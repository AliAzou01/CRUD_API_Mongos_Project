const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('Request received at is-auth middleware');
    const authHeader = req.get('Authorization');
    console.log('Headers:', req.headers);
    if (!authHeader) {
        console.log('No auth header');
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        console.log('No token');
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'myincreptablesecrettoken');
        console.log('Token verified successfully');
    } catch (err) {
        console.log('Token verification failed', err);
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        console.log('No decoded token');
        req.isAuth = false;
        return next();
    }
    console.log('Decoded token:', decodedToken);
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};
