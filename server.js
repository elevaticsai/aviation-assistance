import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        response: 'Please provide a message to continue our conversation.'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured',
        response: 'I apologize, but I am not properly configured at the moment. Please try the special commands like "show images" or "show videos" instead.'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI travel assistant for SkyWings airline. Provide helpful, concise responses about flights, services, and travel information. Keep responses professional and focused on air travel."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response received from AI');
    }

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get response',
      response: 'I apologize, but I am having trouble processing your request. You can try special commands like "show images" or "show videos" instead.'
    });
  }
});