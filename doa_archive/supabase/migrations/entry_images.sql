-- Add image_url column to entries
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS image_url text;

-- Create storage bucket for entry images
INSERT INTO storage.buckets (id, name, public)
VALUES ('entry-images', 'entry-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload entry images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'entry-images');

-- Allow public read access to entry images
CREATE POLICY "Public can view entry images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'entry-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete entry images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'entry-images');
