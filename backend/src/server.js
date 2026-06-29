import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import config from "./config/env.js";
import connectDB from "./config/database.js";

import { initializeSocket } from "./sockets/index.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";


import notificationRoutes from "./routes/notification.routes.js";


import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

const server = http.createServer(app);

initializeSocket(server);

connectDB();

app.use(
  cors({
    origin: [
      config.ADMIN_CLIENT_URL,
      config.USER_CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:5174",
  ],
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());


app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.status(200).json({ message: "server running", });
});

// AUTH
app.use( "/api/auth", authRoutes);

app.use( "/api/admin",  adminRoutes);

app.use( "/api/users", userRoutes);


// NOTIFICATION
app.use( "/api/notifications", notificationRoutes);


app.use(errorMiddleware);

server.listen(config.PORT, () => {
  console.log( `Server running on port ${config.PORT}`  );
});