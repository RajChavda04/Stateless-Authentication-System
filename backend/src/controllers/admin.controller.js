import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import adminModel from "../models/admin.model.js";
import config from "../config/env.js";
import ROLES from "../constants/roles.js";

export const login = async(req,res)=>{
    try{

        const {
            email,
            password
        } = req.body;

        const admin =
            await adminModel.findOne({
                email
            });

        if(!admin){
            return res.status(401).json({
                message:"invalid credentials"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                admin.password
            );

        if(!isMatch){
            return res.status(401).json({
                message:"invalid credentials"
            });
        }

        const accessToken =
            jwt.sign(
                {
                    id: admin._id,
                    role: ROLES.ADMIN,
                    type: "ACCESS",
                },
                config.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

        res.status(200).json({
            message:"login successful",
            accessToken
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"something went wrong"
        });

    }
}

export const getProfile = async(req,res)=>{
    try{

        const admin =
            await adminModel.findById(
                req.admin.id
            ).select("-password");

        if(!admin){
            return res.status(404).json({
                message:"admin not found"
            });
        }

        res.status(200).json({
            admin
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"something went wrong"
        });

    }
}

export const changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};