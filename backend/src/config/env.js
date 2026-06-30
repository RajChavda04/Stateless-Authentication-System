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
    ADMIN_CLIENT_URL:process.env.ADMIN_CLIENT_URL,
    USER_CLIENT_URL:process.env.USER_CLIENT_URL
    
}

export default config;