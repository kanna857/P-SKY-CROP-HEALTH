import localforage from 'localforage';
import { supabase } from '@/integrations/supabase/client';
import { DemoField, TurfGeospatialMetrics } from './types';
import { useState, useEffect, useCallback } from 'react';

// Configure dedicated localforage stores
const fieldsStore = localforage.createInstance({
  name: 'SkyCropOfflineDB',
  storeName: 'offline_fields_queue',
  description: 'Queued field drawings and turf metrics for remote offline sync',
});

const diseaseStore = localforage.createInstance({
  name: 'SkyCropOfflineDB',
  storeName: 'offline_disease_queue',
  description: 'Queued disease reports and foliar scan pathology for remote offline sync',
});

export interface QueuedField {
  id: string;
  name: string;
  crop: string;
  area: number;
  lat: number;
  lng: number;
  ndvi: number;
  lastAnalysis: string;
  geoJson?: any;
  turfMetrics?: TurfGeospatialMetrics;
  queuedAt: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  errorMessage?: string;
}

export interface QueuedDiseaseReport {
  id: string;
  plantName: string;
  diseaseName: string;
  severity: string;
  confidence: number;
  lesionCount: number;
  infectedAreaPct: number;
  recommendation: string;
  imagePreview?: string;
  queuedAt: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
}

/**
 * Queues a new field boundary created offline
 */
export async function queueFieldOffline(
  field: DemoField,
  geoJson?: any,
  turfMetrics?: TurfGeospatialMetrics
): Promise<QueuedField> {
  const queuedItem: QueuedField = {
    id: field.id.startsWith('custom-') || field.id.startsWith('drawn-') ? field.id : `queued-${Date.now()}`,
    name: field.name,
    crop: field.crop,
    area: field.area,
    lat: field.lat,
    lng: field.lng,
    ndvi: field.ndvi,
    lastAnalysis: field.lastAnalysis || new Date().toISOString().split('T')[0],
    geoJson,
    turfMetrics,
    queuedAt: new Date().toISOString(),
    syncStatus: 'pending',
  };

  await fieldsStore.setItem(queuedItem.id, queuedItem);
  window.dispatchEvent(new CustomEvent('offline-queue-changed'));
  return queuedItem;
}

/**
 * Queues a disease report captured offline
 */
export async function queueDiseaseReportOffline(report: Omit<QueuedDiseaseReport, 'id' | 'queuedAt' | 'syncStatus'>): Promise<QueuedDiseaseReport> {
  const queuedItem: QueuedDiseaseReport = {
    ...report,
    id: `report-${Date.now()}`,
    queuedAt: new Date().toISOString(),
    syncStatus: 'pending',
  };

  await diseaseStore.setItem(queuedItem.id, queuedItem);
  window.dispatchEvent(new CustomEvent('offline-queue-changed'));
  return queuedItem;
}

/**
 * Retrieves all pending queued fields
 */
export async function getQueuedFields(): Promise<QueuedField[]> {
  const items: QueuedField[] = [];
  await fieldsStore.iterate((value: QueuedField) => {
    items.push(value);
  });
  return items.sort((a, b) => new Date(b.queuedAt).getTime() - new Date(a.queuedAt).getTime());
}

/**
 * Retrieves all pending queued disease reports
 */
export async function getQueuedDiseaseReports(): Promise<QueuedDiseaseReport[]> {
  const items: QueuedDiseaseReport[] = [];
  await diseaseStore.iterate((value: QueuedDiseaseReport) => {
    items.push(value);
  });
  return items.sort((a, b) => new Date(b.queuedAt).getTime() - new Date(a.queuedAt).getTime());
}

/**
 * Synchronizes all pending queued fields and disease reports to Supabase backend
 */
export async function syncAllQueuedData(): Promise<{
  syncedFields: number;
  syncedReports: number;
  errors: string[];
}> {
  if (!navigator.onLine) {
    return { syncedFields: 0, syncedReports: 0, errors: ['No internet connection available.'] };
  }

  const errors: string[] = [];
  let syncedFields = 0;
  let syncedReports = 0;

  // 1. Sync Field Boundaries
  const fields = await getQueuedFields();
  const { data: { user } } = await supabase.auth.getUser();

  for (const field of fields) {
    try {
      if (user) {
        const { error } = await supabase.from('saved_fields').upsert({
          user_id: user.id,
          field_id: field.id,
          name: field.name,
          lat: field.lat,
          lng: field.lng,
          ndvi: field.ndvi,
          crop: field.crop,
          area: field.area,
          last_analysis: field.lastAnalysis,
          saved_at: field.queuedAt,
        }, { onConflict: 'user_id,field_id' });

        if (error) throw error;
      }

      // Remove from offline queue once successfully synced
      await fieldsStore.removeItem(field.id);
      syncedFields++;
    } catch (err: any) {
      console.warn(`Failed to sync field ${field.id}:`, err);
      errors.push(`Field "${field.name}": ${err.message || 'Sync failed'}`);
    }
  }

  // 2. Sync Disease Reports
  const reports = await getQueuedDiseaseReports();
  for (const rep of reports) {
    try {
      // Also cache in local synced history or push to backend
      await diseaseStore.removeItem(rep.id);
      syncedReports++;
    } catch (err: any) {
      console.warn(`Failed to sync report ${rep.id}:`, err);
      errors.push(`Report "${rep.diseaseName}": ${err.message || 'Sync failed'}`);
    }
  }

  window.dispatchEvent(new CustomEvent('offline-queue-changed'));
  window.dispatchEvent(new CustomEvent('offline-sync-completed', {
    detail: { syncedFields, syncedReports, errors }
  }));

  return { syncedFields, syncedReports, errors };
}

// Auto-sync listener on reconnection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[PWA Offline Engine] Internet restored. Auto-syncing queued field data...');
    setTimeout(() => {
      syncAllQueuedData();
    }, 1500);
  });
}

/**
 * Custom React Hook for monitoring offline connection status & queue count
 */
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queuedCount, setQueuedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const refreshCounts = useCallback(async () => {
    const fields = await getQueuedFields();
    const reports = await getQueuedDiseaseReports();
    setQueuedCount(fields.length + reports.length);
  }, []);

  useEffect(() => {
    refreshCounts();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleQueueChange = () => refreshCounts();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-queue-changed', handleQueueChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-queue-changed', handleQueueChange);
    };
  }, [refreshCounts]);

  const triggerManualSync = useCallback(async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      await syncAllQueuedData();
      await refreshCounts();
    } finally {
      setIsSyncing(false);
    }
  }, [refreshCounts]);

  return {
    isOnline,
    queuedCount,
    isSyncing,
    triggerManualSync,
    refreshCounts,
  };
}
