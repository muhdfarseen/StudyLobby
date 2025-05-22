const { userModel } = require('../model/allModels');
const jwt = require('jsonwebtoken');
require('dotenv').config()


function authorizeRequest(req, res, next) {
    const header = req.headers['authorization'];
    // console.log(req.headers)
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized1 request: No token provided" });
    }
    const token = header.split(" ")[1];
    // console.log("token",token)
    if (!token) {
        return res.status(401).json({ message: "Unauthorized2 request: Token missing" });
    }
    // console.log('asdfg',jwt.verify(token,process.env.JWT_pass))
    jwt.verify(token, process.env.JWT_pass, async (err, decoded) => {
        
        if (err) {
            console.log('err1')
            return res.status(401).json({ message: "Unauthorized3 request: Invalid token" });
            
        }

        try {
            const user = await userModel.findOne({ _id: decoded.data._id })
            if (!user) {
                console.log('err2')
                return res.status(401).json({ message: "Unauthorized4 request: User not found" });
            }

            req.user = user;
            next();
        } catch (dbErr) {
            console.error("DB error:", dbErr);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports = authorizeRequest;
