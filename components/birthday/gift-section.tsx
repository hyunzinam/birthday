"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Copy, X } from "lucide-react"

const giftOptions = [
  {
    key: "emoticon",
    emoji: "😂",
    label: "이모티콘 하나 던지기",
    description: "가볍게 보내기",
    url: "https://emoticon.kakao.com/",
  },
  {
    key: "gift",
    emoji: "🎁",
    label: "카톡 선물 보내기",
    description: "선물로 마음 전하기",
    url: "https://gift.kakao.com/",
  },
  {
    key: "bonus",
    emoji: "💸",
    label: "생일 보너스 살짝 넣기",
    description: "마음이 더 간다면",
    url: "",
  },
]

export function GiftSection() {
  const [isBonusOpen, setIsBonusOpen] = useState(false)

  const accountInfo = {
    role: "예금주",
    owner: "남현지",
    bank: "국민은행",
    number: "807501-04-214027",
  }

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const copyAccountToClipboard = async () => {
    const copyText = `${accountInfo.bank} ${accountInfo.number} (${accountInfo.owner})`
    try {
      await navigator.clipboard.writeText(copyText)
      return true
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = copyText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    }
  }

  const handleCopyAccount = async () => {
    await copyAccountToClipboard()
    toast({ title: "클립보드에 복사되었습니다.", variant: "success", duration: 2000 })
  }

  const handleGiftOptionClick = (key: string, url: string) => {
    if (key === "bonus") {
      setIsBonusOpen(true)
      return
    }
    openLink(url)
  }

  return (
    <section className="flex flex-col items-center pt-12 pb-20 px-6 bg-gradient-to-b from-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-md mx-auto text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          🎁 마음을 조금 더 표현하고 싶다면
        </h2>
        <p className="text-muted-foreground text-lg mb-2">
          이런 방법도 있어요 🙂
        </p>
        <p className="text-muted-foreground text-lg">
          그냥 넘어가셔도 괜찮습니다 🙌
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-3">
        {giftOptions.map((option, index) => (
          <motion.div
            key={option.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              size="lg"
              className="w-full h-14 text-base rounded-2xl justify-start gap-4 bg-card border-2 border-transparent hover:border-primary/30 hover:bg-card text-foreground shadow-md"
              onClick={() => handleGiftOptionClick(option.key, option.url)}
            >
              <span className="text-2xl">{option.emoji}</span>
              <div className="text-left">
                <p className="font-semibold text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {isBonusOpen ? (
        <div className="fixed inset-0 z-50 bg-black/15 flex items-center justify-center px-4">
          <div className="w-full max-w-[360px] rounded-2xl bg-[#f2f2f3] p-5 ring-1 ring-black/5">
            <div className="relative min-h-[3.5rem] flex items-end mb-4">
              <button
                type="button"
                onClick={() => setIsBonusOpen(false)}
                className="absolute top-0 right-0 p-1 -m-1 text-foreground/30 hover:text-foreground/55 transition-colors"
                aria-label="계좌 정보 닫기"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-between w-full text-foreground font-medium text-sm">
                <span>{accountInfo.role}</span>
                <span>{accountInfo.owner}</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#e8e8ea] px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-foreground/45 text-xs leading-none">{accountInfo.bank}</p>
                <p className="text-foreground/90 text-lg font-semibold tracking-wide mt-1 leading-none">
                  {accountInfo.number}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                className="inline-flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                aria-label="계좌번호 복사"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
