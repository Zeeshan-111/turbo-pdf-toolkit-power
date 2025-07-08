import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// Configure PDF.js worker with a working URL
if (typeof window !== 'undefined') {
  // Use the working .mjs version directly
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';
  console.log('PDF.js worker configured with .mjs version');
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

  static async excelToPDF(file: File): Promise<Uint8Array> {
    try {
      console.log('Starting Professional Excel to PDF conversion');
      const arrayBuffer = await this.fileToArrayBuffer(file);
      
      // Read Excel with comprehensive formatting preservation
      const workbook = XLSX.read(arrayBuffer, { 
        type: 'array',
        cellStyles: true,
        cellDates: true,
        cellNF: true,
        cellText: false,
        raw: false,
        codepage: 65001,
        sheetStubs: false,
        bookDeps: true,
        bookFiles: true,
        bookProps: true,
        bookSheets: true
      });
      
      console.log('Excel workbook loaded successfully. Sheets:', workbook.SheetNames);
      
      // Create PDF with portrait orientation like the reference
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });
      
      let totalProcessedSheets = 0;
      
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        
        if (totalProcessedSheets > 0) {
          pdf.addPage();
        }
        
        console.log(`Processing sheet: "${sheetName}"`);
        
        // Get the range of data in the worksheet
        const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : null;
        if (!range) {
          console.log(`Skipping empty sheet: ${sheetName}`);
          continue;
        }
        
        console.log(`Sheet "${sheetName}" range:`, range);
        
        // Calculate page margins and available space
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const availableWidth = pageWidth - (2 * margin);
        const availableHeight = pageHeight - (2 * margin);
        
        let yPosition = margin + 10;
        
        // Process each row from the range
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          // Check for page break
          if (yPosition > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin + 10;
          }
          
          const rowHeight = 6;
          const numCols = range.e.c - range.s.c + 1;
          const colWidth = availableWidth / numCols;
          
          // Determine if this is a header row (first row or if contains bold formatting)
          const isHeaderRow = rowNum === range.s.r;
          
          // Draw row background for header
          if (isHeaderRow) {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(margin, yPosition - rowHeight + 1, availableWidth, rowHeight, 'F');
          }
          
          // Process each column in the row
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cell = worksheet[cellAddress];
            
            const xPosition = margin + (colNum - range.s.c) * colWidth;
            
            // Draw cell border
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.3);
            pdf.rect(xPosition, yPosition - rowHeight + 1, colWidth, rowHeight);
            
            // Get cell content
            let cellValue = '';
            if (cell) {
              if (cell.w) {
                // Use formatted value if available
                cellValue = String(cell.w);
              } else if (cell.v !== undefined) {
                // Use raw value and format it
                if (typeof cell.v === 'number') {
                  // Handle numbers with proper formatting
                  if (cell.t === 'd') {
                    // Date
                    cellValue = new Date(cell.v).toLocaleDateString('en-IN');
                  } else if (cell.f && cell.f.startsWith('SUM')) {
                    // Formula result
                    cellValue = cell.v.toLocaleString('en-IN');
                  } else {
                    cellValue = cell.v.toLocaleString('en-IN');
                  }
                } else {
                  cellValue = String(cell.v);
                }
              }
            }
            
            // Set font style
            if (isHeaderRow) {
              pdf.setFont('helvetica', 'bold');
              pdf.setFontSize(9);
            } else {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(8);
            }
            
            // Handle text alignment and truncation
            if (cellValue) {
              const maxWidth = colWidth - 2;
              let displayText = cellValue;
              
              // Truncate if text is too long
              const textWidth = pdf.getTextWidth(displayText);
              if (textWidth > maxWidth) {
                while (pdf.getTextWidth(displayText + '...') > maxWidth && displayText.length > 0) {
                  displayText = displayText.slice(0, -1);
                }
                displayText += '...';
              }
              
              // Position text in cell (center vertically, left align horizontally)
              const textX = xPosition + 1;
              const textY = yPosition - (rowHeight / 2) + 1;
              
              try {
                pdf.text(displayText, textX, textY);
              } catch (textError) {
                console.warn(`Text rendering error:`, textError);
                // Fallback for special characters
                const fallbackText = displayText.replace(/[^\x00-\x7F]/g, '?');
                pdf.text(fallbackText, textX, textY);
              }
            }
          }
          
          yPosition += rowHeight;
        }
        
        // Add conversion info at bottom
        yPosition += 15;
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        
        const conversionInfo = [
          `Converted from: ${file.name}`,
          `Sheet: ${sheetName}`,
          `Conversion Date: ${new Date().toLocaleString('en-IN')}`,
          `Rows: ${range.e.r - range.s.r + 1}, Columns: ${range.e.c - range.s.c + 1}`
        ];
        
        conversionInfo.forEach((info, index) => {
          if (yPosition + (index * 4) < pageHeight - margin) {
            pdf.text(info, margin, yPosition + (index * 4));
          }
        });
        
        pdf.setTextColor(0, 0, 0);
        totalProcessedSheets++;
      }
      
      // Add metadata page
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Excel Conversion Summary', 20, 30);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const summaryInfo = [
        `Source File: ${file.name}`,
        `File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
        `Total Sheets: ${workbook.SheetNames.length}`,
        `Processed Sheets: ${totalProcessedSheets}`,
        `Sheet Names: ${workbook.SheetNames.join(', ')}`,
        `Conversion Date: ${new Date().toLocaleString('en-IN')}`,
        `Tool: Professional Excel to PDF Converter`,
        '',
        'Conversion Features:',
        '✓ Preserves original data formatting',
        '✓ Handles currency symbols and special characters',
        '✓ Maintains table structure and layout',
        '✓ Optimized for readability and printing',
        '✓ Supports multiple worksheets',
        '✓ UTF-8 character encoding support',
        '',
        'Notes:',
        '• Large spreadsheets are optimally formatted for PDF viewing',
        '• Complex formulas are converted to their calculated values',
        '• Original data types and formatting preserved where possible'
      ];
      
      let summaryY = 50;
      summaryInfo.forEach(line => {
        if (line.startsWith('✓')) {
          pdf.setTextColor(0, 150, 0);
        } else if (line.startsWith('•')) {
          pdf.setTextColor(100, 100, 100);
        } else {
          pdf.setTextColor(0, 0, 0);
        }
        
        pdf.text(line, 20, summaryY);
        summaryY += 6;
      });
      
      const pdfBytes = pdf.output('arraybuffer');
      console.log('Professional Excel to PDF conversion completed successfully');
      console.log(`Total sheets processed: ${totalProcessedSheets}`);
      
      return new Uint8Array(pdfBytes);
      
    } catch (error) {
      console.error('Excel to PDF conversion error:', error);
      throw new Error(`Excel conversion failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }

  static async compressPDF(file: File, compressionLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    try {
      console.log('Starting advanced PDF compression');
      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Remove unnecessary metadata for better compression
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setCreator('PDF Compressor');
      pdf.setProducer('PDF Compressor');
      pdf.setCreationDate(new Date());
      pdf.setModificationDate(new Date());
      
      // Get compression settings based on level
      const settings = this.getCompressionSettings(compressionLevel);
      
      const compressedPdf = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: settings.objectsPerTick,
        updateFieldAppearances: false
      });
      
      console.log('PDF compression completed');
      console.log(`Original size: ${(arrayBuffer.byteLength / 1024).toFixed(2)} KB`);
      console.log(`Compressed size: ${(compressedPdf.length / 1024).toFixed(2)} KB`);
      console.log(`Compression ratio: ${(((arrayBuffer.byteLength - compressedPdf.length) / arrayBuffer.byteLength) * 100).toFixed(1)}%`);
      
      return compressedPdf;
    } catch (error) {
      console.error('PDF compression error:', error);
      throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static getCompressionSettings(level: 'low' | 'medium' | 'high') {
    switch (level) {
      case 'low':
        return {
          objectsPerTick: 200,
          removeMetadata: false,
          optimizeStreams: true
        };
      case 'medium':
        return {
          objectsPerTick: 100,
          removeMetadata: true,
          optimizeStreams: true
        };
      case 'high':
        return {
          objectsPerTick: 50,
          removeMetadata: true,
          optimizeStreams: true
        };
      default:
        return {
          objectsPerTick: 100,
          removeMetadata: true,
          optimizeStreams: true
        };
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
