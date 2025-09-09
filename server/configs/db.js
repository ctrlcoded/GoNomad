import mongoose from "mongoose";

const connectDB = async ()=>{
    console.log("Trying connection with MongoDB")
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`).then(()=>{
        console.log("MongoDB connected successfully")
    }).catch((err)=>{
        console.log("Error in connecting to MongoDB", err)
        process.exit(1)
    })
}

export default connectDB;