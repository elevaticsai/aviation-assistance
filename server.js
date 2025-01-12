import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ollama API endpoint
const OLLAMA_API = 'http://localhost:11434/api/generate';

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: `You are an AI travel assistant for SkyWings airline. Provide helpful, concise responses about flights, services, and travel information. User message: ${message}`,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});