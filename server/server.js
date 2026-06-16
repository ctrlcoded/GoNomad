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

// TEMP diagnostic — reports env-var presence and the real DB error
// (credentials redacted). Remove after debugging.
app.get('/api/debug', async (req, res) => {
    const uri = process.env.MONGODB_URI || ""
    // Redact username:password from the URI before reporting its shape
    const redactedUri = uri.replace(/\/\/([^@]*)@/, "//<redacted>@")
    const report = {
        env: {
            MONGODB_URI: !!process.env.MONGODB_URI,
            JWT_SECRET: !!process.env.JWT_SECRET,
            IMAGEKIT_PUBLIC_KEY: !!process.env.IMAGEKIT_PUBLIC_KEY,
            IMAGEKIT_PRIVATE_KEY: !!process.env.IMAGEKIT_PRIVATE_KEY,
            IMAGEKIT_URL_ENDPOINT: !!process.env.IMAGEKIT_URL_ENDPOINT,
            GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        },
        uriScheme: uri.split("://")[0] || null,
        uriRedacted: redactedUri || null,
        hasLeadingOrTrailingSpace: uri !== uri.trim(),
    }
    try {
        await connectDB()
        report.dbConnect = "OK"
        res.json({ success: true, report })
    } catch (error) {
        report.dbConnect = "FAILED"
        report.dbErrorName = error.name
        report.dbError = error.message
        res.status(200).json({ success: false, report })
    }
})

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
