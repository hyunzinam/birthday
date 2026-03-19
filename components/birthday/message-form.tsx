"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, User, MessageSquare, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface MessageFormProps {
  onSubmit: (message: {
    name: string
    content: string
    isAnonymous: boolean
    isPrivate: boolean
  }) => void
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onSubmit({
      name: isAnonymous ? "익명" : (name.trim() || "익명"),
      content: content.trim(),
      isAnonymous,
      isPrivate,
    })
    
    setContent("")
    setName("")
    setIsAnonymous(false)
    setIsPrivate(false)
    setIsSubmitting(false)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-4"
          >
            <MessageSquare className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            메시지 남기기
          </h2>
          <p className="text-muted-foreground">
            생일 축하 메시지를 남겨주세요!
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-6 shadow-lg border border-border"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-foreground">
                <User className="w-4 h-4" />
                이름 (선택)
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                disabled={isAnonymous}
                className="bg-input"
              />
            </div>

            <div>
              <Label htmlFor="content" className="flex items-center gap-2 mb-2 text-foreground">
                <MessageSquare className="w-4 h-4" />
                메시지
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="축하 메시지를 입력하세요..."
                rows={4}
                required
                className="bg-input resize-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  익명으로 남기기
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                />
                <Label htmlFor="private" className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1">
                  {isPrivate ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  나만 보기 (비공개)
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!content.trim() || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "남기는 중..." : "남기기"}
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
