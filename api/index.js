import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load .env variables locally
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const sql = neon(process.env.DATABASE_URL);

// Simple healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Medicines
const medicinesRouter = express.Router();
medicinesRouter.get('/', async (req, res) => {
    try {
        const result = await sql`SELECT id, name, combination, category, condition, price, discount, description, instock, image_base64 FROM medicines ORDER BY id DESC LIMIT 200`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

medicinesRouter.post('/', async (req, res) => {
    try {
        const { name, combination, category, condition, price, discount, description, instock, image_base64 } = req.body;
        const result = await sql`
            INSERT INTO medicines (name, combination, category, condition, price, discount, description, instock, image_base64)
            VALUES (${name || null}, ${combination || null}, ${category || null}, ${condition || null}, ${price || 0}, ${discount || 0}, ${description || null}, ${instock !== false}, ${image_base64 || null})
            RETURNING *
        `;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

medicinesRouter.post('/bulk', async (req, res) => {
    try {
        for (let med of req.body) {
            await sql`INSERT INTO medicines (name, combination, category, condition, price, discount, description, instock, image_base64) 
                      VALUES (${med.name}, ${med.combination || null}, ${med.category || null}, ${med.condition || null}, ${med.price || 0}, ${med.discount || 0}, ${med.description || null}, ${med.instock !== false}, ${med.image_base64 || null})`;
        }
        res.json({ success: true, count: req.body.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

medicinesRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.instock !== undefined && Object.keys(req.body).length === 1) {
            const result = await sql`UPDATE medicines SET instock = ${req.body.instock} WHERE id = ${id} RETURNING *`;
            return res.json([result[0]]);
        }
        if (req.body.image_base64 !== undefined && Object.keys(req.body).length === 1) {
            const result = await sql`UPDATE medicines SET image_base64 = ${req.body.image_base64} WHERE id = ${id} RETURNING *`;
            return res.json([result[0]]);
        }
        const { name, combination, category, price, discount, description, instock, image_base64 } = req.body;
        const result = await sql`
            UPDATE medicines SET name=${name}, combination=${combination || null}, category=${category}, price=${price}, discount=${discount}, description=${description || null}, instock=${instock}, image_base64=${image_base64 || null}
            WHERE id = ${id} RETURNING *
        `;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

medicinesRouter.delete('/:id', async (req, res) => {
    try {
        await sql`DELETE FROM medicines WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

medicinesRouter.get('/:id/image', async (req, res) => {
    try {
        const result = await sql`SELECT image_base64 FROM medicines WHERE id = ${req.params.id}`;
        res.json(result[0] || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.use('/api/medicines', medicinesRouter);

// Doctors
const doctorsRouter = express.Router();
doctorsRouter.get('/', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM doctors ORDER BY id ASC`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
doctorsRouter.post('/', async (req, res) => {
    try {
        const { name, specialty, experience, about, image_base64, availability_start, availability_end } = req.body;
        const result = await sql`INSERT INTO doctors (name, specialty, experience, about, image_base64, availability_start, availability_end) VALUES (${name}, ${specialty}, ${experience}, ${about}, ${image_base64 || null}, ${availability_start || null}, ${availability_end || null}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
doctorsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.image_base64 !== undefined && Object.keys(req.body).length === 1) {
            const result = await sql`UPDATE doctors SET image_base64=${req.body.image_base64} WHERE id=${id} RETURNING *`;
            return res.json([result[0]]);
        }
        if (req.body.availability_start && req.body.availability_end && Object.keys(req.body).length === 2) {
            const result = await sql`UPDATE doctors SET availability_start=${req.body.availability_start}, availability_end=${req.body.availability_end} WHERE id=${id} RETURNING *`;
            return res.json([result[0]]);
        }
        const { name, specialty, experience, about, image_base64, availability_start, availability_end } = req.body;
        const result = await sql`UPDATE doctors SET name=${name}, specialty=${specialty}, experience=${experience}, about=${about || null}, image_base64=${image_base64 || null}, availability_start=${availability_start || null}, availability_end=${availability_end || null} WHERE id=${id} RETURNING *`;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
doctorsRouter.get('/:id/image', async (req, res) => {
    try {
        const result = await sql`SELECT image_base64 FROM doctors WHERE id = ${req.params.id}`;
        res.json(result[0] || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
});
doctorsRouter.delete('/:id', async (req, res) => {
    try {
        await sql`DELETE FROM doctors WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.use('/api/doctors', doctorsRouter);

// Appointments
const appointmentsRouter = express.Router();
appointmentsRouter.get('/', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM appointments ORDER BY created_at DESC LIMIT 500`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
appointmentsRouter.post('/', async (req, res) => {
    try {
        const { patientname, doctorid, doctorname, date, time, phone, reason, status } = req.body;
        const result = await sql`INSERT INTO appointments (patientname, doctorid, doctorname, date, time, phone, reason, status) VALUES (${patientname}, ${doctorid}, ${doctorname}, ${date}, ${time || null}, ${phone}, ${reason || null}, ${status || 'Pending'}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
appointmentsRouter.put('/:id', async (req, res) => {
    try {
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
    } catch (err) { res.status(500).json({ error: err.message }); }
});
appointmentsRouter.delete('/cleanup', async (req, res) => {
    try {
        await sql`DELETE FROM appointments WHERE created_at < NOW() - INTERVAL '72 hours'`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
appointmentsRouter.post('/statusCheck', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) return res.json([]);
        const query = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        if(query.length === 0) return res.json([]);
        // Convert JS array to postgres array format manually or via neon
        const result = await sql`SELECT id, status FROM appointments WHERE id = ANY(${query})`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.use('/api/appointments', appointmentsRouter);

// Orders
const ordersRouter = express.Router();
ordersRouter.get('/', async (req, res) => {
    try {
        const result = await sql`SELECT id, customer_name, phone, whatsapp, address, pincode, email, total_amount, status, created_at, items::text as items FROM orders ORDER BY created_at DESC LIMIT 500`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
ordersRouter.post('/', async (req, res) => {
    try {
        const { customer_name, phone, whatsapp, address, pincode, email, items, total_amount, status } = req.body;
        const result = await sql`INSERT INTO orders (customer_name, phone, whatsapp, address, pincode, email, items, total_amount, status) VALUES (${customer_name}, ${phone}, ${whatsapp}, ${address}, ${pincode}, ${email || null}, ${JSON.stringify(items)}, ${total_amount}, ${status || 'Pending'}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
ordersRouter.put('/:id', async (req, res) => {
    try {
        if (req.body.status) {
            const result = await sql`UPDATE orders SET status=${req.body.status} WHERE id=${req.params.id} RETURNING *`;
            return res.json([result[0]]);
        }
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
ordersRouter.delete('/cleanup', async (req, res) => {
    try {
        await sql`DELETE FROM orders WHERE created_at < NOW() - INTERVAL '72 hours'`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
ordersRouter.post('/statusCheck', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) return res.json([]);
        const query = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        if(query.length === 0) return res.json([]);
        const result = await sql`SELECT id, status FROM orders WHERE id = ANY(${query})`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.use('/api/orders', ordersRouter);

// Prescriptions
const prescriptionsRouter = express.Router();
prescriptionsRouter.get('/', async (req, res) => {
    try {
        const result = await sql`SELECT id, status, created_at FROM prescriptions ORDER BY created_at DESC LIMIT 200`;
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
prescriptionsRouter.post('/', async (req, res) => {
    try {
        const { image_base64, status } = req.body;
        const result = await sql`INSERT INTO prescriptions (image_base64, status) VALUES (${image_base64}, ${status || 'Pending'}) RETURNING *`;
        res.json([result[0]]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
prescriptionsRouter.put('/:id', async (req, res) => {
    try {
        if (req.body.status) {
            const result = await sql`UPDATE prescriptions SET status=${req.body.status} WHERE id=${req.params.id} RETURNING *`;
            return res.json([result[0]]);
        }
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
prescriptionsRouter.get('/:id/image', async (req, res) => {
    try {
        const result = await sql`SELECT image_base64 FROM prescriptions WHERE id = ${req.params.id}`;
        res.json(result[0] || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.use('/api/prescriptions', prescriptionsRouter);

export default app;
