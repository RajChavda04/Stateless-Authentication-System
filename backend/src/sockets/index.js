import { Server } from "socket.io";

let io;

export const initializeSocket = (
  server
) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "socket connected:",
      socket.id
    );

    socket.on(
      "join-user",
      (userId) => {
        socket.join(
          `user-${userId}`
        );
      }
    );

    socket.on(
      "join-admin",
      () => {
        socket.join("admins");
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "socket disconnected"
        );
      }
    );
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};

