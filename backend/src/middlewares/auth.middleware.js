// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

import config from "../config/env.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

   
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    if (decoded.type !== "ACCESS") {
   return res.status(401).json({ message: "Invalid token type" });
   }
 
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid tokensss" });
  }
};

export default authMiddleware;