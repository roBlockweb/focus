// FocusFlow - Background Service Worker

// Initialize extension when installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  console.log('FocusFlow extension installed');
    
  // Initialize default settings
  const defaultSettings = {
    userData: {
      isLoggedIn: false,
      name: 'Guest',
      email: '',
      isPremium: false
    },
    pomodoro: {
      isRunning: false,
      mode: 'focus',
      timeRemaining: 25 * 60,
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      autoStartBreaks: true,
      notificationSound: 'bell'
    },
    goals: [
      { id: 1, text: 'Complete project proposal', completed: false },
      { id: 2, text: 'Review feedback from team', completed: true },
      { id: 3, text: 'Set up client meeting', completed: false }
    ],
    analytics: {
      focusTime: [0, 0, 0, 0, 0, 0, 0], // hours per day (Mon-Sun)
      tasksCompleted: 0,
      averageSessionLength: 0,
      productiveTimeOfDay: '9 AM - 11 AM',
      pomodoroEfficiency: 0
    },
    integrations: {
      connected: []
    }
  };
    
  // Store default settings
  await chrome.storage.local.set(defaultSettings);
    
  // Create alarm for daily stats reset
  chrome.alarms.create('dailyReset', {
    when: getNextMidnight(),
    periodInMinutes: 24 * 60 // Daily
  });
});

// Get timestamp for the next midnight
function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // next day
    0, 0, 0 // midnight
  );
  return midnight.getTime();
}

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReset') {
    resetDailyStats();
  }
});

// Reset daily statistics at midnight
async function resetDailyStats() {
  console.log('Resetting daily stats');
    
  // We don't actually reset the weekly focus time,
  // but in a real implementation we might archive old data
  // and generate insights
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
    
  if (message.type === 'START_FOCUS_SESSION') {
    // Handle starting focus session
    trackFocusSession(message.duration);
    sendResponse({ success: true });
  } else if (message.type === 'END_FOCUS_SESSION') {
    // Handle ending focus session
    stopFocusSession(message.sessionData);
    sendResponse({ success: true });
  } else if (message.type === 'CHECK_PREMIUM') {
    // Check if user has premium status
    checkPremiumStatus().then(isPremium => {
      sendResponse({ isPremium });
    });
    return true; // Required for async response
  }
});

// Track ongoing focus session
function trackFocusSession(duration) {
  console.log(`Starting ${duration} minute focus session`);
    
  // In a real implementation, we would track the current session
  // and potentially send periodic updates to a server
}

// Process ended focus session
function stopFocusSession(sessionData) {
  console.log('Focus session ended:', sessionData);
    
  // In a real implementation, we would update analytics,
  // potentially sync with a server, etc.
}

// Check if user has premium status
async function checkPremiumStatus() {
  const data = await chrome.storage.local.get('userData');
  return data.userData?.isPremium || false;
}

// Optional: Implement WebSocket connection for real-time communication
// This would be used for the virtual coworking rooms
// Will be used in future implementation
// let socket = null;

// NOTE: The following WebSocket functionality is commented out for now
// These functions will be implemented in a future version when we add
// real-time communication capabilities

/* 
// Connect to WebSocket server - To be implemented in future version
function connectToServer() {
  // In a real implementation, we would connect to an actual WebSocket server
  console.log('Would connect to WebSocket server here');
    
  // Example implementation:
  socket = new WebSocket('wss://api.focusflow.example.com/ws');
    
  socket.onopen = () => {
      console.log('Connected to FocusFlow server');
  };
    
  socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      processServerMessage(message);
  };
    
  socket.onclose = () => {
      console.log('Disconnected from server');
      // Attempt to reconnect after a delay
      setTimeout(connectToServer, 5000);
  };
    
  socket.onerror = (error) => {
      console.error('WebSocket error:', error);
  };
}

// Process message from server - To be implemented in future version
function processServerMessage(message) {
  // Handle different types of server messages
  console.log('Received server message:', message);
    
  // Relay relevant messages to the popup
  chrome.runtime.sendMessage({ type: 'SERVER_MESSAGE', data: message });
}

// Send message to server - To be implemented in future version
function sendToServer(messageData) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(messageData));
  }
}
*/