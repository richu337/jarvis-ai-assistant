# 🚀 JARVIS AI Assistant - Complete Setup Guide

This guide will walk you through setting up your JARVIS AI Assistant from scratch.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Windows OS** (for system control features)
- **Google Account** (for Gmail and Gemini API)
- **Spotify Account** (optional, for music control)

## 🔧 Step 1: Clone the Repository

```bash
git clone https://github.com/richu337/jarvis-ai-assistant.git
cd jarvis-ai-assistant
```

## 📦 Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express (web server)
- Google Generative AI (Gemini)
- Puppeteer (web scraping)
- WebSocket (real-time communication)
- And more...

## 🔑 Step 3: Get API Keys

### 3.1 Google Gemini API (Required)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key
4. Save it for the `.env` file

**Cost:** FREE (with generous limits)

### 3.2 Gmail API (Required for Email Features)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/auth/gmail/callback`
   - Copy Client ID and Client Secret

**Cost:** FREE

### 3.3 Spotify API (Optional)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in app name and description
5. Add redirect URI: `http://localhost:3000/auth/spotify/callback`
6. Copy Client ID and Client Secret

**Cost:** FREE

### 3.4 Google Search API (Optional)

You can use the free DuckDuckGo search (no API key needed) or set up Google Custom Search:

1. Go to [Google Custom Search](https://programmablesearchengine.google.com/)
2. Create a new search engine
3. Get your Search Engine ID
4. Go to [Google Cloud Console](https://console.cloud.google.com/)
5. Enable "Custom Search API"
6. Create API key

**Cost:** FREE (100 queries/day)

## ⚙️ Step 4: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` in a text editor and fill in your API keys:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail (Required for email features)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/auth/gmail/callback

# Spotify (Optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback

# Google Search (Optional - uses DuckDuckGo if not provided)
GOOGLE_SEARCH_API_KEY=your_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# Server Configuration
PORT=3000
NODE_ENV=development

# Your Expense Tracker URL
EXPENSE_TRACKER_URL=https://your-expense-tracker.com
```

## 🎯 Step 5: Customize Website Scraper

If you want JARVIS to scrape your expense tracker or other websites:

1. Open `src/server/services/scraper.js`
2. Find the `scrapeExpenseTracker` function
3. Update the CSS selectors to match your website:

```javascript
const balance = document.querySelector('.your-balance-class')?.textContent;
const income = document.querySelector('.your-income-class')?.textContent;
// etc.
```

**How to find selectors:**
1. Open your website in Chrome
2. Right-click on the element you want to scrape
3. Click "Inspect"
4. Look at the class names or IDs
5. Use those in the querySelector

## 🚀 Step 6: Run the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 🌐 Step 7: Access the UI

1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the JARVIS interface!

## 🔐 Step 8: Authenticate Services

### Gmail Authentication:
1. In your browser, go to: `http://localhost:3000/api/email/auth`
2. Follow the Google OAuth flow
3. Grant permissions
4. You'll be redirected back with a success message

### Spotify Authentication:
1. In your browser, go to: `http://localhost:3000/api/spotify/auth`
2. Follow the Spotify OAuth flow
3. Grant permissions
4. You'll be redirected back with a success message

## 🧪 Step 9: Test Commands

Try these commands in the JARVIS interface:

### Search:
- "Search who is Mohanlal"
- "What is artificial intelligence?"
- "Find information about Node.js"

### Email:
- "Check my emails"
- "Show my inbox"

### Spotify:
- "Play music"
- "Play Bohemian Rhapsody"
- "What's playing?"

### System Control:
- "Open Chrome"
- "Open Notepad"
- "Launch Calculator"

### Website Scraping:
- "Show my expense tracker"
- "What's my balance?"

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Make sure the server is running (`npm run dev`)

### Issue: "Gemini API error"
**Solution:** Check that your GEMINI_API_KEY is correct in `.env`

### Issue: "Gmail authentication failed"
**Solution:** 
- Make sure Gmail API is enabled in Google Cloud Console
- Check that redirect URI matches exactly
- Try clearing browser cookies

### Issue: "Spotify not playing"
**Solution:**
- Make sure Spotify app is open on your computer
- Check that a device is active in Spotify
- Try playing something manually first

### Issue: "Voice recognition not working"
**Solution:**
- Use Chrome or Edge browser (best support)
- Allow microphone permissions
- Check browser console for errors

### Issue: "Website scraping returns N/A"
**Solution:**
- Update CSS selectors in `scraper.js` to match your website
- Check if website requires authentication
- Try the `fetchAndParse` method for simpler websites

## 🌍 Step 10: Deploy to Production

### Option 1: Heroku (Free Tier)

```bash
# Install Heroku CLI
# Then:
heroku login
heroku create jarvis-assistant
heroku config:set GEMINI_API_KEY=your_key
heroku config:set GMAIL_CLIENT_ID=your_id
# ... set all other env vars
git push heroku main
```

### Option 2: Railway

1. Go to [Railway.app](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# On your server:
git clone https://github.com/richu337/jarvis-ai-assistant.git
cd jarvis-ai-assistant
npm install
# Create .env file with your keys
npm start
```

Use PM2 to keep it running:
```bash
npm install -g pm2
pm2 start src/server/index.js --name jarvis
pm2 save
pm2 startup
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use HTTPS in production** - Get free SSL with Let's Encrypt
3. **Add authentication** - Implement user login for public deployment
4. **Rate limiting** - Already included, but adjust limits for your needs
5. **Whitelist commands** - System commands are already whitelisted for security

## 📱 Next Steps

- [ ] Customize the UI colors and styling
- [ ] Add more voice commands
- [ ] Integrate additional services (Calendar, Tasks, etc.)
- [ ] Build mobile app (React Native)
- [ ] Add custom wake word
- [ ] Implement learning from user behavior

## 💡 Tips

- **Voice works best in Chrome** - Best speech recognition support
- **Keep Spotify open** - Required for music control
- **Test locally first** - Before deploying to production
- **Check logs** - Use `console.log` to debug issues
- **Start simple** - Get basic features working before adding complexity

## 📚 Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Puppeteer Docs](https://pptr.dev/)
- [Express.js Docs](https://expressjs.com/)

## 🆘 Need Help?

- Check the [Issues](https://github.com/richu337/jarvis-ai-assistant/issues) page
- Create a new issue with:
  - What you're trying to do
  - What error you're getting
  - Your environment (OS, Node version, etc.)

## 🎉 You're All Set!

Your JARVIS AI Assistant is now ready to use. Enjoy your personal AI assistant!

---

**Made with ❤️ by rayhan**
