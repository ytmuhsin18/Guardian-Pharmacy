-- Migration: Add Cascade Deletion
-- Ensures that deleting a Doctor also deletes their Appointments automatically.

-- 1. Drop existing constraint
ALTER TABLE IF EXISTS appointments 
DROP CONSTRAINT IF EXISTS appointments_doctorId_fkey;

-- 2. Re-add constraint with ON DELETE CASCADE
ALTER TABLE appointments
ADD CONSTRAINT appointments_doctorId_fkey 
FOREIGN KEY (doctorid) 
REFERENCES doctors(id) 
ON DELETE CASCADE;

-- Note: Medicines are stored as JSON blobs in orders, 
-- so they don't have strict foreign key constraints preventing deletion.
