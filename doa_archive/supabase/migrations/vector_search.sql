-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to entries
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create ivfflat index for cosine similarity search
CREATE INDEX IF NOT EXISTS entries_embedding_idx
  ON public.entries
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Function for similarity search
CREATE OR REPLACE FUNCTION match_entries(
  query_embedding vector(1536),
  match_count int DEFAULT 4,
  filter_published boolean DEFAULT true
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  type text,
  classification text,
  status text,
  file_no text,
  summary text,
  gated_content text,
  is_gated boolean,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.slug,
    e.type,
    e.classification,
    e.status,
    e.file_no,
    e.summary,
    e.gated_content,
    e.is_gated,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM public.entries e
  WHERE
    (NOT filter_published OR e.is_published = true)
    AND e.embedding IS NOT NULL
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- To backfill embeddings for existing entries, use the embed-entry Edge Function.
-- See: supabase/functions/embed-entry/index.ts
