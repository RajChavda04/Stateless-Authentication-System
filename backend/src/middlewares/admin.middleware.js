import jwt from "jsonwebtoken";
import config from "../config/env.js";
import ROLES from "../constants/roles.js";

const adminMiddleware = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      config.JWT_SECRET
    );

    const isAdmin =
      decoded.role === ROLES.ADMIN ||
      decoded.type === "ADMIN";

    if (!isAdmin) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    req.admin = {
      ...decoded,
      id: decoded.id,
      role: ROLES.ADMIN,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default adminMiddleware;