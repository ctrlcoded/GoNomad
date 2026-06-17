import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

// Middleware — CORS must run first so even error responses carry CORS headers
app.use(cors());
app.use(express.json());

// Health check (no DB needed) — confirms the function itself boots
app.get('/', (req, res) => res.send("Server is running"))

// Ensure the DB is connected before handling API routes.
// Connection is cached, so this is a no-op after the first request.
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        console.log("Database connection failed:", error.message)
        res.status(500).json({ success: false, message: "Database connection failed" })
    }
})

app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Export Express App for Vercel serverless functions
export default app;
