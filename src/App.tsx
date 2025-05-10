import { useState } from 'react';
import { createPdf } from './services/pdfApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TextInput } from './components/TextInput';
import PdfViewer from './components/PdfViewer.tsx';
import { HistoryList } from './components/HistoryList';
import type { PdfHistoryItem } from './types';

export default function App() {
  const [history, setHistory] = useLocalStorage<PdfHistoryItem[]>('pdfHistory', []);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      const item = await createPdf(text);

      const response = await fetch(item.pdfUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const itemWithData = { ...item, pdfUrl: base64 };

      setHistory([itemWithData, ...history]);
      setCurrentUrl(base64);
    } catch (e) {
      setError('Failed to create PDF, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (url: string) => setCurrentUrl(url);

  const handleDelete = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
    if (currentUrl && history.find((h) => h.id === id)?.pdfUrl === currentUrl) {
      setCurrentUrl(null);
    }
  };

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-gray-100 via-white to-teal-50">
      <div className="flex-1 flex flex-col h-full min-h-0 bg-white/90 border-r border-gray-200 shadow-md">
        <div className="p-8">
          <TextInput onSubmit={handleConvert} />
        </div>
        <div className="flex-1 min-h-0 p-8 pt-0">
          <HistoryList history={history} onSelect={handleSelect} onDelete={handleDelete} />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center min-w-0 bg-gradient-to-br from-white to-teal-50">
        {currentUrl ? (
          <PdfViewer url={currentUrl} />
        ) : (
          <span className="text-gray-400 text-lg flex items-center justify-center w-full h-full">
            Select or create a PDF to view...
          </span>
        )}
      </div>
    </main>
  );
}
