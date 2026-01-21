-- 1. Create Comments Table
create table comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Security
alter table comments enable row level security;

-- 3. Policies
-- Everyone can read comments
create policy "Anyone can read comments" 
  on comments for select 
  using ( true );

-- Authenticated users can insert (post) comments
create policy "Auth users can post comments" 
  on comments for insert 
  with check ( auth.uid() = user_id );

-- Users can delete their OWN comments
create policy "Users can delete own comments" 
  on comments for delete 
  using ( auth.uid() = user_id );