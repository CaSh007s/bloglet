-- 1. Create the Posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  title text not null,
  slug text not null, -- The URL part (e.g., my-first-post)
  content text,       -- The actual Markdown
  published boolean default false,

  author_id uuid references public.profiles(id) on delete cascade not null,

  -- Ensure slugs are unique per author (so cash007s/post-1 doesn't clash with other-user/post-1)
  constraint unique_slug_per_author unique (author_id, slug)
);

-- 2. Enable Security (RLS)
alter table posts enable row level security;

-- 3. Security Policies (Who can do what?)

-- Policy: Anyone can READ published posts
create policy "Anyone can read published posts"
  on posts for select
  using ( published = true );

-- Policy: Authors can READ their own posts (even drafts)
create policy "Authors can read own posts"
  on posts for select
  using ( auth.uid() = author_id );

-- Policy: Authors can CREATE posts
create policy "Authors can create posts"
  on posts for insert
  with check ( auth.uid() = author_id );

-- Policy: Authors can UPDATE their own posts
create policy "Authors can update own posts"
  on posts for update
  using ( auth.uid() = author_id );

-- Policy: Authors can DELETE their own posts
create policy "Authors can delete own posts"
  on posts for delete
  using ( auth.uid() = author_id );