import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z\s]+$/, "Enter valid name"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/,
        "Enter valid email",
      ],
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter valid number"],
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    //   default: null,
    },

    dateOfBirth: {
      type: Date,
    //   default: null,
    },

    city: {
      type: String,
      trim: true,
    //   default: "",
    },

    state: {
      type: String,
      trim: true,
    //   default: "",
    },

    profileImage: {
      publicId: {
        type: String,
        // default: "",
      },

      originalName: {
        type: String,
        // default: "",
      },

      url: {
        type: String,
        // default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ fullname: 1 });

const userModel = mongoose.model("users", userSchema);

export default userModel;