import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

export default router;