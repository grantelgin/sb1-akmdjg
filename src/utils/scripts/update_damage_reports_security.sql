-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for all users" ON damage_reports;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON damage_reports;
DROP POLICY IF EXISTS "Enable update for owners" ON damage_reports;
DROP POLICY IF EXISTS "Enable delete for owners" ON damage_reports;

-- Enable RLS
ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;

-- Create new policies
-- Allow anyone to insert reports
CREATE POLICY "Enable insert for all users"
ON damage_reports FOR INSERT
WITH CHECK (true);

-- Allow users to view their own reports if authenticated, or reports without an owner
CREATE POLICY "Enable select for authenticated users"
ON damage_reports FOR SELECT
USING (
  (auth.uid() IS NULL AND owner_id IS NULL) OR -- Allow viewing reports without owner
  (auth.uid() = owner_id) -- Allow viewing own reports
);

-- Allow users to update their own reports
CREATE POLICY "Enable update for owners"
ON damage_reports FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Allow users to delete their own reports
CREATE POLICY "Enable delete for owners"
ON damage_reports FOR DELETE
USING (owner_id = auth.uid()); 