// API Configuration
const API_CONFIG = {
    API_URL: "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
    API_KEY: "sk-default-pFNnvq5oSDeZx345ky9zBJpfhLruHKsO",
    AGENT_ID: "684a9249e5203d8a7b648270",
    USER_ID: "newnewton09@gmail.com"
};

// SMART Criteria Data
const SMART_CRITERIA = [
    {
        name: "Specific",
        icon: "🎯",
        color: "#3B82F6",
        colorRgb: "59, 130, 246",
        description: "Clear and well-defined objective"
    },
    {
        name: "Measurable",
        icon: "📊",
        color: "#10B981",
        colorRgb: "16, 185, 129",
        description: "Quantifiable progress indicators"
    },
    {
        name: "Achievable",
        icon: "⚡",
        color: "#F59E0B",
        colorRgb: "245, 158, 11",
        description: "Realistic and attainable"
    },
    {
        name: "Relevant",
        icon: "🎪",
        color: "#8B5CF6",
        colorRgb: "139, 92, 246",
        description: "Aligned with broader goals"
    },
    {
        name: "Time-bound",
        icon: "⏰",
        color: "#EF4444",
        colorRgb: "239, 68, 68",
        description: "Specific deadline and timeframe"
    }
];

// Global state
let goalData = null;
let completedActions = new Set();

// DOM Elements
const goalInput = document.getElementById('goalInput');
const targetDateInput = document.getElementById('targetDate');
const breakdownBtn = document.getElementById('breakdownBtn');
const resultsSection = document.getElementById('resultsSection');
const smartGrid = document.getElementById('smartGrid');
const actionsList = document.getElementById('actionsList');
const timelineContent = document.getElementById('timelineContent');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeErrorModal = document.getElementById('closeErrorModal');
const closeErrorBtn = document.getElementById('closeErrorBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date();
    const todayFormatted = formatDateForInput(today);
    targetDateInput.min = todayFormatted;
    
    // Set default target date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    targetDateInput.value = formatDateForInput(defaultDate);
    
    // Event listeners
    breakdownBtn.addEventListener('click', handleGoalBreakdown);
    
    // Error modal event listeners
    closeErrorModal.addEventListener('click', hideErrorModal);
    closeErrorBtn.addEventListener('click', hideErrorModal);
    errorModal.addEventListener('click', function(e) {
        if (e.target === errorModal) {
            hideErrorModal();
        }
    });
    
    // Add escape key listener to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !errorModal.classList.contains('hidden')) {
            hideErrorModal();
        }
    });
    
    // Timeline view switcher
    document.querySelectorAll('.timeline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            if (goalData) {
                renderTimeline(goalData.microActions, e.target.dataset.view);
            }
        });
    });
    
    // Export functionality
    document.getElementById('exportCalendarBtn').addEventListener('click', exportToCalendar);
    document.getElementById('printBtn').addEventListener('click', printPlan);
    
    // Handle Enter key in textarea
    goalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleGoalBreakdown();
        }
    });
});

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// Format date for display (DD-MM-YYYY)
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        // Parse the date in UTC to avoid timezone issues
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateString);
            return dateString;
        }
        
        const formattedDay = String(date.getUTCDate()).padStart(2, '0');
        const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
        const formattedYear = date.getUTCFullYear();
        return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Handle goal breakdown
