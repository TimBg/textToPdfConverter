import React, { useState } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-4 border rounded-lg mb-4 min-h-[200px]"
        placeholder="Enter text to convert..."
      />
      <button
        type="submit"
        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
      >
        Convert to PDF
      </button>
    </form>
  );
}; 