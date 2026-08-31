import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DemoField, DEMO_FIELDS, getNDVICategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Locate,
  Layers,
  Satellite,
  Leaf,
  Search,
  Crosshair,
  Loader2,
  CheckCircle2,
  Navigation,
  X,
  Compass,
  Sparkles,
  Move,
  Copy,
  Check,
  Maximize2,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// High resolution Satellite & Map Providers
const SATELLITE_LAYERS: Record<Exclude<MapLayerType, 'base'>, {
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom: number;
}> = {
  satellite: {
    name: 'Google High-Res Satellite',
    url: MAPBOX_TOKEN
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
      : 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: MAPBOX_TOKEN ? '&copy; Mapbox' : '&copy; Google Satellite',
    maxZoom: 22,
    maxNativeZoom: 20,
  },
  hybrid: {
    name: 'Google Hybrid (Satellite + Roads/Borders)',
    url: MAPBOX_TOKEN
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
      : 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: MAPBOX_TOKEN ? '&copy; Mapbox' : '&copy; Google Hybrid',
    maxZoom: 22,
    maxNativeZoom: 20,
  },
  esri: {
    name: 'Esri World Imagery (Farm Clarity)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery',
    maxZoom: 22,
    maxNativeZoom: 19,
  },
  terrain: {
    name: 'Topographic Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
    maxZoom: 17,
    maxNativeZoom: 17,
  },
};

type MapLayerType = 'base' | 'satellite' | 'hybrid' | 'esri' | 'terrain';

interface FieldMapProps {
  onFieldSelect: (field: DemoField) => void;
  selectedField: DemoField | null;
  showDemoFields?: boolean;
  ndviTileUrl?: string;
  trueColorUrl?: string;
  affectedArea?: number;
  onPolygonDrawn?: (geoJson: any) => void;
}

interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

// Convert decimal coordinates to DMS string
function toDMS(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const absLat = Math.abs(lat);
  const absLng = Math.abs(lng);

  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = ((absLat - latDeg - latMin / 60) * 3600).toFixed(2);

  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);
  const lngSec = ((absLng - lngDeg - lngMin / 60) * 3600).toFixed(2);

  return `${latDeg}°${latMin}'${latSec}"${latDir}, ${lngDeg}°${lngMin}'${lngSec}"${lngDir}`;
}

