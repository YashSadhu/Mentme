/**
 * BeEasy AI Helper Configuration
 *
 * INSTRUCTIONS FOR USE:
 * 1. Copy this entire file to your project
 * 2. In your HTML file, add type="module" to your script tags:
 *    <script type="module" src="config.js"></script>
 *    <script type="module" src="your-script.js"></script>
 *
 * 3. In your JavaScript file, import the config:
 *    import { config } from './config.js';
 *
 * 4. Run your project through a local server:
 *    - Using Python: python -m http.server 8000
 *    - Using Node.js: npx http-server
 *    - Using VS Code: Install "Live Server" extension
 *
 * 5. Access your project at http://localhost:8000
 */

export const config = {
  // API Configuration
  API_URL: "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
  API_KEY: "sk-default-pFNnvq5oSDeZx345ky9zBJpfhLruHKsO",
  AGENT_ID: "684e3fb9e5203d8a7b653447",
  USER_ID: "newnewton09@gmail.com",

  // Agent Configuration
  AGENT_CONFIG: {
    name: "MentorMind",
    description: "Get personalised mentorship from legendary minds",
    agent_role: "You are an expert mentor embodying the wisdom and personality of historical figures.",
    agent_instructions:
      "Provide clear, insightful guidance based on the mentor's personality and expertise. Adapt your communication style based on user preferences.",

    // Features configuration
    features: [
      {
        type: "SHORT_TERM_MEMORY",
        config: {},
        priority: 0,
      },
      {
        type: "LONG_TERM_MEMORY",
        config: {},
        priority: 0,
      },
      {
        type: "CONTEXT_RELEVANCE",
        config: {},
        priority: 0,
      },
    ],

    // Model configuration
    provider_id: "Google",
    model: "gemini/gemini-2.0-flash-lite",
    temperature: "0.7",
    top_p: "0.9",
    llm_credential_id: "lyzr_google",
  },

  // HTML Template (for reference)
  HTML_TEMPLATE: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Helper Chat</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <div class="chat-container">
                <div class="chat-header">
                    <h1>AI Helper</h1>
                    <p>Get personalized assistance and expert suggestions</p>
                </div>
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input-container">
                    <textarea id="userInput" placeholder="Type your message here..." rows="3"></textarea>
                    <button id="sendButton" type="button">Send</button>
                </div>
            </div>
            <script type="module" src="config.js"></script>
            <script type="module" src="script.js"></script>
        </body>
        </html>
    `,

  // CSS Template (for reference)
  CSS_TEMPLATE: `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f0f2f5;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .chat-container {
            width: 90%;
            max-width: 800px;
            height: 90vh;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
        }

        .chat-header {
            padding: 20px;
            background-color: #1a73e8;
            color: white;
            border-radius: 12px 12px 0 0;
            text-align: center;
        }

        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .user-message {
            background-color: #e3f2fd;
            align-self: flex-end;
        }

        .mentor-message {
            background-color: #f5f5f5;
            align-self: flex-start;
        }

        .chat-input-container {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }

        #userInput {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            resize: none;
        }

        #sendButton {
            padding: 12px 24px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
    `,

  // JavaScript Template (for reference)
  JS_TEMPLATE: `
        import config from './config.js';

        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');

        sendButton.addEventListener('click', handleSendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        async function handleSendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            userInput.value = '';

            try {
                const response = await fetch(config.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': config.API_KEY
                    },
                    body: JSON.stringify({
                        user_id: config.USER_ID,
                        agent_id: config.AGENT_ID,
                        session_id: config.AGENT_ID + '-' + Math.random().toString(36).substring(2, 12),
                        message: message
                    })
                });

                const data = await response.json();
                addMessage(data.response || data.message, 'mentor');
            } catch (error) {
                console.error('Error:', error);
                addMessage("I apologize, but I'm having trouble connecting right now.", 'mentor');
            }
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}-message\`;
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    `,
}
