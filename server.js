import express from 'express';
import api from './api/index.js';

const app = express();
const port = process.env.PORT || 3001;

// Use the exact same app behavior as Vercel does
app.use(api);

app.listen(port, () => {
  console.log(`Local Development API Server running on http://localhost:${port}`);
});
