-- Public media bucket for catalog & marketing images (Tier 1 stock → replace with own photos later)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can read catalog images
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Service role / admin uploads via dashboard or seed script (no anon write)
create policy "media admin write"
  on storage.objects for all
  using (public.is_admin())
  with check (public.is_admin());
