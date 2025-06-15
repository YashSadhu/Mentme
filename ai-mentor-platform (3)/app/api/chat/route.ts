export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, mentor, fineTuningSettings } = await req.json()

  try {
    // Get the latest user message
    const latestMessage = messages[messages.length - 1]
    if (!latestMessage || latestMessage.role !== "user") {
      return new Response("No user message found", { status: 400 })
    }

    // Process message with fine-tuning and mentor context
    const processedMessage = processMessageWithFineTuning(latestMessage.content, mentor, fineTuningSettings)

    console.log("Processed message:", processedMessage)
    console.log("Mentor:", mentor.name)

    // Create unique session ID
    const sessionId = "684e3fb9e5203d8a7b653447-eozrvtq617i"

    console.log("Making API request to Lyzr AI...")

    // Make request to Lyzr AI API
    const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk-default-pFNnvq5oSDeZx345ky9zBJpfhLruHKsO",
      },
      body: JSON.stringify({
        user_id: "newnewton09@gmail.com",
        agent_id: "684e3fb9e5203d8a7b653447",
        session_id: sessionId,
        message: processedMessage,
      }),
    })

    if (!response.ok) {
      console.error("Lyzr AI API Error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return new Response("AI service temporarily unavailable", { status: response.status })
    }

    const data = await response.json()
    console.log("Lyzr AI Response:", data)

    // Extract response text
    const responseText =
      data.response || data.message || "I apologize, but I'm having trouble processing your request right now."

    // Create a streaming response compatible with useChat
    const stream = new ReadableStream({
      start(controller) {
        // Send the response in chunks to simulate streaming
        const chunks = responseText.split(" ")
        let index = 0

        const sendChunk = () => {
          if (index < chunks.length) {
            const chunk = chunks[index] + (index < chunks.length - 1 ? " " : "")
            controller.enqueue(
              `data: ${JSON.stringify({
                id: Date.now().toString(),
                object: "chat.completion.chunk",
                choices: [
                  {
                    delta: { content: chunk },
                    finish_reason: index === chunks.length - 1 ? "stop" : null,
                  },
                ],
              })}\n\n`,
            )
            index++
            setTimeout(sendChunk, 50) // Delay between chunks for natural typing effect
          } else {
            controller.enqueue(`data: [DONE]\n\n`)
            controller.close()
          }
        }

        sendChunk()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}

function processMessageWithFineTuning(
  message: string,
  mentor: any,
  settings: { tone: number; fun: number; seriousness: number; practicality: number },
) {
  const toneMap = {
    0: "very casual and informal",
    25: "casual",
    50: "balanced",
    75: "professional",
    100: "very formal and professional",
  }

  const funMap = {
    0: "serious and straightforward",
    25: "mostly serious with occasional light moments",
    50: "balanced between serious and playful",
    75: "engaging and somewhat playful",
    100: "very fun and entertaining",
  }

  const seriousnessMap = {
    0: "very light and casual",
    25: "somewhat relaxed",
    50: "balanced approach",
    75: "focused and serious",
    100: "very serious and intense",
  }

  const practicalityMap = {
    0: "theoretical and conceptual",
    25: "mostly theoretical with some practical elements",
    50: "balanced theory and practice",
    75: "practical with theoretical backing",
    100: "highly practical and actionable",
  }

  const getToneLevel = (value: number) => {
    if (value <= 12) return 0
    if (value <= 37) return 25
    if (value <= 62) return 50
    if (value <= 87) return 75
    return 100
  }

  const enhancedPrompt = `You are ${mentor?.name || "an AI mentor"}, an expert in ${mentor?.field || "various fields"}. ${mentor?.description || ""}

PERSONALITY & COMMUNICATION STYLE:
- You embody the personality, wisdom, and communication style of ${mentor?.name || "this mentor"}
- Communication tone: ${toneMap[getToneLevel(settings.tone) as keyof typeof toneMap]}
- Engagement style: ${funMap[getToneLevel(settings.fun) as keyof typeof funMap]}  
- Approach intensity: ${seriousnessMap[getToneLevel(settings.seriousness) as keyof typeof seriousnessMap]}
- Content focus: ${practicalityMap[getToneLevel(settings.practicality) as keyof typeof practicalityMap]}

MENTOR BACKGROUND:
${mentor?.background || ""}

MENTAL MODELS TO USE:
${mentor?.mentalModels?.join(", ") || "First principles thinking, systems thinking"}

COMMUNICATION STYLE:
${mentor?.communicationStyle || "Clear, insightful, and helpful"}

Respond as ${mentor?.name || "this mentor"} would, incorporating their known personality, wisdom, and unique perspective. Provide helpful, insightful mentorship that reflects their authentic voice and approach.

USER QUESTION: ${message}`

  return enhancedPrompt
}
