const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // System prompt for Jarvis personality
    this.systemPrompt = `You are Jarvis, an advanced AI assistant inspired by Tony Stark's AI. 
You are helpful, intelligent, and have a sophisticated yet friendly personality.
You can help with:
- Web searches
- Email management
- Spotify control
- Opening Windows applications
- Extracting data from websites
- General assistance

Respond concisely and professionally. When given a command, identify the intent and provide structured output.`;
  }

  async processCommand(userCommand) {
    try {
      const prompt = `${this.systemPrompt}\n\nUser Command: "${userCommand}"\n\nAnalyze this command and respond with:
1. Intent (search, email, spotify, system, scrape, general)
2. Action to take
3. Parameters needed
4. Response to user

Format as JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response
      return this.parseGeminiResponse(text, userCommand);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to process command with AI');
    }
  }

  parseGeminiResponse(text, originalCommand) {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: simple intent detection
      return this.fallbackIntentDetection(originalCommand);
    } catch (error) {
      return this.fallbackIntentDetection(originalCommand);
    }
  }

  fallbackIntentDetection(command) {
    const lowerCommand = command.toLowerCase();

    // Search intent
    if (lowerCommand.includes('search') || lowerCommand.includes('who is') || 
        lowerCommand.includes('what is') || lowerCommand.includes('find')) {
      return {
        intent: 'search',
        action: 'web_search',
        parameters: { query: command.replace(/search|who is|what is|find/gi, '').trim() },
        response: `Searching for: ${command}`
      };
    }

    // Email intent
    if (lowerCommand.includes('email') || lowerCommand.includes('mail') || 
        lowerCommand.includes('inbox')) {
      return {
        intent: 'email',
        action: 'check_emails',
        parameters: {},
        response: 'Checking your emails...'
      };
    }

    // Spotify intent
    if (lowerCommand.includes('play') || lowerCommand.includes('music') || 
        lowerCommand.includes('spotify')) {
      return {
        intent: 'spotify',
        action: 'play_music',
        parameters: { query: command.replace(/play|music|spotify/gi, '').trim() },
        response: 'Playing music on Spotify...'
      };
    }

    // System intent
    if (lowerCommand.includes('open') || lowerCommand.includes('launch') || 
        lowerCommand.includes('start')) {
      const app = command.replace(/open|launch|start/gi, '').trim();
      return {
        intent: 'system',
        action: 'open_app',
        parameters: { app: app },
        response: `Opening ${app}...`
      };
    }

    // Scrape intent
    if (lowerCommand.includes('expense') || lowerCommand.includes('balance') || 
        lowerCommand.includes('tracker')) {
      return {
        intent: 'scrape',
        action: 'get_expense_data',
        parameters: { url: process.env.EXPENSE_TRACKER_URL },
        response: 'Fetching your expense tracker data...'
      };
    }

    // General conversation
    return {
      intent: 'general',
      action: 'chat',
      parameters: { message: command },
      response: 'I understand. How can I help you with that?'
    };
  }

  async chat(message) {
    try {
      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error('Failed to generate response');
    }
  }
}

module.exports = new GeminiService();
