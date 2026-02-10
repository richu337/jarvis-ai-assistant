// WebSocket connection
let ws = null;
let commandCount = 0;
let recognition = null;

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const commandInput = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const voiceIndicator = document.getElementById('voiceIndicator');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const connectionStatus = document.getElementById('connectionStatus');
const commandCountEl = document.getElementById('commandCount');
const commandHistory = document.getElementById('commandHistory');
const actionBtns = document.querySelectorAll('.action-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initWebSocket();
    initVoiceRecognition();
    setupEventListeners();
});

// WebSocket Setup
function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('Connected to JARVIS');
        updateStatus('online', 'Online');
        connectionStatus.textContent = 'Connected';
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateStatus('error', 'Connection Error');
    };

    ws.onclose = () => {
        console.log('Disconnected from JARVIS');
        updateStatus('offline', 'Offline');
        connectionStatus.textContent = 'Disconnected';
        
        // Attempt to reconnect after 3 seconds
        setTimeout(initWebSocket, 3000);
    };
}

// Handle WebSocket Messages
function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'welcome':
            console.log(data.message);
            break;
        
        case 'response':
            displayMessage(data.data.response, 'jarvis');
            break;
        
        case 'error':
            displayMessage(`Error: ${data.message}`, 'jarvis', true);
            break;
        
        default:
            console.log('Unknown message type:', data);
    }
}

// Voice Recognition Setup
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceBtn.classList.add('active');
            voiceIndicator.classList.add('active');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            commandInput.value = transcript;
            sendCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            voiceBtn.classList.remove('active');
            voiceIndicator.classList.remove('active');
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('active');
            voiceIndicator.classList.remove('active');
        };
    } else {
        console.warn('Speech recognition not supported');
        voiceBtn.disabled = true;
        voiceBtn.title = 'Speech recognition not supported in this browser';
    }
}

// Event Listeners
function setupEventListeners() {
    // Send button
    sendBtn.addEventListener('click', () => {
        const command = commandInput.value.trim();
        if (command) {
            sendCommand(command);
            commandInput.value = '';
        }
    });

    // Enter key
    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                sendCommand(command);
                commandInput.value = '';
            }
        }
    });

    // Voice button
    voiceBtn.addEventListener('click', () => {
        if (recognition) {
            if (voiceBtn.classList.contains('active')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        }
    });

    // Quick action buttons
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.getAttribute('data-command');
            sendCommand(command);
        });
    });
}

// Send Command
function sendCommand(command) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        displayMessage('Not connected to server. Please wait...', 'jarvis', true);
        return;
    }

    // Display user message
    displayMessage(command, 'user');

    // Add to history
    addToHistory(command);

    // Send to server
    ws.send(JSON.stringify({
        type: 'command',
        command: command
    }));

    // Update command count
    commandCount++;
    commandCountEl.textContent = commandCount;
}

// Display Message
function displayMessage(content, sender, isError = false) {
    // Remove welcome message if it exists
    const welcomeMsg = chatContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (isError) {
        messageDiv.style.borderLeftColor = 'var(--error)';
    }

    const senderName = sender === 'user' ? 'You' : 'JARVIS';
    const timestamp = new Date().toLocaleTimeString();

    messageDiv.innerHTML = `
        <div class="sender">${senderName}</div>
        <div class="content">${content}</div>
        <div class="timestamp">${timestamp}</div>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add to History
function addToHistory(command) {
    // Remove empty state if it exists
    const emptyState = commandHistory.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.textContent = command;

    commandHistory.insertBefore(historyItem, commandHistory.firstChild);

    // Keep only last 10 commands
    while (commandHistory.children.length > 10) {
        commandHistory.removeChild(commandHistory.lastChild);
    }
}

// Update Status
function updateStatus(status, text) {
    statusText.textContent = text;
    
    const colors = {
        online: 'var(--success)',
        offline: 'var(--error)',
        error: 'var(--error)',
        processing: 'var(--warning)'
    };

    statusIndicator.style.background = colors[status] || colors.offline;
    statusIndicator.style.boxShadow = `0 0 10px ${colors[status] || colors.offline}`;
}

// Text-to-Speech (optional)
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// Export functions for external use
window.jarvis = {
    sendCommand,
    speak
};
