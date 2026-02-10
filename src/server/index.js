require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, '../client/public')));

// API Routes
app.use('/api/command', require('./routes/command'));
app.use('/api/search', require('./routes/search'));
app.use('/api/email', require('./routes/email'));
app.use('/api/spotify', require('./routes/spotify'));
app.use('/api/scraper', require('./routes/scraper'));
app.use('/api/system', require('./routes/system'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection for real-time communication
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);

      // Handle different message types
      switch (data.type) {
        case 'command':
          // Process command through Gemini AI
          const response = await processCommand(data.command);
          ws.send(JSON.stringify({ type: 'response', data: response }));
          break;
        
        case 'voice':
          // Handle voice input
          const voiceResponse = await processCommand(data.transcript);
          ws.send(JSON.stringify({ type: 'response', data: voiceResponse }));
          break;

        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Send welcome message
  ws.send(JSON.stringify({ 
    type: 'welcome', 
    message: 'Connected to Jarvis AI Assistant' 
  }));
});

// Process command function (placeholder - will be implemented in services)
async function processCommand(command) {
  // This will be implemented with Gemini AI integration
  return {
    command: command,
    response: 'Command received and processing...',
    timestamp: new Date().toISOString()
  };
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🤖 Jarvis AI Assistant running on port ${PORT}`);
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});

module.exports = { app, server, wss };
