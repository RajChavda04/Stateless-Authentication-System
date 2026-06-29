import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value),
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      },
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    role:{
      type: String,
      enum: ["admin", "user"],
      default: "admin",
  },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

const adminModel = mongoose.model("admins", adminSchema);

export default adminModel;