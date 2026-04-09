const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('DATABASE_URL missing');
    process.exit(1);
}

const sql = neon(dbUrl);

async function check() {
    try {
        const medicines = await sql`SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'medicines'`;
        console.log('Medicines columns:', medicines);
        const doctors = await sql`SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'doctors'`;
        console.log('Doctors columns:', doctors);
    } catch (err) {
        console.error(err);
    }
}

check();
