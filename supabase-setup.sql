-- ZTP Lifestyle catalogue, admin allowlist, and image bucket.
-- Run this in Supabase Dashboard > SQL Editor after creating a project.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  details text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= 0),
  badge text not null default '',
  image_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.products enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.products from anon, authenticated;
grant select on table public.admin_users to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;

drop policy if exists "Admins can verify their own admin record" on public.admin_users;
create policy "Admins can verify their own admin record"
on public.admin_users for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Anyone can view active products" on public.products;
create policy "Anyone can view active products"
on public.products for select to anon, authenticated
using (active = true or exists (
  select 1 from public.admin_users
  where admin_users.user_id = (select auth.uid())
));

drop policy if exists "Admins can add products" on public.products;
create policy "Admins can add products"
on public.products for insert to authenticated
with check (exists (
  select 1 from public.admin_users
  where admin_users.user_id = (select auth.uid())
));

drop policy if exists "Admins can edit products" on public.products;
create policy "Admins can edit products"
on public.products for update to authenticated
using (exists (
  select 1 from public.admin_users
  where admin_users.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.admin_users
  where admin_users.user_id = (select auth.uid())
));

drop policy if exists "Admins can remove products" on public.products;
create policy "Admins can remove products"
on public.products for delete to authenticated
using (exists (
  select 1 from public.admin_users
  where admin_users.user_id = (select auth.uid())
));

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'product-images' and exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update to authenticated
using (
  bucket_id = 'product-images' and exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'product-images' and exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'product-images' and exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

-- After creating your admin user in Authentication > Users, replace the email
-- below and run this insert in the SQL Editor to grant that account admin access.
-- insert into public.admin_users (user_id)
-- select id from auth.users where lower(email) = lower('YOUR-ADMIN-EMAIL')
-- on conflict (user_id) do nothing;
