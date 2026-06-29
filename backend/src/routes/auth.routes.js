import express from "express"
import {
    register,
    sendOtp,verifyOtp,
    resendOtp,login,
    refreshToken,
    getMe,
    forgotPassword,
    resetPassword,
    logout,
    logoutAnotherDevice,
    getSessions,
    logoutAllDevices,
    changePassword 
} from "../controllers/auth.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const authRouter = express.Router();

authRouter.post("/register",register)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resendotp", resendOtp)
authRouter.post("/login", login)
authRouter.get("/refreshtokengeneration", refreshToken)
authRouter.get("/getme", authMiddleware, getMe)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/sessions", authMiddleware, getSessions);
authRouter.delete("/sessions/:id", authMiddleware, logoutAnotherDevice);
authRouter.post("/logout-all-devices",authMiddleware, logoutAllDevices );
authRouter.put("/change-password",authMiddleware, changePassword );

export default authRouter;