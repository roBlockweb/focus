// FocusFlow Extension - Popup Script

// State management
const state = {
  user: {
    isLoggedIn: false,
    name: 'Guest',
    email: '',
    isPremium: false
  },
  currentRoom: null,
  pomodoro: {
    isRunning: false,
    mode: 'focus', // 'focus' or 'break'
    timeRemaining: 25 * 60, // in seconds
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
    focusTime: [2.5, 4.2, 3.3, 5.1, 3.6, 1.5, 0.9], // hours per day (Mon-Sun)
    tasksCompleted: 12,
    averageSessionLength: 32, // minutes
    productiveTimeOfDay: '9 AM - 11 AM',
    pomodoroEfficiency: 37 // percent improvement
  },
  integrations: {
    connected: []
  }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  initializeUI();
    
  // Load saved data
  loadUserData();
    
  // Setup event listeners
  setupEventListeners();
});

// Initialize UI
function initializeUI() {
  // Set active tab
  document.querySelector('.tab-button.active').click();
    
  // Update user profile
  updateUserProfile();
    
  // Initialize pomodoro timer display
  updateTimerDisplay();
    
  // Initialize goals list
  renderGoalsList();
    
  // Initialize analytics
  renderAnalytics();
}

// Load user data from storage
function loadUserData() {
  chrome.storage.local.get(['userData', 'goals', 'pomodoro', 'analytics'], (result) => {
    if (result.userData) {
      state.user = { ...state.user, ...result.userData };
      updateUserProfile();
    }
        
    if (result.goals) {
      state.goals = result.goals;
      renderGoalsList();
    }
        
    if (result.pomodoro) {
      state.pomodoro = { ...state.pomodoro, ...result.pomodoro };
      updatePomodoroSettings();
    }
        
    if (result.analytics) {
      state.analytics = { ...state.analytics, ...result.analytics };
      renderAnalytics();
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      // Hide all tab panels
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
            
      // Remove active class from all buttons
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
            
      // Add active class to clicked button
      button.classList.add('active');
            
      // Show corresponding tab panel
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
    
  // Focus Room Events
  setupFocusRoomEvents();
    
  // Pomodoro Events
  setupPomodoroEvents();
    
  // Goals Events
  setupGoalsEvents();
    
  // Analytics Events
  setupAnalyticsEvents();
    
  // Upgrade button
  document.getElementById('upgrade-button').addEventListener('click', () => {
    showUpgradeModal();
  });
    
  // Auth-related events
  document.getElementById('user-profile').addEventListener('click', () => {
    if (!state.user.isLoggedIn) {
      showAuthModal();
    }
  });
    
  // Modal close buttons
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', (e) => {
      e.target.closest('.modal').style.display = 'none';
    });
  });
    
  // Settings and Help buttons
  document.getElementById('settings-button').addEventListener('click', () => {
    showSettingsModal();
  });
    
  document.getElementById('help-button').addEventListener('click', () => {
    openHelpPage();
  });
}

// Update user profile display
function updateUserProfile() {
  const userNameEl = document.getElementById('user-name');
  const subscriptionEl = document.getElementById('subscription-status');
    
  userNameEl.textContent = state.user.isLoggedIn ? state.user.name : 'Guest';
    
  if (state.user.isPremium) {
    subscriptionEl.textContent = 'Premium';
    subscriptionEl.classList.remove('free-tier');
  } else {
    subscriptionEl.textContent = 'Free Tier';
    subscriptionEl.classList.add('free-tier');
  }
    
  // Update premium features visibility
  const premiumOptions = document.querySelectorAll('.premium-option');
  premiumOptions.forEach(option => {
    option.disabled = !state.user.isPremium;
  });
}

