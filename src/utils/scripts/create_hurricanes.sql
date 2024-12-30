create table hurricanes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  date timestamp with time zone not null,
  lat double precision not null,
  lon double precision not null,
  wind_speed integer not null,
  category integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);