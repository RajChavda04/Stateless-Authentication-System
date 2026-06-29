import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
  createNotification,
  getNotifications,
  getHeaderNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,

} from "../controllers/notification.controller.js";

const router = express.Router();

router.post( "/", authMiddleware,roleMiddleware("admin"),createNotification);

router.get( "/",authMiddleware, getNotifications);

router.get("/header", authMiddleware, getHeaderNotifications);

router.patch( "/read-all", authMiddleware, markAllAsRead);

router.patch( "/:id/read", authMiddleware, markAsRead);

router.delete("/:id",authMiddleware,deleteNotification);

export default router;
