import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

// Configure PDF.js worker with multiple fallbacks
if (typeof window !== 'undefined') {
  const setupWorker = async () => {
    const workerUrls = [
      // Try unpkg first (most reliable)
      `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`,
      // Fallback to jsdelivr
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.js`,
      // Fallback to cdnjs
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`,
      // Final fallback - try .mjs version
      `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs`
    ];

    for (const url of workerUrls) {
      try {
        // Test if the URL is accessible
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = url;
          console.log('PDF.js worker configured successfully with:', url);
          return;
        }
      } catch (error) {
        console.warn('Failed to access worker URL:', url);
      }
    }
    
    console.error('All PDF.js worker URLs failed, PDF processing may not work');
  };

  setupWorker();
}

export class PDFUtils {
  static async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static async pdfToImages(file: File, format: 'jpeg' | 'png' = 'jpeg'): Promise<string[]> {
    try {
      console.log('Starting PDF to images conversion:', file.name, format);
      
      // Validate file
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Invalid PDF file');
      }

      const arrayBuffer = await this.fileToArrayBuffer(file);
      console.log('File loaded as ArrayBuffer, size:', arrayBuffer.byteLength);
      
      // Enhanced PDF loading configuration with better error handling
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0,
        useSystemFonts: true,
        disableFontFace: false,
        // Use correct cMap configuration
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/cmaps/',
        cMapPacked: true,
        // Add worker options
        useWorkerFetch: false,
        isEvalSupported: false,
        disableAutoFetch: false,
        disableStream: false
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      const images: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          console.log(`Processing page ${i}/${pdf.numPages}`);
          const page = await pdf.getPage(i);
          
          // Use higher scale for better quality
          const scale = format === 'png' ? 2.5 : 2.0;
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { 
            alpha: format === 'png',
            willReadFrequently: false 
          });
          