// Focus Room Events
function setupFocusRoomEvents() {
  const joinRoomBtn = document.getElementById('join-room-btn');
  const roomDropdown = document.getElementById('room-dropdown');
  const sendMessageBtn = document.getElementById('send-message');
  const messageText = document.getElementById('message-text');
    
  joinRoomBtn.addEventListener('click', () => {
    const selectedRoom = roomDropdown.value;
    const roomName = roomDropdown.options[roomDropdown.selectedIndex].text;
        
    // Check if premium room and user is not premium
    if (selectedRoom.includes('premium') && !state.user.isPremium) {
      showUpgradeModal();
      return;
    }
        
    // Join room logic
    joinRoom(selectedRoom, roomName);
  });
    
  sendMessageBtn.addEventListener('click', () => {
    if (!messageText.value.trim()) return;
        
    sendMessage(messageText.value);
    messageText.value = '';
  });
    
  messageText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessageBtn.click();
    }
  });
}

// Join a virtual coworking room
function joinRoom(roomId, roomName) {
  // In a real implementation, this would connect to a WebSocket server
  console.log(`Joining room: ${roomId}`);
    
  // Update UI to show connected room
  document.getElementById('current-room-name').textContent = roomName;
    
  // In a real implementation, we would fetch actual participants
  // For now, just use the placeholder participants
    
  // Update state
  state.currentRoom = roomId;
    
  // Add system message
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'ai-message');
  messageElement.innerHTML = `
        <span class="sender">FocusAI:</span>
        <span class="content">You've joined ${roomName}. Focus time begins now!</span>
    `;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a chat message
