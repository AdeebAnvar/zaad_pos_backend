const express = require('express');

const app = express();
const userRoutes = require('./routes/user_routes');
const itemRoutes = require('./routes/item_routes');

const port = 3000;
const authJwt = require('./config/jwt')

// Middleware

app.use(express.json());
app.use(authJwt)

// Routes
app.use('/user', userRoutes);
app.use('/item', itemRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
