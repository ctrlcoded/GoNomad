import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({success: false, message: "Not authorized, no token"})
    }

    // Support an optional "Bearer <token>" scheme
    if(token.startsWith("Bearer ")){
        token = token.slice(7).trim();
    }

    try {
        // verify() checks the signature & expiry — decode() does NOT and is forgeable
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded?.id){
            return res.status(401).json({success: false, message: "Not authorized"})
        }

        const user = await User.findById(decoded.id).select("-password")
        if(!user){
            return res.status(401).json({success: false, message: "Not authorized"})
        }

        req.user = user
        next();
    }
    catch (error) {
        return res.status(401).json({success: false, message: "Not authorized, token failed"})
    }
}