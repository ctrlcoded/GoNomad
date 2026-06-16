import mongoose from "mongoose";

// Cache the connection across serverless invocations so we don't reconnect
// on every request (and so a cold start reuses an existing connection).
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set in environment variables");
    }

    if (!cached.promise) {
        console.log("Trying connection with MongoDB");
        mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
        mongoose.connection.on("error", (err) => console.log("MongoDB connection error", err.message));
        cached.promise = mongoose
            .connect(`${process.env.MONGODB_URI}/car-rental`, {
                // Fail fast within Vercel's function time limit instead of
                // hanging on the 30s default if the host is unreachable.
                serverSelectionTimeoutMS: 8000,
            })
            .catch((err) => {
                // Clear the cached promise so the next request can retry,
                // rather than permanently re-awaiting a rejected promise.
                cached.promise = null;
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;