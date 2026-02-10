const axios = require('axios');

class SearchService {
  constructor() {
    this.useGoogleAPI = process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID;
  }

  async search(query) {
    try {
      if (this.useGoogleAPI) {
        return await this.googleSearch(query);
      } else {
        // Fallback to DuckDuckGo (free, no API key needed)
        return await this.duckDuckGoSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to perform search');
    }
  }

  async googleSearch(query) {
    const url = 'https://www.googleapis.com/customsearch/v1';
    const params = {
      key: process.env.GOOGLE_SEARCH_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      num: 5
    };

    const response = await axios.get(url, { params });
    
    return {
      query: query,
      results: response.data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
      }))
    };
  }

  async duckDuckGoSearch(query) {
    // DuckDuckGo Instant Answer API (free, no key needed)
    const url = 'https://api.duckduckgo.com/';
    const params = {
      q: query,
      format: 'json',
      no_html: 1,
      skip_disambig: 1
    };

    const response = await axios.get(url, { params });
    const data = response.data;

    // Format results
    const results = [];

    if (data.Abstract) {
      results.push({
        title: data.Heading,
        snippet: data.Abstract,
        link: data.AbstractURL
      });
    }

    // Add related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, 4).forEach(topic => {
        if (topic.Text) {
          results.push({
            title: topic.Text.split(' - ')[0],
            snippet: topic.Text,
            link: topic.FirstURL
          });
        }
      });
    }

    return {
      query: query,
      results: results,
      source: 'DuckDuckGo'
    };
  }

  // Quick answer for simple queries
  async quickAnswer(query) {
    try {
      const searchResults = await this.search(query);
      
      if (searchResults.results && searchResults.results.length > 0) {
        return {
          answer: searchResults.results[0].snippet,
          source: searchResults.results[0].link,
          allResults: searchResults.results
        };
      }

      return {
        answer: 'No results found',
        source: null,
        allResults: []
      };
    } catch (error) {
      console.error('Quick answer error:', error);
      throw error;
    }
  }
}

module.exports = new SearchService();
