"use client"

import { motion } from "framer-motion"
import { PartyPopper, MessageSquare } from "lucide-react"

interface StatsSectionProps {
  totalReactions: number
  totalMessages: number
}

export function StatsSection({ totalReactions, totalMessages }: StatsSectionProps) {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-accent/20 to-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          참여 현황
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 text-center shadow-md border border-border"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <PartyPopper className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalReactions}</p>
            <p className="text-sm text-muted-foreground">축하</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 text-center shadow-md border border-border"
          >
            <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalMessages}</p>
            <p className="text-sm text-muted-foreground">메시지</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
