-- Create user_edits table
create table public.user_edits (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  original_url text not null,
  enhanced_url text not null,
  mode text not null,
  created_at timestamp with time zone not null default now(),
  constraint user_edits_pkey primary key (id),
  constraint user_edits_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS
alter table public.user_edits enable row level security;

-- Policies
create policy "Users can view their own edits" on public.user_edits
  for select using (auth.uid() = user_id);

create policy "Users can insert their own edits" on public.user_edits
  for insert with check (auth.uid() = user_id);
