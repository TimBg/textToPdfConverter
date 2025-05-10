import type { PdfHistoryItem } from '../types/index';
import { API_URL, API_KEY } from '../config';

export interface PdfResponse {
  id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
}

export async function createPdf(text: string): Promise<PdfResponse> {
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

  return response.json();
}

export async function downloadPdf(id: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/create-pdf?apiKey=${API_KEY}`);

  if (!response.ok) {
    throw new Error('Помилка при завантаженні PDF');
  }

  return response.blob();
} 