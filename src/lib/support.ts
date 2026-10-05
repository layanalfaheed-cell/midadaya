import type { Dict } from './i18n'

type AnswerKey = keyof Dict['support']['answers']

// Keyword-based auto-reply. A later milestone swaps this for an AI-backed support agent + ticketing.
const rules: { key: AnswerKey; words: string[] }[] = [
  { key: 'greet', words: ['السلام', 'سلام', 'مرحب', 'اهلا', 'salam', 'assalam', 'hello', 'hi', 'halo', 'hai'] },
  { key: 'thanks', words: ['شكر', 'جزاك', 'thank', 'thanks', 'terima kasih', 'makasih'] },
  { key: 'sign', words: ['اشار', 'إشار', 'صم', 'بكم', 'sign', 'deaf', 'isyarat', 'tuli'] },
  { key: 'api', words: ['api', 'مفتاح', 'مطور', 'key', 'developer', 'kunci', 'pengembang'] },
  { key: 'error', words: ['خطا', 'خطأ', 'بلاغ', 'ابلاغ', 'إبلاغ', 'mistake', 'error', 'wrong', 'report', 'salah', 'lapor'] },
  { key: 'status', words: ['تحقق', 'معتمد', 'حالة', 'مراجع', 'verif', 'status', 'review', 'tinjau'] },
  { key: 'search', words: ['بحث', 'ابحث', 'search', 'find', 'cari'] },
]

export function autoReply(text: string, t: Dict): string {
  const q = text.toLowerCase()
  const hit = rules.find((r) => r.words.some((w) => q.includes(w)))
  return t.support.answers[hit?.key ?? 'default']
}
