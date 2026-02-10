const axios = require('axios');

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Get authorization URL
  getAuthUrl() {
    const scopes = [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Exchange code for tokens
  async getTokens(code) {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri
        }),
        {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      return {
        success: true,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken
      };
    } catch (error) {
      console.error('Spotify token error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }),
        {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Search for tracks
  async search(query, type = 'track', limit = 5) {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          q: query,
          type: type,
          limit: limit
        }
      });

      const items = response.data[type + 's'].items;

      return {
        success: true,
        results: items.map(item => ({
          id: item.id,
          name: item.name,
          uri: item.uri,
          artists: item.artists?.map(a => a.name).join(', '),
          album: item.album?.name,
          duration: item.duration_ms
        }))
      };
    } catch (error) {
      console.error('Spotify search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Play track
  async play(uri = null) {
    try {
      const data = uri ? { uris: [uri] } : {};

      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        data,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'Playback started'
      };
    } catch (error) {
      console.error('Spotify play error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Make sure Spotify is open and a device is active'
      };
    }
  }

  // Pause playback
  async pause() {
    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/pause',
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        success: true,
        message: 'Playback paused'
      };
    } catch (error) {
      console.error('Spotify pause error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get currently playing
  async getCurrentlyPlaying() {
    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.data || !response.data.item) {
        return {
          success: true,
          isPlaying: false,
          message: 'Nothing is currently playing'
        };
      }

      const track = response.data.item;

      return {
        success: true,
        isPlaying: response.data.is_playing,
        track: {
          name: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          duration: track.duration_ms,
          progress: response.data.progress_ms
        }
      };
    } catch (error) {
      console.error('Currently playing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Next track
  async next() {
    try {
      await axios.post(
        'https://api.spotify.com/v1/me/player/next',
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        success: true,
        message: 'Skipped to next track'
      };
    } catch (error) {
      console.error('Spotify next error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Previous track
  async previous() {
    try {
      await axios.post(
        'https://api.spotify.com/v1/me/player/previous',
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        success: true,
        message: 'Went back to previous track'
      };
    } catch (error) {
      console.error('Spotify previous error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SpotifyService();
