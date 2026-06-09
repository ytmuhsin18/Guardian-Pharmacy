import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load .env variables locally (only used in local node server.js)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to get Neon SQL client
const getSql = () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL environment variable is missing. Please add it to your Vercel project settings.");
    }
    return neon(dbUrl);
};

// Simple healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok', hasDbUrl: !!process.env.DATABASE_URL }));

// Medicines
const medicinesRouter = express.Router();
medicinesRouter.get('/', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT id, name, combination, category, condition, price, discount, description, instock, image_base64 FROM medicines ORDER BY id DESC LIMIT 200`;
        res.json(result);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});

medicinesRouter.post('/', async (req, res) => {
    try {
        const sql = getSql();
        const { name, combination, category, condition, price, discount, description, instock, image_base64 } = req.body;
        const result = await sql`
            INSERT INTO medicines (name, combination, category, condition, price, discount, description, instock, image_base64)
            VALUES (${name || null}, ${combination || null}, ${category || null}, ${condition || null}, ${parseFloat(price) || 0}, ${parseFloat(discount) || 0}, ${description || null}, ${instock !== false}, ${image_base64 || null})
            RETURNING *
        `;
        res.json([result[0]]);
    } catch (err) {
        console.error('POST medicine error details:', err);
        res.status(500).json({ error: err.message });
    }
});

medicinesRouter.post('/bulk', async (req, res) => {
    try {
        const sql = getSql();
        for (let med of req.body) {
            await sql`INSERT INTO medicines (name, combination, category, condition, price, discount, description, instock, image_base64) 
                      VALUES (${med.name}, ${med.combination || null}, ${med.category || null}, ${med.condition || null}, ${med.price || 0}, ${med.discount || 0}, ${med.description || null}, ${med.instock !== false}, ${med.image_base64 || null})`;
        }
        res.json({ success: true, count: req.body.length });
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});

medicinesRouter.put('/:id', async (req, res) => {
    try {
        const sql = getSql();
        const id = parseInt(req.params.id);
        if (req.body.instock !== undefined && Object.keys(req.body).length === 1) {
            const result = await sql`UPDATE medicines SET instock = ${req.body.instock === true} WHERE id = ${id} RETURNING *`;
            return res.json([result[0]]);
        }
        if (req.body.image_base64 !== undefined && Object.keys(req.body).length === 1) {
            const result = await sql`UPDATE medicines SET image_base64 = ${req.body.image_base64} WHERE id = ${id} RETURNING *`;
            return res.json([result[0]]);
        }
        const { name, combination, category, price, discount, description, instock, image_base64 } = req.body;
        const result = await sql`
            UPDATE medicines SET name=${name}, combination=${combination || null}, category=${category}, price=${parseFloat(price) || 0}, discount=${parseFloat(discount) || 0}, description=${description || null}, instock=${instock === true}, image_base64=${image_base64 || null}
            WHERE id = ${id} RETURNING *
        `;
        res.json([result[0]]);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});

medicinesRouter.delete('/:id', async (req, res) => {
    try {
        const sql = getSql();
        await sql`DELETE FROM medicines WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});

