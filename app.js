require('dotenv').config();
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
        const accessToken = token.split(' ')[1];

        try {
            const decoded = jwt.verify(accessToken, 'your-secret-key');
            console.log("DECODED",decoded)
            req.user = decoded;
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    next();
};


const app = express();

// Middleware
app.use(bodyParser.json());
// Configure CORS
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://task4-front-end-m313-reaju68dx-asherzod1.vercel.app'
    ],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes);

app.use(extractUser);



app.use('', routes)

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
