-- Add cover fields to books_uploads table
ALTER TABLE public.books_uploads 
ADD COLUMN IF NOT EXISTS cover_path text,
ADD COLUMN IF NOT EXISTS cover_width integer,
ADD COLUMN IF NOT EXISTS cover_height integer,
ADD COLUMN IF NOT EXISTS cover_color text;

-- Add title, author, year fields if they don't exist
ALTER TABLE public.books_uploads 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS author text,
ADD COLUMN IF NOT EXISTS year integer,
ADD COLUMN IF NOT EXISTS tags text[];

-- Update existing records to have title from filename if title is null
UPDATE public.books_uploads 
SET title = regexp_replace(filename, '\.[^.]*$', '') 
WHERE title IS NULL;

-- Create books-covers storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books-covers', 'books-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for books-covers bucket
CREATE POLICY "Anyone can view book covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'books-covers');

CREATE POLICY "Admins can upload book covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'books-covers' AND is_admin());

CREATE POLICY "Admins can update book covers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'books-covers' AND is_admin());

CREATE POLICY "Admins can delete book covers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'books-covers' AND is_admin());