medicinesRouter.get('/:id/image', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT image_base64 FROM medicines WHERE id = ${req.params.id}`;
        res.json(result[0] || {});
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
app.use('/api/medicines', medicinesRouter);

// Doctors
const doctorsRouter = express.Router();
doctorsRouter.get('/', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT * FROM doctors ORDER BY id ASC`;
        res.json(result);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
doctorsRouter.post('/', async (req, res) => {
    try {
        const sql = getSql();
        const { name, specialty, experience, about, image_base64, availability_start, availability_end, availability_start_2, availability_end_2 } = req.body;
        const result = await sql`INSERT INTO doctors (name, specialty, experience, about, image_base64, availability_start, availability_end, availability_start_2, availability_end_2) VALUES (${name}, ${specialty}, ${experience}, ${about}, ${image_base64 || null}, ${availability_start || null}, ${availability_end || null}, ${availability_start_2 || null}, ${availability_end_2 || null}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) {
        console.error('POST doctor error details:', err);
        res.status(500).json({ error: err.message });
    }
});
doctorsRouter.put('/:id', async (req, res) => {
    try {
        const sql = getSql();
        const id = req.params.id;
        if (req.body.image_base64 !== undefined && Object.keys(req.body).length === 1) {
            const result = await sql`UPDATE doctors SET image_base64=${req.body.image_base64} WHERE id=${id} RETURNING *`;
            return res.json([result[0]]);
        }
        if (req.body.availability_start !== undefined && req.body.availability_end !== undefined && Object.keys(req.body).length <= 4) {
            const result = await sql`UPDATE doctors SET availability_start=${req.body.availability_start}, availability_end=${req.body.availability_end}, availability_start_2=${req.body.availability_start_2 || null}, availability_end_2=${req.body.availability_end_2 || null} WHERE id=${id} RETURNING *`;
            return res.json([result[0]]);
        }
        const { name, specialty, experience, about, image_base64, availability_start, availability_end, availability_start_2, availability_end_2 } = req.body;
        const result = await sql`UPDATE doctors SET name=${name}, specialty=${specialty}, experience=${experience}, about=${about || null}, image_base64=${image_base64 || null}, availability_start=${availability_start || null}, availability_end=${availability_end || null}, availability_start_2=${availability_start_2 || null}, availability_end_2=${availability_end_2 || null} WHERE id=${id} RETURNING *`;
        res.json([result[0]]);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
doctorsRouter.get('/:id/image', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT image_base64 FROM doctors WHERE id = ${req.params.id}`;
        res.json(result[0] || {});
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
doctorsRouter.delete('/:id', async (req, res) => {
    try {
        const sql = getSql();
        await sql`DELETE FROM doctors WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
app.use('/api/doctors', doctorsRouter);

// Appointments
const appointmentsRouter = express.Router();
appointmentsRouter.get('/', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT * FROM appointments ORDER BY created_at DESC LIMIT 500`;
        res.json(result);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
appointmentsRouter.post('/', async (req, res) => {
    try {
        const sql = getSql();
        const { patientname, doctorid, doctorname, date, time, phone, reason, status } = req.body;
        const result = await sql`INSERT INTO appointments (patientname, doctorid, doctorname, date, time, phone, reason, status) VALUES (${patientname}, ${doctorid}, ${doctorname}, ${date}, ${time || null}, ${phone}, ${reason || null}, ${status || 'Pending'}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
appointmentsRouter.put('/:id', async (req, res) => {
    try {
        const sql = getSql();
        const id = req.params.id;
        if (req.body.status !== undefined) {
            const result = await sql`UPDATE appointments SET status=${req.body.status} WHERE id=${id} RETURNING *`;
            return res.json([result[0]]);
        }
        if (req.body.token_number !== undefined) {
            const result = await sql`UPDATE appointments SET token_number=${req.body.token_number} WHERE id=${id} RETURNING *`;
            return res.json([result[0]]);
        }
        res.json([]);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
appointmentsRouter.delete('/cleanup', async (req, res) => {
    try {
        const sql = getSql();
        await sql`DELETE FROM appointments WHERE created_at < NOW() - INTERVAL '72 hours'`;
        res.json({ success: true });
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
appointmentsRouter.post('/statusCheck', async (req, res) => {
    try {
        const sql = getSql();
        const { ids } = req.body;
        if (!ids || ids.length === 0) return res.json([]);
        const query = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        if (query.length === 0) return res.json([]);
        const result = await sql`SELECT id, status FROM appointments WHERE id = ANY(${query})`;
        res.json(result);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
app.use('/api/appointments', appointmentsRouter);

// Orders
const ordersRouter = express.Router();
ordersRouter.get('/', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT id, customer_name, phone, whatsapp, address, pincode, email, total_amount, payment_method, status, created_at, items::text as items FROM orders ORDER BY created_at DESC LIMIT 500`;
        res.json(result);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
ordersRouter.post('/', async (req, res) => {
    try {
        const sql = getSql();
        const { customer_name, phone, whatsapp, address, pincode, email, items, total_amount, status } = req.body;
        const payment_method = req.body.payment_method || req.body.paymentMethod || 'COD';
        const result = await sql`INSERT INTO orders (customer_name, phone, whatsapp, address, pincode, email, items, total_amount, status, payment_method) VALUES (${customer_name}, ${phone}, ${whatsapp}, ${address}, ${pincode}, ${email || null}, ${JSON.stringify(items)}, ${total_amount}, ${status || 'Pending'}, ${payment_method}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
ordersRouter.put('/:id', async (req, res) => {
    try {
        const sql = getSql();
        if (req.body.status) {
            const result = await sql`UPDATE orders SET status=${req.body.status} WHERE id=${req.params.id} RETURNING *`;
            return res.json([result[0]]);
        }
        res.json([]);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
ordersRouter.delete('/cleanup', async (req, res) => {
    try {
        const sql = getSql();
        await sql`DELETE FROM orders WHERE created_at < NOW() - INTERVAL '72 hours'`;
        res.json({ success: true });
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
ordersRouter.post('/statusCheck', async (req, res) => {
    try {
        const sql = getSql();
        const { ids } = req.body;
        if (!ids || ids.length === 0) return res.json([]);
        const query = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        if (query.length === 0) return res.json([]);
        const result = await sql`SELECT id, status FROM orders WHERE id = ANY(${query})`;
        res.json(result);
    } catch (err) { console.error('GET medicines error:', err); res.status(500).json({ error: err.message }); }
});
app.use('/api/orders', ordersRouter);

// Prescriptions removed

// Users
const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    try {
        const sql = getSql();
        const result = await sql`SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC`;
        res.json(result);
    } catch (err) { console.error('GET users error:', err); res.status(500).json({ error: err.message }); }
});

usersRouter.post('/register', async (req, res) => {
    try {
        const sql = getSql();
        const { name, email, phone, password } = req.body;
        // Check if phone exists
        const existingUser = await sql`SELECT id FROM users WHERE phone = ${phone}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Phone number already registered. Please Login.' });
        }

        const result = await sql`INSERT INTO users (name, email, phone, password) VALUES (${name}, ${email || null}, ${phone}, ${password}) RETURNING id, name, email, phone, created_at`;
        res.json(result[0]);
    } catch (err) { console.error('POST register error:', err); res.status(500).json({ error: err.message }); }
});

usersRouter.post('/login', async (req, res) => {
    try {
        const sql = getSql();
        const { phone, password } = req.body;
        const result = await sql`SELECT id, name, email, phone, created_at, password FROM users WHERE phone = ${phone}`;

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found. Please Sign Up first.' });
        }

        const user = result[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.' });
        }

        // Remove password from response
        delete user.password;
        res.json(user);
    } catch (err) { console.error('POST login error:', err); res.status(500).json({ error: err.message }); }
});

usersRouter.put('/:id', async (req, res) => {
    try {
        const sql = getSql();
        const { name, email, phone } = req.body;
        const result = await sql`UPDATE users SET name=${name}, email=${email || null}, phone=${phone} WHERE id=${req.params.id} RETURNING id, name, email, phone, created_at`;
        res.json(result[0]);
    } catch (err) { console.error('PUT user error:', err); res.status(500).json({ error: err.message }); }
});

usersRouter.delete('/:id', async (req, res) => {
    try {
        const sql = getSql();
        await sql`DELETE FROM users WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { console.error('DELETE user error:', err); res.status(500).json({ error: err.message }); }
});

app.use('/api/users', usersRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER FATAL ERROR:', err);
    res.status(500).json({
        error: 'Global Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;
