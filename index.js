import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://192.168.0.187:5173' // 務必包含手機訪問的前端 IP
  ],
  credentials: true, // 允許跨網域傳遞 Cookie 或 Authorization Header
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API 路由
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.listen(3002,'0.0.0.0', () => {
  console.log('API running at http://192.168.0.187:3002');
});
