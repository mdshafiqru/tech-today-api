const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
    const {authorization} = req.headers;

    try {
        
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userId, role} = decoded;
        if(role === 'admin'){
            req.userId = userId;
            next();
        } else {
            next({statusCode : 401, message: "Authentication Failed"});
        }
        
    } catch (error) {

        next({statusCode : 401, message: "Authentication Failed"});
    }
}

module.exports = admin;