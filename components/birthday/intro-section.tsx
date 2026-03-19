"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface IntroSectionProps {
  onScrollToCelebrate: () => void
  onScrollToRollingPaper: () => void
}

export function IntroSection({ onScrollToCelebrate, onScrollToRollingPaper }: IntroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-md mx-auto"
      >
        <h1 className="text-center text-foreground mb-4">
          <span className="block text-3xl md:text-4xl font-bold">🎂 생일이라서 링크 돌립니다</span>
        </h1>

        <div className="text-center text-muted-foreground mb-8 space-y-1.5">
          <p className="text-lg">축하만 해도 충분 🙌</p>
          <p className="text-lg">대신 그냥 나가면… 조금 서운함 😇</p>
        </div>

        <div className="bg-card rounded-3xl p-4 shadow-md border border-border">
          <div className="bg-card rounded-2xl p-4 pb-8">
            <div className="relative w-full h-[320px] rounded-[16px] overflow-hidden bg-secondary/40">
              <Image
                src="/intro-image.png"
                alt="생일 인트로"
                fill
                className="object-cover object-center"
                sizes="(max-width: 448px) 100vw, 448px"
              />
            </div>
            <div className="mt-5 text-center space-y-2">
              <p className="text-foreground font-medium text-[17px]">3월 20일 생일인사람</p>
              <p className="text-muted-foreground text-sm">사진은 저랑 저희 집 강아지 탱이입니다🐶🎂</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.55 }}
        className="flex flex-col gap-3 w-full max-w-md mx-auto mt-8"
      >
        <Button
          size="lg"
          onClick={onScrollToCelebrate}
          className="w-full h-14 text-base rounded-2xl bg-card border-2 border-transparent hover:border-primary/30 hover:bg-card text-foreground shadow-md"
        >
          🎉 축하 한 번 눌러주기
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onScrollToRollingPaper}
          className="w-full h-14 rounded-2xl border-0 bg-[#6b4f3f] hover:bg-[#5b4133] text-white text-base shadow-sm"
        >
          🟨 롤링페이퍼 구경하기
        </Button>
      </motion.div>
    </section>
  )
}
