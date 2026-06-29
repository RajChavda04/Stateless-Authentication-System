import mongoose from "mongoose";
import NOTIFICATION_TYPE from "../constants/notificationType.js";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    recipientType: {
      type: String,
      enum: ["admin", "user"],
      required: true
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId
    },

    isRead: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      default: NOTIFICATION_TYPE.SYSTEM,
    },

    redirectUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const notificationModel = mongoose.model(
  "notifications",
  notificationSchema
);

export default notificationModel;