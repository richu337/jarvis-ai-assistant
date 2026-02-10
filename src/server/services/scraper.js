const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

class ScraperService {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Scrape expense tracker website
  async scrapeExpenseTracker(url) {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.goto(url || process.env.EXPENSE_TRACKER_URL, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Extract data - customize selectors based on your website
      const data = await page.evaluate(() => {
        // Example selectors - modify based on your actual website structure
        const balance = document.querySelector('.balance, #balance, [data-balance]')?.textContent || 'N/A';
        const income = document.querySelector('.income, #income, [data-income]')?.textContent || 'N/A';
        const expenses = document.querySelector('.expenses, #expenses, [data-expenses]')?.textContent || 'N/A';
        
        // Get recent transactions
        const transactions = [];
        const transactionElements = document.querySelectorAll('.transaction, .transaction-item, [data-transaction]');
        
        transactionElements.forEach((el, index) => {
          if (index < 5) { // Get last 5 transactions
            transactions.push({
              description: el.querySelector('.description, .name')?.textContent || '',
              amount: el.querySelector('.amount, .value')?.textContent || '',
              date: el.querySelector('.date, .time')?.textContent || ''
            });
          }
        });

        return {
          balance,
          income,
          expenses,
          transactions
        };
      });

      return {
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Scraping error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to scrape expense tracker. Please check the URL and selectors.'
      };
    }
  }

  // Generic website scraper
  async scrapeWebsite(url, selectors = {}) {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await page.waitForTimeout(2000);

      // Extract data based on provided selectors
      const data = await page.evaluate((sels) => {
        const result = {};
        
        for (const [key, selector] of Object.entries(sels)) {
          const element = document.querySelector(selector);
          result[key] = element ? element.textContent.trim() : null;
        }

        return result;
      }, selectors);

      return {
        success: true,
        url: url,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Generic scraping error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simple HTML fetch and parse (faster, no browser needed)
  async fetchAndParse(url, selectors = {}) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const data = {};
      
      for (const [key, selector] of Object.entries(selectors)) {
        data[key] = $(selector).text().trim() || null;
      }

      return {
        success: true,
        url: url,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Fetch and parse error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get page screenshot
  async getScreenshot(url) {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const screenshot = await page.screenshot({
        encoding: 'base64',
        fullPage: false
      });

      return {
        success: true,
        screenshot: `data:image/png;base64,${screenshot}`
      };
    } catch (error) {
      console.error('Screenshot error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ScraperService();
