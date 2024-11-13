-- Create contractors table
create table contractors (
  id bigint generated by default as identity primary key,
  contractor_id text unique not null,
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  coordinates jsonb not null,
  services jsonb not null,
  property_types text[] not null,
  license_number text,
  insurance_info jsonb,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create RLS policies
alter table contractors enable row level security;

-- Allow contractors to insert their own data
create policy "Allow contractor insert"
  on contractors for insert
  with check (true);

-- Allow contractors to view their own data
create policy "Allow contractor select own data"
  on contractors for select
  using (email = auth.email());
