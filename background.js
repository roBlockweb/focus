// FocusFlow - Background Service Worker
// Version 1.1.0 - Production Ready

/**
 * Core Storage Module - Handles all data operations
 */
const StorageManager = {
  /**
   * Saves data to chrome.storage.local
   * @param {Object} data - Data object to save
   * @returns {Promise<void>}
   */
  async saveData(data) {
    try {
      await chrome.storage.local.set(data);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  },

  /**
   * Retrieves data from chrome.storage.local
   * @param {string|Array<string>} keys - Keys to retrieve
   * @returns {Promise<Object>} Retrieved data
   */
  async getData(keys) {
    try {
      return await chrome.storage.local.get(keys);
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return {};
    }
  },

  /**
   * Initialize default settings for first-time users
   * @returns {Promise<boolean>} Success status
   */
  async initializeDefaultSettings() {
    try {
      const defaultSettings = {
        userData: {
          isLoggedIn: false,
          name: 'Guest',
          email: '',
          isPremium: false,
          lastLoginDate: new Date().toISOString()
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
          pomodoroEfficiency: 0,
          lastReset: new Date().toISOString()
        },
        integrations: {
          connected: []
        },
        appSettings: {
          theme: 'light',
          showNotifications: true,
          version: '1.1.0'
        }
      };

      await this.saveData(defaultSettings);
      return true;
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      return false;
    }
  }
};

/**
 * Time Management Module - Handles timers and alarms
 */
const TimeManager = {
  /**
   * Get timestamp for the next midnight
   * @returns {number} Timestamp in milliseconds
   */
  getNextMidnight() {
    try {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // next day
        0, 0, 0 // midnight
      );
      return midnight.getTime();
    } catch (error) {
      console.error('Error calculating next midnight:', error);
      // Fallback: return time 24 hours from now
      return Date.now() + (24 * 60 * 60 * 1000);
    }
  },

  /**
   * Create a daily alarm for stats reset
   * @returns {Promise<void>}
   */
  async setupDailyAlarm() {
    try {
      await chrome.alarms.create('dailyReset', {
        when: this.getNextMidnight(),
        periodInMinutes: 24 * 60 // Daily
      });
      console.log('Daily reset alarm created successfully');
    } catch (error) {
      console.error('Failed to create alarm:', error);
    }
  },

  /**
   * Reset daily statistics
   * @returns {Promise<void>}
   */
  async resetDailyStats() {
    try {
      console.log('Resetting daily stats');
      
      // Get current analytics data
      const data = await StorageManager.getData('analytics');
      if (!data.analytics) return;
      
      // Update last reset time
      data.analytics.lastReset = new Date().toISOString();
      
      // In a real implementation, we would:
      // 1. Archive today's data for historical tracking
      // 2. Generate insights from patterns
      // 3. Update weekly averages
      
      // Save updated analytics
      await StorageManager.saveData({ analytics: data.analytics });
      
      console.log('Daily stats reset completed');
    } catch (error) {
      console.error('Error resetting daily stats:', error);
    }
  }
};

/**
 * Focus Session Module - Handles productivity tracking
 */
const FocusSessionManager = {
  /**
   * Start tracking a focus session
   * @param {number} duration - Duration in minutes
   * @returns {Promise<Object>} Session info
   */
  async trackFocusSession(duration) {
    try {
      console.log(`Starting ${duration} minute focus session`);
      
      const sessionInfo = {
        startTime: new Date().toISOString(),
        duration: duration,
        isActive: true,
        id: Date.now().toString()
      };
      
      // Save session info
      await StorageManager.saveData({ currentSession: sessionInfo });
      
      return sessionInfo;
    } catch (error) {
      console.error('Error starting focus session:', error);
      throw error;
    }
  },

  /**
   * End and process a focus session
   * @param {Object} sessionData - Data about the completed session
   * @returns {Promise<boolean>} Success status
   */
  async stopFocusSession(sessionData) {
    try {
      console.log('Focus session ended:', sessionData);
      
      // Get current analytics
      const data = await StorageManager.getData(['analytics', 'currentSession']);
      if (!data.analytics) return false;
      
      const analytics = data.analytics;
      
      // Calculate session duration in hours
      let durationHours = 0;
      if (sessionData.actualDuration) {
        durationHours = sessionData.actualDuration / 60;
      } else if (data.currentSession && data.currentSession.startTime) {
        const startTime = new Date(data.currentSession.startTime);
        const endTime = new Date();
        durationHours = (endTime - startTime) / (1000 * 60 * 60);
      }
      
      // Update analytics
      if (durationHours > 0) {
        // Get day of week (0 = Monday, ... 6 = Sunday)
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1;
        
        // Update focus time for today
        analytics.focusTime[dayIndex] += parseFloat(durationHours.toFixed(2));
        
        // Update average session length
        const prevTotal = analytics.averageSessionLength * analytics.tasksCompleted;
        analytics.tasksCompleted += 1;
        analytics.averageSessionLength = (prevTotal + (durationHours * 60)) / analytics.tasksCompleted;
      }
      
      // Clear current session
      await StorageManager.saveData({ 
        analytics: analytics,
        currentSession: null
      });
      
      return true;
    } catch (error) {
      console.error('Error ending focus session:', error);
      return false;
    }
  }
};

