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

grant execute on function public.increment_tool_views(uuid) to anon, authenticated;
grant execute on function public.increment_clicks(uuid) to anon, authenticated;
