-- 1. Drop the old constraint pointing to auth.users
alter table comments 
drop constraint comments_user_id_fkey;

-- 2. Add new constraint pointing to profiles (public)
alter table comments 
add constraint comments_user_id_fkey 
foreign key (user_id) 
references public.profiles(id) 
on delete cascade;