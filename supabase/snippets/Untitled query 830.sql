-- 1. Create Bookmarks Table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id) -- Prevent duplicate bookmarks
);

-- 2. Enable Security
alter table bookmarks enable row level security;

-- 3. Policies (Strictly Private)
create policy "Users can view own bookmarks" 
  on bookmarks for select 
  using ( auth.uid() = user_id );

create policy "Users can add bookmarks" 
  on bookmarks for insert 
  with check ( auth.uid() = user_id );

create policy "Users can remove bookmarks" 
  on bookmarks for delete 
  using ( auth.uid() = user_id );