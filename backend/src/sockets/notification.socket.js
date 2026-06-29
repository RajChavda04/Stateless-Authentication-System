import { getIO } from "./index.js";

export const emitNotification = (
  recipientType,
  recipientId,
  notification
) => {
  const io = getIO();

  if (recipientType === "admin") {
    io.to("admins").emit(
      "new-notification",
      notification
    );
  }

  if (recipientType === "user") {
    io.to(`user-${recipientId}`).emit(
      "new-notification",
      notification
    );
  }
};