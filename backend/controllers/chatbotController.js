const Groq = require('groq-sdk');
const TravelService = require('../models/TravelService');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// System prompt for the AI Travel Assistant
const SYSTEM_PROMPT = `You are a friendly and knowledgeable AI Travel Assistant for a travel booking platform called "Tours and Travel". 
Your role is to help users find the best travel options, recommend destinations, and guide them through the booking process.

Guidelines:
1. Be helpful, friendly, and conversational
2. When users ask about travel options, use the provided database data to give accurate recommendations
3. Always mention prices in Indian Rupees (₹)
4. Suggest options based on user preferences like budget, destination, and travel dates
5. If asked about booking, guide them to use the booking feature on the website
6. Keep responses concise but informative (max 3-4 sentences unless detailed info is requested)
7. If you don't have specific data, provide general travel advice
8. IMPORTANT: Format prices with commas (e.g., ₹24,999 not ₹24999)

Available service types: bus, hotel, trip`;

// @desc    Chat with AI Travel Assistant
// @route   POST /api/chatbot/message
// @access  Public
const chatWithAssistant = asyncHandler(async (req, res) => {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
        res.status(400);
        throw new Error('Please provide a message');
    }

    try {
        // Fetch relevant travel data from database
        const travelData = await TravelService.find({ isActive: true })
            .select('name type source destination price duration rating availableSeats departureDate amenities')
            .limit(30)
            .lean();

        // Format travel data for the AI
        const formattedData = travelData.map(service => ({
            name: service.name,
            type: service.type,
            route: `${service.source} to ${service.destination}`,
            price: `₹${service.price.toLocaleString('en-IN')}`,
            duration: service.duration,
            rating: service.rating,
            availableSeats: service.availableSeats,
            date: service.departureDate ? new Date(service.departureDate).toLocaleDateString() : 'Flexible'
        }));

        // Build the context with travel data
        const dataContext = formattedData.length > 0
            ? `\n\nAvailable Travel Options in Database:\n${JSON.stringify(formattedData, null, 2)}`
            : '\n\nNote: No travel services currently available in the database.';

        // Build messages for Groq API
        const messages = [
            {
                role: 'system',
                content: `${SYSTEM_PROMPT}${dataContext}`
            },
            ...conversationHistory.slice(-6), // Include last 6 messages for context
            {
                role: 'user',
                content: message
            }
        ];

        // Call Groq API with Llama 3 model
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b-versatile', // Fast and capable model
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiMessage = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        res.json({
            success: true,
            data: {
                message: aiMessage,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Groq AI Error:', error.message);

        // Fallback response if AI fails
        res.json({
            success: true,
            data: {
                message: "I'm having trouble connecting right now. Meanwhile, you can browse our travel services using the search feature, or try asking me again in a moment!",
                timestamp: new Date().toISOString(),
                fallback: true
            }
        });
    }
});

// @desc    Get chat suggestions
// @route   GET /api/chatbot/suggestions
// @access  Public
const getChatSuggestions = asyncHandler(async (req, res) => {
    const suggestions = [
        "What are the best trips under ₹10,000?",
        "Show me hotels in Goa",
        "Suggest a weekend getaway",
        "What buses are available from Hyderabad to Bangalore?",
        "Help me plan a trip to Kerala",
        "Show highly rated travel packages"
    ];

    res.json({
        success: true,
        data: suggestions
    });
});

module.exports = {
    chatWithAssistant,
    getChatSuggestions
};
