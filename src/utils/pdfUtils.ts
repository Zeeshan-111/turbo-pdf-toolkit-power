import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

// Configure PDF.js worker - use empty string to disable worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

export class PDFUtils {
  static async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
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

  static async splitPDF(file: File, pageRanges: number[][]): Promise<Uint8Array[]> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const results: Uint8Array[] = [];
    
    for (const range of pageRanges) {
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, range);
      pages.forEach((page) => newPdf.addPage(page));
      results.push(await newPdf.save());
    }
    
    return results;
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

  static async pdfToImages(file: File, format: 'jpeg' | 'png' = 'jpeg'): Promise<string[]> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Use the specified format and quality
      const imageData = canvas.toDataURL(`image/${format}`, format === 'png' ? 1.0 : 0.9);
      images.push(imageData);
    }
    
    return images;
  }

  static async imagesToPDF(images: File[]): Promise<Uint8Array> {
    const pdf = new jsPDF();
    let isFirstPage = true;
    
    for (const imageFile of images) {
      if (!isFirstPage) {
        pdf.addPage();
      }
      
      const imageData = await this.fileToBase64(imageFile);
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imageData;
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const ratio = Math.min(190 / img.width, 270 / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 10, 10, width, height);
      isFirstPage = false;
    }
    
    return new Uint8Array(pdf.output('arraybuffer'));
  }

  static async extractText(file: File): Promise<string> {
    try {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      
      // Load PDF without worker for maximum compatibility
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        worker: null,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
        disableAutoFetch: true,
        disableStream: true,
        disableRange: true
      });
      
      const pdf = await loadingTask.promise;
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
        throw new Error('No text content found in the PDF. The PDF might contain only images or be password protected.');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF text extraction error:', error);
      if (error instanceof Error && error.message.includes('No text content found')) {
        throw error;
      }
      throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted and contains readable text.');
    }
  }

  static async compressPDF(file: File): Promise<Uint8Array> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    
    // Basic compression by removing metadata and optimizing
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    
    return await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false
    });
  }

  static async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