function sendMessage(text) {
  if (!state.currentRoom) {
    // Not connected to a room
    showNotification('Please join a room first');
    return;
  }
    
  // In a real implementation, this would send to a WebSocket server
  console.log(`Sending message to room ${state.currentRoom}: ${text}`);
    
  // Add message to UI
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
        <span class="sender">You:</span>
        <span class="content">${text}</span>
    `;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
    
  // Simulate AI response for demonstration
  simulateAIResponse();
}

// Simulate AI response in chat
function simulateAIResponse() {
  // Only respond sometimes (30% chance)
  if (Math.random() > 0.3) return;
    
  const responses = [
    'Remember to stay hydrated during your focus session!',
    'Great progress! Keep up the momentum.',
    'Try to eliminate distractions for better focus.',
    'Taking short breaks can actually improve your productivity.',
    'Consider setting specific goals for this session.'
  ];
    
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
  // Add AI message after a short delay
  setTimeout(() => {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'ai-message');
    messageElement.innerHTML = `
            <span class="sender">FocusAI:</span>
            <span class="content">${randomResponse}</span>
        `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1500);
}

// Pomodoro Events
function setupPomodoroEvents() {
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');
  const focusDurationInput = document.getElementById('focus-duration');
  const breakDurationInput = document.getElementById('break-duration');
  const autoStartBreaksCheck = document.getElementById('auto-start-breaks');
  const notificationSoundSelect = document.getElementById('notification-sound');
    
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
    
  focusDurationInput.addEventListener('change', () => {
    const minutes = parseInt(focusDurationInput.value);
    if (minutes > 0 && minutes <= 60) {
      state.pomodoro.focusDuration = minutes * 60;
      if (state.pomodoro.mode === 'focus' && !state.pomodoro.isRunning) {
        state.pomodoro.timeRemaining = state.pomodoro.focusDuration;
        updateTimerDisplay();
      }
      savePomodoroSettings();
    }
  });
    
  breakDurationInput.addEventListener('change', () => {
    const minutes = parseInt(breakDurationInput.value);
    if (minutes > 0 && minutes <= 30) {
      state.pomodoro.breakDuration = minutes * 60;
      if (state.pomodoro.mode === 'break' && !state.pomodoro.isRunning) {
        state.pomodoro.timeRemaining = state.pomodoro.breakDuration;
        updateTimerDisplay();
      }
      savePomodoroSettings();
    }
  });
    
  autoStartBreaksCheck.addEventListener('change', () => {
    state.pomodoro.autoStartBreaks = autoStartBreaksCheck.checked;
    savePomodoroSettings();
  });
    
  notificationSoundSelect.addEventListener('change', () => {
    state.pomodoro.notificationSound = notificationSoundSelect.value;
    savePomodoroSettings();
  });
}

// Start the Pomodoro timer
function startTimer() {
  if (state.pomodoro.isRunning) return;
    
  state.pomodoro.isRunning = true;
    
  // Create an interval to update the timer every second
  const timerInterval = setInterval(() => {
    if (state.pomodoro.timeRemaining <= 0) {
      // Timer finished
      clearInterval(timerInterval);
      handleTimerCompletion();
      return;
    }
        
    state.pomodoro.timeRemaining--;
    updateTimerDisplay();
  }, 1000);
    
  // Store the interval ID as a property of the window object
  window.timerInterval = timerInterval;
}

// Pause the Pomodoro timer
function pauseTimer() {
  if (!state.pomodoro.isRunning) return;
    
  state.pomodoro.isRunning = false;
  clearInterval(window.timerInterval);
}

// Reset the Pomodoro timer
function resetTimer() {
  pauseTimer();
    
  if (state.pomodoro.mode === 'focus') {
    state.pomodoro.timeRemaining = state.pomodoro.focusDuration;
  } else {
    state.pomodoro.timeRemaining = state.pomodoro.breakDuration;
  }
    
  updateTimerDisplay();
}

// Handle timer completion (focus or break)
function handleTimerCompletion() {
  // Play notification sound
  playNotificationSound();
    
  // Show notification
  if (state.pomodoro.mode === 'focus') {
    showNotification('Focus session complete! Time for a break.');
        
    // Switch to break mode
    state.pomodoro.mode = 'break';
    state.pomodoro.timeRemaining = state.pomodoro.breakDuration;
        
    // Auto-start break if configured
    if (state.pomodoro.autoStartBreaks) {
      startTimer();
    }
  } else {
    showNotification('Break complete! Ready for another focus session?');
        
    // Switch to focus mode
    state.pomodoro.mode = 'focus';
    state.pomodoro.timeRemaining = state.pomodoro.focusDuration;
  }
    
  updateTimerDisplay();
    
  // Update analytics data
  if (state.pomodoro.mode === 'focus') {
    // Just finished a focus session, update analytics
    updateFocusTimeAnalytics(state.pomodoro.focusDuration / 60); // convert to minutes
  }
}

// Update timer display with current time remaining
function updateTimerDisplay() {
  const minutes = Math.floor(state.pomodoro.timeRemaining / 60);
  const seconds = state.pomodoro.timeRemaining % 60;
    
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update pomodoro settings UI
function updatePomodoroSettings() {
  document.getElementById('focus-duration').value = state.pomodoro.focusDuration / 60;
  document.getElementById('break-duration').value = state.pomodoro.breakDuration / 60;
  document.getElementById('auto-start-breaks').checked = state.pomodoro.autoStartBreaks;
  document.getElementById('notification-sound').value = state.pomodoro.notificationSound;
}

// Save pomodoro settings to storage
function savePomodoroSettings() {
  chrome.storage.local.set({ pomodoro: state.pomodoro });
}

// Play notification sound
function playNotificationSound() {
  if (state.pomodoro.notificationSound === 'none') return;
    
  // In a real implementation, we would play the actual sound
  console.log(`Playing sound: ${state.pomodoro.notificationSound}`);
}

// Goals Events
function setupGoalsEvents() {
  const addGoalBtn = document.getElementById('add-goal');
  const newGoalInput = document.getElementById('new-goal');
    
  addGoalBtn.addEventListener('click', () => {
    addNewGoal();
  });
    
  newGoalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addNewGoal();
    }
  });
}

// Add a new goal
function addNewGoal() {
  const newGoalInput = document.getElementById('new-goal');
  const goalText = newGoalInput.value.trim();
    
  if (!goalText) return;
    
  // Create new goal
  const newGoal = {
    id: Date.now(), // use timestamp as unique ID
    text: goalText,
    completed: false
  };
    
  // Add to state
  state.goals.push(newGoal);
    
  // Save to storage
  saveGoals();
    
  // Update UI
  renderGoalsList();
    
  // Clear input
  newGoalInput.value = '';
}

// Toggle goal completion status
function toggleGoalCompletion(goalId) {
  const goal = state.goals.find(g => g.id === goalId);
  if (goal) {
    goal.completed = !goal.completed;
    saveGoals();
    renderGoalsList();
    updateGoalStats();
  }
}

// Delete a goal - implement in future version with delete button
// Currently not used but keeping for future implementation
/* function deleteGoal(goalId) {
  state.goals = state.goals.filter(g => g.id !== goalId);
  saveGoals();
  renderGoalsList();
  updateGoalStats();
} */

// Render goals list UI
function renderGoalsList() {
  const goalList = document.querySelector('.goal-list');
  goalList.innerHTML = '';
    
  state.goals.forEach(goal => {
    const li = document.createElement('li');
    li.classList.add('goal-item');
        
    li.innerHTML = `
            <input type="checkbox" id="goal-${goal.id}" ${goal.completed ? 'checked' : ''}>
            <label for="goal-${goal.id}" ${goal.completed ? 'class="completed"' : ''}>${goal.text}</label>
        `;
        
    // Add event listener to checkbox
    const checkbox = li.querySelector(`#goal-${goal.id}`);
    checkbox.addEventListener('change', () => {
      toggleGoalCompletion(goal.id);
    });
        
    goalList.appendChild(li);
  });
    
  updateGoalStats();
}

