"use client"

import { Button } from "@/components/ui/button"
import { Forward } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatPanelProps {
  onMermaidUpdate?: (code: string) => void
}

export function ChatPanel({ onMermaidUpdate }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    }

    const userInput = input.trim()
    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          conversationHistory
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      // Add AI response to messages
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "I've created a flowchart for you."
      }
      
      setMessages(prev => [...prev, aiResponse])
      
      // Update the mermaid diagram if code was generated
      if (data.mermaidCode && onMermaidUpdate) {
        onMermaidUpdate(data.mermaidCode)
      }
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to get response from AI. Please try again.")
      
      // Add error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again."
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat messages - scrollable area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4">
        {messages.length === 0 && !isTyping ? (
          /* Empty state - call to action */
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-md px-4">
              <div className="flex justify-center mb-2">
                <img src="supabase-logo-icon.svg" alt="FlowGrid" width={48} height={48} className="opacity-50" />
              </div>
              <h3 className="text-lg font-semibold">Welcome to FlowGrid</h3>
              <p className="text-sm text-muted-foreground">
                Create any type of diagram with AI assistance. 
                Flowcharts, sequence diagrams, ER diagrams, and more!
              </p>
              <div className="pt-2 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <div className="bg-muted/50 rounded px-3 py-1.5">"Create a login flowchart"</div>
                  <div className="bg-muted/50 rounded px-3 py-1.5">"Show me a sequence diagram for API calls"</div>
                  <div className="bg-muted/50 rounded px-3 py-1.5">"Design an ER diagram for a blog"</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && (
                  <div className="relative flex flex-col items-center shrink-0">             
                    <div className="text-[10px] text-primary mb-1">FG</div>            
                    <div className="w-0.5 flex-1 bg-border/50" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}>
                  {message.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="relative flex flex-col items-center shrink-0">             
                  <div className="text-[10px] text-primary mb-1">FG</div>            
                  <div className="w-0.5 flex-1 bg-border/50" />
                </div>
                <div className="max-w-[80%] rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground animate-pulse">
                  Thinking...
                </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Chat input area - sticky at bottom */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your flowchart..."
            className="min-h-0 py-2 max-h-[200px] overflow-y-auto"
            rows={1}
          />
          <Button 
            variant="outline" 
            className="shrink-0"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Forward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

