-- Run this migration on your existing Supabase database to add missing columns
-- Go to Supabase Dashboard > SQL Editor > Paste and Run

ALTER TABLE medicines ADD COLUMN IF NOT EXISTS combination TEXT;
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS availability_start TEXT DEFAULT '06:00 PM';
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS availability_end TEXT DEFAULT '10:00 PM';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS token_number INTEGER;
