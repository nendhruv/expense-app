import { useMemo } from 'react';
import { parseExpense } from '../utils/parse';

export function useParseExpense(text: string) {
  return useMemo(() => parseExpense(text), [text]);
}