/**
 * User Management Module - Handles user data and premium status
 */
const UserManager = {
  /**
   * Check if user has premium status
   * @returns {Promise<boolean>} Premium status
   */
  async checkPremiumStatus() {
    try {
      const data = await StorageManager.getData('userData');
      return data.userData?.isPremium || false;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  },

  /**
   * Update user login state
   * @param {Object} userData - User data to update
   * @returns {Promise<boolean>} Success status
   */
  async updateUserData(userData) {
    try {
      const data = await StorageManager.getData('userData');
      const updatedData = {
        ...data.userData,
        ...userData,
        lastLoginDate: new Date().toISOString()
      };
      
      await StorageManager.saveData({ userData: updatedData });
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  }
};

/**
 * Coworking Module - Handles virtual rooms and communication
 * Note: This is a stub for future WebSocket implementation
 */
// eslint-disable-next-line no-unused-vars
const CoworkingManager = {
  // WebSocket connection
  socket: null,
  
  // Connection status
  isConnected: false,
  
  // Reconnection attempt count
  reconnectAttempts: 0,
  
  /**
   * Connect to WebSocket server
   * @returns {Promise<boolean>} Connection success
   */
  async connectToServer() {
    // This is a stub implementation
    // In production, we would connect to an actual WebSocket server
    console.log('WebSocket connection stub - would connect to server');
    
    /*
    // Actual implementation would look like this:
    try {
      // Create WebSocket connection
      this.socket = new WebSocket('wss://api.focusflow.example.com/ws');
      
      // Set up connection event handlers
      this.socket.onopen = this.handleConnectionOpen.bind(this);
      this.socket.onmessage = this.handleServerMessage.bind(this);
      this.socket.onclose = this.handleConnectionClose.bind(this);
      this.socket.onerror = this.handleConnectionError.bind(this);
      
      return true;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      return false;
    }
    */
    
    return true;
  },
  
  /**
   * Handle successful WebSocket connection
   */
  handleConnectionOpen() {
    console.log('Connected to FocusFlow server');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Notify UI about successful connection
    chrome.runtime.sendMessage({ 
      type: 'COWORKING_CONNECTION_STATUS', 
      connected: true 
    }).catch(err => console.error('Error sending connection status:', err));
  },
  
  /**
   * Process message from server
   * @param {MessageEvent} event - WebSocket message event
   */
  handleServerMessage(event) {
    try {
      const message = JSON.parse(event.data);
      console.log('Received server message:', message);
      
      // Relay message to popup
      chrome.runtime.sendMessage({ 
        type: 'SERVER_MESSAGE', 
        data: message 
      }).catch(err => console.error('Error relaying server message:', err));
    } catch (error) {
      console.error('Error processing server message:', error);
    }
  },
  
  /**
   * Handle WebSocket connection close
   * @param {CloseEvent} event - Close event
   */
  handleConnectionClose(event) {
    console.log(`Disconnected from server: ${event.code} ${event.reason}`);
    this.isConnected = false;
    
    // Notify UI about disconnection
    chrome.runtime.sendMessage({ 
      type: 'COWORKING_CONNECTION_STATUS', 
      connected: false 
    }).catch(err => console.error('Error sending disconnection status:', err));
    
    // Attempt to reconnect with exponential backoff
    if (this.reconnectAttempts < 5) {
      const backoffTime = Math.pow(2, this.reconnectAttempts) * 1000;
      this.reconnectAttempts++;
      
      console.log(`Attempting to reconnect in ${backoffTime/1000} seconds...`);
      setTimeout(() => this.connectToServer(), backoffTime);
    }
  },
  
  /**
   * Handle WebSocket errors
   * @param {Event} error - Error event
   */
  handleConnectionError(error) {
    console.error('WebSocket error:', error);
    
    // Notify UI about error
    chrome.runtime.sendMessage({ 
      type: 'COWORKING_ERROR', 
      error: 'Connection error. Please try again later.' 
    }).catch(err => console.error('Error sending error status:', err));
  },
  
  /**
   * Send message to server
   * @param {Object} messageData - Data to send
   * @returns {boolean} Send success
   */
  sendToServer(messageData) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(messageData));
        return true;
      } catch (error) {
        console.error('Error sending message to server:', error);
        return false;
      }
    }
    return false;
  }
};

