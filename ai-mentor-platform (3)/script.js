// Import configuration
import { config } from "./config.js"

// Mentor configuration
const mentorMap = {
  leonardo: {
    name: "Leonardo da Vinci",
    field: "Art, Science, and Innovation",
    description: "A master of multiple disciplines, combining art and science with innovative thinking.",
    personality: "Curious, observant, and always seeking connections between different fields of knowledge.",
    background: "Renaissance polymath known for the Mona Lisa, The Last Supper, and countless scientific innovations.",
  },
  einstein: {
    name: "Albert Einstein",
    field: "Physics and Philosophy",
    description: "A revolutionary thinker who transformed our understanding of the universe.",
    personality: "Thoughtful, imaginative, and passionate about understanding the fundamental nature of reality.",
    background: "Theoretical physicist who developed the theory of relativity and won the Nobel Prize in Physics.",
  },
  curie: {
    name: "Marie Curie",
    field: "Science and Research",
    description: "A pioneering scientist who made groundbreaking discoveries in radioactivity.",
    personality: "Determined, methodical, and dedicated to the pursuit of scientific knowledge.",
    background: "First woman to win a Nobel Prize and the only person to win Nobel Prizes in two different sciences.",
  },
  jobs: {
    name: "Steve Jobs",
    field: "Technology and Innovation",
    description: "A visionary leader who revolutionized personal computing and digital technology.",
    personality: "Perfectionist, innovative, and focused on creating products that change the world.",
    background: "Co-founder of Apple Inc. who transformed multiple industries through design and innovation.",
  },
}

// DOM Elements
const chatMessages = document.getElementById("chatMessages")
const userInput = document.getElementById("userInput")
const sendButton = document.getElementById("sendButton")
const promptPreview = document.getElementById("promptPreview")
const mentorSelect = document.getElementById("mentor")

// Add mentor settings fields
const mentorSettings = {
  name: document.createElement("input"),
  field: document.createElement("input"),
  description: document.createElement("textarea"),
}

// Create mentor settings container
const mentorSettingsContainer = document.createElement("div")
mentorSettingsContainer.className = "mentor-settings"
mentorSettingsContainer.innerHTML = "<h3>Mentor Settings</h3>"

// Add mentor settings fields to the container
Object.entries(mentorSettings).forEach(([key, element]) => {
  const label = document.createElement("label")
  label.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ":"
  element.className = "mentor-setting-input"
  element.placeholder = `Enter mentor ${key}`
  mentorSettingsContainer.appendChild(label)
  mentorSettingsContainer.appendChild(element)
})

// Insert mentor settings after mentor select
mentorSelect.parentNode.insertBefore(mentorSettingsContainer, mentorSelect.nextSibling)

// Slider elements
const sliders = {
  tone: document.getElementById("tone"),
  fun: document.getElementById("fun"),
  seriousness: document.getElementById("seriousness"),
  practicality: document.getElementById("practicality"),
  creativity: document.getElementById("creativity"),
}

// Slider value displays
const sliderValues = {
  tone: document.getElementById("tone-value"),
  fun: document.getElementById("fun-value"),
  seriousness: document.getElementById("seriousness-value"),
  practicality: document.getElementById("practicality-value"),
  creativity: document.getElementById("creativity-value"),
}

// Debug logging
console.log("Script loaded")
console.log("API Configuration:", {
  API_URL: config.API_URL,
  AGENT_ID: config.AGENT_ID,
  USER_ID: config.USER_ID,
})

// Add initial welcome message
addMessage(
  "Hello! I'm your AI mentor. Choose a mentor above and adjust the sliders to customize my response style, then ask me anything!",
  "mentor",
)

// Event Listeners
sendButton.addEventListener("click", handleSendMessage)
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
})

// Update mentor settings when mentor is selected
mentorSelect.addEventListener("change", () => {
  const mentor = mentorMap[mentorSelect.value]
  mentorSettings.name.value = mentor.name
  mentorSettings.field.value = mentor.field
  mentorSettings.description.value = mentor.description
  updatePromptPreview()
})

// Update mentor settings when inputs change
Object.values(mentorSettings).forEach((input) => {
  input.addEventListener("input", updatePromptPreview)
})

// Update slider values and preview
Object.entries(sliders).forEach(([key, slider]) => {
  slider.addEventListener("input", () => {
    sliderValues[key].textContent = slider.value
    updatePromptPreview()
  })
})

function updatePromptPreview() {
  const mentor = {
    name: mentorSettings.name.value || mentorMap[mentorSelect.value].name,
    field: mentorSettings.field.value || mentorMap[mentorSelect.value].field,
    description: mentorSettings.description.value || mentorMap[mentorSelect.value].description,
  }

  const tone = Number.parseInt(sliders.tone.value)
  const fun = Number.parseInt(sliders.fun.value)
  const seriousness = Number.parseInt(sliders.seriousness.value)
  const practicality = Number.parseInt(sliders.practicality.value)
  const creativity = Number.parseInt(sliders.creativity.value)

  const styleDescription = `
Communication Style:
• Tone: ${tone > 66 ? "Very Casual" : tone > 33 ? "Balanced" : "Very Formal"}
• Fun Level: ${fun > 66 ? "Very Playful" : fun > 33 ? "Moderate" : "Serious"}
• Seriousness: ${seriousness > 66 ? "Very Serious" : seriousness > 33 ? "Moderate" : "Light"}
• Practicality: ${practicality > 66 ? "Highly Practical" : practicality > 33 ? "Balanced" : "Theoretical"}
• Creativity: ${creativity > 66 ? "Highly Creative" : creativity > 33 ? "Balanced" : "Conventional"}

Current Mentor: ${mentor.name} - ${mentor.field}
${mentor.description}`

  promptPreview.textContent = styleDescription
}

