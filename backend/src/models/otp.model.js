// import mongoose from "mongoose"


// const otpSchema = new mongoose.Schema({

//     fullname:{
//         type:String,
//         required: [true, "full name is required"]
//     },
//     email:{
//         type:String,
//         required: [true,"email is required"]
//     },
//     otpHash:{
//         type: String,
//         required : [true, "otp is require"]
//     },
//     expires: {
//         type: Date,
//         required: true
//     },
//     verified:{
//         type: Boolean,
//         default: false,
//     }
// },{
//     timestamps: true,
// })

// const otpModel = mongoose.model("otps", otpSchema);
// export default otpModel



import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
    },

    otpHash: {
      type: String,
      required: [true, "otp is required"],
    },

    expires: {
      type: Date,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const otpModel = mongoose.model("otps", otpSchema);

export default otpModel;