import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import fs from "fs";

export const getProfile = async(req,res)=>{
    try{

        const user = await userModel.findById(req.user.id)
            .select("-password");

        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }

        res.status(200).json({
            user
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"something went wrong"
        });
    }
}

export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      gender,
      dateOfBirth,
      city,
      state,
    } = req.body;

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullname?.trim()) {
      user.fullname = fullname.trim();
    }

    if (phone?.trim()) {
      const existingPhone = await userModel.findOne({
        phone,
        _id: { $ne: user._id },
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }

      user.phone = phone.trim();
    }

    if (gender) {
      const allowedGenders = ["male", "female", "other"];

      if (!allowedGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender",
        });
      }

      user.gender = gender.toLowerCase();
    }

    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
    }

    if (city?.trim()) {
      user.city = city.trim();
    }

    if (state?.trim()) {
      user.state = state.trim();
    }

    await user.save();

    const updatedUser = await userModel
      .findById(user._id)
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const changePassword = async(req,res)=>{
    try{

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await userModel.findById(
            req.user.id
        );

        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if(!isMatch){
            return res.status(400).json({
                message:"current password is incorrect"
            });
        }

        const hashPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        user.password = hashPassword;

        await user.save();

        res.status(200).json({
            message:"password changed successfully"
        });

    }catch(err){
        console.log(err);

        res.status(500).json({
            message:"something went wrong"
        });
    }
}


