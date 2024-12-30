-- Seed data for hurricanes table with HURDAT2 data
-- Source: National Hurricane Center's HURDAT2 dataset
-- Only including some recent significant hurricanes as examples

INSERT INTO hurricanes (name, date, lat, lon, wind_speed, category)
VALUES 
  -- Hurricane Ian (2022)
  ('Ian', '2022-09-28 18:00:00+00', 26.3, -82.5, 150, 4),
  ('Ian', '2022-09-28 12:00:00+00', 26.7, -82.2, 155, 4),
  
  -- Hurricane Ida (2021)
  ('Ida', '2021-08-29 16:00:00+00', 29.5, -90.1, 150, 4),
  ('Ida', '2021-08-29 12:00:00+00', 29.2, -89.6, 145, 4),
  
  -- Hurricane Laura (2020)
  ('Laura', '2020-08-27 06:00:00+00', 30.2, -93.2, 150, 4),
  ('Laura', '2020-08-27 00:00:00+00', 29.6, -93.3, 145, 4),
  
  -- Hurricane Michael (2018)
  ('Michael', '2018-10-10 18:00:00+00', 30.2, -85.3, 155, 5),
  ('Michael', '2018-10-10 12:00:00+00', 29.8, -85.7, 150, 4);

-- Note: This is example seed data. For a complete dataset, you would want to:
-- 1. Include the full HURDAT2 dataset or a larger subset
-- 2. Add more data points per hurricane to show the storm track
-- 3. Consider adding additional hurricanes from recent years 