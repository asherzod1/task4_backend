const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/model');

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req)
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error', message:error });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if(user.status === 'blocked'){
            return res.status(423).json({error: 'User blocked'})
        }

        user.last_login_time = new Date();
        await user.save();

        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
