import {
  ref,
  get,
  set,
  push,
  remove,
  update,
  onValue,
  runTransaction,
  type Unsubscribe,
} from "firebase/database"
import { db } from "@/lib/firebase"

const REACTIONS_PATH = "birthday/reactions"
const MESSAGES_PATH = "birthday/messages"

export interface ReactionCounts {
  celebrate: number
  party: number
  love: number
  funny: number
}

export interface MessageData {
  id: string
  name: string
  content: string
  isAnonymous: boolean
  isPrivate: boolean
  createdAt: Date
  password?: string
}

const DEFAULT_REACTIONS: ReactionCounts = {
  celebrate: 0,
  party: 0,
  love: 0,
  funny: 0,
}

function parseMessage(id: string, data: Record<string, unknown>): MessageData {
  return {
    id,
    name: (data.name as string) ?? "익명",
    content: (data.content as string) ?? "",
    isAnonymous: (data.isAnonymous as boolean) ?? false,
    isPrivate: (data.isPrivate as boolean) ?? false,
    createdAt: data.createdAt
      ? new Date(data.createdAt as string)
      : new Date(),
    password: data.password as string | undefined,
  }
}

export async function getReactionCounts(): Promise<ReactionCounts> {
  const snapshot = await get(ref(db, REACTIONS_PATH))
  const data = snapshot.val()
  if (!data) return DEFAULT_REACTIONS
  return {
    celebrate: data.celebrate ?? 0,
    party: data.party ?? 0,
    love: data.love ?? 0,
    funny: data.funny ?? 0,
  }
}

export async function incrementReaction(type: keyof ReactionCounts): Promise<void> {
  const reactionRef = ref(db, REACTIONS_PATH)
  await runTransaction(reactionRef, (current) => {
    const next = current ?? DEFAULT_REACTIONS
    const key = type as string
    return { ...next, [key]: (next[key] ?? 0) + 1 }
  })
}

export async function getMessages(): Promise<MessageData[]> {
  const snapshot = await get(ref(db, MESSAGES_PATH))
  const data = snapshot.val()
  if (!data) return []
  return Object.entries(data)
    .map(([id, val]) => parseMessage(id, val as Record<string, unknown>))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

export async function createMessage(data: {
  name: string
  content: string
  isAnonymous: boolean
  isPrivate: boolean
  password: string
}): Promise<string> {
  const messagesRef = ref(db, MESSAGES_PATH)
  const newRef = await push(messagesRef, {
    name: data.name,
    content: data.content,
    isAnonymous: data.isAnonymous,
    isPrivate: data.isPrivate,
    createdAt: new Date().toISOString(),
    password: data.password,
  })
  return newRef.key ?? ""
}

export async function deleteMessage(id: string): Promise<void> {
  await remove(ref(db, `${MESSAGES_PATH}/${id}`))
}

export async function updateMessage(id: string, content: string): Promise<void> {
  await update(ref(db, `${MESSAGES_PATH}/${id}`), { content })
}

export function subscribeReactions(
  callback: (counts: ReactionCounts) => void
): Unsubscribe {
  return onValue(ref(db, REACTIONS_PATH), (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      callback(DEFAULT_REACTIONS)
      return
    }
    callback({
      celebrate: data.celebrate ?? 0,
      party: data.party ?? 0,
      love: data.love ?? 0,
      funny: data.funny ?? 0,
    })
  })
}

export function subscribeMessages(
  callback: (messages: MessageData[]) => void
): Unsubscribe {
  return onValue(ref(db, MESSAGES_PATH), (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      callback([])
      return
    }
    const list = Object.entries(data)
      .map(([id, val]) => parseMessage(id, val as Record<string, unknown>))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    callback(list)
  })
}
