import { ulid } from 'ulid';

export function generateId(): string {
  return ulid();
}

export function nowISO(): string {
  return new Date().toISOString();
}



