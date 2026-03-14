import { useMemo, useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Bot, MessageSquare, SendHorizontal, Sparkles, X } from 'lucide-react'
import { askChatbot } from '../services/api'

const defaultMessages = [
  { id: 'u1', role: 'user', text: 'Is there an emergency near Gate B?' },
  {
    id: 'a1',
    role: 'assistant',
    text: 'No emergency has been officially reported. The event is running normally.',
  },
]

function TypingDots() {
  return (
    <div
      className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-sm px-4 py-3"
      style={{
        background: 'linear-gradient(120deg, #eff6ff, #eef2ff)',
        border: '1px solid rgba(148,163,184,0.18)',
      }}
    >
      <div className="flex gap-1">
        <span className="typing-dot h-2 w-2 rounded-full bg-blue-500" />
        <span className="typing-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span className="typing-dot h-2 w-2 rounded-full bg-teal-500" />
      </div>
      <span className="text-xs text-slate-700">AI thinking…</span>
    </div>
  )
}

function Chatbot({ open, onToggle }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(defaultMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const typing = useMemo(() => open && isTyping, [open, isTyping])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async () => {
    if (!input.trim()) {
      return
    }

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setIsTyping(true)
    try {
      const response = await askChatbot(userMsg.text)
      const aiMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: response.answer || 'No emergency has been officially reported.',
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const fallback = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: 'AI service is temporarily unavailable. Please verify with command center staff.',
      }
      setMessages((prev) => [...prev, fallback])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-24 z-30 flex h-12 items-center gap-2 rounded-full px-4 text-white transition-all duration-200"
        style={{
          background: 'linear-gradient(110deg, #2563eb, #6366f1)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 18px rgba(37,99,235,0.18)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-semibold">SafeCrowd AI</span>
      </Motion.button>

      <AnimatePresence>
        {open ? (
          <Motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="fixed bottom-22 right-4 z-40 w-[92vw] max-w-sm rounded-2xl p-4 sm:right-6"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
              border: '1px solid rgba(148,163,184,0.18)',
              boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className="rounded-full p-2"
                style={{
                  background: 'linear-gradient(120deg, rgba(37,99,235,0.1), rgba(99,102,241,0.08))',
                  border: '1px solid rgba(148,163,184,0.16)',
                }}
              >
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-['Orbitron',sans-serif] text-sm font-bold text-slate-900">
                  SafeCrowd AI Assistant
                </p>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-teal-500" />
                  <p className="text-[10px] text-slate-600">Online · Fake News Verification</p>
                </div>
              </div>
              <button type="button" onClick={onToggle} className="rounded-lg p-1 transition-all duration-200 hover:bg-slate-100">
                <X className="h-3.5 w-3.5 text-slate-700" />
              </button>
            </div>

            <div className="mb-3 h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

            <div
              className="neon-scroll mb-3 h-56 space-y-2 overflow-auto rounded-xl p-3"
              style={{ background: 'rgba(248,250,252,0.96)', border: '1px solid rgba(148,163,184,0.16)' }}
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <Motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                      message.role === 'user' ? 'ml-auto rounded-tr-sm' : 'rounded-tl-sm'
                    }`}
                    style={
                      message.role === 'user'
                        ? {
                            background: 'linear-gradient(110deg, #2563eb, #6366f1)',
                            border: '1px solid rgba(37,99,235,0.16)',
                            color: '#ffffff',
                          }
                        : {
                            background: 'linear-gradient(110deg, #eff6ff, #f0fdfa)',
                            border: '1px solid rgba(148,163,184,0.16)',
                            color: '#0f172a',
                          }
                    }
                  >
                    {message.text}
                  </Motion.div>
                ))}
              </AnimatePresence>
              {typing ? <TypingDots /> : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crowd status…"
                className="w-full rounded-xl px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500"
                style={{
                  background: 'rgba(255,255,255,0.94)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(37,99,235,0.35)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(148,163,184,0.2)'
                }}
              />
              <Motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                className="rounded-xl px-3"
                style={{
                  background: 'linear-gradient(110deg, #2563eb, #6366f1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 16px rgba(37,99,235,0.18)',
                }}
              >
                <SendHorizontal className="h-4 w-4 text-white" />
              </Motion.button>
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Chatbot