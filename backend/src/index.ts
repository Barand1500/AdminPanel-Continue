import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import publicRoutes from './WebApi/routes/publicRoutes.js';
import adminRoutes from './WebApi/routes/adminRoutes.js';
import { bulunamadiHandler, hataYakalayici } from './WebApi/middleware/hataYakalayici.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use(bulunamadiHandler);
app.use(hataYakalayici);

app.listen(config.port, () => {
  console.log(`Backend calisiyor: http://localhost:${config.port}`);
  console.log(`Ortam: ${config.nodeEnv}`);
});