async function handleGoalBreakdown() {
    const goal = goalInput.value.trim();
    const targetDate = targetDateInput.value;
    
    if (!goal) {
        showError('Please enter your goal before proceeding.');
        return;
    }
    
    if (!targetDate) {
        showError('Please select a target completion date.');
        return;
    }
    
    setLoadingState(true);
    
    try {
        // Try to call the AI API first
        const response = await callAI(goal, targetDate);
        if (!response) {
            throw new Error('No response received from the API');
        }
        
        try {
            goalData = parseAIResponse(response);
            if (!goalData || !goalData.smartGoals || !goalData.microActions) {
                throw new Error('Invalid response format from API');
            }
        } catch (parseError) {
            console.error('Parse Error:', parseError);
            throw new Error('Failed to process the API response. Please try again.');
        }
    } catch (error) {
        console.error('API Error:', error);
        showError(error.message || 'Failed to connect to the service. Please check your internet connection and try again.');
        setLoadingState(false);
        return;
    }
    
    try {
        renderResults(goalData);
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    } catch (renderError) {
        console.error('Render Error:', renderError);
        showError('Failed to display the results. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Call AI API
async function callAI(goal, targetDate) {
    // Get today's date in DD-MM-YYYY format
    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    // Format target date in DD-MM-YYYY format
    const targetDateObj = new Date(targetDate);
    const targetDateFormatted = `${String(targetDateObj.getDate()).padStart(2, '0')}-${String(targetDateObj.getMonth() + 1).padStart(2, '0')}-${targetDateObj.getFullYear()}`;
    
    console.log('Dates being sent to API:', {
        today: todayFormatted,
        targetDate: targetDateFormatted
    });

    const prompt = `Please break down this goal into SMART Goals format and provide micro-actions with scheduling suggestions. 

Goal: ${goal}
Today's date: ${todayFormatted}
Target completion date: ${targetDateFormatted}

Please provide a detailed response in JSON format with the following structure:
{
    "smartGoals": {
        "specific": "Clear and detailed description of what exactly will be accomplished",
        "measurable": "Specific metrics and milestones to track progress",
        "achievable": "Realistic assessment of what can be accomplished with available resources",
        "relevant": "How this goal aligns with broader objectives and why it matters",
        "timeBound": "Specific deadlines and timeframes for completion"
    },
    "microActions": [
        {
            "title": "Action description",
            "estimatedTime": "30 minutes",
            "suggestedDate": "DD-MM-YYYY",
            "suggestedTime": "09:00",
            "priority": "High",
            "description": "Detailed description of what to do"
        }
    ]
}

Please ensure all micro-actions are the smallest possible steps that can be completed in 2 hours or less. 
Suggest realistic dates and times based on the target completion date.
Use DD-MM-YYYY format for all dates.
Consider that today is ${todayFormatted} and the target date is ${targetDateFormatted}.`;

    console.log('Making API call with config:', {
        url: API_CONFIG.API_URL,
        agentId: API_CONFIG.AGENT_ID,
        userId: API_CONFIG.USER_ID
    });

    const controller = new AbortController();
    // Increase timeout to 30 seconds
    const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('API call timed out after 30 seconds');
    }, 30000);

    try {
        const requestBody = {
            agent_id: API_CONFIG.AGENT_ID,
            user_id: API_CONFIG.USER_ID,
            session_id: `goal-session-${Date.now()}`,
            message: prompt
        };
        
        console.log('Request body:', requestBody);
        
        const response = await fetch(API_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_CONFIG.API_KEY,
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!data || !data.response) {
            console.error('Invalid response format:', data);
            throw new Error('Invalid response format from API');
        }
        
        return data.response;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('API call error:', error);
        
        if (error.name === 'AbortError') {
            throw new Error('The request took too long to complete. Please try again.');
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
            throw error;
        }
    }
}

// Generate mock response as fallback
function generateMockResponse(goal, targetDate) {
    const goalLower = goal.toLowerCase();
    
    // Generate specific responses based on goal keywords
    let smartGoals, microActions;
    
    if (goalLower.includes('learn') && (goalLower.includes('web') || goalLower.includes('code') || goalLower.includes('programming'))) {
        smartGoals = {
            specific: `Learn web development fundamentals including HTML, CSS, JavaScript, and build at least 3 complete projects by ${formatDate(targetDate)}.`,
            measurable: "Complete 5 online courses, build 3 portfolio projects, and pass 10 coding challenges with 80% accuracy.",
            achievable: "With 2-3 hours daily study and access to online resources, this goal is realistic within the given timeframe.",
            relevant: "Web development skills are in high demand and will open up career opportunities in the tech industry.",
            timeBound: `Complete foundation by ${getIntermediateDate(targetDate, 0.3)}, intermediate skills by ${getIntermediateDate(targetDate, 0.7)}, and final projects by ${formatDate(targetDate)}.`
        };
        
        microActions = [
            {
                id: 0,
                title: "Set up development environment",
                description: "Install VS Code, Node.js, and Git. Create GitHub account.",
                estimatedTime: "1 hour",
                suggestedDate: getDefaultDate(1),
                suggestedTime: "09:00",
                priority: "High",
                completed: false
            },
            {
                id: 1,
                title: "Start HTML & CSS basics course",
                description: "Begin with freeCodeCamp's Responsive Web Design certification",
                estimatedTime: "2 hours",
                suggestedDate: getDefaultDate(2),
                suggestedTime: "10:00",
                priority: "High",
                completed: false
            },
            {
                id: 2,
                title: "Build first HTML page",
                description: "Create a simple personal webpage with basic HTML structure",
                estimatedTime: "1 hour",
                suggestedDate: getDefaultDate(3),
                suggestedTime: "14:00",
                priority: "Medium",
                completed: false
            },
            {
                id: 3,
                title: "Learn CSS styling basics",
                description: "Style your HTML page with colors, fonts, and basic layout",
                estimatedTime: "1.5 hours",
                suggestedDate: getDefaultDate(4),
                suggestedTime: "15:00",
                priority: "Medium",
                completed: false
            },
            {
                id: 4,
                title: "Start JavaScript fundamentals",
                description: "Learn variables, functions, and basic programming concepts",
                estimatedTime: "2 hours",
                suggestedDate: getDefaultDate(7),
                suggestedTime: "09:00",
                priority: "High",
                completed: false
            }
        ];
    } else if (goalLower.includes('fit') || goalLower.includes('health') || goalLower.includes('exercise')) {
        smartGoals = {
            specific: `Establish a consistent fitness routine with 4 workouts per week, lose 10 pounds, and run a 5K by ${formatDate(targetDate)}.`,
            measurable: "Work out 4 times per week, track weight weekly, measure body fat percentage monthly, complete a 5K run under 30 minutes.",
            achievable: "With dedication and proper planning, losing 1-2 pounds per week and building endurance is realistic.",
            relevant: "Improved fitness will boost energy, confidence, and overall health for long-term well-being.",
            timeBound: `Build routine in first 2 weeks, see initial results by ${getIntermediateDate(targetDate, 0.4)}, and reach all targets by ${formatDate(targetDate)}.`
        };
        
        microActions = [
            {
                id: 0,
                title: "Plan workout schedule",
                description: "Choose 4 days per week and specific times for workouts",
                estimatedTime: "30 minutes",
                suggestedDate: getDefaultDate(1),
                suggestedTime: "08:00",
                priority: "High",
                completed: false
            },
            {
                id: 1,
                title: "First cardio session",
                description: "Start with 20-minute walk or light jog",
                estimatedTime: "30 minutes",
                suggestedDate: getDefaultDate(2),
                suggestedTime: "07:00",
                priority: "High",
                completed: false
            },
            {
                id: 2,
                title: "Research healthy meal plans",
                description: "Find 3 healthy recipes and plan weekly meals",
                estimatedTime: "45 minutes",
                suggestedDate: getDefaultDate(2),
                suggestedTime: "20:00",
                priority: "Medium",
                completed: false
            },
            {
                id: 3,
                title: "First strength training",
                description: "Try bodyweight exercises: push-ups, squats, planks",
                estimatedTime: "30 minutes",
                suggestedDate: getDefaultDate(4),
                suggestedTime: "07:00",
                priority: "Medium",
                completed: false
            },
            {
                id: 4,
                title: "Track first week progress",
                description: "Weigh yourself and record workout completion",
                estimatedTime: "15 minutes",
                suggestedDate: getDefaultDate(7),
                suggestedTime: "08:00",
                priority: "Low",
                completed: false
            }
        ];
    } else {
        // Generic goal breakdown
        smartGoals = {
            specific: `Transform "${goal}" into a clear, actionable plan with defined outcomes and specific deliverables by ${formatDate(targetDate)}.`,
            measurable: "Break down into 5-7 key milestones with measurable progress indicators and weekly check-ins to track advancement.",
            achievable: "This goal is realistic with proper planning, resource allocation, and consistent daily effort over the available timeframe.",
            relevant: "This goal aligns with your personal growth objectives and will create meaningful positive change in your life.",
            timeBound: `Phase 1 completion by ${getIntermediateDate(targetDate, 0.25)}, Phase 2 by ${getIntermediateDate(targetDate, 0.6)}, and final goal achievement by ${formatDate(targetDate)}.`
        };
        
        microActions = [
            {
                id: 0,
                title: "Define success criteria",
                description: "Write down exactly what achieving this goal looks like",
                estimatedTime: "30 minutes",
                suggestedDate: getDefaultDate(1),
                suggestedTime: "09:00",
                priority: "High",
                completed: false
            },
            {
                id: 1,
                title: "Research requirements",
                description: "Identify resources, tools, and knowledge needed",
                estimatedTime: "1 hour",
                suggestedDate: getDefaultDate(2),
                suggestedTime: "10:00",
                priority: "High",
                completed: false
            },
            {
                id: 2,
                title: "Create action timeline",
                description: "Map out key milestones and deadlines",
                estimatedTime: "45 minutes",
                suggestedDate: getDefaultDate(3),
                suggestedTime: "14:00",
                priority: "Medium",
                completed: false
            },
            {
                id: 3,
                title: "Take first concrete step",
                description: "Begin with the most important initial action",
                estimatedTime: "1 hour",
                suggestedDate: getDefaultDate(4),
                suggestedTime: "15:00",
                priority: "High",
                completed: false
            },
            {
                id: 4,
                title: "Set up tracking system",
                description: "Create a method to monitor and measure progress",
                estimatedTime: "30 minutes",
                suggestedDate: getDefaultDate(5),
                suggestedTime: "16:00",
                priority: "Medium",
                completed: false
            }
        ];
    }
    
    return { smartGoals, microActions };
}

// Parse AI response
function parseAIResponse(response) {
    try {
        // Handle response that might be wrapped in markdown code blocks
        let jsonStr = response;
        if (typeof response === 'string') {
            // Remove markdown code block if present
            jsonStr = response.replace(/```json\n?|\n?```/g, '').trim();
            // Try to find JSON object in the response
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
        }
        
        const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
        
        // Parse the micro-actions and format dates
        const microActions = data.microActions.map((action, index) => ({
            id: index,
            title: action.title,
            description: action.description,
            estimatedTime: action.estimatedTime,
            suggestedDate: parseDateFromDDMMYYYY(action.suggestedDate),
            suggestedTime: action.suggestedTime,
            priority: action.priority,
            completed: false
        }));

        return {
            smartGoals: data.smartGoals,
            microActions: microActions
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        console.log('Raw response:', response);
        throw new Error('Failed to parse the API response');
    }
}

// Parse date from DD-MM-YYYY format
function parseDateFromDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    
    // Handle both DD-MM-YYYY and DD/MM/YYYY formats
    const parts = dateStr.split(/[-/]/);
    if (parts.length !== 3) return dateStr;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-based
    const year = parseInt(parts[2], 10);
    
    // Create date in UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, month, day));
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateStr);
        return dateStr;
    }
    
    // Format as YYYY-MM-DD for HTML date input
    return date.toISOString().split('T')[0];
}

