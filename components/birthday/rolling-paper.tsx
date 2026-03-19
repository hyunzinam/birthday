"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { X, Pencil, Trash2 } from "lucide-react"

interface Message {
  id: string
  name: string
  content: string
  isAnonymous: boolean
  isPrivate: boolean
  createdAt: Date
  password?: string
}

interface RollingPaperProps {
  messages: Message[]
  onCreateMessage?: (message: {
    name: string
    content: string
    isAnonymous: boolean
    isPrivate: boolean
    password: string
  }) => void | Promise<void> | Promise<void>
  onDeleteMessage?: (messageId: string) => void | Promise<void>
  onUpdateMessage?: (messageId: string, content: string) => void | Promise<void>
}

const BASE_NOTE_LAYOUTS = [
  { rotation: -7, color: "bg-[#f2e3e5]" },
  { rotation: -24, color: "bg-[#ececee]" },
  { rotation: 10, color: "bg-[#eef09a]" },
  { rotation: -10, color: "bg-[#ededee]" },
  { rotation: 22, color: "bg-[#e7e7e8]" },
  { rotation: -8, color: "bg-[#ececee]" },
  { rotation: 1, color: "bg-[#e9e9ea]" },
  { rotation: -25, color: "bg-[#eef09a]" },
  { rotation: 14, color: "bg-[#9abce2]" },
]

function getNoteLayout(index: number, _totalCount: number) {
  if (index < BASE_NOTE_LAYOUTS.length) {
    return { ...BASE_NOTE_LAYOUTS[index], isBase: true as const }
  }
  const baseLayout = BASE_NOTE_LAYOUTS[index % BASE_NOTE_LAYOUTS.length]
  return {
    ...baseLayout,
    isBase: false as const,
  }
}

function formatDateTime(createdAt: Date) {
  const date = new Date(createdAt)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  return `${year}.${month}.${day} ${hour}:${minute}`
}

function formatShortDateTime(createdAt: Date) {
  const date = new Date(createdAt)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  return `${month}.${day} ${hour}:${minute}`
}

