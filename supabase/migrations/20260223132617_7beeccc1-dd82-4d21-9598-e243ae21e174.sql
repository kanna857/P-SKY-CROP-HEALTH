
-- Create storage bucket for crop photos
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-photos', 'crop-photos', true);

-- Allow authenticated users to upload
CREATE POLICY "Users can upload crop photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'crop-photos' AND auth.uid() IS NOT NULL);

-- Allow public read access
CREATE POLICY "Crop photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'crop-photos');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own crop photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'crop-photos' AND auth.uid() IS NOT NULL);
