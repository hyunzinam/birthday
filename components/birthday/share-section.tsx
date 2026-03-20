"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function ShareSection() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "클립보드에 복사되었습니다.",
        variant: "success",
      })
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "클립보드에 복사되었습니다.",
        variant: "success",
      })
    }
  }

  const handleKakaoShare = () => {
    if (typeof window === "undefined") return

    const shareUrl = window.location.href
    const shareTextContent = "👉 다른 친구한테도 축하받아볼까? 😏"

    const fallbackToCopy = () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "링크를 복사했어요. 카톡에서 붙여넣기 해주세요.",
          variant: "success",
        })
      })
    }

    if (window.Kakao?.isInitialized?.() && window.Kakao?.Share?.sendDefault) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: "text",
          text: shareTextContent,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        })
      } catch {
        fallbackToCopy()
      }
    } else if (navigator.share) {
      navigator.share({
        title: "생일 롤링페이퍼 공유",
        text: `${shareTextContent}\n\n${shareUrl}`,
        url: shareUrl,
      }).catch(() => {
        fallbackToCopy()
      })
    } else {
      fallbackToCopy()
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-start pt-12 pb-12 px-6 bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-md mx-auto text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          💌 와주셔서 감사합니다 🙂
        </h2>
        <p className="text-muted-foreground text-lg mb-2">
          덕분에 기분 좋게 보내고 있어요
        </p>
        <p className="text-muted-foreground text-lg">
          항상 감사합니다
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleKakaoShare}
            className="w-full h-14 text-base rounded-2xl bg-card border-2 border-transparent hover:border-primary/30 hover:bg-card text-foreground shadow-md flex items-center justify-center"
          >
            📤 카톡으로 공유하기
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleCopyLink}
            className="w-full h-14 rounded-2xl border-0 bg-[#6b4f3f] hover:bg-[#5b4133] text-white text-base shadow-sm flex items-center justify-center"
          >
            🔗 {copied ? "복사완료!" : "링크 복사"}
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
