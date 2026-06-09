import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function resetOrders() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL is missing in .env");
        return;
    }
    const sql = neon(dbUrl);
    try {
        console.log("Truncating orders table...");
        await sql`TRUNCATE TABLE orders RESTART IDENTITY CASCADE`;
        console.log("Orders table reset successfully.");

        console.log("Truncating appointments table...");
        await sql`TRUNCATE TABLE appointments RESTART IDENTITY CASCADE`;
        console.log("Appointments table reset successfully.");
    } catch (err) {
        console.error("Error resetting database:", err);
    }
}

resetOrders();
