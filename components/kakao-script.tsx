"use client"

import Script from "next/script"

interface KakaoScriptProps {
  kakaoJsKey: string
}

export function KakaoScript({ kakaoJsKey }: KakaoScriptProps) {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && window.Kakao) {
          window.Kakao.init(kakaoJsKey)
        }
      }}
    />
  )
}
