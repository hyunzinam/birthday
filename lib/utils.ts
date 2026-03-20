import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** HTML 태그를 제거하여 사용자 입력을 안전하게 표시 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}
