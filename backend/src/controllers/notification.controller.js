import notificationModel from "../models/notification.model.js";
import NOTIFICATION_TYPE from "../constants/notificationType.js";
import { logger } from "../utils/logger.js";
import { emitNotification } from "../sockets/notification.socket.js";

export const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      recipientType,
      recipientId,
      type,
      redirectUrl,
    } = req.body;

    const notification = await notificationModel.create({
      title,
      message,
      recipientType,
      recipientId,
      type: type || NOTIFICATION_TYPE.SYSTEM,
      redirectUrl,
    });

    try {
      emitNotification(
        recipientType,
        recipientId,
        notification
      );
    } catch (socketErr) {
      logger.warn("socket emit notification failed:", socketErr.message);
    }

    return res.status(201).json({
      message: "notification created successfully",
      notification,
    });
  } catch (err) {
    logger.error("createNotification:", err);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const getHeaderNotifications = async (req, res) => {
    try {
      let query;

      if (
        req.user.role === "admin"
      ) {
        query = {
          recipientType: "admin",
        };
      } else {
        query = {
          recipientType: "user",
          recipientId: req.user.id,
        };
      }

      const [
        notifications,
        unreadCount,
      ] = await Promise.all([
        notificationModel
          .find(query)
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .lean(),

        notificationModel.countDocuments({
          ...query,
          isRead: false,
        }),
      ]);

      return res.status(200).json({
        notifications,
        unreadCount,
      });
    } catch (err) {
      logger.error(
        "getHeaderNotifications:",
        err
      );

      return res.status(500).json({
        message:
          "something went wrong",
      });
    }
  };

export const getNotifications =  async (req, res) => {
    try {
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) ||
        5;

      const skip =
        (page - 1) * limit;

      let query;

      if (
        req.user.role === "admin"
      ) {
        query = {
          recipientType: "admin",
        };
      } else {
        query = {
          recipientType: "user",
          recipientId: req.user.id,
        };
      }

      const [
        notifications,
        total,
      ] = await Promise.all([
        notificationModel
          .find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        notificationModel.countDocuments(
          query
        ),
      ]);

      return res.status(200).json({
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages:
            Math.ceil(
              total / limit
            ),
        },
      });
    } catch (err) {
      logger.error(err);

      return res.status(500).json({
        message:
          "something went wrong",
      });
    }
  };

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationModel.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        message: "notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      message: "notification marked as read",
    });
  } catch (err) {
    logger.error("markAsRead:", err);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndDelete(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        message: "notification not found",
      });
    }

    return res.status(200).json({
      message: "notification deleted successfully",
    });
  } catch (err) {
    logger.error("deleteNotification:", err);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const markAllAsRead = async (
  req,
  res
) => {
  try {
    let query;

    if (req.user.role === "admin") {
      query = {
        recipientType: "admin",
        isRead: false,
      };
    } else {
      query = {
        recipientType: "user",
        recipientId: req.user.id,
        isRead: false,
      };
    }

    await notificationModel.updateMany(
      query,
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      message:
        "all notifications marked as read",
    });
  } catch (err) {
    logger.error(
      "markAllAsRead:",
      err
    );

    return res.status(500).json({
      message:
        "something went wrong",
    });
  }
};