const router = require('express').Router();

const verifyToken = require('./verifyToken');

router.get('/', verifyToken, (req, res, next) => {

    // token store 'req.user', in this project that should has _id, expires date

    res.json({
        posts: [
            { title: 'Sample Title 1', description: 'Sample Description 1' },
            { title: 'Sample Title 2', description: 'Sample Description 2' },
            { title: 'Sample Title 3', description: 'Sample Description 3' }
        ]
    });
});

module.exports = router;