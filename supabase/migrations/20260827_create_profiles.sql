-- ==============================================================================
-- TRACEPASS SUPABASE MIGRATION: BẢNG PROFILES & TRIGGER TỰ ĐỘNG PHÂN VAI TRÒ
-- ==============================================================================

-- 1. Tạo bảng profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null check (role in ('sme', 'supplier')),
  created_at timestamptz default now()
);

-- 2. Bật Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Tạo RLS Policies
-- User chỉ đọc được profile của chính mình
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- User có thể cập nhật profile của chính mình
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- User có thể insert profile của chính mình (hỗ trợ fallback từ client)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- 4. Function tự động thêm profile khi tạo user mới trong auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'sme')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = coalesce(excluded.role, public.profiles.role);
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger kích hoạt khi có user mới
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
