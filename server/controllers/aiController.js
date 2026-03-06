import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCarDescription = async (req, res) => {
    try {
        const { brand, model, year, category, transmission = "", fuel_type = "", seating_capacity = "" } = req.body;

        if (!brand || !model || !year || !category) {
            return res.json({ success: false, message: "Brand, model, year, and category are required to generate description." });
        }

        const modelConfig = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Write a professional, catchy description for a car rental listing. 
CRITICAL RULES:
1. MAX 50 words.
2. MAX 400 characters total.

Details:
- Brand: ${brand}
- Model: ${model}
- Year: ${year}
- Category: ${category}
- Transmission: ${transmission}
- Fuel Type: ${fuel_type}
- Seats: ${seating_capacity}

Focus on comfort, performance, and suitability for trips. Keep it engaging but EXTREMELY concise.`;

        const result = await modelConfig.generateContent(prompt);
        let description = result.response.text().trim();

        // Failsafe slicing to ensure it never exceeds 500 chars 
        // (the form allows me max 500, but slicing neatly at a word is better, so slice up to 490)
        if (description.length > 490) {
            description = description.substring(0, 490) + "...";
        }

        res.json({ success: true, description });
    } catch (error) {
        console.error("Gemini AI Error:", error);
        res.json({ success: false, message: "Failed to generate description. Check your API key or try again later." });
    }
};
