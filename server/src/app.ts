import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Task Flow API is running!'});
});

export default app;