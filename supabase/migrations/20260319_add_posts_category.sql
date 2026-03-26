alter table public.posts
add column if not exists category_id uuid references public.categories(id) on delete set null;

create index if not exists idx_posts_category on public.posts(category_id);