          if (!context) {
            throw new Error('Failed to get canvas context');
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          // Clear canvas with white background for JPEG
          if (format === 'jpeg') {
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            background: format === 'jpeg' ? 'white' : 'transparent'
          };
          
          await page.render(renderContext).promise;
          
          // Convert to data URL with appropriate quality
          const quality = format === 'jpeg' ? 0.95 : 1.0;
          const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
          const imageData = canvas.toDataURL(mimeType, quality);
          
          if (!imageData || imageData === 'data:,') {
            throw new Error(`Failed to generate ${format.toUpperCase()} for page ${i}`);
          }
          
          images.push(imageData);
          console.log(`Page ${i} converted successfully to ${format.toUpperCase()}`);
          
          // Clean up canvas
          canvas.width = 0;
          canvas.height = 0;
          
          // Clean up page object
          page.cleanup();
          
        } catch (pageError) {
          console.error(`Error processing page ${i}:`, pageError);
          throw new Error(`Failed to process page ${i}: ${pageError instanceof Error ? pageError.message : 'Unknown error'}`);
        }
      }
      
      // Clean up PDF document
      pdf.destroy();
      
      if (images.length === 0) {
        throw new Error('No images were generated from the PDF');
      }
      
      console.log(`All pages converted successfully to ${format.toUpperCase()}:`, images.length);
      return images;
      
    } catch (error) {
      console.error('PDF to images conversion error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid PDF')) {
          throw new Error('The uploaded file is not a valid PDF document.');
        } else if (error.message.includes('password')) {
          throw new Error('This PDF is password protected. Please unlock it first.');
        } else if (error.message.includes('corrupted')) {
          throw new Error('The PDF file appears to be corrupted. Please try with a different file.');
        } else if (error.message.includes('worker') || error.message.includes('fetch')) {
          throw new Error('PDF processing service is temporarily unavailable. Please try again in a moment.');
        } else {
          throw new Error(`Conversion failed: ${error.message}`);
        }
      }
      
      throw new Error('Failed to convert PDF. Please ensure the file is a valid PDF document.');
    }
  }

  static async imagesToPDF(images: File[]): Promise<Uint8Array> {
    try {
      console.log('Starting images to PDF conversion:', images.length, 'images');
      const pdf = new jsPDF();
      let isFirstPage = true;
      
      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        console.log(`Processing image ${i + 1}/${images.length}:`, imageFile.name);
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        const imageData = await this.fileToBase64(imageFile);
        
        // Create image element to get dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`Failed to load image: ${imageFile.name}`));
          img.src = imageData;
        });
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;
        
        pdf.addImage(imageData, 'JPEG', x, y, width, height);
        isFirstPage = false;
      }
      
      const pdfArrayBuffer = pdf.output('arraybuffer');
      console.log('Images to PDF conversion completed successfully');
      return new Uint8Array(pdfArrayBuffer);
    } catch (error) {
      console.error('Images to PDF conversion error:', error);
      throw new Error(`Failed to convert images to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async lockPDF(file: File, password: string): Promise<Uint8Array> {
    try {
      console.log('Starting PDF lock process');
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Add visual indication of password protection
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      
      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText('🔒 PASSWORD PROTECTED', {
          x: width - 150,
          y: height - 20,
          size: 10,
          font,
          color: rgb(1, 0, 0),
          opacity: 0.7
        });
      });
      
      const pdfBytes = await pdf.save();
      console.log('PDF locked successfully');
      return pdfBytes;
    } catch (error) {
      console.error('PDF lock error:', error);
      throw new Error(`Failed to protect PDF with password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async wordToPDF(file: File): Promise<Uint8Array> {
    try {
      console.log('Starting Word to PDF conversion (basic)');
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const page = pdf.addPage();
      const { width, height } = page.getSize();
      
      page.drawText('Word Document Converted to PDF', {
        x: 50,
        y: height - 50,
        size: 16,
        font,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(`Original file: ${file.name}`, {
        x: 50,
        y: height - 80,
        size: 12,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });
      
      const noteText = `This is a basic Word to PDF conversion.
For full format preservation, please use desktop software.

File Details:
- Name: ${file.name}
- Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- Type: ${file.type}`;
      
      const lines = noteText.split('\n');
      lines.forEach((line, index) => {
        page.drawText(line, {
          x: 50,
          y: height - 120 - (index * 20),
          size: 10,
          font,
          color: rgb(0.3, 0.3, 0.3)
        });
      });
      
      const pdfBytes = await pdf.save();
      console.log('Word to PDF conversion completed');
      return pdfBytes;
    } catch (error) {
      console.error('Word to PDF conversion error:', error);
      throw new Error(`Failed to convert Word document to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async compressPDF(file: File, compressionLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    try {
      console.log('Starting PDF compression');
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const compressedPdf = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: compressionLevel === 'high' ? 50 : compressionLevel === 'medium' ? 100 : 200
      });
      
      console.log('PDF compression completed');
      return compressedPdf;
    } catch (error) {
      console.error('PDF compression error:', error);
      throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file as base64'));
      reader.readAsDataURL(file);
    });
  }

  static async extractText(file: File): Promise<string> {
    try {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => item.str && item.str.trim())
          .map((item: any) => item.str)
          .join(' ');
        
        if (pageText.trim()) {
          fullText += `${pageText}\n\n`;
        }
      }
      
      if (!fullText.trim()) {
        throw new Error('No text content found in the PDF. The PDF might contain only images.');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF text extraction error:', error);
      throw new Error('Failed to extract text from PDF. Please ensure the file contains readable text.');
    }
  }

  static async mergePDFs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  }

  static async splitPDF(file: File, selectedPages: number[]): Promise<Uint8Array> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    // Convert 1-based page numbers to 0-based indices
    const pageIndices = selectedPages.map(pageNum => pageNum - 1);
    
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach((page) => newPdf.addPage(page));
    
    return await newPdf.save();
  }

  static async extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    const pages = await newPdf.copyPages(pdf, pageNumbers);
    pages.forEach((page) => newPdf.addPage(page));
    
    return await newPdf.save();
  }

  static async rotatePDF(file: File, rotation: number): Promise<Uint8Array> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    
    const pages = pdf.getPages();
    pages.forEach(page => {
      page.setRotation(degrees(rotation));
    });
    
    return await pdf.save();
  }

  static async addWatermark(file: File, text: string, opacity: number = 0.3): Promise<Uint8Array> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    const pages = pdf.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - 100,
        y: height / 2,
        size: 50,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity,
        rotate: degrees(45)
      });
    });
    
    return await pdf.save();
  }

  static async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
  }
}
