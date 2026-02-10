# 🤖 Jarvis AI Assistant

A powerful AI assistant inspired by Jarvis from Iron Man, capable of controlling your Windows PC, searching the web, managing emails, controlling Spotify, and extracting data from custom websites.

## 🌟 Features

### Core Capabilities
- 🔍 **Web Search** - Search anything on the web ("Who is Mohanlal?")
- 📧 **Email Management** - Check and read Gmail emails
- 🎵 **Spotify Control** - Play music, control playback
- 🌐 **Website Feed Extraction** - Extract data from your expense tracker and other websites
- 💬 **Text & Voice Interface** - Interact via text or voice commands
- 🖥️ **Windows System Control** - Open apps, execute commands
- 🌍 **Web-Based** - Access from anywhere via browser

### Technical Features
- Free AI model (Google Gemini)
- No expensive APIs (no ElevenLabs)
- Full system access on Windows
- Public web hosting ready
- Real-time voice recognition
- Custom website scraping

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (Web UI)                 │
│  - Jarvis-style interface                   │
│  - Voice input (Web Speech API)             │
│  - Text chat interface                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│         Backend (Node.js + Express)         │
│  - API Routes                               │
│  - WebSocket for real-time communication    │
│  - Command processor                        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│            AI Engine (Gemini)               │
│  - Natural language understanding           │
│  - Intent classification                    │
│  - Response generation                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          Service Integrations               │
│  - Gmail API                                │
│  - Spotify API                              │
│  - Google Search                            │
│  - Website Scraper (Puppeteer)              │
│  - Windows System Commands                  │
└─────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Windows OS
- Google Cloud account (for Gemini API - free tier)
- Gmail API credentials
- Spotify Developer account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/richu337/jarvis-ai-assistant.git
cd jarvis-ai-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# AI Model
GEMINI_API_KEY=your_gemini_api_key

# Gmail API
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/auth/gmail/callback

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Google Search (optional - can use free alternatives)
GOOGLE_SEARCH_API_KEY=your_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# Server
PORT=3000
NODE_ENV=development

# Custom Website URLs (for feed extraction)
EXPENSE_TRACKER_URL=your_expense_tracker_url
```

4. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Access the UI**
Open your browser and navigate to `http://localhost:3000`

## 📋 API Setup Guide

### 1. Google Gemini API (Free)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` as `GEMINI_API_KEY`

### 2. Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add credentials to `.env`

### 3. Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get Client ID and Secret
4. Add to `.env`

### 4. Google Search (Optional)
- Use free alternatives like SerpAPI or DuckDuckGo
- Or set up Custom Search API (100 queries/day free)

## 💻 Usage Examples

### Text Commands
```
"Search who is Mohanlal"
"Check my emails"
"Play music on Spotify"
"Open Chrome"
"Show my expense tracker balance"
"What's the weather today?"
```

### Voice Commands
Click the microphone icon and speak naturally:
- "Hey Jarvis, search for the latest news"
- "Open Notepad"
- "Play my favorite playlist"

## 🛠️ Project Structure

```
jarvis-ai-assistant/
├── src/
│   ├── server/
│   │   ├── index.js              # Main server file
│   │   ├── routes/               # API routes
│   │   ├── services/             # Service integrations
│   │   │   ├── gemini.js         # Gemini AI service
│   │   │   ├── gmail.js          # Gmail integration
│   │   │   ├── spotify.js        # Spotify integration
│   │   │   ├── search.js         # Web search service
│   │   │   ├── scraper.js        # Website scraper
│   │   │   └── system.js         # Windows system control
│   │   ├── controllers/          # Request handlers
│   │   └── utils/                # Helper functions
│   ├── client/
│   │   ├── public/
│   │   │   ├── index.html        # Main HTML
│   │   │   ├── styles.css        # Jarvis-style CSS
│   │   │   └── app.js            # Frontend JavaScript
│   │   └── assets/               # Images, sounds, etc.
├── config/
│   └── default.js                # Configuration
├── tests/                        # Test files
├── .env.example                  # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🎨 UI Features

- **Jarvis-inspired design** with glowing blue accents
- **Voice visualization** when speaking
- **Command history** panel
- **Real-time status** indicators
- **Dark theme** with futuristic aesthetics
- **Responsive** design for all devices

## 🔒 Security Notes

- Never commit `.env` file
- Use environment variables for all sensitive data
- Implement rate limiting for public deployment
- Consider adding authentication for production use
- Sanitize all user inputs
- Use HTTPS in production

## 🌐 Deployment

### Deploy to Heroku (Free Tier)
```bash
heroku create jarvis-assistant
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

### Deploy to Railway
1. Connect your GitHub repo
2. Add environment variables
3. Deploy automatically

### Deploy to Vercel/Netlify
- Frontend can be deployed separately
- Backend needs a Node.js hosting service

## 🔧 Customization

### Adding New Commands
Edit `src/server/services/gemini.js` to add custom intents and responses.

### Adding New Websites to Scrape
Edit `src/server/services/scraper.js` and add your website URL and selectors.

### Changing Voice Settings
Modify `src/client/public/app.js` to adjust voice recognition settings.

## 📱 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Custom wake word ("Hey Jarvis")
- [ ] Calendar integration
- [ ] Smart home control
- [ ] Task automation
- [ ] Learning from user behavior

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by Jarvis from Iron Man
- Built with Google Gemini AI
- Uses free and open-source technologies

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ by rayhan**
