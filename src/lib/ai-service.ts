export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface AIResponse {
  mermaidCode: string
  message: string
}

const SYSTEM_PROMPT = `You are FlowGrid AI, an expert assistant specialized in creating all types of diagrams using Mermaid syntax.

Your primary role is to:
1. Have a conversation with users to understand their diagram needs
2. Ask clarifying questions before generating diagrams
3. Generate accurate, well-structured Mermaid code based on gathered requirements
4. Help users refine and modify their diagrams iteratively

Supported Mermaid diagram types:
- **Flowcharts** (graph TD/LR): Process flows, algorithms, decision trees
- **Sequence Diagrams** (sequenceDiagram): API interactions, user flows, system communications
- **Class Diagrams** (classDiagram): Object-oriented design, database schemas
- **State Diagrams** (stateDiagram-v2): State machines, lifecycle flows
- **Entity Relationship Diagrams** (erDiagram): Database relationships, data models
- **User Journey** (journey): User experience flows
- **Gantt Charts** (gantt): Project timelines, schedules
- **Pie Charts** (pie): Data distribution
- **Requirement Diagrams** (requirementDiagram): Requirements analysis
- **Gitgraph** (gitGraph): Git branching strategies
- **Mindmaps** (mindmap): Brainstorming, concept mapping
- **Timeline** (timeline): Historical events, roadmaps
- **Quadrant Charts** (quadrantChart): Priority matrices, analysis

IMPORTANT WORKFLOW - Follow these steps:

**Step 1: Understand & Clarify**
When a user first requests a diagram:
1. Acknowledge their request warmly
2. Identify the most suitable diagram type(s) for their needs
3. Ask 2-3 specific clarifying questions to understand:
   - Key components/entities involved
   - Main flows or relationships they want to show
   - Level of detail needed (high-level overview vs detailed)
   - Any specific elements they want included/excluded
4. DO NOT generate the diagram yet - wait for their answers

**Step 2: Confirm & Generate**
After receiving clarification:
1. Briefly summarize what you'll create
2. Generate the Mermaid code wrapped in \`\`\`mermaid code blocks
3. Explain the diagram structure and key elements
4. Ask if they'd like any modifications

**Step 3: Iterate & Refine**
When users request changes:
1. Acknowledge the requested changes
2. Generate the updated diagram immediately
3. Highlight what was changed
4. Ask if further refinements are needed

Guidelines for creating diagrams:
- Choose the most appropriate diagram type for the user's needs
- Use clear, concise labels and descriptions
- Follow best practices for each diagram type
- Keep diagrams clean, organized, and easy to understand
- Use proper Mermaid syntax for the specific diagram type
- Add meaningful relationships, connections, and annotations
- Break complex diagrams into manageable sections

Example Flowchart:
\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C{Decision?}
    C -->|Yes| D[Action A]
    C -->|No| E[Action B]
    D --> F[End]
    E --> F
\`\`\`

Example Sequence Diagram:
\`\`\`mermaid
sequenceDiagram
    participant User
    participant API
    participant Database
    User->>API: Request Data
    API->>Database: Query
    Database-->>API: Results
    API-->>User: Response
\`\`\`

Example ER Diagram:
\`\`\`mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
\`\`\`

REMEMBER: 
- Always ask clarifying questions BEFORE generating the first diagram
- Be conversational and friendly
- If the request is already very detailed, you may skip some questions and proceed
- For modification requests, generate the updated diagram immediately
- Keep responses concise but informative`

async function callAI(
  messages: { role: string; content: string }[]
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "FlowGrid",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}

async function validateMermaidSyntax(code: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Import mermaid dynamically to avoid SSR issues
    const mermaid = (await import("mermaid")).default
    
    // Try to parse the mermaid code
    await mermaid.parse(code)
    return { valid: true }
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : "Invalid Mermaid syntax"
    }
  }
}

export async function generateFlowchart(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  try {
    // Initial AI call
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ]
    
    let aiMessage = await callAI(messages)
    
    // Extract Mermaid code from the response
    let mermaidMatch = aiMessage.match(/```mermaid\n([\s\S]*?)\n```/)
    let mermaidCode = mermaidMatch ? mermaidMatch[1].trim() : ""

    // If Mermaid code was generated, validate it
    if (mermaidCode) {
      const validation = await validateMermaidSyntax(mermaidCode)
      
      // If invalid, ask AI to fix it (max 2 retry attempts)
      let retryCount = 0
      const maxRetries = 2
      
      while (!validation.valid && retryCount < maxRetries) {
        retryCount++
        
        console.log(`Mermaid syntax error detected (attempt ${retryCount}/${maxRetries}):`, validation.error)
        
        // Ask AI to fix the error
        const fixMessages = [
          ...messages,
          { role: "assistant", content: aiMessage },
          { 
            role: "user", 
            content: `There's a syntax error in the Mermaid code: "${validation.error}". Please fix the Mermaid diagram and provide the corrected version. Make sure the syntax is valid.`
          }
        ]
        
        aiMessage = await callAI(fixMessages)
        
        // Extract the fixed Mermaid code
        mermaidMatch = aiMessage.match(/```mermaid\n([\s\S]*?)\n```/)
        mermaidCode = mermaidMatch ? mermaidMatch[1].trim() : ""
        
        if (mermaidCode) {
          const newValidation = await validateMermaidSyntax(mermaidCode)
          if (newValidation.valid) {
            console.log("Mermaid syntax fixed successfully!")
            break
          } else {
            validation.error = newValidation.error
          }
        }
      }
      
      // If still invalid after retries, log but continue (let user see the error)
      if (!validation.valid) {
        console.error("Failed to fix Mermaid syntax after retries:", validation.error)
      }
    }

    // Remove the mermaid code block from the message to get clean text
    const cleanMessage = aiMessage
      .replace(/```mermaid\n[\s\S]*?\n```/g, "")
      .trim()

    return {
      mermaidCode,
      message: cleanMessage || "I've created a diagram for you based on your request."
    }
  } catch (error) {
    console.error("AI Service Error:", error)
    throw new Error("Failed to generate diagram. Please try again.")
  }
}

