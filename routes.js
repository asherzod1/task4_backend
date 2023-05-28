const express = require("express");
const sequelize = require('./sequelize');
const User = require('./models/model');

router = express.Router();

router.get("/userme", async (req, res) => {
    try {
        // console.log(req)

        console.log(req.user.userId)
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] },
        });

        // const user = await User.findByPk(userId, {
        //     attributes: { exclude: ['password'] },
        // });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/users', async (req, res) => {
    try {
        // Example query using Sequelize
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Exclude the "password" attribute
        });
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/users/:id', async (req, res) =>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const user = await User.findByPk(id)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        user.status = status
        await user.save()

        res.json({message: "User status updated"})
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/users/:id', async (req, res) =>{
    try {
        const {id} = req.params;

        const user = await User.findByPk(id)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        await user.destroy()

        res.json({message: "User deleted"})
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
