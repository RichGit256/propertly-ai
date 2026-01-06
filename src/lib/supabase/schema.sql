-- Create a table for user credits
create table if not exists public.user_credits (
  user_id uuid references auth.users not null primary key,
  credits_remaining integer default 3 not null,
  is_pro_member boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_credits enable row level security;

-- Create policies
create policy "Users can view their own credits" on public.user_credits
  for select using (auth.uid() = user_id);

-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_credits (user_id, credits_remaining)
  values (new.id, 3);
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically create a user_credits entry when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
