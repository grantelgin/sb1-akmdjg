-- Enable the moddatetime extension
create extension if not exists moddatetime schema extensions;

-- Create storm_reports table
create table public.storm_reports (
    id uuid default gen_random_uuid() primary key,
    report_date date not null,
    county text not null,
    state text not null,
    tornado_reports jsonb,
    hail_reports jsonb,
    wind_reports jsonb,
    hurricane_reports jsonb,
    map_image_url text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.storm_reports enable row level security;

-- Create policies for storm_reports
create policy "Allow public read access"
    on public.storm_reports
    for select
    using (true);

create policy "Allow authenticated insert"
    on public.storm_reports
    for insert
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
    on public.storm_reports
    for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Create updated_at trigger
create trigger handle_updated_at before update on public.storm_reports
    for each row execute procedure moddatetime (updated_at);

-- Create storage bucket for SPC reports
insert into storage.buckets (id, name, public)
values ('spc', 'spc', true);

-- Create storage policies for SPC bucket
create policy "Public Access"
    on storage.objects
    for select
    using (bucket_id = 'spc');

create policy "Authenticated Upload"
    on storage.objects
    for insert
    with check (
        bucket_id = 'spc'
        and auth.role() = 'authenticated'
    );
