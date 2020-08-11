const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { registerValidation, loginValidation } = require('../validation.js');


router.post('/register', async (req, res, next) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ message: 'Email Address is already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {

        const createdUser = await user.save();

        if (createdUser) {

            res.json({ user: { id: createdUser._id, name: createdUser.name, email: createdUser.email } });

        }

    } catch (error) {

        res.status(400).json({ message: error });

    }

});


router.post('/login', async (req, res, next) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Email Address is not found' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid Password' });

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({ user: { id: user._id, name: user.name, email: user.email, token: token } });

});


module.exports = router;