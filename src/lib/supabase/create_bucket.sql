-- 1. Create the 'temp-uploads' bucket (Public)
insert into storage.buckets (id, name, public)
values ('temp-uploads', 'temp-uploads', true)
on conflict (id) do nothing;

-- 2. Allow Public Access (Read)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'temp-uploads' );

-- 3. Allow Information (To everyone for now, to fix the error)
-- Ideally you restrict this to 'authenticated' later.
create policy "Everyone can upload"
on storage.objects for insert
with check ( bucket_id = 'temp-uploads' );
