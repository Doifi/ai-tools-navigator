create extension if not exists pgcrypto;

create type public.price_model as enum ('free', 'freemium', 'paid');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.submission_status as enum ('pending', 'approved', 'rejected');
create type public.sponsor_plan as enum ('starter', 'featured', 'homepage');

create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name varchar(100) not null,
  slug varchar(100) unique not null,
  description text,
  icon varchar(50),
  "order" integer default 0,
  created_at timestamp with time zone default now()
);

create table public.tools (
  id uuid default gen_random_uuid() primary key,
  name varchar(200) not null,
  slug varchar(200) unique not null,
  description text,
  detailed_intro text,
  logo_url text,
  website_url text not null,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] default '{}',
  price_model public.price_model,
  api_available boolean default false,
  features text[] default '{}',
  is_sponsored boolean default false,
  sponsor_plan public.sponsor_plan,
  sponsor_expiry timestamp with time zone,
  views integer default 0,
  clicks integer default 0,
  status public.content_status default 'published',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  published_at timestamp with time zone default now()
);

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title varchar(200) not null,
  slug varchar(200) unique not null,
  content text,
  excerpt text,
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  related_tools uuid[] default '{}',
  author varchar(100),
  views integer default 0,
  status public.content_status default 'published',
  published_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table public.tool_submissions (
  id uuid default gen_random_uuid() primary key,
  tool_name varchar(200) not null,
  website_url text not null,
  logo_url text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price_model public.price_model,
  api_available boolean default false,
  submitter_email varchar(200),
  status public.submission_status default 'pending',
  admin_notes text,
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.increment_tool_views(tool_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tools
  set views = coalesce(views, 0) + 1
  where id = tool_id;
end;
$$;

create or replace function public.increment_clicks(tool_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tools
  set clicks = coalesce(clicks, 0) + 1
  where id = tool_id;
end;
$$;

create trigger tools_set_updated_at
before update on public.tools
for each row
execute function public.set_updated_at();

create index if not exists idx_tools_category on public.tools(category_id);
create index if not exists idx_tools_status on public.tools(status);
create index if not exists idx_tools_sponsored on public.tools(is_sponsored) where is_sponsored = true;
create index if not exists idx_tools_published on public.tools(published_at desc);
create index if not exists idx_posts_published on public.posts(published_at desc);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_category on public.posts(category_id);

alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.posts enable row level security;
alter table public.tool_submissions enable row level security;

drop policy if exists "public_categories_can_read" on public.categories;
drop policy if exists "public_tools_can_read_published" on public.tools;
drop policy if exists "public_posts_can_read_published" on public.posts;
drop policy if exists "anyone_can_insert_tool_submissions" on public.tool_submissions;

create policy "public_categories_can_read"
on public.categories
for select
using (true);

create policy "public_tools_can_read_published"
on public.tools
for select
using (status = 'published');

create policy "public_posts_can_read_published"
on public.posts
for select
using (status = 'published');

create policy "anyone_can_insert_tool_submissions"
on public.tool_submissions
for insert
with check (true);

grant execute on function public.increment_tool_views(uuid) to anon, authenticated;
grant execute on function public.increment_clicks(uuid) to anon, authenticated;
