const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini');
const searchService = require('../services/search');
const gmailService = require('../services/gmail');
const spotifyService = require('../services/spotify');
const scraperService = require('../services/scraper');
const systemService = require('../services/system');

// Process command
router.post('/', async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Use Gemini to understand the command
    const intent = await geminiService.processCommand(command);

    // Execute based on intent
    let result;
    switch (intent.intent) {
      case 'search':
        result = await searchService.quickAnswer(intent.parameters.query);
        break;

      case 'email':
        result = await gmailService.listEmails(5);
        break;

      case 'spotify':
        if (intent.action === 'play_music') {
          const searchResults = await spotifyService.search(intent.parameters.query);
          if (searchResults.success && searchResults.results.length > 0) {
            result = await spotifyService.play(searchResults.results[0].uri);
          } else {
            result = { success: false, message: 'No tracks found' };
          }
        } else {
          result = await spotifyService.getCurrentlyPlaying();
        }
        break;

      case 'system':
        result = await systemService.openApp(intent.parameters.app);
        break;

      case 'scrape':
        result = await scraperService.scrapeExpenseTracker(intent.parameters.url);
        break;

      case 'general':
        const response = await geminiService.chat(command);
        result = { success: true, response: response };
        break;

      default:
        result = { success: false, message: 'Unknown intent' };
    }

    res.json({
      success: true,
      intent: intent,
      result: result
    });

  } catch (error) {
    console.error('Command processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
