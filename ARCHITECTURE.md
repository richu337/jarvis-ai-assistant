# 🏗️ JARVIS AI Assistant - Architecture Documentation

## System Overview

JARVIS is a full-stack AI assistant application that combines natural language processing, web services integration, and system control capabilities.

## Technology Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **AI Model:** Google Gemini Pro
- **Real-time Communication:** WebSocket (ws library)
- **Web Scraping:** Puppeteer + Cheerio
- **APIs:** Google APIs (Gmail), Spotify Web API

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with animations
- **Vanilla JavaScript** - No frameworks for simplicity
- **Web Speech API** - Voice recognition
- **WebSocket Client** - Real-time communication

### Security
- **Helmet.js** - HTTP headers security
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **Environment Variables** - Sensitive data protection

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML/CSS   │  │  JavaScript  │  │ Web Speech   │      │
│  │   Interface  │  │   WebSocket  │  │     API      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Communication Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              WebSocket Server (ws)                   │   │
│  │         Real-time bidirectional messaging            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │    Routes    │  │ Controllers  │      │
│  │    Server    │  │   Handlers   │  │    Logic     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Business Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Gemini AI Service                       │   │
│  │        Natural Language Understanding                │   │
│  │         Intent Classification                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Integration Layer                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Gmail   │ │ Spotify  │ │  Search  │ │  System  │       │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐                                                │
│  │ Scraper  │                                                │
│  │ Service  │                                                │
│  └──────────┘                                                │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Google  │ │ Spotify  │ │DuckDuckGo│ │ Windows  │       │
│  │   APIs   │ │   API    │ │   API    │ │   OS     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input Flow

```
User Input (Text/Voice)
    ↓
Frontend Validation
    ↓
WebSocket Message
    ↓
Backend Receives Command
    ↓
Gemini AI Processing
    ↓
Intent Classification
    ↓
Service Router
    ↓
Appropriate Service Execution
    ↓
Response Generation
    ↓
WebSocket Response
    ↓
Frontend Display
```

### 2. Voice Command Flow

```
User Speaks
    ↓
Web Speech API Captures Audio
    ↓
Browser Converts to Text
    ↓
Text Sent to Backend
    ↓
[Same as Text Flow]
```

### 3. Service Integration Flow

```
Command Received
    ↓
Gemini Identifies Intent
    ↓
┌─────────────────────────────────────┐
│  Intent Router                      │
├─────────────────────────────────────┤
│  • search → Search Service          │
│  • email → Gmail Service            │
│  • spotify → Spotify Service        │
│  • system → System Service          │
│  • scrape → Scraper Service         │
│  • general → Gemini Chat            │
└─────────────────────────────────────┘
    ↓
Service Executes Action
    ↓
Result Returned
    ↓
Response Formatted
    ↓
Sent to Frontend
```

## Component Details

### 1. Gemini AI Service (`services/gemini.js`)

**Purpose:** Natural language understanding and intent classification

**Key Functions:**
- `processCommand(command)` - Analyzes user command
- `parseGeminiResponse(text)` - Extracts structured data
- `fallbackIntentDetection(command)` - Rule-based fallback
- `chat(message)` - General conversation

**Intent Types:**
- `search` - Web search queries
- `email` - Email operations
- `spotify` - Music control
- `system` - OS commands
- `scrape` - Website data extraction
- `general` - Conversational responses

### 2. Search Service (`services/search.js`)

**Purpose:** Web search functionality

**Features:**
- Google Custom Search API (optional)
- DuckDuckGo API (free fallback)
- Quick answer extraction
- Multiple result sources

**Methods:**
- `search(query)` - Perform search
- `quickAnswer(query)` - Get instant answer

### 3. Gmail Service (`services/gmail.js`)

**Purpose:** Email management

**Features:**
- OAuth 2.0 authentication
- List recent emails
- Search emails
- Get unread count
- Send emails

**Methods:**
- `listEmails(maxResults)` - Get inbox
- `searchEmails(query)` - Search
- `getUnreadCount()` - Unread count
- `sendEmail(to, subject, body)` - Send

### 4. Spotify Service (`services/spotify.js`)

**Purpose:** Music control

**Features:**
- OAuth 2.0 authentication
- Search tracks
- Play/pause control
- Track navigation
- Currently playing info

**Methods:**
- `search(query)` - Find tracks
- `play(uri)` - Play track
- `pause()` - Pause playback
- `getCurrentlyPlaying()` - Get current track

