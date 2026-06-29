import userModel from "../models/user.model.js";
import { generateAccesstoken, createSession, } from "../utils/token.js";
import bcrypt from "bcryptjs";
import otpModel from "../models/otp.model.js";
import sessionModel from "../models/session.model.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOtp } from "../utils/generateOtp.js";
import otpTemplate from "../templates/otp.template.js";
import { logger } from "../utils/logger.js";
import adminModel from "../models/admin.model.js";
import notificationModel from "../models/notification.model.js";
import NOTIFICATION_TYPE from "../constants/notificationType.js";
import { emitNotification } from "../sockets/notification.socket.js";


export const sendOtp = async (req, res) => {
  try {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({ message: "all fields are required" });
    }
     
    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullname.trim())) {
      return res.status(400).json({
        message: "enter valid name",
      });
    }

    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "enter valid email",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await otpModel.deleteMany({ email });
    await otpModel.create({
      fullname,
      email,
      otpHash,
      verified: false,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(
      email,
      "Verify Your Email",
      undefined,
      otpTemplate(otp)
    );

    return res.status(200).json({ message: "otp sent successfully" });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;
    // FIND OTP
    const otpData = await otpModel.findOne({ email });
    if (!otpData) {
      return res.status(400).json({ message: "otp not found" });
    }

    // CHECK EXPIRED
    if (new Date() > otpData.expires) {
      await otpModel.deleteOne({ email });
      return res.status(400).json({ message: "otp expired" });
    }

    // VERIFY OTP
    const isOtpValid = await bcrypt.compare(otp, otpData.otpHash);
    if (!isOtpValid) {
      return res.status(400).json({ message: "invalid otp" });
    }

    // UPDATE VERIFIED STATUS
    otpData.verified = true;
    await otpData.save();
    res.status(200).json({ message: "otp verified successfully" });
  }
  catch (err) {
    logger.error(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otpData = await otpModel.findOne({ email });
    if (!otpData) {
      return res.status(400).json({ message: "otp not found" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    otpData.otpHash = otpHash;
    otpData.verified = false;
    otpData.expires = new Date(Date.now() + 5 * 60 * 1000);
    await otpData.save();

    await sendEmail(
      email,
      "Resend OTP",
      undefined,
      otpTemplate(otp)
    );

    return res.status(200).json({ message: "otp resent successfully" });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const register = async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;

    // Required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "fullname, email and password are required",
      });
    }

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullname.trim())) {
      return res.status(400).json({
        message: "enter valid name",
      });
    }

    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "enter valid email",
      });
    }

    // Phone validation (optional)
    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/;

      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          message: "enter valid phone number",
        });
      }
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    // Check existing email
    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        message: "email already exists",
      });
    }

    // Check existing phone only if phone provided
    if (phone) {
      const existingPhone = await userModel.findOne({ phone });

      if (existingPhone) {
        return res.status(409).json({
          message: "phone number already exists",
        });
      }
    }

    // Check OTP verification
    const otpData = await otpModel.findOne({ email });

    if (!otpData) {
      return res.status(400).json({
        message: "verification not found",
      });
    }

    if (!otpData.verified) {
      return res.status(400).json({
        message: "please verify email first",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      password: hashPassword,
    });

    // Delete OTP after successful registration
    await otpModel.deleteOne({ email });

    // User notification
    try {
      const userNotification =
        await notificationModel.create({
          title: `Welcome ${user.fullname}`,
          message:
            "Your account has been created successfully. Welcome to our travel platform.",
          recipientType: "user",
          recipientId: user._id,
          type: NOTIFICATION_TYPE.SYSTEM,
          redirectUrl: "/profile",
        });

      emitNotification(
        "user",
        user._id,
        userNotification
      );
    } catch (notificationErr) {
      logger.warn(
        "user welcome notification failed:",
        notificationErr.message
      );
    }

    // Admin notification
    try {
      const adminNotification =
        await notificationModel.create({
          title: "New User Registered",
          message: `${user.fullname} (${user.email}) has registered successfully.`,
          recipientType: "admin",
          type: NOTIFICATION_TYPE.SYSTEM,
          redirectUrl: `/admin/users/${user._id}`,
        });

      emitNotification(
        "admin",
        null,
        adminNotification
      );
    } catch (notificationErr) {
      logger.warn(
        "admin notification failed:",
        notificationErr.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    // const { email, password, role } = req.body;
    const { email, password} = req.body;
   
    // if (!email || !password || !role) {
    //   return res.status(400).json({ message: "all fields are required" });
    // }
   
    if (!email || !password ) {
      return res.status(400).json({ message: "all fields are required" });
    }
   
    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "enter valid email",
      });
    }

   // --- for two login page dedicated for admin and users------ 
    // let user,
    // if (role === "admin") {
    //   user = await adminModel.findOne({ email });
    // } else {
    //   user = await userModel.findOne({ email });
    // }

    // ---- for single login page for both admin and users ----
    let user = await adminModel.findOne({ email });

    if (!user) {
      user = await userModel.findOne({ email });
    }
    if (!user) {
       return res.status(401).json({ message: "Invalid email or password" });
     }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { refreshToken, session } = await createSession(user, req);
    const accessToken = generateAccesstoken(user, session);


    const isProd = process.env.NODE_ENV === "production";
    const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: refreshMaxAge,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        role: user.role
      },
      accessToken,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshTokenCookie, config.JWT_SECRET);


    if (decoded.type !== "REFRESH" || !decoded.sessionId) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const session = await sessionModel.findOne({
      _id: decoded.sessionId,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isValidToken = await bcrypt.compare(
      refreshTokenCookie,
      session.refreshTokenHash
    );

    if (!isValidToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    let user;

    if (decoded.role === "admin") {
      user = await adminModel.findById(decoded.id);
    } else {
      user = await userModel.findById(decoded.id);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccesstoken(user, session);

    const newRefreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
        type: "REFRESH",
      },
      config.JWT_SECRET,
      { expiresIn: config.REFRESH_EXPIRES_IN }
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    const isProd = process.env.NODE_ENV === "production";
    const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;


    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: refreshMaxAge,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "access token refreshed successfully",
      accessToken,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getMe = async (req, res) => {
  try {
    let user;

    if (req.user.role === "admin") {
      user = await adminModel.findById(req.user.id);
    } else {
      user = await userModel.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "user fetched successfully",
      user,
    });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userExists = await userModel.exists({ email });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await otpModel.findOneAndDelete({ email });

    await Promise.all([
      otpModel.create({
        email,
        otpHash,
        expires: new Date(Date.now() + 5 * 60 * 1000),
      }),

      sendEmail(
        email,
        "Reset Password OTP",
        undefined,
        otpTemplate(otp)
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    logger.error("Forgot Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "password and confirm password do not match",
      });
    }

    const otpData = await otpModel.findOne({ email });

    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        message: "please verify otp first",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    await otpModel.deleteOne({ email });

    return res.status(200).json({
      message: "password reset successfully",
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (refreshTokenCookie) {
      try {
        const decoded = jwt.verify(refreshTokenCookie, config.JWT_SECRET);

        if (decoded.sessionId) {
          await sessionModel.findByIdAndUpdate(
            decoded.sessionId,
            {
              revoked: true,
            }
          );
        }
      } catch (err) {
        logger.warn("invalid refresh token during logout");
      }
    }

    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "logged out successfully",
    });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await sessionModel
      .find({
        user: req.user.id,
        revoked: false,
      })
      .sort({ createdAt: -1 });

    const currentSessionId = req.user.sessionId;

    const currentSession = sessions.find(
      (session) => session._id.toString() === currentSessionId
    );

    const otherSessions = sessions.filter(
      (session) => session._id.toString() !== currentSessionId
    );

    return res.status(200).json({
      currentSession,
      sessions: otherSessions,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const logoutAnotherDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await sessionModel.findOne({ 
      _id: id, 
      user: req.user.id 
    });

    if (!session) {
      return res.status(404).json({ message: "session not found" });
    }
    await session.deleteOne();
   
    return res.status(200).json({ message: "device logged out successfully" });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user.id;

    await sessionModel.deleteMany({
      user: req.user.id,
      _id: { $ne: req.user.sessionId }, // Keep current session
    });

    return res.status(200).json({
      message: "logged out from all other devices successfully",
    });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Validation
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};