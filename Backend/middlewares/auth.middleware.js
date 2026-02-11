const jwt = require('jsonwebtoken')

function generateToken(payload){
    const secret = ensureSecret();
    const tokenOptions = {
        expiresIn: '2h'
    }
    return jwt.sign( { payload } , secret, tokenOptions)
}

function ensureSecret(){
    if(!process.env.JWT_SECRET){
        const message = 'Missing JWT_SECRET from enviroment'
        console.log(message);
        throw new Error(message)
    }
    return process.env.JWT_SECRET
}

function verifyToken(token){
    const secret = ensureSecret();
    return jwt.verify(token, secret)
}

function authenticate(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token!' });
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        console.log("Missing or invalid token!")
        return res.status(401).json({error: "Missing or invalid token!"})
    }
    try{
        req.user = verifyToken(token)
        next();
    }
    catch(e){
        console.log(e.message)
        return res.status(401).json({error: 'Invalid or expired token!'})
    }
   
}

module.exports = {
    authenticate,
    verifyToken,
    ensureSecret,
    generateToken
}