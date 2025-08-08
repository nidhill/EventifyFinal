import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectTodbs = async() => {
    try {
        await mongoose.connect(process.env.db_host,
            console.log('mongoDB connected✅')
        )
    } catch (error) {
        console.error('Mongoose connection error:❌',error)
    }
} 


export default connectTodbs;