function formatMessage(text) {
  // Replace double asterisks with HTML bold tags
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Replace single asterisks with HTML italic tags
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Add line breaks for better readability
  formattedText = formattedText.replace(/\n/g, "<br>")

  // Add spacing between paragraphs
  formattedText = formattedText.replace(/\n\n/g, "<br><br>")

  return formattedText
}

async function handleSendMessage() {
  const message = userInput.value.trim()
  if (!message) return

  // Disable send button to prevent multiple requests
  sendButton.disabled = true
  sendButton.textContent = "Sending..."

  addMessage(message, "user")
  userInput.value = ""

  try {
    const selectedMentorKey = mentorSelect.value
    const selectedMentor = mentorMap[selectedMentorKey]

    const mentor = {
      name: mentorSettings.name.value || selectedMentor.name,
      field: mentorSettings.field.value || selectedMentor.field,
      description: mentorSettings.description.value || selectedMentor.description,
      personality: selectedMentor.personality,
      background: selectedMentor.background,
    }

    const tone = Number.parseInt(sliders.tone.value)
    const fun = Number.parseInt(sliders.fun.value)
    const seriousness = Number.parseInt(sliders.seriousness.value)
    const practicality = Number.parseInt(sliders.practicality.value)
    const creativity = Number.parseInt(sliders.creativity.value)

    // Create enhanced prompt with mentor context and style instructions
    const enhancedPrompt = `You are ${mentor.name}, ${mentor.description}

MENTOR BACKGROUND:
${mentor.background}

PERSONALITY:
${mentor.personality}

FIELD OF EXPERTISE:
${mentor.field}

COMMUNICATION STYLE INSTRUCTIONS:
- Tone: ${tone > 66 ? "Be very casual and conversational" : tone > 33 ? "Use a balanced, approachable tone" : "Be formal and professional"}
- Engagement: ${fun > 66 ? "Be playful and entertaining" : fun > 33 ? "Be moderately engaging" : "Be serious and focused"}
- Approach: ${seriousness > 66 ? "Take a very serious, intense approach" : seriousness > 33 ? "Use a moderately serious approach" : "Keep things light and accessible"}
- Content Focus: ${practicality > 66 ? "Provide highly practical, actionable advice" : practicality > 33 ? "Balance theory with practical application" : "Focus on theoretical concepts and ideas"}
- Innovation: ${creativity > 66 ? "Be highly creative and innovative in your responses" : creativity > 33 ? "Balance conventional wisdom with creative insights" : "Stick to conventional, proven approaches"}

Respond to the following message as ${mentor.name} would, incorporating your unique perspective, expertise, and the specified communication style:

USER MESSAGE: ${message}`

    console.log("Sending enhanced prompt to API...")
    console.log("Prompt length:", enhancedPrompt.length)

    const requestBody = {
      user_id: config.USER_ID,
      agent_id: config.AGENT_ID,
      session_id: config.AGENT_ID + "-" + Math.random().toString(36).substring(2, 12),
      message: enhancedPrompt,
    }

    console.log("Request body:", requestBody)

    const response = await fetch(config.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const responseText = await response.text()
    console.log("Raw response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError)
      console.error("Response text:", responseText)
      throw new Error("Invalid JSON response from API")
    }

    console.log("Parsed response:", data)

    // Handle different response formats
    let mentorResponse
    if (data.response) {
      mentorResponse = data.response
    } else if (data.message) {
      mentorResponse = data.message
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
      mentorResponse = data.choices[0].message.content
    } else {
      console.error("Unexpected response format:", data)
      mentorResponse = "I apologize, but I received an unexpected response format. Please try again."
    }

    addMessage(mentorResponse, "mentor")
  } catch (error) {
    console.error("Detailed error:", error)

    let errorMessage = "I apologize, but I encountered an error. "

    if (error.message.includes("Failed to fetch")) {
      errorMessage += "Please check your internet connection and try again."
    } else if (error.message.includes("API Error: 401")) {
      errorMessage += "Authentication failed. Please check the API key."
    } else if (error.message.includes("API Error: 403")) {
      errorMessage += "Access forbidden. Please check your permissions."
    } else if (error.message.includes("API Error: 429")) {
      errorMessage += "Rate limit exceeded. Please wait a moment and try again."
    } else if (error.message.includes("API Error: 500")) {
      errorMessage += "Server error. Please try again later."
    } else {
      errorMessage += `Error details: ${error.message}`
    }

    addMessage(errorMessage, "mentor")
  } finally {
    // Re-enable send button
    sendButton.disabled = false
    sendButton.textContent = "Send"
  }
}

function addMessage(text, sender) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${sender}-message`
  messageDiv.innerHTML = formatMessage(text)
  chatMessages.appendChild(messageDiv)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Initialize everything
function initialize() {
  // Initialize slider values
  Object.entries(sliders).forEach(([key, slider]) => {
    slider.value = 50
    sliderValues[key].textContent = 50
  })

  // Initialize mentor settings with default values
  const defaultMentor = mentorMap[mentorSelect.value]
  mentorSettings.name.value = defaultMentor.name
  mentorSettings.field.value = defaultMentor.field
  mentorSettings.description.value = defaultMentor.description

  updatePromptPreview()
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize)
} else {
  initialize()
}
