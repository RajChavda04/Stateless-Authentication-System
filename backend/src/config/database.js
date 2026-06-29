import mongoose from "mongoose"
import config from "./env.js"


const connectDB= async()=>{

    try{

        await mongoose.connect(config.MONGODB_URI)
        console.log("MongoDB is connected")

    } catch(error){
         
        console.log("MongoDB connection failed ", error.message)
        process.exit(1)
    }

    
}

export default connectDB;