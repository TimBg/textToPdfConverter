import React from 'react';
import type { PdfHistoryItem } from '../types';

interface HistoryListProps {
  history: PdfHistoryItem[];
  onSelect: (url: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) {
    return <p className="text-gray-400 italic">Conversion history is empty...</p>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2 text-teal-700">Conversion History</h2>

      <div className="flex-1 h-full min-h-0 space-y-2 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.pdfUrl)}
            className="w-full flex flex-col p-4 min-h-[72px] bg-white rounded-xl border border-gray-200 transition-colors hover:bg-gray-100 hover:border-gray-300 cursor-pointer group"
          >
            <div className="text-xs text-gray-600 mb-1">
              {new Date(item.createdAt).toLocaleString()}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-left h-10 flex items-center w-[50%] bg-gray-900 text-white rounded-lg px-3 select-none cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="truncate whitespace-nowrap overflow-hidden w-full font-medium">
                  {item.title}
                </span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="h-10 w-24 min-w-[80px] rounded-r-lg bg-red-500 text-white text-base flex items-center justify-center px-3 focus:outline-none transition-colors hover:bg-red-600 hover:border-red-600 border border-transparent"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};