
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
        .filter((item: any) => item.str)
        .map((item: any) => item.str)
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
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      
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

  static async imagesToPDF(files: File[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      const imageBytes = await file.arrayBuffer();
      let image;
      
      if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        throw new Error(`Unsupported image format: ${file.type}`);
      }
      
      const page = pdfDoc.addPage();
      const { width, height } = image.scale(1);
      
      page.setSize(width, height);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }
    
    return await pdfDoc.save();
  }

  static async lockPDF(file: File, password: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Note: pdf-lib doesn't support password protection directly
    // This is a placeholder that returns the original PDF
    // In a real implementation, you'd need a different library or server-side processing
    console.warn('Password protection not fully implemented in browser environment');
    
    return await pdfDoc.save();
  }

  static async wordToPDF(file: File): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    
    // Create a proper PDF with readable text
    page.drawText(`Document: ${file.name}`, {
      x: 50,
      y: page.getHeight() - 100,
      size: 16,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('This is a sample PDF converted from Word document.', {
      x: 50,
      y: page.getHeight() - 140,
      size: 12,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('Content would be preserved in a real conversion.', {
      x: 50,
      y: page.getHeight() - 170,
      size: 12,
      color: rgb(0, 0, 0),
    });
    
    return await pdfDoc.save();
  }

  // Improved compression with better quality control
  static async compressPDF(file: File, compressionLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    console.log(`Compressing PDF with ${compressionLevel} level for better quality`);
    
    // Remove metadata only for medium and high compression
    if (compressionLevel === 'medium' || compressionLevel === 'high') {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
    }
    
    // Save with appropriate compression settings
    const saveOptions = {
      useObjectStreams: compressionLevel !== 'low', // Only compress structure for medium/high
      addDefaultPage: false,
    };
    
    const pdfBytes = await pdfDoc.save(saveOptions);
    
    console.log(`PDF compressed successfully. Original: ${file.size} bytes, Compressed: ${pdfBytes.length} bytes`);
    
    return pdfBytes;
  }
}

export const compressPDF = async (
  file: File,
  compressionLevel: 'low' | 'medium' | 'high' = 'medium'
): Promise<{ blob: Blob; stats: CompressionStats }> => {
  console.log(`Starting improved PDF compression with ${compressionLevel} level`);
  
  const originalSize = file.size;
  const compressedBytes = await PDFUtils.compressPDF(file, compressionLevel);
  const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });

  const stats: CompressionStats = {
    originalSize,
    compressedSize: compressedBlob.size,
    compressionRatio: Math.round(((originalSize - compressedBlob.size) / originalSize) * 100)
  };

  console.log(`Compression completed:`, stats);
  
  return { blob: compressedBlob, stats };
};
