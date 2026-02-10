const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class SystemService {
  constructor() {
    // Common Windows applications and their commands
    this.appCommands = {
      'chrome': 'start chrome',
      'google chrome': 'start chrome',
      'firefox': 'start firefox',
      'edge': 'start msedge',
      'microsoft edge': 'start msedge',
      'notepad': 'start notepad',
      'calculator': 'start calc',
      'calc': 'start calc',
      'paint': 'start mspaint',
      'explorer': 'start explorer',
      'file explorer': 'start explorer',
      'cmd': 'start cmd',
      'command prompt': 'start cmd',
      'powershell': 'start powershell',
      'task manager': 'start taskmgr',
      'taskmgr': 'start taskmgr',
      'control panel': 'start control',
      'settings': 'start ms-settings:',
      'spotify': 'start spotify',
      'vscode': 'code',
      'visual studio code': 'code',
      'word': 'start winword',
      'excel': 'start excel',
      'powerpoint': 'start powerpnt',
      'outlook': 'start outlook'
    };
  }

  async openApp(appName) {
    try {
      const normalizedName = appName.toLowerCase().trim();
      const command = this.appCommands[normalizedName] || `start ${appName}`;

      await execPromise(command);

      return {
        success: true,
        message: `Opened ${appName}`,
        app: appName
      };
    } catch (error) {
      console.error('Failed to open app:', error);
      return {
        success: false,
        message: `Failed to open ${appName}. Make sure the application is installed.`,
        error: error.message
      };
    }
  }

  async executeCommand(command) {
    try {
      // Security: Whitelist allowed commands
      const allowedCommands = [
        'dir', 'ls', 'echo', 'date', 'time', 'systeminfo',
        'ipconfig', 'ping', 'tasklist', 'vol'
      ];

      const cmdBase = command.split(' ')[0].toLowerCase();
      
      if (!allowedCommands.includes(cmdBase)) {
        return {
          success: false,
          message: 'Command not allowed for security reasons',
          output: ''
        };
      }

      const { stdout, stderr } = await execPromise(command);

      return {
        success: true,
        message: 'Command executed successfully',
        output: stdout || stderr
      };
    } catch (error) {
      console.error('Command execution error:', error);
      return {
        success: false,
        message: 'Failed to execute command',
        error: error.message
      };
    }
  }

  async getSystemInfo() {
    try {
      const { stdout } = await execPromise('systeminfo');
      
      // Parse basic info
      const lines = stdout.split('\n');
      const info = {};
      
      lines.forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          if (key && value) {
            info[key.trim()] = value.trim();
          }
        }
      });

      return {
        success: true,
        info: info
      };
    } catch (error) {
      console.error('System info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listRunningApps() {
    try {
      const { stdout } = await execPromise('tasklist');
      
      return {
        success: true,
        processes: stdout
      };
    } catch (error) {
      console.error('List apps error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getAvailableApps() {
    return Object.keys(this.appCommands);
  }
}

module.exports = new SystemService();
