import { useState, useEffect, useCallback } from 'react';
import { SavedField, DemoField } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useSavedFields() {
  const { user, isAuthenticated } = useAuth();
  const [savedFields, setSavedFields] = useState<SavedField[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved fields from database
  const fetchSavedFields = useCallback(async () => {
    if (!user) {
      setSavedFields([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_fields')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved fields:', error);
        return;
      }

      const fields: SavedField[] = (data || []).map((row) => ({
        id: row.field_id,
        name: row.name,
        lat: row.lat,
        lng: row.lng,
        ndvi: row.ndvi,
        crop: row.crop,
        area: row.area,
        lastAnalysis: row.last_analysis || '',
        savedAt: row.saved_at,
      }));

      setSavedFields(fields);
    } catch (error) {
      console.error('Error fetching saved fields:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedFields();
  }, [fetchSavedFields]);

  const saveField = async (field: DemoField) => {
    if (!user) {
      console.error('User must be logged in to save fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_fields')
        .upsert({
          user_id: user.id,
          field_id: field.id,
          name: field.name,
          lat: field.lat,
          lng: field.lng,
          ndvi: field.ndvi,
          crop: field.crop,
          area: field.area,
          last_analysis: field.lastAnalysis,
          saved_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,field_id',
        });

      if (error) {
        console.error('Error saving field:', error);
        throw error;
      }

      // Refresh the list
      await fetchSavedFields();
    } catch (error) {
      console.error('Error saving field:', error);
      throw error;
    }
  };

  const removeField = async (fieldId: string) => {
    if (!user) {
      console.error('User must be logged in to remove fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_fields')
        .delete()
        .eq('user_id', user.id)
        .eq('field_id', fieldId);

      if (error) {
        console.error('Error removing field:', error);
        throw error;
      }

      // Refresh the list
      await fetchSavedFields();
    } catch (error) {
      console.error('Error removing field:', error);
      throw error;
    }
  };

  const isFieldSaved = (fieldId: string) => {
    return savedFields.some(f => f.id === fieldId);
  };

  return { 
    savedFields, 
    saveField, 
    removeField, 
    isFieldSaved, 
    loading,
    isAuthenticated 
  };
}
