const express = require('express');
const axios = require('axios'); // Ensure axios is installed: npm install axios

const app = express();
const userRoutes = require('./routes/user_routes');
const itemRoutes = require('./routes/item_routes');
const authJwt = require('./config/jwt');

const port = 3000;

// Middleware
app.use(express.json());
app.use(authJwt);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Call the health check endpoint every 10 seconds to keep the server alive
setInterval(async () => {
  try {
    const response = await axios.get('http://localhost:3000/health'); // Use full URL
    console.log('API called successfully:', response.data);
  } catch (error) {
    console.error('Error calling API:', error.message);
  }
}, 10000);

// Routes
app.use('/user', userRoutes);
app.use('/item', itemRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
