const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Ollama } = require('ollama');
const cors = require('cors'); // Import CORS middleware
const app = express();
app.use(bodyParser.json());
app.use(cors())
const ollama = new Ollama();
let conversationStarted = false;
let chatHistory = [];
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'chat_data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Start endpoint
app.post('/start', (req, res) => {
  if (conversationStarted) {
    return res.status(400).json({ error: 'Conversation already started.' });
  }
  conversationStarted = true;
  chatHistory = [{ role: 'system', content: "You are an AI chatbot. How can I assist you today?" }];
  res.json({ message: 'Conversation started.' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  if (!conversationStarted) {
    return res.status(400).json({ error: 'Start the conversation first by hitting the /start endpoint.' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    chatHistory.push({ role: 'user', content: message });
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: chatHistory,
    });

    const botResponse = response.message.content;
    chatHistory.push({ role: 'assistant', content: botResponse });
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error during chat:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Stop endpoint
app.post('/stop', (req, res) => {
  if (!conversationStarted) {
    return res.status(400).json({ error: 'Conversation is not started yet.' });
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `chat-history-${timestamp}.json`;
    const filePath = path.join(DATA_DIR, fileName);

    fs.writeFileSync(filePath, JSON.stringify(chatHistory, null, 2));
    conversationStarted = false;
    res.json({ message: 'Conversation stopped and saved.', file: fileName });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: 'Failed to save chat history.' });
  }
});

// Get chat file list
app.get('/chat-files', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith('.json'));
    res.json(files);
  } catch (error) {
    console.error('Error reading chat files:', error);
    res.status(500).json({ error: 'Failed to fetch chat files.' });
  }
});

// Get chat data for a specific file
app.get('/chat-files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found.' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
