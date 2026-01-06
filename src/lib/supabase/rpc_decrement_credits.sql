-- Create a secure function to deduct credits
create or replace function public.decrement_credits(amount int)
returns int
language plpgsql
security definer
as $$
declare
  current_credits int;
  new_credits int;
begin
  -- Get current credits for the user
  select credits_remaining into current_credits
  from public.user_credits
  where user_id = auth.uid();

  -- Check if user exists and has enough credits
  if current_credits is null then
    raise exception 'User not found';
  end if;

  if current_credits < amount then
    raise exception 'Insufficient credits';
  end if;

  -- Calculate new balance
  new_credits := current_credits - amount;

  -- Update the record
  update public.user_credits
  set credits_remaining = new_credits
  where user_id = auth.uid();

  return new_credits;
end;
$$;
