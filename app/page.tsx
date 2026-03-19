"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { IntroSection } from "@/components/birthday/intro-section"
import { CelebrateSection } from "@/components/birthday/celebrate-section"
import { RollingPaper } from "@/components/birthday/rolling-paper"
import { GiftSection } from "@/components/birthday/gift-section"
import { ShareSection } from "@/components/birthday/share-section"
import { toast } from "@/hooks/use-toast"
import {
  subscribeReactions,
  subscribeMessages,
  incrementReaction,
  createMessage,
  deleteMessage,
  updateMessage,
  type MessageData,
  type ReactionCounts,
} from "@/lib/birthday-db"

export default function BirthdayPage() {
  const celebrateRef = useRef<HTMLDivElement>(null)
  const rollingPaperRef = useRef<HTMLDivElement>(null)

  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    celebrate: 0,
    party: 0,
    love: 0,
    funny: 0,
  })
  const [messages, setMessages] = useState<MessageData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubReactions = subscribeReactions(setReactionCounts)
    const unsubMessages = subscribeMessages(setMessages)
    setIsLoading(false)
    return () => {
      unsubReactions()
      unsubMessages()
    }
  }, [])

  const scrollToCelebrate = useCallback(() => {
    celebrateRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const scrollToRollingPaper = useCallback(() => {
    rollingPaperRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleReaction = useCallback((type: string) => {
    incrementReaction(type as keyof ReactionCounts).catch(() => {
      toast({ title: "축하 전달에 실패했어요. 잠시 후 다시 시도해주세요.", variant: "destructive" })
    })
  }, [])

  const handleMessageSubmit = useCallback(
    async (newMessage: {
      name: string
      content: string
      isAnonymous: boolean
      isPrivate: boolean
      password: string
    }) => {
      try {
        await createMessage(newMessage)
        setTimeout(() => {
          rollingPaperRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 300)
      } catch (err) {
        toast({ title: "메시지 전송에 실패했어요. 잠시 후 다시 시도해주세요.", variant: "destructive" })
        throw err
      }
    },
    []
  )

  const handleMessageDelete = useCallback(async (messageId: string) => {
    try {
      await deleteMessage(messageId)
    } catch {
      toast({
        title: "삭제에 실패했어요. 잠시 후 다시 시도해주세요.",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      throw new Error("삭제 실패")
    }
  }, [])

  const handleMessageUpdate = useCallback(
    async (messageId: string, content: string) => {
      try {
        await updateMessage(messageId, content)
      } catch {
        toast({
          title: "수정에 실패했어요. 잠시 후 다시 시도해주세요.",
          variant: "delete-error",
          duration: 2000,
          hideClose: true,
        })
        throw new Error("수정 실패")
      }
    },
    []
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Intro Section */}
      <IntroSection 
        onScrollToCelebrate={scrollToCelebrate}
        onScrollToRollingPaper={scrollToRollingPaper}
      />

      {/* Celebrate Section */}
      <div ref={celebrateRef}>
        <CelebrateSection 
          onReaction={handleReaction}
          reactionCounts={reactionCounts}
        />
      </div>

      {/* Rolling Paper Section */}
      <div ref={rollingPaperRef}>
        <RollingPaper
          messages={messages}
          onCreateMessage={handleMessageSubmit}
          onDeleteMessage={handleMessageDelete}
          onUpdateMessage={handleMessageUpdate}
        />
      </div>

      {/* Gift Section */}
      <GiftSection />

      {/* Share Section */}
      <ShareSection />
    </main>
  )
}
