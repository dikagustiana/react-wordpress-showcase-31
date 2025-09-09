-- Remove duplicate entries with dash format, keeping underscore format ones
DELETE FROM public.fsli_pages 
WHERE slug = 'cash-and-cash-equivalents';

-- Update all existing underscore format slugs to dash format for consistency
UPDATE public.fsli_pages 
SET slug = REPLACE(slug, '_', '-')
WHERE slug LIKE '%_%';

-- Update page_key in related tables to match the new dash format
UPDATE public.fsli_inline_sections 
SET page_key = REPLACE(page_key, '_', '-')
WHERE page_key LIKE '%_%';

UPDATE public.fsli_inline_embeds 
SET page_key = REPLACE(page_key, '_', '-')
WHERE page_key LIKE '%_%';

UPDATE public.fsli_inline_assets 
SET page_key = REPLACE(page_key, '_', '-')
WHERE page_key LIKE '%_%';