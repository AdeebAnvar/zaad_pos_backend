const jwt = require('jsonwebtoken');
require('dotenv').config();
const { unless } = require('express-unless');

function authJwt() {
    const secret = process.env.SECRET_KEY;

    const middleware = (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized error, no token provided'
            })
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    return res.status(401).json({
                        status: false,
                        error: true,
                        message: 'Token expired. Please login again.'
                    })
                }
                console.log(err);
                return res.status(401).json({
                    message: 'Unauthorized error'
                })
            }
            next()
        })
    }

    middleware.unless = unless

    return middleware
}

const authMiddleware = authJwt()

const isExcludedUrl = (req) => {
    console.log('Incoming request:', req.path, req.method);

    const excludedUrls = [
        '/user/login',
        '/user/add_user',
        '/health',
        '/customer/submitData',

    ]

    const isExcluded = excludedUrls.some((url) => {
        if (url.endsWith('/')) {
            return req.path.startsWith(url);
        } else {
            return req.path == url;
        }
    })

    return isExcluded;
}
module.exports = authMiddleware.unless({ custom: isExcludedUrl });