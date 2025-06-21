import express from 'express';
import cors from 'cors';
import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/role', roleRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

export default app;