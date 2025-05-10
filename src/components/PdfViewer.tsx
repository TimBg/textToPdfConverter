import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect, memo } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
}

const PageInputForm = memo(({ 
  onSubmit, 
  numPages 
}: { 
  onSubmit: (page: number) => void;
  numPages: number;
}) => {
  const [inputPage, setInputPage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const page = parseInt(inputPage);
    if (isNaN(page) || page < 1 || page > numPages) {
      return;
    }

    onSubmit(page);
    setInputPage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        placeholder={`1-${numPages}`}
        className="w-20 h-10 px-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none"
      >
        Go
      </button>
    </form>
  );
});

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setPageNumber(1);
  }, [url]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#525659] [&_*]:!box-content [&_*]:!border-0 [&_*]:!border-transparent px-4">
      <div className="flex flex-col items-center p-4 min-h-full">
        <div className="flex-1 max-w-[794px]">
          <Document 
            file={url}
            className="shadow-2xl"
            onLoadSuccess={onDocumentLoadSuccess}
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
              cMapPacked: true,
              standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
            }}
          >
            <Page 
              pageNumber={pageNumber} 
              width={794}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="bg-white"
              scale={1.0}
            />
          </Document>
        </div>
        {numPages && (
          <div className="flex flex-col items-center gap-4 mt-4 text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              >
                Previous
              </button>
              <PageInputForm 
                onSubmit={setPageNumber}
                numPages={numPages}
              />
              <button
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              >
                Next
              </button>
            </div>
            <span>
              Page {pageNumber} of {numPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;

