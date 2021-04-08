const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {

//     const token = req.header('auth-token');
//     if (!token) return res.status(401).json({ message: 'Access Denied' });

//     try {

//         const verified = jwt.verify(token, process.env.TOKEN_SECRET);
//         req.user = verified;

//         next();

//     } catch (error) {

//         res.status(400).json({ message: 'Invalid Token' });

//     }

// }

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not Authenticated.");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error("Not Authenticated.");
        error.statusCode = 401;
        throw error;
    }

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
};
