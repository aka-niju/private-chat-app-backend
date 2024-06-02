import mongoose from "mongoose";

const connectToDB = async (dbName) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName });
        console.log("mongodb connected..");
    } catch (error) {
        console.log("Database Connection Error: ", error.message);
    }
}

export default connectToDB;