-- 1. Drop the existing strict constraint
alter table public.user_credits
  drop constraint if exists user_credits_user_id_fkey;

-- 2. Re-add it with "ON DELETE CASCADE"
-- This means if you delete the User in Auth, it will automatically
-- delete their credits row, instead of blocking the deletion.
alter table public.user_credits
  add constraint user_credits_user_id_fkey
  foreign key (user_id)
  references auth.users (id)
  on delete cascade;
