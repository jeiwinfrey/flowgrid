"use client"

import { Button } from "@/components/ui/button"
import { Forward } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"
import { generateMermaidFromInput } from "@/lib/diagram-generator"

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

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    }

    setMessages([...messages, newMessage])
    const userInput = input.trim()
    setInput("")
    setIsTyping(true)

    // Mock AI response after a short delay
    setTimeout(() => {
      const mermaidCode = generateMermaidFromInput(userInput)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've created a flowchart based on your request. You can see it in the diagram panel on the right. Feel free to ask me to modify it or create a different one!"
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
      
      // Update the mermaid diagram
      if (onMermaidUpdate) {
        onMermaidUpdate(mermaidCode)
      }
    }, 2000)
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
                Start creating beautiful flowcharts with AI assistance. 
                Describe what you need and I'll generate it for you.
              </p>
              <div className="pt-2 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <div className="bg-muted/50 rounded px-3 py-1.5">"Create a login flowchart"</div>
                  <div className="bg-muted/50 rounded px-3 py-1.5">"Show me a payment process"</div>
                  <div className="bg-muted/50 rounded px-3 py-1.5">"Design a user registration flow"</div>
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

