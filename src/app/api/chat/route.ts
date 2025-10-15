import { NextRequest, NextResponse } from "next/server"
import { generateFlowchart, ChatMessage } from "@/lib/ai-service"

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

    const result = await generateFlowchart(
      message,
      conversationHistory as ChatMessage[]
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    )
  }
}

