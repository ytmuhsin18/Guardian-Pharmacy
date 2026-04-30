import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
    try {
        const sql = neon(process.env.DATABASE_URL);
        console.log('Adding columns availability_start_2 and availability_end_2 to doctors table...');
        await sql`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS availability_start_2 TEXT DEFAULT NULL;`;
        await sql`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS availability_end_2 TEXT DEFAULT NULL;`;
        console.log('Migration successful!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
};

runMigration();