// Parse various coordinate formats (DD, DMS, Google Maps URLs)
function parseCoordinateInput(input: string): { lat: number; lng: number } | null {
  const text = input.trim();
  if (!text) return null;

  // 1. Google Maps URLs: /@16.506174,80.648015 or ?q=16.506174,80.648015
  const gmapMatch = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || text.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (gmapMatch) {
    const lat = parseFloat(gmapMatch[1]);
    const lng = parseFloat(gmapMatch[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
  }

  // 2. Standard decimal degrees: "16.506174, 80.648015" or "16.506174 80.648015"
  const ddMatch = text.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
  if (ddMatch) {
    const lat = parseFloat(ddMatch[1]);
    const lng = parseFloat(ddMatch[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
  }

  // 3. DMS: 16°30'22.2"N 80°38'52.8"E
  const dmsPattern = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([NSEWnsew])[\s,]+(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([NSEWnsew])/;
  const dmsMatch = text.match(dmsPattern);
  if (dmsMatch) {
    let lat = parseInt(dmsMatch[1]) + parseInt(dmsMatch[2]) / 60 + (parseFloat(dmsMatch[3]) || 0) / 3600;
    if (dmsMatch[4].toUpperCase() === 'S') lat = -lat;
    let lng = parseInt(dmsMatch[5]) + parseInt(dmsMatch[6]) / 60 + (parseFloat(dmsMatch[7]) || 0) / 3600;
    if (dmsMatch[8].toUpperCase() === 'W') lng = -lng;
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
  }

  return null;
}

// Reverse geocode lat/lng to high-detail locality name
async function fetchAddress(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return `Field (${lat.toFixed(6)}°, ${lng.toFixed(6)}°)`;
    const data = await res.json();
    const addr = data.address || {};
    const parts = [
      addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || addr.town || addr.city,
      addr.county || addr.district || addr.state_district,
      addr.state || addr.country,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : data.display_name.split(',').slice(0, 3).join(',');
  } catch (err) {
    return `Field (${lat.toFixed(6)}°, ${lng.toFixed(6)}°)`;
  }
}

export function FieldMap({
  onFieldSelect,
  selectedField,
  showDemoFields = true,
  ndviTileUrl,
  trueColorUrl,
  affectedArea,
  onPolygonDrawn,
}: FieldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const overlayRef = useRef<L.Circle | null>(null);
  const gpsAccuracyCircleRef = useRef<L.Circle | null>(null);
  const draggablePinRef = useRef<L.Marker | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);
  const ndviOverlayRef = useRef<L.ImageOverlay | null>(null);
  const watchPositionIdRef = useRef<number | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('hybrid'); // Default to hybrid satellite for maximum clarity
  const [showNdviOverlay, setShowNdviOverlay] = useState(false);
  const [showCenterCrosshair, setShowCenterCrosshair] = useState(true);

  // Search & Geocoding State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // GPS High-Accuracy State
  const [isLocating, setIsLocating] = useState(false);
  const [isWatchingGps, setIsWatchingGps] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Manual Coordinates Input
  const [manualInput, setManualInput] = useState('');
  const [coordPopoverOpen, setCoordPopoverOpen] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Live Map HUD
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({ lat: 16.0, lng: 80.0 });
  const [currentZoom, setCurrentZoom] = useState<number>(15);

  // Precision Nudge step in meters (approx lat/lng degrees)
  const [nudgeStep, setNudgeStep] = useState<number>(5); // 5 meters

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [16.506174, 80.648015],
      zoom: 16,
      maxZoom: 22, // Enable ultra-zoom for satellite field view
      zoomControl: false,
    });

    // Metric scale bar in bottom left
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map.current);

    // Dark themed base fallback
    baseLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 22,
      maxNativeZoom: 19,
    }).addTo(map.current);

    // Add Google Hybrid layer by default for immediate high-resolution satellite visibility
    const hybridConfig = SATELLITE_LAYERS.hybrid;
    satelliteLayerRef.current = L.tileLayer(hybridConfig.url, {
      attribution: hybridConfig.attribution,
      maxZoom: hybridConfig.maxZoom,
      maxNativeZoom: hybridConfig.maxNativeZoom,
      opacity: 1.0,
      crossOrigin: true,
    }).addTo(map.current);

    L.control.zoom({ position: 'bottomright' }).addTo(map.current);

    // Track map center and zoom
    map.current.on('move', () => {
      if (map.current) {
        const c = map.current.getCenter();
        setCenterCoords({ lat: c.lat, lng: c.lng });
      }
    });

    map.current.on('zoomend', () => {
      if (map.current) {
        setCurrentZoom(map.current.getZoom());
      }
    });

    // Track cursor coordinates with 6 decimal places
    map.current.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // Click handler for custom location with reverse geocoding
    map.current.on('click', async (e: L.LeafletMouseEvent) => {
      const lat = parseFloat(e.latlng.lat.toFixed(7));
      const lng = parseFloat(e.latlng.lng.toFixed(7));

      const placeName = await fetchAddress(lat, lng);

      const customField: DemoField = {
        id: `custom-${Date.now()}`,
        name: placeName,
        lat,
        lng,
        ndvi: Math.random() * 0.4 + 0.4,
        crop: 'Precision Farm Point',
        area: 10,
        lastAnalysis: new Date().toISOString().split('T')[0],
      };
      onFieldSelect(customField);
    });

    // Enable Geoman drawing controls for manual farm tracing
    (map.current as any).pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: true,
      drawRectangle: true,
      drawCircle: false,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    // Handle polygon creation
    map.current.on('pm:create', (e: any) => {
      if (onPolygonDrawn) {
        onPolygonDrawn(e.layer.toGeoJSON());
      }
    });

    setMapReady(true);

    return () => {
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
      }
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle layer switching
  const switchLayer = (layerType: MapLayerType) => {
    if (!map.current) return;

    if (satelliteLayerRef.current) {
      satelliteLayerRef.current.remove();
      satelliteLayerRef.current = null;
    }

    if (baseLayerRef.current) {
      baseLayerRef.current.addTo(map.current);
      baseLayerRef.current.bringToBack();
    }

    if (layerType !== 'base') {
      const layerConfig = SATELLITE_LAYERS[layerType];

      const layer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: layerConfig.maxZoom,
        maxNativeZoom: layerConfig.maxNativeZoom,
        opacity: 1.0,
        crossOrigin: true,
      });

      satelliteLayerRef.current = layer.addTo(map.current);
      satelliteLayerRef.current.bringToFront();
    }

    setActiveLayer(layerType);
  };

  // Add demo field markers
  useEffect(() => {
    if (!map.current || !mapReady || !showDemoFields) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    DEMO_FIELDS.forEach((field) => {
      const category = getNDVICategory(field.ndvi);

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full ${category.bgColor} opacity-40 animate-ping"></div>
            <div class="w-6 h-6 rounded-full ${category.bgColor} border-2 border-white flex items-center justify-center shadow-lg">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([field.lat, field.lng], { icon })
        .addTo(map.current!)
        .bindPopup(`
          <div class="p-2.5 min-w-[200px] text-foreground">
            <h3 class="font-bold text-sm mb-1 text-primary">${field.name}</h3>
            <div class="text-xs space-y-1 font-mono">
              <p>Crop: <span class="text-foreground font-semibold">${field.crop}</span></p>
              <p>Area: ${field.area} ha</p>
              <p>NDVI: <span class="font-bold">${field.ndvi.toFixed(2)}</span> (${category.label})</p>
              <p class="text-[10px] text-muted-foreground">Coords: ${field.lat.toFixed(5)}°, ${field.lng.toFixed(5)}°</p>
            </div>
          </div>
        `)
        .on('click', () => onFieldSelect(field));

      markersRef.current.push(marker);
    });
  }, [mapReady, showDemoFields, onFieldSelect]);

  // DRAGGABLE PRECISION FIELD PIN
  useEffect(() => {
    if (!map.current || !mapReady) return;

    if (overlayRef.current) {
      overlayRef.current.remove();
      overlayRef.current = null;
    }
    if (draggablePinRef.current) {
      draggablePinRef.current.remove();
      draggablePinRef.current = null;
    }

    if (selectedField) {
      let fillColor = '#ef4444';
      if (selectedField.ndvi >= 0.7) fillColor = '#16a34a';
      else if (selectedField.ndvi >= 0.5) fillColor = '#22c55e';
      else if (selectedField.ndvi >= 0.3) fillColor = '#eab308';

      const areaToUse = affectedArea !== undefined ? affectedArea : selectedField.area;

      overlayRef.current = L.circle([selectedField.lat, selectedField.lng], {
        radius: Math.sqrt(areaToUse * 10000) * 10,
        fillColor,
        fillOpacity: 0.25,
        color: fillColor,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(map.current);

      // Custom Precision Bullseye Pin
      const precisionIcon = L.divIcon({
        className: 'precision-draggable-pin',
        html: `
          <div class="relative flex flex-col items-center cursor-grab active:cursor-grabbing group">
            <div class="px-2 py-0.5 rounded-full bg-background/90 backdrop-blur-md border border-primary text-[10px] font-mono font-bold text-primary shadow-lg mb-1 whitespace-nowrap animate-pulse">
              Drag to Adjust 🎯
            </div>
            <div class="relative w-9 h-9 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full bg-primary/25 animate-ping"></div>
              <div class="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-2xl flex items-center justify-center text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v3m0 12v3M3 12h3m12 0h3"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="w-1 h-3 bg-white shadow"></div>
            <div class="w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
          </div>
        `,
        iconSize: [120, 60],
        iconAnchor: [60, 58],
      });

      const pin = L.marker([selectedField.lat, selectedField.lng], {
        icon: precisionIcon,
        draggable: true,
        autoPan: true,
      }).addTo(map.current);

      // Live updates while dragging
      pin.on('drag', (e: any) => {
        const newLat = e.target.getLatLng().lat;
        const newLng = e.target.getLatLng().lng;
        setCursorCoords({ lat: newLat, lng: newLng });
        if (overlayRef.current) {
          overlayRef.current.setLatLng([newLat, newLng]);
        }
      });

      // On drop: reverse geocode and update field
      pin.on('dragend', async (e: any) => {
        const newLat = parseFloat(e.target.getLatLng().lat.toFixed(7));
        const newLng = parseFloat(e.target.getLatLng().lng.toFixed(7));

        const newName = await fetchAddress(newLat, newLng);

        const updatedField: DemoField = {
          ...selectedField,
          name: newName,
          lat: newLat,
          lng: newLng,
        };
        onFieldSelect(updatedField);
      });

      pin.bindPopup(`
        <div class="p-3 min-w-[220px]">
          <div class="flex items-center justify-between gap-2 font-bold text-sm text-primary mb-1 border-b pb-1">
            <span>🎯 ${selectedField.name}</span>
          </div>
          <div class="text-xs space-y-1 font-mono text-muted-foreground my-2">
            <p><strong class="text-foreground">Decimal:</strong> ${selectedField.lat.toFixed(7)}°, ${selectedField.lng.toFixed(7)}°</p>
            <p><strong class="text-foreground">DMS:</strong> ${toDMS(selectedField.lat, selectedField.lng)}</p>
            <p><strong class="text-foreground">Area:</strong> ${selectedField.area} ha</p>
          </div>
          <p class="text-[10px] text-primary italic">💡 You can drag this pin anywhere on the satellite view.</p>
        </div>
      `);

      draggablePinRef.current = pin;
    }
  }, [selectedField, mapReady, affectedArea]);

  // Handle map flyTo when selected field changes
  useEffect(() => {
    if (!map.current || !mapReady || !selectedField) return;

    map.current.flyTo([selectedField.lat, selectedField.lng], 18, {
      duration: 1.2,
    });
  }, [selectedField?.id, selectedField?.lat, selectedField?.lng, mapReady]);

  // Handle NDVI overlay from Agromonitoring
  useEffect(() => {
    if (!map.current || !mapReady) return;

    if (ndviOverlayRef.current) {
      ndviOverlayRef.current.remove();
      ndviOverlayRef.current = null;
    }

    if (showNdviOverlay && ndviTileUrl && selectedField) {
      const sideLength = Math.sqrt((selectedField.area || 10) * 10000);
      const latOffset = (sideLength / 2) / 111320;
      const lngOffset = (sideLength / 2) / (111320 * Math.cos(selectedField.lat * Math.PI / 180));

      const bounds: L.LatLngBoundsExpression = [
        [selectedField.lat - latOffset, selectedField.lng - lngOffset],
        [selectedField.lat + latOffset, selectedField.lng + lngOffset]
      ];

      ndviOverlayRef.current = L.imageOverlay(ndviTileUrl, bounds, {
        opacity: 0.85,
        crossOrigin: true
      }).addTo(map.current);

      ndviOverlayRef.current.bringToFront();
    }
  }, [showNdviOverlay, ndviTileUrl, selectedField, mapReady]);

  // CONTINUOUS MULTI-SAMPLE HIGH-ACCURACY GPS TRACKER
  const handleToggleGpsLock = () => {
    if (!map.current) return;
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your device or browser.');
      return;
    }

    if (isWatchingGps) {
      // Stop GPS watcher
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      setIsWatchingGps(false);
      setGpsMessage('GPS watching paused.');
      return;
    }

    setIsLocating(true);
    setIsWatchingGps(true);
    setGpsMessage('Connecting to GPS satellites for sub-meter precision...');

    let sampleCount = 0;

    watchPositionIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        sampleCount++;
        const latitude = parseFloat(position.coords.latitude.toFixed(7));
        const longitude = parseFloat(position.coords.longitude.toFixed(7));
        const accuracy = Math.round(position.coords.accuracy || 5);

        setGpsAccuracy(accuracy);
        setIsLocating(false);

        if (gpsAccuracyCircleRef.current) {
          gpsAccuracyCircleRef.current.remove();
        }

        if (map.current) {
          gpsAccuracyCircleRef.current = L.circle([latitude, longitude], {
            radius: accuracy,
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.18,
            weight: 2,
            dashArray: '4, 4',
          }).addTo(map.current);

          // Fly map smoothly on initial or high accuracy fix
          if (sampleCount === 1 || accuracy < 15) {
            map.current.flyTo([latitude, longitude], 19, { duration: 1.0 });
          }
        }

        const placeName = await fetchAddress(latitude, longitude);

        const lockQuality = accuracy <= 5
          ? `Ultra-Precision Satellite Lock (±${accuracy}m)`
          : accuracy <= 15
          ? `High Accuracy GPS Lock (±${accuracy}m)`
          : `GPS / Wi-Fi Estimated (±${accuracy}m)`;

        setGpsMessage(`Live GPS: ${lockQuality}`);

        const gpsField: DemoField = {
          id: `gps-live-${Date.now()}`,
          name: placeName,
          lat: latitude,
          lng: longitude,
          ndvi: 0.68,
          crop: 'My GPS Location',
          area: 10,
          lastAnalysis: new Date().toISOString().split('T')[0],
        };
        onFieldSelect(gpsField);
      },
      (error) => {
        setIsLocating(false);
        setIsWatchingGps(false);
        setGpsAccuracy(null);
        console.error('GPS Watch error:', error);
        let msg = 'Unable to get GPS location. Check browser location permissions.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'GPS permission denied. Please enable Location in your browser / Windows settings.';
        }
        setGpsMessage(msg);
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  };

  // MICRO-NUDGE PIN BY METERS
  const handleNudge = async (direction: 'N' | 'S' | 'E' | 'W') => {
    if (!selectedField) return;

    // 1 meter in latitude degrees ~ 1 / 111320
    const latDelta = (nudgeStep) / 111320;
    // 1 meter in longitude degrees ~ 1 / (111320 * cos(lat))
    const lngDelta = (nudgeStep) / (111320 * Math.cos(selectedField.lat * Math.PI / 180));

    let newLat = selectedField.lat;
    let newLng = selectedField.lng;

    if (direction === 'N') newLat += latDelta;
    if (direction === 'S') newLat -= latDelta;
    if (direction === 'E') newLng += lngDelta;
    if (direction === 'W') newLng -= lngDelta;

    newLat = parseFloat(newLat.toFixed(7));
    newLng = parseFloat(newLng.toFixed(7));

    const updatedField: DemoField = {
      ...selectedField,
      lat: newLat,
      lng: newLng,
    };
    onFieldSelect(updatedField);
  };

  // DEBOUNCED SEARCH PLACE / ADDRESS / PINCODE / VILLAGE
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    // Check if query is formatted as coordinates or URL
    const parsedCoords = parseCoordinateInput(query);
    if (parsedCoords) {
      setSearchResults([{
        place_id: 999999,
        lat: parsedCoords.lat.toString(),
        lon: parsedCoords.lng.toString(),
        display_name: `Exact Coordinates: ${parsedCoords.lat.toFixed(7)}°, ${parsedCoords.lng.toFixed(7)}°`,
        type: 'coordinate'
      }]);
      setShowSearchDropdown(true);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=7&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data: SearchResult[] = await res.json();
        setSearchResults(data);
        setShowSearchDropdown(data.length > 0);
      }
    } catch (err) {
      console.error('Search location error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSelectSearchResult = async (result: SearchResult) => {
    setShowSearchDropdown(false);
    setSearchQuery(result.display_name.split(',')[0]);

    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (map.current) {
      map.current.flyTo([lat, lng], 18, { duration: 1.5 });
    }

    const field: DemoField = {
      id: `searched-${Date.now()}`,
      name: result.display_name.split(',').slice(0, 2).join(','),
      lat: parseFloat(lat.toFixed(7)),
      lng: parseFloat(lng.toFixed(7)),
      ndvi: 0.65,
      crop: 'Selected Farm',
      area: 10,
      lastAnalysis: new Date().toISOString().split('T')[0],
    };
    onFieldSelect(field);
  };

  // DIRECT MANUAL COORDINATES JUMP (Supports DD, DMS, Google Maps links)
  const handleJumpToCoordinates = async () => {
    const parsed = parseCoordinateInput(manualInput);
    if (!parsed) {
      alert('Please enter valid coordinates.\n\nSupported formats:\n• Decimal: 16.506174, 80.648015\n• DMS: 16°30\'22.2"N 80°38\'52.8"E\n• Google Maps URL link');
      return;
    }

    setCoordPopoverOpen(false);

    if (map.current) {
      map.current.flyTo([parsed.lat, parsed.lng], 19, { duration: 1.5 });
    }

    const placeName = await fetchAddress(parsed.lat, parsed.lng);

    const field: DemoField = {
      id: `manual-${Date.now()}`,
      name: placeName,
      lat: parseFloat(parsed.lat.toFixed(7)),
      lng: parseFloat(parsed.lng.toFixed(7)),
      ndvi: 0.60,
      crop: 'Precision Survey Point',
      area: 10,
      lastAnalysis: new Date().toISOString().split('T')[0],
    };
    onFieldSelect(field);
  };

  // Copy current coordinates to clipboard
  const handleCopyCoords = () => {
    const target = selectedField ? { lat: selectedField.lat, lng: selectedField.lng } : centerCoords;
    const text = `${target.lat.toFixed(7)}, ${target.lng.toFixed(7)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleResetView = () => {
    map.current?.flyTo([16.0, 80.0], 8);
  };

  return (
    <TooltipProvider>
      <div className="relative h-full min-h-[560px] rounded-xl overflow-hidden border border-border bg-card shadow-2xl select-none">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* CENTER TARGET RETICLE CROSSHAIR */}
        {showCenterCrosshair && (
          <div className="absolute inset-0 pointer-events-none z-[990] flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border border-primary/40 rounded-full animate-pulse"></div>
              <div className="absolute w-2.5 h-2.5 bg-primary/80 rounded-full border border-white"></div>
              <div className="absolute w-7 h-[1px] bg-primary"></div>
              <div className="absolute h-7 w-[1px] bg-primary"></div>
            </div>
          </div>
        )}

        {/* TOP SEARCH BAR & PRECISION TOOLS */}
        <div className="absolute top-4 left-4 right-16 z-[1000] flex items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                placeholder="Search village, city, farm, pincode, or paste lat, lng..."
                className="pl-9 pr-8 py-2 h-10 glass-card bg-background/95 backdrop-blur-md border-border/80 text-sm shadow-xl focus-visible:ring-primary font-medium"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-3" />
              )}
              {searchQuery && !isSearching && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 glass-card bg-background/95 backdrop-blur-xl rounded-xl border border-border/90 shadow-2xl overflow-hidden z-[1050] divide-y divide-border/40 max-h-72 overflow-y-auto animate-fade-in">
                {searchResults.map((res) => (
                  <button
                    key={res.place_id}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary/15 transition-colors flex items-start gap-2.5 group"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{res.display_name.split(',')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{res.display_name}</p>
                      <span className="text-[10px] text-primary/90 font-mono font-bold">
                        {parseFloat(res.lat).toFixed(6)}°, {parseFloat(res.lon).toFixed(6)}°
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coordinates Tool Popover */}
          <Popover open={coordPopoverOpen} onOpenChange={setCoordPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="glass-card shadow-lg flex items-center gap-1.5 h-10 px-3 bg-background/95 backdrop-blur-md border border-border/80"
                title="Enter Coordinates (DD, DMS, or Google Maps Link)"
              >
                <Crosshair className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline text-xs font-bold">Coordinates</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-84 glass-card bg-background/98 backdrop-blur-2xl border border-border shadow-2xl p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-primary" />
                    <h4 className="font-bold text-sm">Jump to Exact Coordinates</h4>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter or paste coordinates in any format:
                </p>
                <Input
                  placeholder="e.g. 16.506174, 80.648015 or DMS / Maps link"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="h-9 text-xs font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleJumpToCoordinates()}
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleJumpToCoordinates}
                    className="flex-1 h-8 text-xs font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Pin Location
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCoords}
                    className="h-8 text-xs px-2.5"
                    title="Copy current coordinates"
                  >
                    {copiedCoords ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* MAP CONTROL BUTTONS (RIGHT SIDE) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          {/* High Precision Live GPS Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isWatchingGps ? 'default' : 'secondary'}
                size="icon"
                onClick={handleToggleGpsLock}
                className={`glass-card shadow-lg backdrop-blur-md relative border border-border/80 ${isWatchingGps ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-background/95'}`}
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <Locate className={`w-4 h-4 ${isWatchingGps ? 'text-white' : 'text-primary'}`} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs font-semibold">{isWatchingGps ? 'GPS Tracking Active (Tap to Stop)' : 'High-Accuracy Satellite GPS Fix'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Toggle Crosshair Reticle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showCenterCrosshair ? 'default' : 'secondary'}
                size="icon"
                onClick={() => setShowCenterCrosshair(!showCenterCrosshair)}
                className={`glass-card shadow-lg backdrop-blur-md border border-border/80 ${showCenterCrosshair ? 'bg-primary/20 text-primary' : 'bg-background/95'}`}
              >
                <Target className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs font-semibold">Toggle Center Target Crosshair</p>
            </TooltipContent>
          </Tooltip>

          {/* Satellite / Terrain Layer Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="glass-card shadow-lg bg-background/95 backdrop-blur-md border border-border/80"
                title="Select Satellite Imagery Layer"
              >
                <Satellite className="w-4 h-4 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card bg-background/98 backdrop-blur-2xl border border-border shadow-2xl">
              <DropdownMenuLabel className="flex items-center gap-2 text-xs font-bold">
                <Satellite className="w-4 h-4 text-primary" />
                Satellite & Map Providers
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => switchLayer('hybrid')}
                className={activeLayer === 'hybrid' ? 'bg-primary/15 font-bold text-primary' : ''}
              >
                <Satellite className="w-4 h-4 mr-2 text-success" />
                Google Hybrid (Recommended)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchLayer('satellite')}
                className={activeLayer === 'satellite' ? 'bg-primary/15 font-bold text-primary' : ''}
              >
                <Satellite className="w-4 h-4 mr-2 text-primary" />
                Google Satellite High-Res
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchLayer('esri')}
                className={activeLayer === 'esri' ? 'bg-primary/15 font-bold text-primary' : ''}
              >
                <Layers className="w-4 h-4 mr-2 text-amber-400" />
                Esri World Imagery (Farm Clarity)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchLayer('terrain')}
                className={activeLayer === 'terrain' ? 'bg-primary/15 font-bold text-primary' : ''}
              >
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                Topography Terrain
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchLayer('base')}
                className={activeLayer === 'base' ? 'bg-primary/15 font-bold text-primary' : ''}
              >
                <Layers className="w-4 h-4 mr-2" />
                Dark Standard Map
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* NDVI Overlay Toggle */}
          {ndviTileUrl && (
            <Button
              variant={showNdviOverlay ? 'default' : 'secondary'}
              size="icon"
              onClick={() => setShowNdviOverlay(!showNdviOverlay)}
              className={`glass-card shadow-lg ${showNdviOverlay ? 'bg-success text-white hover:bg-success/90' : 'bg-background/95'}`}
              title="Toggle NDVI Satellite Layer"
            >
              <Leaf className="w-4 h-4" />
            </Button>
          )}

          {/* Reset View */}
          <Button
            variant="secondary"
            size="icon"
            onClick={handleResetView}
            className="glass-card shadow-lg bg-background/95 backdrop-blur-md border border-border/80"
            title="Reset Map View"
          >
            <Compass className="w-4 h-4" />
          </Button>
        </div>

        {/* GPS ACCURACY & STATUS BADGE */}
        {gpsMessage && (
          <div className="absolute top-16 left-4 z-[1000] animate-fade-in max-w-md">
            <div className="glass-card bg-background/98 backdrop-blur-md px-3.5 py-2 rounded-lg border border-primary/50 shadow-2xl flex items-center gap-2.5">
              {isLocating ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              ) : gpsAccuracy !== null ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <Navigation className="w-4 h-4 text-primary shrink-0" />
              )}
              <span className="text-xs font-semibold text-foreground truncate">{gpsMessage}</span>
              {gpsAccuracy !== null && (
                <Badge variant="outline" className={`text-[10px] font-bold py-0.5 px-2 ${gpsAccuracy <= 10 ? 'border-success text-success bg-success/15' : 'border-amber-500 text-amber-400 bg-amber-500/15'}`}>
                  ±{gpsAccuracy}m
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* PRECISION NUDGE CONTROLS (FLOATING ON RIGHT) */}
        {selectedField && (
          <div className="absolute right-4 bottom-16 z-[1000] glass-card bg-background/95 backdrop-blur-md p-2 rounded-xl border border-border/80 shadow-2xl flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase">Nudge {nudgeStep}m</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleNudge('N')} title="Nudge North">
              <ChevronUp className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleNudge('W')} title="Nudge West">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Move className="w-2.5 h-2.5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleNudge('E')} title="Nudge East">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleNudge('S')} title="Nudge South">
              <ChevronDown className="w-4 h-4" />
            </Button>
            <div className="flex gap-1 mt-1">
              {[1, 5, 20].map((step) => (
                <button
                  key={step}
                  onClick={() => setNudgeStep(step)}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${nudgeStep === step ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  {step}m
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LIVE HIGH-PRECISION COORDINATES HUD (BOTTOM RIGHT) */}
        <div className="absolute bottom-4 right-16 z-[1000] hidden md:flex items-center gap-2">
          <div className="glass-card bg-background/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-mono text-muted-foreground shadow-2xl border border-border/80 flex items-center gap-3">
            {cursorCoords ? (
              <span>
                Cursor: <strong className="text-primary font-bold">{cursorCoords.lat.toFixed(7)}° N</strong>, <strong className="text-primary font-bold">{cursorCoords.lng.toFixed(7)}° E</strong>
              </span>
            ) : (
              <span>
                Center: <strong className="text-foreground font-bold">{centerCoords.lat.toFixed(7)}°</strong>, <strong className="text-foreground font-bold">{centerCoords.lng.toFixed(7)}°</strong>
              </span>
            )}
            <span className="text-primary/90 font-bold border-l pl-2 border-border/60">Zoom {currentZoom}x</span>
            <button
              onClick={handleCopyCoords}
              className="hover:text-foreground transition-colors"
              title="Copy coordinates"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* INSTRUCTIONS & SHORTCUTS (BOTTOM LEFT) */}
        <div className="absolute bottom-4 left-24 z-[1000] hidden sm:block">
          <div className="glass-card bg-background/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-border/60 shadow-xl">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Click to drop pin | Drag pin to fine-tune | Search village / coordinates</span>
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