// Update goal statistics display
function updateGoalStats() {
  const completedGoals = state.goals.filter(g => g.completed).length;
  const totalGoals = state.goals.length;
  const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
  const progressBar = document.querySelector('.goal-stats .progress');
  const progressValue = document.querySelector('.goal-stats .stat-value');
    
  progressBar.style.width = `${progress}%`;
  progressValue.textContent = `${progress}%`;
}

// Save goals to storage
function saveGoals() {
  chrome.storage.local.set({ goals: state.goals });
}

// Analytics Events
function setupAnalyticsEvents() {
  const integrationButtons = document.querySelectorAll('.integration-button');
    
  integrationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const service = button.getAttribute('data-service');
            
      if (service === 'more' && !state.user.isPremium) {
        showUpgradeModal();
        return;
      }
            
      connectIntegration(service);
    });
  });
}

// Connect to an external service integration
function connectIntegration(service) {
  // Premium feature check
  if (service !== 'trello' && service !== 'asana' && service !== 'google-calendar') {
    if (!state.user.isPremium) {
      showUpgradeModal();
      return;
    }
  }
    
  // In a real implementation, this would redirect to OAuth flow
  console.log(`Connecting to ${service}...`);
    
  // Simulate connecting
  showNotification(`Connecting to ${service}...`);
    
  // Use identity API to open auth window
  // This would be implemented fully in a real extension
  if (chrome.identity) {
    // Example for illustration (not functional):
    // chrome.identity.launchWebAuthFlow(...)
  }
    
  // For demo, just add to connected integrations
  if (!state.integrations.connected.includes(service)) {
    state.integrations.connected.push(service);
        
    // Save to storage
    chrome.storage.local.set({ integrations: state.integrations });
        
    // Show success notification after a delay
    setTimeout(() => {
      showNotification(`Successfully connected to ${service}!`);
    }, 1500);
  }
}

// Update focus time analytics
function updateFocusTimeAnalytics(minutes) {
  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  // Convert to our array index (0 = Monday, ... 6 = Sunday)
  const dayIndex = today === 0 ? 6 : today - 1;
    
  // Add focus minutes to today's total
  const hoursToAdd = minutes / 60;
  state.analytics.focusTime[dayIndex] += hoursToAdd;
    
  // Round to 1 decimal place
  state.analytics.focusTime[dayIndex] = Math.round(state.analytics.focusTime[dayIndex] * 10) / 10;
    
  // Save to storage
  chrome.storage.local.set({ analytics: state.analytics });
    
  // Update UI
  renderAnalytics();
}

