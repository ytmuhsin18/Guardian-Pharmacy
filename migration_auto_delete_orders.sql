-- Migration: Automate Data Deletion (Orders & Appointments > 72 hours)
-- Run this in your Supabase SQL Editor

-- 1. Create the cleanup function
CREATE OR REPLACE FUNCTION delete_old_records()
RETURNS void AS $$
BEGIN
  -- Deletes orders where created_at is older than 72 hours
  DELETE FROM orders
  WHERE created_at < NOW() - INTERVAL '72 hours';

  -- Deletes appointments where created_at is older than 72 hours
  DELETE FROM appointments
  WHERE created_at < NOW() - INTERVAL '72 hours';
END;
$$ LANGUAGE plpgsql;

-- 2. Schedule the cleanup using pg_cron (if available on your plan)
-- SELECT cron.schedule('0 * * * *', 'SELECT delete_old_records()');

-- NOTE: If pg_cron is not enabled, go to Dashboard > Database > Extensions and enable 'pg_cron'.
-- If you are on a plan that doesn't support pg_cron, the app handles 
-- cleanup automatically on the Admin Dashboard load.
