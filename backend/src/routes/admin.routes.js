import express from "express";

import {login,refreshToken,getMe} from "../controllers/auth.controller.js"
import { changePassword } from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";


const router = express.Router();

router.post( "/login", login);

router.put( "/change-password", authMiddleware,roleMiddleware("admin"),changePassword);

// router.get("/profile", authMiddleware, getProfile);

export default router;