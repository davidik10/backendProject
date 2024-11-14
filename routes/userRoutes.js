const express = require('express');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../utils/authMiddleware');
const User = require('../models/User');


const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const newuser = new User({
            username, email, password
        })
        console.log(newuser)
        await newuser.save();
        const token = jwt.sign({ id: newuser._id }, process.env.SECRET_KEY);
        res.status(201).json({ user: newuser, message: "Created Successfuly", token });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        const isValid = await user.isValidPassword(password)
        if (isValid && user) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            res.json({ user: user, message: "Connected Seccessfuly", token });
        } else {
            res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:userId', authMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByIdAndUpdate(req.params.userId, { email, password })
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ message: "USER NOT FOUND" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:userId', authMiddleware, async (req, res) => {
    try {
        const response = await User.findByIdAndDelete(req.params.userId)
        res.json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;