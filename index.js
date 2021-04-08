const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth.js');
const postsRoute = require('./routes/posts.js');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB CONNECTED!');
});

// Middleware
app.use(express.json()); // works like body-parser

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

app.get('/', (req, res) => {
    res.send('Node Authentication API by Najathi');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server Up and running'));