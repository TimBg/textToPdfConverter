import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

interface TextConverterProps {
  onConvert: (pdfUrl: string) => void;
}

export const TextConverter: React.FC<TextConverterProps> = ({ onConvert }) => {
  const [text, setText] = useState('');

  const handleConvert = () => {
    if (!text.trim()) return;

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    
    const pdfUrl = doc.output('datauristring');
    onConvert(pdfUrl);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2 text-teal-700">Text to PDF Converter</h2>
      
      <div className="flex-1 min-h-0">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-full p-4 bg-white rounded-lg resize-none focus:outline-none focus:ring-0"
        />
      </div>

      <button
        onClick={handleConvert}
        disabled={!text.trim()}
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        Convert to PDF
      </button>
    </div>
  );
}; 