// Helper functions for default dates and times
function getDefaultDate(index) {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return date.toISOString().split('T')[0];
}

function getDefaultTime(index) {
    const times = ['09:00', '10:00', '14:00', '15:00', '16:00'];
    return times[index % times.length];
}

function getIntermediateDate(targetDate, percentage) {
    const today = new Date();
    const target = new Date(targetDate);
    const totalDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    const intermediateDays = Math.floor(totalDays * percentage);
    
    const intermediateDate = new Date(today);
    intermediateDate.setDate(today.getDate() + intermediateDays);
    
    return formatDate(intermediateDate.toISOString().split('T')[0]);
}

// Render results
function renderResults(data) {
    renderSmartGoals(data.smartGoals);
    renderMicroActions(data.microActions);
    renderTimeline(data.microActions, 'week');
    updateProgress();
}

// Render SMART goals
function renderSmartGoals(smartGoals) {
    const criteria = ['specific', 'measurable', 'achievable', 'relevant', 'timeBound'];
    
    smartGrid.innerHTML = criteria.map((criterion, index) => {
        const criteriaData = SMART_CRITERIA[index];
        const content = smartGoals[criterion] || `${criteriaData.description}`;
        
        return `
            <div class="smart-card" style="--smart-color: ${criteriaData.color}; --smart-color-rgb: ${criteriaData.colorRgb}">
                <div class="smart-card__header">
                    <div class="smart-card__icon">${criteriaData.icon}</div>
                    <div>
                        <h3 class="smart-card__title">${criteriaData.name}</h3>
                        <p class="smart-card__description">${criteriaData.description}</p>
                    </div>
                </div>
                <div class="smart-card__content">
                    ${content}
                </div>
            </div>
        `;
    }).join('');
}