// Render analytics data to UI
function renderAnalytics() {
  // Update bar chart
  const bars = document.querySelectorAll('.bar');
  const barValues = document.querySelectorAll('.bar-value');
    
  state.analytics.focusTime.forEach((hours, index) => {
    // Calculate height percentage (max height for the highest value)
    const maxHours = Math.max(...state.analytics.focusTime);
    const heightPercentage = maxHours > 0 ? (hours / maxHours) * 100 : 0;
        
    bars[index].style.height = `${heightPercentage}%`;
    barValues[index].textContent = hours.toString();
  });
    
  // Update insights
  const insights = document.querySelectorAll('.analytics-insights .insight');
  insights[0].querySelector('p').innerHTML = `Your most productive time of day is <strong>${state.analytics.productiveTimeOfDay}</strong>`;
  insights[1].querySelector('p').innerHTML = `You complete <strong>${state.analytics.pomodoroEfficiency}% more tasks</strong> when using the Pomodoro technique`;
}

// Show authentication modal
function showAuthModal() {
  document.getElementById('auth-modal').style.display = 'block';
    
  // Set up auth event listeners
  document.getElementById('sign-in-button').addEventListener('click', () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
        
    if (!email || !password) {
      showNotification('Please enter email and password');
      return;
    }
        
    // Simulate authentication (in a real app, this would call an API)
    simulateSignIn(email);
  });
    
  document.getElementById('register-button').addEventListener('click', () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
        
    if (!email || !password) {
      showNotification('Please enter email and password');
      return;
    }
        
    // Simulate registration (in a real app, this would call an API)
    simulateSignIn(email);
  });
    
  document.getElementById('google-auth').addEventListener('click', () => {
    // Simulate Google authentication
    simulateSignIn('user@gmail.com');
  });
}

// Simulate user sign in
function simulateSignIn(email) {
  // Update user state
  state.user.isLoggedIn = true;
  state.user.email = email;
  state.user.name = email.split('@')[0]; // Use part before @ as name
    
  // Close auth modal
  document.getElementById('auth-modal').style.display = 'none';
    
  // Update UI
  updateUserProfile();
    
  // Save to storage
  chrome.storage.local.set({ userData: state.user });
    
  // Show welcome notification
  showNotification(`Welcome, ${state.user.name}!`);
}

// Show upgrade to premium modal
function showUpgradeModal() {
  document.getElementById('upgrade-modal').style.display = 'block';
    
  // Set up payment selection event listeners
  document.querySelectorAll('.select-plan').forEach(button => {
    button.addEventListener('click', () => {
      const plan = button.getAttribute('data-plan');
      processUpgrade(plan);
    });
  });
}

// Process premium upgrade
function processUpgrade(plan) {
  // In a real app, this would redirect to a payment processor
  console.log(`Processing ${plan} upgrade...`);
    
  // For demo purposes, simulate upgrade
  showNotification(`Processing ${plan} upgrade...`);
    
  setTimeout(() => {
    // Update user state
    state.user.isPremium = true;
        
    // Update UI
    updateUserProfile();
        
    // Save to storage
    chrome.storage.local.set({ userData: state.user });
        
    // Close upgrade modal
    document.getElementById('upgrade-modal').style.display = 'none';
        
    // Show success notification
    showNotification('Upgrade successful! You now have premium access.');
        
    // Refresh UI to show premium features
    document.querySelectorAll('.premium-feature').forEach(element => {
      element.classList.remove('premium-feature');
    });
  }, 2000);
}

// Show settings modal
function showSettingsModal() {
  // In a real extension, this would show a settings page
  console.log('Opening settings...');
  showNotification('Settings feature coming soon!');
}

// Open help page
function openHelpPage() {
  // In a real extension, this would open a help page
  console.log('Opening help...');
  showNotification('Help feature coming soon!');
}

// Show notification to user
function showNotification(message) {
  // Use Chrome notifications if available
  if (chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon128.png',
      title: 'FocusFlow',
      message: message
    });
  } else {
    // Fallback for development
    console.log(`Notification: ${message}`);
        
    // Create in-app notification
    const notif = document.createElement('div');
    notif.classList.add('in-app-notification');
    notif.textContent = message;
        
    document.body.appendChild(notif);
        
    // Show animation
    setTimeout(() => {
      notif.classList.add('show');
    }, 10);
        
    // Remove after a delay
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notif);
      }, 300);
    }, 3000);
  }
}

// Utility to get a random item from an array
// Currently not used but kept for future implementations
/* function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
} */