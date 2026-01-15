-- 1. Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  -- Enforce username rules (lowercase, a-z, 0-9, min 3 chars)
  constraint username_length check (char_length(username) >= 3),
  constraint username_validation check (username ~* '^[a-zA-Z0-9_]+$')
);

-- 2. Enable Row Level Security (RLS)
-- This locks the table down. No one can touch it unless we say so.
alter table profiles enable row level security;

-- 3. Create Policies (Security Rules)

-- Rule: Everyone can see profiles (Public access)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Rule: Users can insert their own profile (Required for the trigger to work occasionally, though usually system handles this)
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

-- Rule: Users can only update their OWN profile
create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );

-- 4. Set up the Trigger for New Users
-- This function runs every time a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    -- Fallback username: user123 (we will let them change it later)
    'user_' || substr(new.id::text, 1, 8)
  );
  return new;
end;
$$;

-- Trigger the function on auth.users creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();