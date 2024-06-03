import mongoose from "mongoose";

const connectToDB = async (dbName, e) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName });
        console.log("mongodb connected..");
    } catch (error) {
        console.log("Database connection error: ", error.message);
    }
}

export default connectToDB;