const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { protect } = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ai/travel
router.post('/travel', protect, async (req, res) => {
  try {
    const { budget, location, days, interests, prompt } = req.body;

    let userPrompt = prompt;
    if (!prompt && location) {
      userPrompt = `Plan a ${days || 5}-day trip to ${location} with a budget of ₹${budget || 15000}. 
      ${interests ? `I'm interested in: ${interests}.` : ''}
      Please provide:
      1. A day-by-day itinerary
      2. Accommodation suggestions
      3. Must-visit places
      4. Local food to try
      5. Travel tips
      6. Approximate cost breakdown
      Format the response in a clear, structured way with emojis for better readability.`;
    }

    if (!userPrompt) {
      return res.status(400).json({ success: false, message: 'Prompt or location required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are TravelNest AI, an expert travel planner with deep knowledge of destinations worldwide. 
          You provide detailed, personalized travel itineraries with practical advice. 
          Always be enthusiastic, helpful, and provide specific actionable suggestions.
          Use emojis to make responses visually appealing and easy to read.`
        },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Unable to generate response';
    res.json({ success: true, response: aiResponse });

  } catch (err) {
    console.error('Groq AI Error:', err);
    res.status(500).json({ success: false, message: 'AI service temporarily unavailable. Please try again.' });
  }
});

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are TravelNest AI, a friendly and knowledgeable travel assistant. 
          Help users plan trips, discover destinations, get travel tips, understand local cultures, 
          find best times to visit, budget planning, and more. Be concise but helpful. Use emojis.`
        },
        ...messages
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 1024,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Unable to generate response';
    res.json({ success: true, response: aiResponse });

  } catch (err) {
    console.error('Groq Chat Error:', err);
    res.status(500).json({ success: false, message: 'AI chat temporarily unavailable.' });
  }
});

module.exports = router;
