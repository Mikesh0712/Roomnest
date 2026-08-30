import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 RoomNest Hyperlocal API running on port ${PORT}`);
    console.log(`📖 Swagger API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`====================================================`);
  });
}).catch((err) => {
  console.error('[Server Startup Error]:', err);
});
