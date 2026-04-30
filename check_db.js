import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function main() {
    try {
        const columns = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'doctors'
        `;
        console.log("Columns in doctors table:", columns.map(c => c.column_name));
        
        const data = await sql`SELECT * FROM doctors LIMIT 1`;
        console.log("First row:", data);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}
main();