function formatShortDate(createdAt: Date) {
  const date = new Date(createdAt)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${month}.${day}`
}

const POST_IT_NAME_MAX_LEN = 5
const MESSAGE_MAX_LENGTH = 200

function truncateName(name: string): string {
  if (name.length <= POST_IT_NAME_MAX_LEN) return name
  return name.slice(0, POST_IT_NAME_MAX_LEN) + "..."
}

type PendingAction = "delete" | "edit" | null

export function RollingPaper({
  messages,
  onCreateMessage,
  onDeleteMessage,
  onUpdateMessage,
}: RollingPaperProps) {
  const publicMessages = useMemo(
    () =>
      messages
        .filter(m => !m.isPrivate)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [messages],
  )
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [isWriteOpen, setIsWriteOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [verifyPassword, setVerifyPassword] = useState("")
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [writeName, setWriteName] = useState("")
  const [writePassword, setWritePassword] = useState("")
  const [writeContent, setWriteContent] = useState("")

  const selectedMessage = useMemo(
    () => publicMessages.find(message => message.id === selectedMessageId) ?? null,
    [publicMessages, selectedMessageId],
  )

  const openWritePopup = () => {
    setWriteName("")
    setWritePassword("")
    setWriteContent("")
    setIsWriteOpen(true)
  }

  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onCreateMessage) return

    if (!writePassword.trim()) {
      toast({
        title: "삭제 시 필요하니 비밀번호를 입력해주세요",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      return
    }
    if (writePassword.length < 4) {
      toast({
        title: "비밀번호는 숫자 4자리로 입력해주세요",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      return
    }
    const content = writeContent.trim()
    if (!content) {
      toast({
        title: "메시지를 입력해주세요",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      return
    }

    const name = writeName.trim()
    try {
      await Promise.resolve(
        onCreateMessage({
          name: name || "익명",
          content,
          isAnonymous: !name,
          isPrivate: false,
          password: writePassword,
        })
      )
      setIsWriteOpen(false)
      toast({ title: "💌 메시지가 잘 전달됐어요", variant: "success" })
    } catch {
      toast({ title: "메시지 전송에 실패했어요. 잠시 후 다시 시도해주세요.", variant: "destructive" })
    }
  }

  const openPasswordVerify = (action: "delete" | "edit") => {
    setPendingAction(action)
    setVerifyPassword("")
  }

  const closeDetail = () => {
    setSelectedMessageId(null)
    setPendingAction(null)
    setVerifyPassword("")
    setIsEditFormOpen(false)
    setEditContent("")
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !pendingAction) return

    const msg = selectedMessage as Message & { password?: string }
    const storedPassword = msg.password ?? ""

    if (!verifyPassword.trim()) {
      toast({
        title: "비밀번호를 입력해주세요",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      return
    }
    if (verifyPassword !== storedPassword) {
      toast({
        title: "비밀번호가 맞지 않아요",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      return
    }

    if (pendingAction === "delete") {
      if (!onDeleteMessage) return
      try {
        await onDeleteMessage(selectedMessage.id)
        closeDetail()
        toast({
          title: "🗑️ 메시지가 삭제되었어요",
          variant: "success",
          duration: 2000,
          hideClose: true,
        })
      } catch {
        // 삭제 실패 토스트는 page에서 표시
      }
      return
    }

    if (pendingAction === "edit") {
      setEditContent(selectedMessage.content)
      setIsEditFormOpen(true)
      setPendingAction(null)
      setVerifyPassword("")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !onUpdateMessage) return

    const content = editContent.trim()
    if (!content) {
      toast({
        title: "메시지를 입력해주세요",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
      return
    }

    try {
      await onUpdateMessage(selectedMessage.id, content)
      closeDetail()
      toast({
        title: "✏️ 메시지가 수정되었어요",
        variant: "success",
        duration: 2000,
        hideClose: true,
      })
    } catch {
      toast({
        title: "수정에 실패했어요. 잠시 후 다시 시도해주세요.",
        variant: "delete-error",
        duration: 2000,
        hideClose: true,
      })
    }
  }

  const slotCount = Math.max(9, publicMessages.length)
  const baseSlots = Array.from({ length: Math.min(9, slotCount) }, (_, i) => i)
  const extraSlots = Array.from({ length: Math.max(0, slotCount - 9) }, (_, i) => i + 9)

  const NoteContent = ({ message }: { message: Message | undefined }) => (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.03) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-9 h-9 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 55%, rgba(0,0,0,0.01) 100%)",
          clipPath: "ellipse(78% 72% at 100% 100%)",
          boxShadow: "none",
        }}
      />
      {message ? (
        <div className="h-full p-3.5 flex flex-col justify-between">
          <p className="text-[15px] leading-snug text-foreground/85 break-words line-clamp-5 mt-1">
            {message.content}
          </p>
          <div className="pt-2 flex items-end justify-between gap-2 text-[11px] leading-tight">
            <p className="text-[#9f80ac]">From {message.isAnonymous ? "익명" : message.name}</p>
            <p className="text-foreground/55">{formatShortDate(message.createdAt)}</p>
          </div>
        </div>
      ) : null}
    </>
  )

  return (
    <section className="px-6 py-10 bg-background overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-md mx-auto"
      >
        <div className="mb-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">💌 생일 롤링페이퍼</h2>
          <p className="text-muted-foreground mt-2">
            벌써 {publicMessages.length}개의 메시지가 도착했어요 🙌
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {baseSlots.map((index) => {
            const layout = BASE_NOTE_LAYOUTS[index]
            const message = publicMessages[index]
            return (
              <motion.div
                key={`note-${index}`}
                initial={{ opacity: 0, scale: 0.95, rotate: layout.rotation }}
                whileInView={{ opacity: 1, scale: 1, rotate: layout.rotation }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.02, rotate: layout.rotation * 0.45, zIndex: 10 }}
                className={`relative w-full min-h-[140px] rounded-[4px] ${layout.color} ring-1 ring-black/8 cursor-pointer overflow-hidden`}
                style={{ opacity: message ? 1 : 0.58 }}
                onClick={() => message && setSelectedMessageId(message.id)}
              >
                <NoteContent message={message} />
              </motion.div>
            )
          })}
        </div>

        {extraSlots.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            {extraSlots.map((index) => {
              const layout = getNoteLayout(index, slotCount)
              const message = publicMessages[index]
              return (
                <motion.div
                  key={`note-extra-${index}`}
                  initial={{ opacity: 0, scale: 0.95, rotate: layout.rotation }}
                  whileInView={{ opacity: 1, scale: 1, rotate: layout.rotation }}
                  viewport={{ once: true }}
                  transition={{ delay: (index - 9) * 0.03 }}
                  whileHover={{ scale: 1.02, rotate: layout.rotation * 0.45, zIndex: 10 }}
                  className={`relative w-full min-h-[140px] rounded-[4px] ${layout.color} ring-1 ring-black/8 cursor-pointer overflow-hidden`}
                  onClick={() => message && setSelectedMessageId(message.id)}
                >
                  <NoteContent message={message} />
                </motion.div>
              )
            })}
          </div>
        ) : null}

        <Button
          type="button"
          onClick={openWritePopup}
          className="w-full mt-10 md:mt-12 h-14 text-base rounded-2xl bg-card border-2 border-transparent hover:border-primary/30 hover:bg-card text-foreground shadow-md"
        >
          💌 한마디 남기기
        </Button>

        {isWriteOpen ? (
          <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] flex items-center justify-center px-4">
            <motion.form
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              onSubmit={handleWriteSubmit}
              className="w-full max-w-3xl rounded-[20px] bg-[#f2f2f3] p-6 md:p-10 ring-1 ring-black/5"
            >
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setIsWriteOpen(false)}
                  className="text-foreground/25 hover:text-foreground/50 transition-colors"
                  aria-label="작성 닫기"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="write-name" className="text-foreground font-medium">
                    닉네임 (선택, 비우면 익명)
                  </Label>
                  <Input
                    id="write-name"
                    value={writeName}
                    onChange={e => setWriteName(e.target.value.slice(0, 5))}
                    onPaste={e => {
                      e.preventDefault()
                      const pasted = e.clipboardData.getData("text").slice(0, 5)
                      setWriteName(prev => (prev + pasted).slice(0, 5))
                    }}
                    placeholder="이름을 입력해주세요"
                    maxLength={5}
                    className="mt-1.5 h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="write-password" className="text-foreground font-medium">
                    비밀번호 <span className="text-red-500/80">*</span>
                  </Label>
                  <Input
                    id="write-password"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={writePassword}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                      setWritePassword(val)
                    }}
                    placeholder="숫자 4자리"
                    className="mt-1.5 h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="write-content" className="text-foreground font-medium">
                    메시지 <span className="text-red-500/80">*</span>
                  </Label>
                  <Textarea
                    id="write-content"
                    value={writeContent}
                    onChange={e => setWriteContent(e.target.value.slice(0, MESSAGE_MAX_LENGTH))}
                    onPaste={e => {
                      e.preventDefault()
                      const pasted = e.clipboardData.getData("text").slice(0, MESSAGE_MAX_LENGTH)
                      setWriteContent(prev => (prev + pasted).slice(0, MESSAGE_MAX_LENGTH))
                    }}
                    placeholder="축하 메시지를 입력해주세요"
                    rows={5}
                    maxLength={MESSAGE_MAX_LENGTH}
                    className="mt-1.5 h-[7.5rem] max-h-[7.5rem] resize-none overflow-y-auto"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground text-right">
                    {writeContent.length}/{MESSAGE_MAX_LENGTH}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button type="submit" className="px-6">
                  남기기
                </Button>
              </div>
            </motion.form>
          </div>
        ) : null}

        {selectedMessage ? (
          <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-3xl rounded-[20px] bg-[#f2f2f3] p-6 md:p-10 ring-1 ring-black/5"
            >
              <div
                className={
                  isEditFormOpen || pendingAction
                    ? "flex items-center justify-between mb-2"
                    : "flex justify-end mb-2"
                }
              >
                {isEditFormOpen ? (
                  <h2 className="text-xl font-semibold text-foreground">수정하기</h2>
                ) : pendingAction ? (
                  <h2 className="text-xl font-semibold text-foreground">
                    작성 시 입력한 비밀번호를 입력해주세요.
                  </h2>
                ) : null}
                <button
                  type="button"
                  onClick={closeDetail}
                  className="text-foreground/25 hover:text-foreground/50 transition-colors ml-auto"
                  aria-label="메시지 닫기"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {pendingAction ? (
                <form onSubmit={handleVerifySubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="verify-password" className="text-foreground font-medium">
                      비밀번호
                    </Label>
                    <Input
                      id="verify-password"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={verifyPassword}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                        setVerifyPassword(val)
                      }}
                      placeholder="숫자 4자리"
                      className="mt-1.5 h-11"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPendingAction(null)
                        setVerifyPassword("")
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#f05650] hover:bg-[#f05650]/90 text-white border-transparent"
                    >
                      {pendingAction === "delete" ? "삭제하기" : "다음"}
                    </Button>
                  </div>
                </form>
              ) : isEditFormOpen ? (
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div>
                    <Textarea
                      id="edit-content"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value.slice(0, MESSAGE_MAX_LENGTH))}
                      onPaste={e => {
                        e.preventDefault()
                        const pasted = e.clipboardData.getData("text").slice(0, MESSAGE_MAX_LENGTH)
                        setEditContent(prev => (prev + pasted).slice(0, MESSAGE_MAX_LENGTH))
                      }}
                      placeholder="메시지를 입력해주세요"
                      rows={5}
                      maxLength={MESSAGE_MAX_LENGTH}
                      className="mt-1.5 h-[7.5rem] max-h-[7.5rem] resize-none overflow-y-auto text-lg"
                    />
                    <p className="mt-1.5 text-sm text-muted-foreground text-right">
                      {editContent.length}/{MESSAGE_MAX_LENGTH}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditFormOpen(false)
                        setEditContent("")
                      }}
                    >
                      취소
                    </Button>
                    <Button type="submit" className="px-6">
                      저장
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="max-h-[50vh] overflow-y-auto pr-1 -mr-1">
                    <p className="text-[22px] md:text-[26px] leading-[1.4] text-foreground whitespace-pre-wrap break-words">
                      {selectedMessage.content}
                    </p>
                  </div>

                  <div className="mt-8 md:mt-10 flex items-end justify-between gap-4 shrink-0">
                    <p className="text-[18px] md:text-[20px] text-[#b08fbe]">
                      From {selectedMessage.isAnonymous ? "익명" : selectedMessage.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openPasswordVerify("edit")}
                          className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                          aria-label="메시지 수정"
                        >
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openPasswordVerify("delete")}
                          className="p-1.5 rounded-md text-red-500/85 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                          aria-label="메시지 삭제"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                      <p className="text-[18px] md:text-[20px] text-foreground/50 shrink-0">
                        {formatDateTime(selectedMessage.createdAt)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        ) : null}
      </motion.div>
    </section>
  )
}
