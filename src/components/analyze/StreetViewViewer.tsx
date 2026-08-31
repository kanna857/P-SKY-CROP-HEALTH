import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2, Image as ImageIcon, Map as MapIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StreetViewViewerProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export function StreetViewViewer({ lat, lng, onClose }: StreetViewViewerProps) {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<'mapillary' | 'google' | null>(null);
  const [mapillaryImageId, setMapillaryImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function checkCoverage() {
      setLoading(true);
      setError(null);

      let foundMapillary = false;

      // ATTEMPT 1: Try to find Mapillary coverage (Primary)
      if (MAPILLARY_TOKEN) {
        try {
          // Mapillary Graph API v4 requires a bounding box (bbox) to search for images
          const offset = 0.01; // roughly 1.1 km radius 
          const bbox = `${lng - offset},${lat - offset},${lng + offset},${lat + offset}`;
          const url = `https://graph.mapillary.com/images?fields=id&bbox=${bbox}&limit=1&access_token=${MAPILLARY_TOKEN}`;
          const res = await fetch(url);
          
          if (res.ok) {
            const data = await res.json();
            if (data && data.data && data.data.length > 0) {
              if (isMounted) {
                setMapillaryImageId(data.data[0].id);
                setProvider('mapillary');
              }
              foundMapillary = true;
            }
          }
        } catch (err: any) {
          console.error("Mapillary API error:", err);
        }
      }

      // ATTEMPT 2: Fallback to Google Street View for regions like India where Mapillary has gaps
      if (!foundMapillary && isMounted) {
        if (GOOGLE_MAPS_KEY) {
          try {
            // Check Google Street View Metadata API BEFORE loading a blank iframe
            const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${GOOGLE_MAPS_KEY}&radius=1000`;
            const geoRes = await fetch(metadataUrl);
            const geoData = await geoRes.json();
            
            if (geoData.status === "OK") {
              if (isMounted) setProvider('google');
            } else if (geoData.status === "ZERO_RESULTS") {
              if (isMounted) setError("No 360° coverage found here. Both Mapillary and Google Street View lack imagery for this specific rural location! Try clicking closer to a verified road.");
            } else {
              // API key restricted or billing issue
              if (isMounted) setError(`Google Maps Error: ${geoData.status}. Ensure your API Key doesn't have restrictive referrers or requires billing enabled.`);
            }
          } catch (err: any) {
             console.error("Google metadata error:", err);
             if (isMounted) setProvider('google'); // Blind fallback if metadata fails
          }
        } else {
          if (isMounted) setError('No Mapillary 360° coverage found here. To view Google Street View in this region, please add your Google Maps API Key to VITE_GOOGLE_MAPS_KEY in your .env file.');
        }
      }

      if (isMounted) setLoading(false);
    }

    checkCoverage();

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  return (
    <div className="absolute inset-0 z-[2000] bg-background/95 backdrop-blur-sm flex flex-col rounded-xl overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
           {provider === 'mapillary' ? (
              <ImageIcon className="w-5 h-5 text-primary" />
           ) : provider === 'google' ? (
              <MapIcon className="w-5 h-5 text-primary" />
           ) : (
              <X className="w-5 h-5 text-destructive" />
           )}
          <h3 className="font-semibold">
            360° Panoramic View
            {provider === 'mapillary' && ' (Mapillary)'}
            {provider === 'google' && ' (Google Street View)'}
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} title="Close View">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Finding 360° coverage...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-6 max-w-md w-full relative z-10">
             <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 shadow-lg backdrop-blur-md">
                <X className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Coverage Not Available</AlertTitle>
                <AlertDescription className="mt-2 text-sm leading-relaxed font-medium">
                  {error}
                </AlertDescription>
             </Alert>
          </div>
        )}

        {/* Ambient background graphic for empty state */}
        {!loading && error && (
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <MapIcon className="w-64 h-64 text-muted-foreground" />
          </div>
        )}

        {!loading && provider === 'mapillary' && mapillaryImageId && (
          <iframe
            title="Mapillary Street View"
            src={`https://www.mapillary.com/embed?pKey=${mapillaryImageId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0 block bg-black"
          />
        )}

        {!loading && provider === 'google' && GOOGLE_MAPS_KEY && (
          <iframe
            title="Google Street View"
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full border-0 absolute inset-0 block bg-black"
            src={`https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_KEY}&location=${lat},${lng}&heading=210&pitch=10&fov=35`}
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
