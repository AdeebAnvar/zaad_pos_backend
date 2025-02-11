const express = require('express');
const axios = require('axios'); // Ensure axios is installed: npm install axios
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/user_routes');
const productRoutes = require('./routes/product_routes');
const authJwt = require('./config/jwt');
const cors = require('cors');

const port = process.env.DB_PORT|| 3000;

// Middleware
app.use(express.json());
app.use(authJwt);
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/user', userRoutes);
app.use('/product', productRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Call the health check endpoint every 10 seconds to keep the server alive
setInterval(async () => {
  try {
    const response = await axios.get('https://zaad-pos-backend.onrender.com/health'); // Use full URL
    console.log('API called successfully:', response.data);
  } catch (error) {
    console.error('Error calling API:', error.message);
  }
}, 15000);

// Start the server
app.listen(port, () => {
  console.log(`Server running at ${process.env.DB_HOST}:${port}`);
});
