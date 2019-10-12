const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, req.app.get('apiSecretKey'), (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: 'Failed to authenticate token'
                });
            } else {
                req.payload = decoded;
                next();
            }
        });
        
    } catch(error) {
        return res.status(401).json({
            status: false,
            message: 'No token provided'
        });
    }
    
};