// Render micro-actions
function renderMicroActions(actions) {
    actionsList.innerHTML = actions.map(action => `
        <div class="action-item ${action.completed ? 'completed' : ''}" data-action-id="${action.id}">
            <div class="action-header">
                <div class="action-checkbox ${action.completed ? 'checked' : ''}" 
                     onclick="toggleAction(${action.id})"></div>
                <div class="action-content">
                    <h4 class="action-title">${action.title}</h4>
                    <div class="action-meta">
                        <span class="action-tag action-tag--priority-${action.priority.toLowerCase()}">${action.priority} Priority</span>
                        <span class="action-tag action-tag--time">⏱️ ${action.estimatedTime}</span>
                        <span class="action-tag action-tag--date">📅 ${formatDate(action.suggestedDate)} at ${action.suggestedTime}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle action completion
function toggleAction(actionId) {
    if (completedActions.has(actionId)) {
        completedActions.delete(actionId);
    } else {
        completedActions.add(actionId);
    }
    
    // Update UI
    const actionItem = document.querySelector(`[data-action-id="${actionId}"]`);
    const checkbox = actionItem.querySelector('.action-checkbox');
    
    if (completedActions.has(actionId)) {
        actionItem.classList.add('completed');
        checkbox.classList.add('checked');
    } else {
        actionItem.classList.remove('completed');
        checkbox.classList.remove('checked');
    }
    
    updateProgress();
}

// Update progress
function updateProgress() {
    if (!goalData) return;
    
    const total = goalData.microActions.length;
    const completed = completedActions.size;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    progressText.textContent = `${completed}/${total} completed`;
    progressFill.style.width = `${percentage}%`;
}

// Render timeline
function renderTimeline(actions, view = 'week') {
    if (view === 'week') {
        renderWeekView(actions);
    } else {
        renderMonthView(actions);
    }
}

// Render week view
function renderWeekView(actions) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push(date);
    }
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    timelineContent.innerHTML = `
        <div class="timeline-grid">
            ${days.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const dayActions = actions.filter(action => action.suggestedDate === dateStr);
                const isToday = date.toDateString() === today.toDateString();
                
                return `
                    <div class="timeline-day ${isToday ? 'today' : ''}">
                        <div class="timeline-day__header">${dayNames[index]}</div>
                        <div class="timeline-day__date">${date.getDate()}</div>
                        ${dayActions.map(action => `
                            <div class="timeline-event">
                                ${action.suggestedTime} - ${action.title}
                            </div>
                        `).join('')}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render month view
function renderMonthView(actions) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const monthActions = actions.filter(action => {
        const actionDate = new Date(action.suggestedDate);
        return actionDate >= startOfMonth && actionDate <= endOfMonth;
    });
    
    const groupedActions = monthActions.reduce((acc, action) => {
        const date = action.suggestedDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(action);
        return acc;
    }, {});
    
    timelineContent.innerHTML = `
        <div class="timeline-month">
            <h3>Upcoming Actions This Month</h3>
            ${Object.entries(groupedActions).map(([date, dateActions]) => `
                <div class="timeline-date-group">
                    <h4>${formatDate(date)}</h4>
                    ${dateActions.map(action => `
                        <div class="timeline-event">
                            ${action.suggestedTime} - ${action.title} (${action.estimatedTime})
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

// Export to calendar
function exportToCalendar() {
    if (!goalData) return;
    
    const events = goalData.microActions.map(action => {
        const startDate = new Date(`${action.suggestedDate}T${action.suggestedTime}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
        
        return {
            title: action.title,
            start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
            description: action.description
        };
    });
    
    const calendarData = events.map(event => 
        `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.start}\nDTEND:${event.end}\nDESCRIPTION:${event.description}\nEND:VEVENT`
    ).join('\n');
    
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SMART Goals App//EN\n${calendarData}\nEND:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-goals-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
}

// Print plan
function printPlan() {
    window.print();
}

// Utility functions
function setLoadingState(loading) {
    if (loading) {
        breakdownBtn.classList.add('loading');
        breakdownBtn.disabled = true;
        breakdownBtn.querySelector('.loading-spinner').classList.remove('hidden');
    } else {
        breakdownBtn.classList.remove('loading');
        breakdownBtn.disabled = false;
        breakdownBtn.querySelector('.loading-spinner').classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message || 'There was an error processing your request. Please try again.';
    errorModal.classList.remove('hidden');
    // Add a class to prevent scrolling of the background
    document.body.style.overflow = 'hidden';
}

function hideErrorModal() {
    errorModal.classList.add('hidden');
    // Restore scrolling
    document.body.style.overflow = '';
}