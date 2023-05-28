
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./sequelize');
const authRoutes = require('./auth');
const routes = require('./routes');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const extractUser = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({ error: 'Unauthorized' });
    }
    if (token) {
        // Remove the "Bearer " prefix from the token
        const accessToken = token.split(' ')[1];

        try {
            // Verify and decode the token
            const decoded = jwt.verify(accessToken, 'your-secret-key');
            console.log("DECODED",decoded)
            req.user = decoded;
        } catch (err) {
            // Handle token verification errors
            return res.status(401).json({ error: 'Unauthorized' });
            // console.error('Token verification failed:', err);
        }
    }
    next();
};


// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json());
// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Enable CORS for localhost:3000

app.use('/auth', authRoutes);

app.use(extractUser);

// Define a route

app.use('', routes)
// Authentication routes

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
