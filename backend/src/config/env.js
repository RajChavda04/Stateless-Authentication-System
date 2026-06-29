import dotenv from "dotenv"

dotenv.config();

    if(!process.env.PORT){
        throw new Error("PORT is not found")
    }
    if(!process.env.MONGODB_URI){
        throw new Error("mongodb is not found")
    }
    if(!process.env.EMAIL_USER){
        throw new Error("email user is not found")
    }
    if(!process.env.EMAIL_PASS){
        throw new Error("email pass is not found")
    }
    if(!process.env.JWT_SECRET){
        throw new Error("jwt is not found")
    }
    if(!process.env.ACCESS_EXPIRES_IN){ 
    throw new Error("access expires in is not found")
    }
    if(!process.env.REFRESH_EXPIRES_IN){
        throw new Error("refresh expires in is not found")
    }
    if(!process.env.GOOGLE_MAPS_API_KEY){
         throw new Error("google maps api key is not found")
    }
    if(!process.env.RAZORPAY_KEY_ID){
        throw new Error("razorpay key id is not found")
    }
    if(!process.env.RAZORPAY_KEY_SECRET){
         throw new Error("razorpay key secret is not found")
    }
    if(!process.env.RAZORPAY_WEBHOOK_SECRET){
        throw new Error("razorpay webhook secret is not found")
    }
    if(!process.env.CLOUDINARY_CLOUD_NAME){
        throw new Error("cloudinary cloud name is not found")
    }   
    if(!process.env.CLOUDINARY_API_KEY){
        throw new Error("cloudinary api key is not found")
    }
    if(!process.env.CLOUDINARY_API_SECRET){
        throw new Error("cloudinary api secret is not found")
    }
    if(!process.env.ADMIN_CLIENT_URL){
        throw new Error("admin client url is not found")
    }
    if(!process.env.USER_CLIENT_URL){
        throw new Error("user client url is not found")
    }
    

const config={

    PORT:process.env.PORT,
    MONGODB_URI:process.env.MONGODB_URI,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    JWT_SECRET:process.env.JWT_SECRET,
    ACCESS_EXPIRES_IN:process.env.ACCESS_EXPIRES_IN,
    REFRESH_EXPIRES_IN:process.env.REFRESH_EXPIRES_IN,
    GOOGLE_MAPS_API_KEY:process.env.GOOGLE_MAPS_API_KEY,
    RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET:process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET:process.env.RAZORPAY_WEBHOOK_SECRET,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    ADMIN_CLIENT_URL:process.env.ADMIN_CLIENT_URL,
    USER_CLIENT_URL:process.env.USER_CLIENT_URL
    
}

export default config;