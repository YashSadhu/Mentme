const express = require("express")
const path = require("path")
const cors = require("cors")
const app = express()

// Enable CORS for all routes
app.use(cors())

// Serve static files
app.use(express.static(__dirname))

// Parse JSON bodies
app.use(express.json())

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Handle chat API endpoint (for local testing)
app.post("/api/chat", async (req, res) => {
  try {
    console.log("Received chat request:", req.body)

    const { message, mentor, settings } = req.body

    // For local testing, provide a mock response
    const mockResponse = `[${mentor?.name || "AI Mentor"}] Thank you for your message: "${message}"

I understand you want me to respond with a ${settings?.tone > 50 ? "casual" : "formal"} tone, being ${settings?.fun > 50 ? "more playful" : "more serious"}, and ${settings?.creativity > 50 ? "more creative" : "more conventional"}.

This is a local server mock response. To connect to the real AI API, make sure you're using the correct API endpoint and have a valid internet connection.`

    res.json({
      response: mockResponse,
      status: "success",
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
})

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error)
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  })
})

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`MentorMind server running at http://localhost:${PORT}`)
  console.log("Press Ctrl+C to stop the server")
  console.log("\nAPI Endpoints:")
  console.log(`- Main app: http://localhost:${PORT}/`)
  console.log(`- Chat API: http://localhost:${PORT}/api/chat`)
})
