import express from 'express';
import api from './api/index.js';

const app = express();
const port = process.env.PORT || 3001;

// Use the exact same app behavior as Vercel does
app.use(api);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('SERVER START ERROR:', err);
    return;
  }
  console.log(`API Server running on http://127.0.0.1:${port}`);
});
