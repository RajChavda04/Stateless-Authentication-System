import jwt from "jsonwebtoken"
import config from "../config/env.js"
import sessionModel from "../models/session.model.js"
import bcrypt from "bcryptjs"

export const createSession = async (user, req) => {
  if (!user) throw new Error("User is required");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash: "",
    ip: req.ip || "0.0.0.0",
    userAgent: req.headers["user-agent"] || "unknown",
  });

  const refreshToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
      type: "REFRESH",
      role: user.role
    },
    config.JWT_SECRET,
    { expiresIn: config.REFRESH_EXPIRES_IN }
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  session.refreshTokenHash = refreshTokenHash;
  await session.save();

  return {
    refreshToken,
    session,
  };
};


export const generateAccesstoken =(user,session)=> {
    return jwt.sign(
    { id: user._id, sessionId : session._id, type: "ACCESS" , role: user.role }, 
    config.JWT_SECRET,
    { expiresIn : config.ACCESS_EXPIRES_IN}
  )
  
}



// admin token creation

export const createSessionAdmin = async (user, req) => {
  if (!user) throw new Error("User is required");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash: "",
    ip: req.ip || "0.0.0.0",
    userAgent: req.headers["user-agent"] || "unknown",
  });

  const refreshToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
      type: "REFRESH",
    },
    config.JWT_SECRET,
    { expiresIn: config.REFRESH_EXPIRES_IN }
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  session.refreshTokenHash = refreshTokenHash;
  await session.save();

  return {
    refreshToken,
    session,
  };
};

export const generateAccesstokenAdmin =(user,session)=> {
  return jwt.sign(
  { id: user._id, sessionId : session._id, type: "ACCESS" , role: user.role }, 
  config.JWT_SECRET,
  { expiresIn : config.ACCESS_EXPIRES_IN}
)

}