### 5. System Service (`services/system.js`)

**Purpose:** Windows system control

**Features:**
- Open applications
- Execute whitelisted commands
- Get system information
- List running processes

**Security:**
- Command whitelist
- No dangerous operations
- Sanitized inputs

**Methods:**
- `openApp(appName)` - Launch app
- `executeCommand(command)` - Run command
- `getSystemInfo()` - System details

### 6. Scraper Service (`services/scraper.js`)

**Purpose:** Website data extraction

**Features:**
- Puppeteer for dynamic sites
- Cheerio for static sites
- Screenshot capability
- Custom selectors

**Methods:**
- `scrapeExpenseTracker(url)` - Expense data
- `scrapeWebsite(url, selectors)` - Generic scraping
- `fetchAndParse(url, selectors)` - Fast scraping
- `getScreenshot(url)` - Page screenshot

## Security Architecture

### 1. Input Validation
- All user inputs sanitized
- Command whitelist for system operations
- SQL injection prevention (no database yet)

### 2. Authentication
- OAuth 2.0 for Gmail and Spotify
- Token-based authentication
- Refresh token handling

### 3. Rate Limiting
- API endpoint protection
- Configurable limits
- Per-IP tracking

### 4. Environment Security
- Sensitive data in `.env`
- `.gitignore` protection
- No hardcoded credentials

### 5. HTTP Security
- Helmet.js headers
- CORS configuration
- HTTPS in production

## Scalability Considerations

### Current Limitations
- Single server instance
- In-memory state
- No database
- No session management

### Future Improvements
- Redis for session storage
- Database for command history
- Load balancing
- Microservices architecture
- Message queue for async tasks

## Performance Optimization

### Frontend
- Minimal dependencies
- Lazy loading
- WebSocket for real-time
- Efficient DOM updates

### Backend
- Async/await patterns
- Connection pooling
- Caching strategies
- Puppeteer browser reuse

## Error Handling

### Strategy
1. Try-catch blocks in all async functions
2. Graceful degradation
3. User-friendly error messages
4. Detailed logging for debugging

### Error Types
- Network errors
- API errors
- Authentication errors
- System errors
- Validation errors

## Monitoring & Logging

### Current Implementation
- Console logging
- Winston logger (configured)
- Error tracking
- Command history

### Production Recommendations
- Structured logging
- Log aggregation (ELK stack)
- Error monitoring (Sentry)
- Performance monitoring (New Relic)

## Deployment Architecture

### Development
```
Local Machine
    ↓
Node.js Server (localhost:3000)
    ↓
WebSocket + HTTP
    ↓
Browser Client
```

### Production
```
Domain (jarvis.yourdomain.com)
    ↓
Nginx Reverse Proxy (SSL)
    ↓
Node.js Server (PM2)
    ↓
WebSocket + HTTPS
    ↓
Browser Clients
```

## API Endpoints

### REST Endpoints
- `GET /api/health` - Health check
- `POST /api/command` - Process command
- `GET /api/search` - Web search
- `GET /api/email` - Email operations
- `GET /api/spotify` - Spotify operations
- `POST /api/system` - System commands
- `POST /api/scraper` - Website scraping

### WebSocket Events
- `connection` - Client connects
- `message` - Command received
- `response` - Result sent
- `error` - Error occurred
- `close` - Client disconnects

## Configuration Management

### Environment Variables
- API keys and secrets
- Service URLs
- Feature flags
- Performance tuning

### Config Files
- `package.json` - Dependencies
- `.env` - Environment variables
- `.gitignore` - Excluded files

## Testing Strategy

### Unit Tests
- Service functions
- Utility functions
- Intent classification

### Integration Tests
- API endpoints
- Service integrations
- WebSocket communication

### E2E Tests
- User workflows
- Voice commands
- System operations

## Future Architecture Enhancements

1. **Database Layer**
   - User profiles
   - Command history
   - Preferences storage

2. **Authentication Layer**
   - User accounts
   - JWT tokens
   - Role-based access

3. **Caching Layer**
   - Redis for sessions
   - API response caching
   - Search result caching

4. **Queue System**
   - Background jobs
   - Scheduled tasks
   - Email sending

5. **Microservices**
   - Separate AI service
   - Dedicated scraper service
   - Independent integrations

---

**Last Updated:** 2024
**Version:** 1.0.0
