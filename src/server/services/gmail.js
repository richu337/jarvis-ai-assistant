const { google } = require('googleapis');

class GmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    // Set credentials if refresh token is available
    if (process.env.GMAIL_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });
    }

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  // Get authorization URL
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // List recent emails
  async listEmails(maxResults = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: 'in:inbox'
      });

      const messages = response.data.messages || [];
      
      // Get details for each message
      const emailDetails = await Promise.all(
        messages.map(msg => this.getEmailDetails(msg.id))
      );

      return {
        success: true,
        count: emailDetails.length,
        emails: emailDetails
      };
    } catch (error) {
      console.error('Gmail list error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch emails. Please check your Gmail API credentials.'
      };
    }
  }

  // Get email details
  async getEmailDetails(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.data;
      const headers = message.payload.headers;

      const getHeader = (name) => {
        const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header ? header.value : '';
      };

      return {
        id: message.id,
        threadId: message.threadId,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        snippet: message.snippet,
        unread: message.labelIds?.includes('UNREAD') || false
      };
    } catch (error) {
      console.error('Get email details error:', error);
      return null;
    }
  }

  // Search emails
  async searchEmails(query, maxResults = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: query
      });

      const messages = response.data.messages || [];
      
      const emailDetails = await Promise.all(
        messages.map(msg => this.getEmailDetails(msg.id))
      );

      return {
        success: true,
        query: query,
        count: emailDetails.length,
        emails: emailDetails
      };
    } catch (error) {
      console.error('Gmail search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: 1
      });

      return {
        success: true,
        unreadCount: response.data.resultSizeEstimate || 0
      };
    } catch (error) {
      console.error('Unread count error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send email
  async sendEmail(to, subject, body) {
    try {
      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      const encodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      });

      return {
        success: true,
        messageId: response.data.id,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('Send email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GmailService();
