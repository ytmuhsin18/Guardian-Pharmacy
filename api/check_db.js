import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
    try {
        const columns = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'doctors'
            ORDER BY ordinal_position
        `;
        console.log("Columns in doctors table:", columns.map(c => c.column_name));
        
        const data = await sql`SELECT id, name, availability_start, availability_end, availability_start_2, availability_end_2 FROM doctors LIMIT 3`;
        console.log("Doctors data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
}
main();
