-- 1. Create the Likes table
create table likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Composite Key: Ensures user X can only like post Y once
  primary key (user_id, post_id)
);

-- 2. Enable Security
alter table likes enable row level security;

-- 3. Policies
-- Everyone can see who liked what (to count them)
create policy "Anyone can read likes" 
  on likes for select 
  using ( true );

-- Only logged-in users can like
create policy "Auth users can insert likes" 
  on likes for insert 
  with check ( auth.uid() = user_id );

-- Users can only un-like (delete) their own likes
create policy "Users can delete own likes" 
  on likes for delete 
  using ( auth.uid() = user_id );