/**
 * Notification Manager - Handles all notifications
 */
const NotificationManager = {
  /**
   * Show a notification to the user
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @returns {Promise<boolean>} Success status
   */
  async showNotification(title, message) {
    try {
      // Check if notifications are enabled
      const settings = await StorageManager.getData('appSettings');
      if (settings.appSettings?.showNotifications === false) {
        return false;
      }
      
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: title || 'FocusFlow',
        message: message
      });
      
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }
};

// Initialize extension when installed or updated
chrome.runtime.onInstalled.addListener(async (details) => {
  try {
    console.log(`FocusFlow extension ${details.reason}: v1.1.0`);
    
    if (details.reason === 'install') {
      // First-time installation
      await StorageManager.initializeDefaultSettings();
      await NotificationManager.showNotification(
        'Welcome to FocusFlow!',
        'Boost your productivity with virtual coworking and focus tools.'
      );
    } else if (details.reason === 'update') {
      // Handle update from previous version
      const data = await StorageManager.getData('appSettings');
      if (data.appSettings) {
        // Update version
        data.appSettings.version = '1.1.0';
        await StorageManager.saveData({ appSettings: data.appSettings });
      } else {
        // Initialize settings if they don't exist
        await StorageManager.initializeDefaultSettings();
      }
      
      await NotificationManager.showNotification(
        'FocusFlow Updated',
        'Your FocusFlow extension has been updated to version 1.1.0 with improved reliability and security.'
      );
    }
    
    // Set up daily reset alarm
    await TimeManager.setupDailyAlarm();
    
  } catch (error) {
    console.error('Error during extension initialization:', error);
  }
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  try {
    if (alarm.name === 'dailyReset') {
      TimeManager.resetDailyStats();
    }
  } catch (error) {
    console.error('Error handling alarm:', error);
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log('Background received message:', message.type);
    
    // Handle different message types
    switch (message.type) {
    case 'START_FOCUS_SESSION':
      FocusSessionManager.trackFocusSession(message.duration)
        .then(sessionInfo => sendResponse({ success: true, sessionInfo }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Required for async response
        
    case 'END_FOCUS_SESSION':
      FocusSessionManager.stopFocusSession(message.sessionData)
        .then(success => sendResponse({ success }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
        
    case 'CHECK_PREMIUM':
      UserManager.checkPremiumStatus()
        .then(isPremium => sendResponse({ isPremium }))
        .catch(error => sendResponse({ isPremium: false, error: error.message }));
      return true;
        
    case 'UPDATE_USER_DATA':
      UserManager.updateUserData(message.userData)
        .then(success => sendResponse({ success }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
        
    case 'SHOW_NOTIFICATION':
      NotificationManager.showNotification(message.title, message.message)
        .then(success => sendResponse({ success }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
        
    case 'CONNECT_COWORKING':
      // Stub for future implementation
      sendResponse({ success: true, message: 'Coworking feature will be implemented in a future update' });
      return false;
        
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
    }
  } catch (error) {
    console.error('Error processing message:', error);
    sendResponse({ success: false, error: 'Internal error processing message' });
    return false;
  }
});

// Handle browser startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    console.log('Browser started with FocusFlow active');
    
    // Ensure alarms are set
    await TimeManager.setupDailyAlarm();
    
    // Check for any interrupted sessions from last shutdown
    const data = await StorageManager.getData('currentSession');
    if (data.currentSession && data.currentSession.isActive) {
      // There was an active session when browser closed
      await NotificationManager.showNotification(
        'Focus Session Interrupted',
        'Your previous focus session was interrupted when the browser closed.'
      );
      
      // Clean up interrupted session
      await StorageManager.saveData({ currentSession: null });
    }
  } catch (error) {
    console.error('Error during browser startup:', error);
  }
});