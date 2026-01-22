-- 1. Ensure the 'created_at' column exists in your profiles table
alter table public.profiles
add column if not exists created_at timestamp with time zone default now();

-- 2. THE FIX: Copy the real creation date from the auth system to your public profiles
-- This fixes the "Invalid Date" for existing users
update public.profiles as p
set created_at = u.created_at
from auth.users as u
where p.id = u.id
and (p.created_at is null);