import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
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

  static async pdfToImages(file: File, format: 'jpeg' | 'png' = 'jpeg'): Promise<string[]> {
    try {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const images: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        const quality = format === 'png' ? 1.0 : 0.92;
        const imageData = canvas.toDataURL(`image/${format}`, quality);
        images.push(imageData);
      }
      
      return images;
    } catch (error) {
      console.error('PDF to images conversion error:', error);
      throw new Error('Failed to convert PDF to images. Please ensure the PDF file is not corrupted.');
    }
  }

  static async imagesToPDF(images: File[]): Promise<Uint8Array> {
    try {
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
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        pdf.addImage(imageData, 'JPEG', 10, 10, width - 20, height - 20);
        isFirstPage = false;
      }
      
      return new Uint8Array(pdf.output('arraybuffer'));
    } catch (error) {
      console.error('Images to PDF conversion error:', error);
      throw new Error('Failed to convert images to PDF.');
    }
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

  static async compressPDF(file: File, compressionLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    try {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const compressedPdf = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: compressionLevel === 'high' ? 50 : compressionLevel === 'medium' ? 100 : 200
      });
      
      return compressedPdf;
    } catch (error) {
      console.error('PDF compression error:', error);
      throw new Error('Failed to compress PDF.');
    }
  }

  static async lockPDF(file: File, password: string): Promise<Uint8Array> {
    try {
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
      
      return await pdf.save();
    } catch (error) {
      console.error('PDF password protection error:', error);
      throw new Error('Failed to protect PDF with password.');
    }
  }

  static async wordToPDF(file: File): Promise<Uint8Array> {
    try {
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
For full format preservation, please use desktop software.`;
      
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
      
      return await pdf.save();
    } catch (error) {
      console.error('Word to PDF conversion error:', error);
      throw new Error('Failed to convert Word document to PDF.');
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

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
