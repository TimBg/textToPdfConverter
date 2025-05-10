import type { PdfHistoryItem } from '../types/index';
import { API_URL, API_KEY } from '../config';

export interface PdfResponse {
  id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
}

const HISTORY_KEY = 'pdf_history';

export function getPdfHistory(): PdfHistoryItem[] {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function addToHistory(item: PdfHistoryItem): void {
  const history = getPdfHistory();
  history.unshift(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export async function createPdf(text: string): Promise<PdfResponse> {
  try {
    const response = await fetch(`${API_URL}/create-pdf?apiKey=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PDF');
    }

    const id = Date.now().toString();
    const title = text.slice(0, 50) + (text.length > 50 ? '...' : '');
    const createdAt = new Date().toISOString();
    
    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);

    const result = {
      id,
      title,
      pdfUrl,
      createdAt
    };
    
    addToHistory(result);

    return result;
  } catch (error) {
    throw error;
  }
}