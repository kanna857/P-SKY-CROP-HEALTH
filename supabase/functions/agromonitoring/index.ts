import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PolygonRequest {
  name: string;
  coordinates: number[][][]; // GeoJSON polygon coordinates
}

interface NDVIRequest {
  polygonId: string;
}

interface FieldRequest {
  lat: number;
  lng: number;
  name: string;
  areaHa?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('AGROMONITORING_API_KEY');
    if (!apiKey) {
      throw new Error('AGROMONITORING_API_KEY not configured');
    }

    const url = new URL(req.url);
    const body = await req.json();

    // Default behavior: if no explicit action is provided, treat it as a "quick NDVI" request
    // from the web app (lat/lng + name).
    const action = url.searchParams.get('action') || ((body?.lat != null && body?.lng != null) ? 'quick-ndvi' : 'list-polygons');

    console.log(`Agromonitoring API action: ${action}`, body);

    if (action === 'create-polygon') {
      // Create a polygon in Agromonitoring
      const { name, coordinates } = body as PolygonRequest;
      
      const polygonData = {
        name: name,
        geo_json: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: coordinates
          }
        }
      };

      const response = await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons?appid=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(polygonData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Agromonitoring create polygon error:', errorText);
        throw new Error(`Failed to create polygon: ${errorText}`);
      }

      const polygon = await response.json();
      console.log('Created polygon:', polygon);

      return new Response(JSON.stringify(polygon), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'get-ndvi') {
      // Get NDVI statistics for a polygon
      const { polygonId } = body as NDVIRequest;

      // Get satellite imagery list
      const end = Math.floor(Date.now() / 1000);
      const start = end - (30 * 24 * 60 * 60); // Last 30 days

      const satelliteResponse = await fetch(
        `https://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${polygonId}&appid=${apiKey}`
      );

      if (!satelliteResponse.ok) {
        const errorText = await satelliteResponse.text();
        console.error('Agromonitoring satellite search error:', errorText);
        throw new Error(`Failed to get satellite data: ${errorText}`);
      }

      const satellites = await satelliteResponse.json();
      console.log(`Found ${satellites.length} satellite images`);

      if (satellites.length === 0) {
        return new Response(JSON.stringify({
          ndvi: null,
          message: 'No satellite imagery available for this area in the last 30 days',
          satellites: []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get the most recent image with lowest cloud coverage
      const bestImage = satellites
        .filter((s: any) => s.cl < 20) // Less than 20% cloud cover
        .sort((a: any, b: any) => b.dt - a.dt)[0] || satellites[0];

      // Get NDVI stats for this image
      const statsResponse = await fetch(
        `https://api.agromonitoring.com/agro/1.0/image/search?start=${bestImage.dt}&end=${bestImage.dt + 1}&polyid=${polygonId}&appid=${apiKey}`
      );

      // Get the NDVI tile URL
      const ndviTileUrl = bestImage.image?.ndvi;
      const trueColorUrl = bestImage.image?.truecolor;

      // Fetch stats if available
      let stats = null;
      if (bestImage.stats?.ndvi) {
        const statsUrl = bestImage.stats.ndvi;
        const statsResp = await fetch(statsUrl);
        if (statsResp.ok) {
          stats = await statsResp.json();
          console.log('NDVI stats:', stats);
        }
      }

      return new Response(JSON.stringify({
        ndvi: stats?.mean || null,
        ndviMin: stats?.min || null,
        ndviMax: stats?.max || null,
        ndviMedian: stats?.median || null,
        imageDate: new Date(bestImage.dt * 1000).toISOString(),
        cloudCoverage: bestImage.cl,
        ndviTileUrl,
        trueColorUrl,
        satellites: satellites.slice(0, 10) // Return last 10 for history
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'quick-ndvi') {
      // Quick NDVI lookup using center point - creates a small polygon around the point
      const { lat, lng, name, areaHa = 10 } = body as FieldRequest;

      // Create a roughly square polygon around the center point
      // 1 hectare ≈ 100m x 100m, so we calculate offset based on area
      const sideLength = Math.sqrt(areaHa * 10000); // meters
      const latOffset = (sideLength / 2) / 111320; // degrees latitude
      const lngOffset = (sideLength / 2) / (111320 * Math.cos(lat * Math.PI / 180)); // degrees longitude

      const coordinates = [[
        [lng - lngOffset, lat - latOffset],
        [lng + lngOffset, lat - latOffset],
        [lng + lngOffset, lat + latOffset],
        [lng - lngOffset, lat + latOffset],
        [lng - lngOffset, lat - latOffset]
      ]];

      // Create polygon
      const polygonData = {
        name: name || `Field_${Date.now()}`,
        geo_json: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: coordinates
          }
        }
      };

      console.log('Creating quick polygon:', JSON.stringify(polygonData));

      const createResponse = await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons?appid=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(polygonData)
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Agromonitoring create error:', errorText);
        throw new Error(`Failed to create polygon: ${errorText}`);
      }

      const polygon = await createResponse.json();
      console.log('Created polygon:', polygon.id);

      // Now get satellite data
      const end = Math.floor(Date.now() / 1000);
      const start = end - (30 * 24 * 60 * 60);

      const satelliteResponse = await fetch(
        `https://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${polygon.id}&appid=${apiKey}`
      );

      if (!satelliteResponse.ok) {
        const errorText = await satelliteResponse.text();
        console.error('Satellite search error:', errorText);
        
        // Return polygon info even if no satellite data
        return new Response(JSON.stringify({
          polygonId: polygon.id,
          ndvi: null,
          message: 'Polygon created but no satellite data available yet',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const satellites = await satelliteResponse.json();
      console.log(`Found ${satellites.length} satellite passes`);

      if (satellites.length === 0) {
        return new Response(JSON.stringify({
          polygonId: polygon.id,
          ndvi: null,
          message: 'No satellite imagery available for this area',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get best image (lowest cloud cover, most recent)
      const bestImage = satellites
        .filter((s: any) => s.cl < 30)
        .sort((a: any, b: any) => b.dt - a.dt)[0] || satellites[0];

      // Fetch NDVI stats
      let ndviValue = null;
      let stats = null;
      
      if (bestImage.stats?.ndvi) {
        try {
          const statsResp = await fetch(bestImage.stats.ndvi);
          if (statsResp.ok) {
            stats = await statsResp.json();
            ndviValue = stats.mean;
            console.log('NDVI stats fetched:', stats);
          }
        } catch (e) {
          console.error('Error fetching stats:', e);
        }
      }

      return new Response(JSON.stringify({
        polygonId: polygon.id,
        ndvi: ndviValue,
        ndviMin: stats?.min || null,
        ndviMax: stats?.max || null,
        ndviStd: stats?.std || null,
        imageDate: new Date(bestImage.dt * 1000).toISOString(),
        cloudCoverage: bestImage.cl,
        ndviTileUrl: bestImage.image?.ndvi,
        trueColorUrl: bestImage.image?.truecolor,
        dataType: bestImage.type,
        source: 'agromonitoring',
        totalImages: satellites.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // List existing polygons
    if (action === 'list-polygons') {
      const response = await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons?appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to list polygons');
      }

      const polygons = await response.json();
      return new Response(JSON.stringify(polygons), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Delete a polygon
    if (action === 'delete-polygon') {
      const { polygonId } = body;
      
      const response = await fetch(
        `https://api.agromonitoring.com/agro/1.0/polygons/${polygonId}?appid=${apiKey}`,
        { method: 'DELETE' }
      );

      return new Response(JSON.stringify({ success: response.ok }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Agromonitoring error:', errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
