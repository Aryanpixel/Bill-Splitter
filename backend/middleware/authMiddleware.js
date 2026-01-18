import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            // Getting token from header 
            token = token.split(' ')[1];

            // Verifying  token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Adding user id to the request object
            req.user = decoded.id;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "No token, authorization denied" });
    }
};

export default protect;