declare module 'pdf-viewer-reactjs' {
  import { Component } from 'react';

  interface PDFViewerProps {
    document: {
      url: string;
    };
    navbarOnTop?: boolean;
    scale?: number;
    page?: number;
    showToolbar?: boolean;
    showThumbnails?: boolean;
    showBookmarks?: boolean;
    showSearch?: boolean;
    showPaging?: boolean;
    showZoom?: boolean;
    showPresentationMode?: boolean;
    showOpenFile?: boolean;
    showPrint?: boolean;
    showDownload?: boolean;
    showRotate?: boolean;
    showHandTool?: boolean;
    showScrolling?: boolean;
    showSpread?: boolean;
    showProperties?: boolean;
    showFullScreen?: boolean;
    showMoreControls?: boolean;
    showLessControls?: boolean;
  }

  export class PDFViewer extends Component<PDFViewerProps> {}
} 