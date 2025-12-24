import mongoose from "mongoose";
import { SERVER_CONFIG } from "#config.js";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(SERVER_CONFIG?.MONGO_URL);
        // console.log("connection: ", connection);

        console.log("Database connected.");
    } catch (error) {
        console.log("error: ", error);
        console.error("connection error mongodb.");
    }
};

export { connectDB };
