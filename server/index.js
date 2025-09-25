import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();

// ✅ Use dynamic frontend URL (for deployment) or localhost (for dev)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E backend!',
  });
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);

    // ✅ Use Render’s PORT (falls back to 8080 locally)
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(`🚀 Server started on port ${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};

startServer();
