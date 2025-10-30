import dayjs from 'dayjs';
import { Method } from '../hooks/useExpenseStore';

export type Parsed = {
  amountPaise?: number;
  method?: Method;
  dateISO?: string; // occurredAt
  merchant?: string;
  note?: string;
  category: string;
  rawText: string;
  confidence: number; // 0..1
};

const METHOD_MAP: Record<string, Method> = {
  gpay: 'UPI',
  'google pay': 'UPI',
  phonepe: 'UPI',
  paytm: 'UPI',
  upi: 'UPI',
  cash: 'Cash',
  credit: 'Credit Card',
  'credit card': 'Credit Card',
  debit: 'Debit Card',
  'debit card': 'Debit Card',
  card: 'Credit Card',
  netbanking: 'NetBanking',
  wallet: 'Wallet',
};

const CATEGORY_KEYWORDS: Array<{ keys: RegExp; category: string }> = [
  { keys: /(zomato|swiggy|restaurant|dinner|lunch|food)/i, category: 'Food' },
  { keys: /(uber|ola|petrol|fuel|cab|auto)/i, category: 'Transport' },
  { keys: /(blinkit|bigbasket|grocer|milk|vegg?ie)/i, category: 'Groceries' },
  { keys: /(amazon|flipkart|myntra|ajio|shopping)/i, category: 'Shopping' },
  { keys: /(airtel|jio|wifi|broadband|electricity|bill)/i, category: 'Bills' },
  { keys: /(spotify|netflix|prime|hotstar|yt premium)/i, category: 'Subscriptions' },
  { keys: /(apollo|1mg|pharma|doctor|medicine)/i, category: 'Health' },
];

function parseAmountPaise(text: string): number | undefined {
  // Match ₹ 1,234.50 | rs 123 | 999 etc. Take first occurrence.
  const amountRegex = /(₹|rs\b|rs\.|rs:)?\s*(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/i;
  const match = text.match(amountRegex);
  if (!match) return undefined;
  const numStr = match[2].replace(/,/g, '');
  const value = parseFloat(numStr);
  if (isNaN(value)) return undefined;
  const paise = Math.round(value * 100);
  // Negative if prefixed - or refund keyword present
  const isRefund = /refund/i.test(text) || /^-/.test(match[0]);
  return isRefund ? -paise : paise;
}

function parseMethod(text: string): Method | undefined {
  const tokens = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  for (const t of tokens) {
    if (METHOD_MAP[t]) return METHOD_MAP[t];
  }
  // Two-word combos
  const lower = text.toLowerCase();
  for (const key of Object.keys(METHOD_MAP)) {
    if (key.includes(' ') && lower.includes(key)) return METHOD_MAP[key];
  }
  return undefined;
}

function parseDateISO(text: string): string | undefined {
  const now = dayjs();
  const lower = text.toLowerCase();
  if (/(today)\b/.test(lower)) return now.toISOString();
  if (/(yesterday)\b/.test(lower)) return now.subtract(1, 'day').toISOString();
  // dd/mm or dd-mm
  const dmy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
  if (dmy) {
    const d = parseInt(dmy[1], 10);
    const m = parseInt(dmy[2], 10) - 1;
    const y = dmy[3] ? parseInt(dmy[3], 10) : now.year();
    const candidate = dayjs().year(y).month(m).date(d);
    if (candidate.isValid()) return candidate.toISOString();
  }
  // dd mon
  const mon = text.match(/\b(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i);
  if (mon) {
    const d = parseInt(mon[1], 10);
    const monthStr = mon[2].toLowerCase();
    const monthIndex = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(monthStr);
    const candidate = dayjs().month(monthIndex).date(d);
    if (candidate.isValid()) return candidate.toISOString();
  }
  return undefined;
}

function splitMerchantAndNote(text: string): { merchant?: string; note?: string } {
  const separators = [' - ', ' — ', ' | ', ' ; ', ' note: '];
  for (const sep of separators) {
    const idx = text.toLowerCase().indexOf(sep.trim());
    if (idx >= 0) {
      const [left, right] = text.split(sep);
      return { merchant: left.trim(), note: right?.trim() };
    }
  }
  return { merchant: text.trim() || undefined, note: undefined };
}

function inferCategory(merchant: string | undefined, note: string | undefined): string {
  const blob = `${merchant ?? ''} ${note ?? ''}`;
  for (const rule of CATEGORY_KEYWORDS) {
    if (rule.keys.test(blob)) return rule.category;
  }
  return 'Misc';
}

export function parseExpense(text: string): Parsed {
  const trimmed = text.trim();
  let confidence = 1.0;

  const amountPaise = parseAmountPaise(trimmed);
  if (amountPaise == null) confidence = 0; // amount required to save

  const method = parseMethod(trimmed);
  if (!method && /(gpay|phonepe|paytm|card|debit|credit|netbank)/i.test(trimmed)) confidence -= 0.1;

  const dateISO = parseDateISO(trimmed);
  if (!dateISO && /(\d{1,2}[\/\-]\d{1,2}|yesterday)/i.test(trimmed)) confidence -= 0.1;

  // Remove amount and method tokens to isolate merchant/note
  const cleaned = trimmed
    .replace(/(₹|rs\b|rs\.|rs:)\s*-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\b-?\d+(?:\.\d{1,2})?/gi, '')
    .replace(/\b(gpay|google pay|phonepe|paytm|upi|cash|credit card|debit card|credit|debit|card|netbanking|wallet)\b/gi, '')
    .trim();

  const { merchant, note } = splitMerchantAndNote(cleaned);
  if (!merchant || merchant.length < 2) confidence -= 0.2;

  const category = inferCategory(merchant, note);
  if (category === 'Misc' && /(amazon|zomato|swiggy|uber|flipkart|spotify|netflix)/i.test(trimmed)) confidence -= 0.15;

  return {
    amountPaise: amountPaise ?? undefined,
    method,
    dateISO,
    merchant,
    note,
    category,
    rawText: text,
    confidence: Math.max(0, Math.min(1, confidence)),
  };
}



