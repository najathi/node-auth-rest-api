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
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    try {

        const createdUser = await user.save();

        // create and assign a token
        const token = jwt.sign({ _id: createdUser._id }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

        if (createdUser) {

            // res.header('auth-token', token).json({ id: createdUser._id, name: createdUser.name, email: createdUser.email, token: token, token_type: "Bearer", expires_in: 60 * 60 });
            res.json({ id: createdUser._id, username: createdUser.username, email: createdUser.email, token: token, token_type: "Bearer", expires_in: 60 * 60 });

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
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
    // res.header('auth-token', token).json({ id: user._id, name: user.name, email: user.email, token: token, token_type: "Bearer", expires_in: 60 * 60 });
    res.json({ id: user._id, username: user.username, email: user.email, token: token, token_type: "Bearer", expires_in: 60 * 60 });

});


module.exports = router;