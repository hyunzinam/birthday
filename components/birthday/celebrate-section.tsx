"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PartyPopper, Heart, Laugh, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Reaction {
  type: string
  emoji: string
  label: string
  icon: React.ElementType
}

const reactions: Reaction[] = [
  { type: "celebrate", emoji: "🎉", label: "축하해요!", icon: PartyPopper },
  { type: "party", emoji: "🥳", label: "생일축하!!", icon: Sparkles },
  { type: "love", emoji: "💖", label: "오래 사세요", icon: Heart },
  { type: "funny", emoji: "😂", label: "웃김", icon: Laugh },
]

interface CelebrateSectionProps {
  onReaction: (type: string) => void
  reactionCounts: Record<string, number>
}

interface Confetti {
  id: number
  dx: number
  dy: number
  color: string
}

export function CelebrateSection({ onReaction, reactionCounts }: CelebrateSectionProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [clickedButton, setClickedButton] = useState<string | null>(null)

  const handleClick = (type: string) => {
    onReaction(type)
    setClickedButton(type)
    toast({
      title: "🎉 축하가 전달됐어요!",
    })

    const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3', '#FF9F43', '#A29BFE']
    const newConfetti = Array.from({ length: 36 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 36 + Math.random() * 0.3
      const speed = 120 + Math.random() * 80
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    })
    setConfetti(prev => [...prev, ...newConfetti])
    
    // Remove confetti after animation
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)))
    }, 2000)
    
    setTimeout(() => setClickedButton(null), 300)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-background to-secondary/30">
      {/* Confetti - 전체 화면 앞에서 팡! */}
      <div className="pointer-events-none fixed inset-0 z-[100]">
        <AnimatePresence>
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              initial={{
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: c.dx - 6,
                y: c.dy - 6,
                scale: [0, 1.2, 1],
                rotate: 360,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: c.color }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
      >
        🎉 축하 한 번 남기고 가세요
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-center mb-10"
      >
        가볍게 눌러주면 충분합니다 🙌
        <br />
        부담 없이 하나만 눌러주세요
      </motion.p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {reactions.map((reaction, index) => (
          <motion.button
            key={reaction.type}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(reaction.type)}
            className={`
              relative p-6 rounded-2xl bg-card shadow-md border-2 border-transparent
              hover:border-primary/30 hover:shadow-lg transition-all duration-200
              flex flex-col items-center gap-3
              ${clickedButton === reaction.type ? 'bg-primary/10' : ''}
            `}
          >
            <span className="text-4xl">{reaction.emoji}</span>
            <span className="font-medium text-foreground">{reaction.label}</span>
            {reactionCounts[reaction.type] > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full min-w-[24px]"
              >
                {reactionCounts[reaction.type]}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-muted-foreground"
      >
        <p className="text-sm">
          🎉 지금까지 {Object.values(reactionCounts).reduce((a, b) => a + b, 0)}명이 축하해줬어요
        </p>
      </motion.div>
    </section>
  )
}
