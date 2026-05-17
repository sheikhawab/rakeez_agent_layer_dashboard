import type { Transcript } from '@/types/call'

/**
 * Sample transcripts for showcase. Most calls share generic stubs;
 * a couple of "featured" call IDs have hand-crafted bilingual flows.
 */

const featuredArabicEnglish: Transcript = {
  id: 'tr-featured-1',
  callId: 'call-az-1',
  segments: [
    {
      speaker: 'agent',
      text: 'السلام عليكم، أهلاً بك في ركيز سيلز. كيف يمكنني مساعدتك اليوم؟',
      language: 'ar',
      startMs: 0,
      endMs: 4200,
    },
    {
      speaker: 'caller',
      text: 'وعليكم السلام. أريد بناء وكيل صوتي ذكي لشركتي.',
      language: 'ar',
      startMs: 4600,
      endMs: 9100,
    },
    {
      speaker: 'agent',
      text: 'تمام. هل تفضل المتابعة بالإنجليزية؟',
      language: 'ar',
      startMs: 9500,
      endMs: 12200,
    },
    {
      speaker: 'caller',
      text: 'Yes, English is fine.',
      language: 'en',
      startMs: 12500,
      endMs: 14100,
    },
    {
      speaker: 'agent',
      text: "Great. Could you tell me a bit about your company and what the agent should do?",
      language: 'en',
      startMs: 14400,
      endMs: 18800,
    },
    {
      speaker: 'caller',
      text: 'We do logistics, mainly. We want callers to be able to book pickups and get status updates.',
      language: 'en',
      startMs: 19200,
      endMs: 27300,
    },
    {
      speaker: 'agent',
      text: 'Understood. Would you like to schedule a meeting with our technical team to discuss this further?',
      language: 'en',
      startMs: 27700,
      endMs: 33500,
    },
    {
      speaker: 'caller',
      text: 'Yes please. Tomorrow morning works for me.',
      language: 'en',
      startMs: 33900,
      endMs: 37200,
    },
  ],
}

const featuredArabicOnly: Transcript = {
  id: 'tr-featured-2',
  callId: 'call-khalid-1',
  segments: [
    {
      speaker: 'agent',
      text: 'السلام عليكم، أهلاً بك. كيف يمكنني خدمتك؟',
      language: 'ar',
      startMs: 0,
      endMs: 3500,
    },
    {
      speaker: 'caller',
      text: 'أريد حجز موعد لاستشارة طبية لعيادتي.',
      language: 'ar',
      startMs: 4000,
      endMs: 8200,
    },
    {
      speaker: 'agent',
      text: 'بالتأكيد. متى يناسبك الوقت؟',
      language: 'ar',
      startMs: 8600,
      endMs: 10900,
    },
    {
      speaker: 'caller',
      text: 'يوم السبت القادم، الساعة العاشرة صباحاً.',
      language: 'ar',
      startMs: 11300,
      endMs: 15400,
    },
    {
      speaker: 'agent',
      text: 'ممتاز. لقد تم تأكيد موعدك. ستصلك رسالة عبر الواتساب بالتفاصيل.',
      language: 'ar',
      startMs: 15800,
      endMs: 21200,
    },
  ],
}

const stubEnglish: Transcript = {
  id: 'tr-stub-en',
  callId: 'call-stub-en',
  segments: [
    {
      speaker: 'agent',
      text: 'Hello, welcome. How can I help you today?',
      language: 'en',
      startMs: 0,
      endMs: 3000,
    },
    {
      speaker: 'caller',
      text: "Hi, I wanted to learn about your services.",
      language: 'en',
      startMs: 3400,
      endMs: 6800,
    },
    {
      speaker: 'agent',
      text: "Of course! We offer custom software, digital marketing, and AI solutions.",
      language: 'en',
      startMs: 7200,
      endMs: 12500,
    },
  ],
}

export const mockTranscripts: Transcript[] = [
  featuredArabicEnglish,
  featuredArabicOnly,
  stubEnglish,
]

export const mockTranscriptsById = new Map(
  mockTranscripts.map((t) => [t.id, t]),
)
