export interface PdfHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  pdfUrl: string;
}

export interface ApiError {
  message: string;
  code: string;
} 