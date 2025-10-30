import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = 'Asia/Kolkata';

export function startOfMonth(d: Date = new Date()): Date {
  return dayjs(d).tz(TZ).startOf('month').toDate();
}

export function endOfMonth(d: Date = new Date()): Date {
  return dayjs(d).tz(TZ).endOf('month').toDate();
}

export function monthRange(d: Date = new Date()): { start: Date; end: Date } {
  return { start: startOfMonth(d), end: endOfMonth(d) };
}

export function toKolkataISO(d: Date): string {
  return dayjs(d).tz(TZ).toDate().toISOString();
}



