# AI Mentor Platform

An intelligent mentoring platform that provides personalized AI-powered mentorship with customizable interaction styles and fine-tuned responses.

## Overview

This platform enables users to interact with AI mentors who are modeled after real-world experts. Each mentor has their own personality, expertise, and communication style, which can be further customized through fine-tuning settings. The platform is built with Next.js 13+ and leverages the App Router for optimal performance and user experience.

## Key Features

- **AI-Powered Mentorship**: Interact with AI mentors modeled after real experts
- **Fine-Tuning Panel**: Customize mentor's communication style and approach
- **Real-time Chat Interface**: Stream responses for natural conversation flow
- **Personalized Responses**: Context-aware responses based on mentor's expertise
- **Session History**: Track and review past mentoring sessions

## Architecture

### Frontend Components

1. **ChatInterface (`components/chat-interface.tsx`)**
   - Main chat interface component
   - Handles message input and display
   - Manages fine-tuning settings
   - Integrates with the fine-tuning panel

2. **FineTuningPanel (`components/fine-tuning-panel.tsx`)**
   - Customizable settings for mentor interaction
   - Controls for:
     - Communication tone
     - Engagement style
     - Approach intensity
     - Content focus
     - Learning preferences
     - Goals and topics

3. **Layout Components**
   - `app/layout.tsx`: Root layout with HTML structure
   - `app/html-wrapper.tsx`: Client-side HTML wrapper for hydration

### Backend API

1. **Chat API (`app/api/chat/route.ts`)**
   - Handles chat requests
   - Processes messages with fine-tuning
   - Integrates with Lyzr AI API
   - Implements streaming responses

## How It Works

### 1. End-to-End Request Flow

1. **User Interaction**: User sends a message through the chat interface
2. **Request Processing**:
   - Message is wrapped with mentor context
   - Fine-tuning parameters are applied
   - Conversation history is attached
   - System prompt is generated

3. **API Integration**:
   ```typescript
   const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.LYZR_API_KEY}`
     },
     body: JSON.stringify({
       messages: [
         {
           role: 'system',
           content: `You are ${mentor.name}, an expert in ${mentor.field}. ${mentor.background}`
         },
         ...conversationHistory,
         { role: 'user', content: enhancedMessage }
       ],
       session_id: `session_${Date.now()}`,
       // Additional fine-tuning parameters
     })
   });
   ```

4. **Response Handling**:
   - Stream response chunks are processed in real-time
   - Messages are displayed with typing indicators
   - Conversation state is updated
   - Session is persisted for continuity

### 2. Mentor Context & Fine-Tuning

#### Mentor Integration
Each mentor is defined with specific attributes that shape their responses:

```typescript
const demoMentor = {
  name: "Naval Ravikant",
  field: "Philosophy & Venture Capital",
  avatar: "/naval-ravikant.jpg",
  description: "Philosopher, investor, and founder of AngelList",
  background: "Focus on first principles thinking, long-term thinking, and philosophy",
  communicationStyle: "Clear, concise, and thought-provoking"
};
```

#### Fine-Tuning Implementation
The platform applies fine-tuning through prompt engineering:

```typescript
function enhancePrompt(message: string, mentor: Mentor, settings: FineTuningSettings) {
  const toneMap = {
    0: "very casual", 25: "casual", 50: "neutral", 75: "professional", 100: "very formal"
  };
  
  const styleMap = {
    0: "direct and to the point",
    50: "balanced between direct and explanatory",
    100: "detailed and explanatory"
  };

  return `
  # CONTEXT
  You are ${mentor.name}, ${mentor.description}
  
  # COMMUNICATION STYLE
  - Tone: ${toneMap[settings.tone]}
  - Style: ${styleMap[settings.style]}
  - Engagement: ${settings.engagement}% engaging
  - Depth: ${settings.depth}% in-depth
  
  # USER'S QUESTION
  ${message}
  
  # INSTRUCTIONS
  - Respond as ${mentor.name} would
  - Keep responses under 3 paragraphs
  - Ask follow-up questions when appropriate
  `;
}

### 3. API Integration

The platform uses Lyzr AI API for generating responses:

- **API Endpoint**: `https://agent-prod.studio.lyzr.ai/v3/inference/chat/`
- **Session Management**: Unique session IDs for each conversation
- **Streaming Responses**: Real-time response streaming for natural interaction

## Fine-Tuning Parameters

The platform allows customization of:

1. **Communication Style**
   - Tone (Casual to Formal)
   - Fun Level (Serious to Entertaining)
   - Seriousness (Light to Intense)
   - Practicality (Theoretical to Actionable)

2. **Learning Preferences**
   - Learning Style
   - Communication Frequency
   - Feedback Style
   - Challenge Level

3. **Content Focus**
   - Industry Focus
   - Preferred Topics
   - Topics to Avoid
   - Response Length

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Lyzr API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-mentor-platform.git
   cd ai-mentor-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Environment setup:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://agent-prod.studio.lyzr.ai/v3/inference/chat/
   LYZR_API_KEY=your_lyzr_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Lyzr API endpoint |
| `LYZR_API_KEY` | Yes | Your Lyzr API key |
| `NEXT_PUBLIC_APP_URL` | No | Base URL of your app (default: http://localhost:3000) |

## Documentation

### Adding a New Mentor

1. Create a new mentor object in `data/mentors.ts`:
   ```typescript
   {
     id: 'unique-id',
     name: 'Mentor Name',
     field: 'Expertise Area',
     avatar: '/path/to/avatar.jpg',
     description: 'Brief description',
     background: 'Detailed background information',
     communicationStyle: 'Description of communication style'
   }
   ```

2. Add their avatar image to the `public` folder

### Customizing Fine-Tuning

Edit the fine-tuning parameters in `lib/fineTuning.ts`:

```typescript
export const fineTuningOptions = {
  tone: {
    min: 0,
    max: 100,
    step: 25,
    default: 50,
    label: 'Formality',
    description: 'Adjust the formality of responses'
  },
  // Add more parameters as needed
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Built with Next.js and React
- Powered by Lyzr AI
- Inspired by modern AI chat applications

## Advanced Implementation Details

### 1. Hydration & Performance

The platform uses a sophisticated hydration strategy to prevent mismatches:

```typescript
// app/client-layout.tsx
'use client';

export default function ClientLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSkeleton />;
  }

  return <>{children}</>;
}
```

### 2. Error Handling & Fallbacks

Robust error handling ensures smooth user experience:

```typescript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, mentorId })
  });
  
  if (!response.ok) throw new Error('Network response was not ok');
  
  // Handle streaming response
  const reader = response.body.getReader();
  // ... process stream
} catch (error) {
  console.error('Chat error:', error);
  return {
    error: 'Failed to get response',
    fallback: `I'm having trouble connecting right now. ` +
             `This demo shows how our AI mentors would respond.`
  };
}
```

### 3. Session Management

Persistent sessions using localStorage:

```typescript
// Save conversation
const saveConversation = (messages) => {
  try {
    localStorage.setItem(`conversation-${mentorId}`, 
      JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save conversation', e);
  }
};

// Load conversation
const loadConversation = () => {
  try {
    const saved = localStorage.getItem(`conversation-${mentorId}`);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load conversation', e);
    return [];
  }
};
```

### Streaming Response

```typescript
const stream = new ReadableStream({
  start(controller) {
    const chunks = responseText.split(" ")
    let index = 0

    const sendChunk = () => {
      if (index < chunks.length) {
        controller.enqueue(chunk)
        setTimeout(sendChunk, 50)
      }
    }
    sendChunk()
  }
})
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 