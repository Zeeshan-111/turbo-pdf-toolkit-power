
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
console.log('PDF.js worker configured with .mjs version');

export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

// Export PDFUtils class for compatibility with existing code
export class PDFUtils {
  static async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  }

  static async extractText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item): item is { str: string } => 'str' in item)
        .map(item => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }

  static async pdfToImages(file: File, format: 'jpeg' | 'png' = 'jpeg'): Promise<string[]> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const images: string[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get 2D context from canvas');
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      
      const dataUrl = canvas.toDataURL(`image/${format}`, 0.8);
      images.push(dataUrl);
    }
    
    return images;
  }

  static async splitPDF(file: File, pageNumbers: number[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();
    
    const pages = await newPdfDoc.copyPages(pdfDoc, pageNumbers.map(num => num - 1));
    pages.forEach(page => newPdfDoc.addPage(page));
    
    return await newPdfDoc.save();
  }

  static async mergePDFs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  }
}

export const compressPDF = async (
  file: File,
  compressionLevel: 'low' | 'medium' | 'high' = 'medium'
): Promise<{ blob: Blob; stats: CompressionStats }> => {
  console.log(`Starting PDF compression with ${compressionLevel} level`);
  console.log(`Original file size: ${(file.size / 1024).toFixed(2)} KB`);
  
  const originalSize = file.size;
  let compressedBlob: Blob;
  
  try {
    // Try ultra-aggressive compression first
    compressedBlob = await ultraAggressiveCompress(file, compressionLevel);
    console.log(`Ultra-aggressive compression completed. Size: ${(compressedBlob.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.warn('Ultra-aggressive compression failed, trying alternative method:', error);
    // Fallback to alternative compression
    compressedBlob = await alternativeCompress(file, compressionLevel);
    console.log(`Alternative compression completed. Size: ${(compressedBlob.size / 1024).toFixed(2)} KB`);
  }

  const stats: CompressionStats = {
    originalSize,
    compressedSize: compressedBlob.size,
    compressionRatio: Math.round(((originalSize - compressedBlob.size) / originalSize) * 100)
  };

  console.log(`PDF compression completed with ${compressionLevel} level`);
  console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`Compressed size: ${(compressedBlob.size / 1024).toFixed(2)} KB`);
  console.log(`Compression ratio: ${stats.compressionRatio}%`);

  return { blob: compressedBlob, stats };
};

const ultraAggressiveCompress = async (file: File, compressionLevel: string): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  console.log(`PDF loaded with ${pdf.numPages} pages`);
  
  // Create new PDF document
  const newPdfDoc = await PDFDocument.create();
  
  // Compression settings based on level
  const settings = getCompressionSettings(compressionLevel);
  console.log(`Using compression settings:`, settings);
  
  // Process each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    console.log(`Processing page ${pageNum}/${pdf.numPages} with ultra-aggressive compression`);
    
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: settings.scale });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Fill with white background for better compression
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to ultra-compressed JPEG
    const imageDataUrl = canvas.toDataURL('image/jpeg', settings.quality);
    const imageBytes = dataURLToBytes(imageDataUrl);
    
    // Embed image in new PDF
    const image = await newPdfDoc.embedJpg(imageBytes);
    const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
    
    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
    
    console.log(`Page ${pageNum} ultra-compressed and added to PDF`);
  }
  
  // Remove metadata for additional compression
  newPdfDoc.setTitle('');
  newPdfDoc.setAuthor('');
  newPdfDoc.setSubject('');
  newPdfDoc.setCreator('');
  newPdfDoc.setProducer('');
  
  console.log('Generating final ultra-compressed PDF...');
  
  // Generate PDF with maximum compression
  const pdfBytes = await newPdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

const alternativeCompress = async (file: File, compressionLevel: string): Promise<Blob> => {
  console.log('Using alternative compression method');
  
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Remove metadata
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setCreator('');
  pdfDoc.setProducer('');
  
  // Save with compression options
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

const getCompressionSettings = (level: string) => {
  switch (level) {
    case 'low':
      return { quality: 0.7, scale: 0.9 };
    case 'medium':
      return { quality: 0.4, scale: 0.8 };
    case 'high':
      return { quality: 0.2, scale: 0.6 };
    default:
      return { quality: 0.4, scale: 0.8 };
  }
};

const dataURLToBytes = (dataURL: string): Uint8Array => {
  const base64 = dataURL.split(',')[1];
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes;
};
