import { useOfflineSync } from '@/lib/offlineQueue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, CloudUpload, HardDriveDownload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function OfflineSyncBanner() {
  const { isOnline, queuedCount, isSyncing, triggerManualSync } = useOfflineSync();
  const { toast } = useToast();

  useEffect(() => {
    const handleSyncCompleted = (e: any) => {
      const { syncedFields, syncedReports, errors } = e.detail || {};
      if (syncedFields > 0 || syncedReports > 0) {
        toast({
          title: 'Offline Data Synced Successfully',
          description: `Uploaded ${syncedFields} field boundaries and ${syncedReports} disease reports to your cloud account.`,
        });
      }
      if (errors && errors.length > 0) {
        toast({
          title: 'Partial Sync Warning',
          description: errors[0],
          variant: 'destructive',
        });
      }
    };

    window.addEventListener('offline-sync-completed', handleSyncCompleted);
    return () => window.removeEventListener('offline-sync-completed', handleSyncCompleted);
  }, [toast]);

  // Don't render banner if fully online with zero pending queued items
  if (isOnline && queuedCount === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Offline connection and data synchronization banner"
      className="bg-[#0c1422]/98 border-b border-white/10 px-4 py-2 text-xs backdrop-blur-xl shadow-lg relative z-[1100]"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <WifiOff className="w-4 h-4" />
              <span>Offline Remote Field Mode Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Wifi className="w-4 h-4" />
              <span>Network Connected</span>
            </div>
          )}

          <span className="text-gray-400 hidden sm:inline">•</span>

          <div className="flex items-center gap-1 text-gray-300">
            <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {queuedCount > 0 ? (
                <>
                  <strong className="text-white">{queuedCount} items</strong> queued in IndexedDB
                </>
              ) : (
                'Local caching active for offline field scouting'
              )}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {queuedCount > 0 && isOnline && (
            <Button
              size="sm"
              onClick={triggerManualSync}
              disabled={isSyncing}
              className="h-7 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black rounded-lg shadow-sm"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin mr-1.5" />
                  Syncing to Supabase...
                </>
              ) : (
                <>
                  <CloudUpload className="w-3.5 h-3.5 mr-1.5" />
                  Sync {queuedCount} Queued {queuedCount === 1 ? 'Item' : 'Items'}
                </>
              )}
            </Button>
          )}

          {!isOnline && (
            <Badge variant="outline" className="text-[10px] text-amber-300 border-amber-500/40 bg-amber-500/10 font-mono">
              Auto-Syncs When Online
            </Badge>
          )}
        </div>
      </div>
    </aside>
  );
}
