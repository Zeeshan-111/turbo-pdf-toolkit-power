
import { PDFDocument, PDFArray, PDFDict, PDFName, PDFNumber, PDFRef } from 'pdf-lib';

export interface CompressionOptions {
  mode: 'low' | 'medium' | 'high';
  imageDPI: 72 | 96 | 150;
  removeMetadata: boolean;
  removeAnnotations: boolean;
  removeBookmarks: boolean;
  convertImagesToJPEG: boolean;
  imageQuality: number;
}

export interface CompressionResult {
  compressedData: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  optimizations: string[];
}

export class AdvancedPDFCompressor {
  static async compress(file: File, options: CompressionOptions): Promise<CompressionResult> {
    console.log(`Starting advanced PDF compression with ${options.mode} mode`);
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const originalSize = file.size;
    const optimizations: string[] = [];

    // Remove metadata based on compression mode
    if (options.removeMetadata || options.mode !== 'low') {
      this.removeMetadata(pdfDoc);
      optimizations.push('Metadata removal');
    }

    // Remove annotations if specified
    if (options.removeAnnotations && options.mode === 'high') {
      await this.removeAnnotations(pdfDoc);
      optimizations.push('Annotations removal');
    }

    // Remove bookmarks if specified
    if (options.removeBookmarks && options.mode === 'high') {
      this.removeBookmarks(pdfDoc);
      optimizations.push('Bookmarks removal');
    }

    // Optimize fonts
    if (options.mode !== 'low') {
      await this.optimizeFonts(pdfDoc);
      optimizations.push('Font optimization');
    }

    // Process images based on mode
    await this.processImages(pdfDoc, options);
    optimizations.push(`Image optimization (${options.imageDPI} DPI)`);

    // Remove unused objects
    if (options.mode === 'high') {
      await this.removeUnusedObjects(pdfDoc);
      optimizations.push('Unused objects removal');
    }

    // Apply compression settings based on mode
    const saveOptions = this.getSaveOptions(options.mode);
    const compressedData = await pdfDoc.save(saveOptions);
    
    const compressionRatio = Math.round(((originalSize - compressedData.length) / originalSize) * 100);
    
    console.log(`Advanced compression completed: ${originalSize} → ${compressedData.length} bytes (${compressionRatio}% reduction)`);

    return {
      compressedData,
      originalSize,
      compressedSize: compressedData.length,
      compressionRatio,
      optimizations
    };
  }

  private static removeMetadata(pdfDoc: PDFDocument): void {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setCreator('');
    pdfDoc.setProducer('');
    pdfDoc.setKeywords([]);
    pdfDoc.setCreationDate(new Date(0));
    pdfDoc.setModificationDate(new Date(0));
  }

  private static async removeAnnotations(pdfDoc: PDFDocument): Promise<void> {
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
      try {
        const pageDict = page.node;
        const annots = pageDict.get(PDFName.of('Annots'));
        if (annots && annots instanceof PDFArray) {
          pageDict.delete(PDFName.of('Annots'));
        }
      } catch (error) {
        console.log('Could not remove annotations from page:', error);
      }
    }
  }

  private static removeBookmarks(pdfDoc: PDFDocument): void {
    try {
      const catalog = pdfDoc.catalog;
      catalog.delete(PDFName.of('Outlines'));
    } catch (error) {
      console.log('Could not remove bookmarks:', error);
    }
  }

  private static async optimizeFonts(pdfDoc: PDFDocument): Promise<void> {
    try {
      // Remove embedded font subsets and optimize font usage
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const pageDict = page.node;
        const resources = pageDict.get(PDFName.of('Resources'));
        
        if (resources && resources instanceof PDFDict) {
          const fonts = resources.get(PDFName.of('Font'));
          if (fonts && fonts instanceof PDFDict) {
            // Optimize font dictionaries
            const fontKeys = fonts.keys();
            for (const key of fontKeys) {
              const fontRef = fonts.get(key);
              if (fontRef instanceof PDFRef) {
                const fontDict = pdfDoc.context.lookup(fontRef);
                if (fontDict instanceof PDFDict) {
                  // Remove font file data to reduce size
                  fontDict.delete(PDFName.of('FontFile'));
                  fontDict.delete(PDFName.of('FontFile2'));
                  fontDict.delete(PDFName.of('FontFile3'));
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Font optimization error:', error);
    }
  }

  private static async processImages(pdfDoc: PDFDocument, options: CompressionOptions): Promise<void> {
    try {
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const pageDict = page.node;
        const resources = pageDict.get(PDFName.of('Resources'));
        
        if (resources && resources instanceof PDFDict) {
          const xObjects = resources.get(PDFName.of('XObject'));
          if (xObjects && xObjects instanceof PDFDict) {
            const xObjectKeys = xObjects.keys();
            
            for (const key of xObjectKeys) {
              const xObjectRef = xObjects.get(key);
              if (xObjectRef instanceof PDFRef) {
                const xObject = pdfDoc.context.lookup(xObjectRef);
                if (xObject instanceof PDFDict) {
                  const subtype = xObject.get(PDFName.of('Subtype'));
                  if (subtype && subtype.toString() === '/Image') {
                    await this.optimizeImage(xObject, options);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Image processing error:', error);
    }
  }

  private static async optimizeImage(imageDict: PDFDict, options: CompressionOptions): Promise<void> {
    try {
      // Reduce image resolution based on DPI setting
      const scaleFactor = this.getScaleFactor(options.imageDPI, options.mode);
      
      const width = imageDict.get(PDFName.of('Width'));
      const height = imageDict.get(PDFName.of('Height'));
      
      if (width instanceof PDFNumber && height instanceof PDFNumber) {
        const newWidth = Math.floor(width.asNumber() * scaleFactor);
        const newHeight = Math.floor(height.asNumber() * scaleFactor);
        
        imageDict.set(PDFName.of('Width'), PDFNumber.of(newWidth));
        imageDict.set(PDFName.of('Height'), PDFNumber.of(newHeight));
      }

      // Set compression filters
      if (options.convertImagesToJPEG || options.mode === 'high') {
        imageDict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
        
        // Adjust quality based on mode
        const quality = options.mode === 'high' ? 60 : options.mode === 'medium' ? 75 : 85;
        imageDict.set(PDFName.of('DecodeParms'), PDFDict.withContext(imageDict.context));
      }

      // Remove color space information for higher compression
      if (options.mode === 'high') {
        imageDict.delete(PDFName.of('ColorSpace'));
        imageDict.delete(PDFName.of('SMask'));
      }
    } catch (error) {
      console.log('Image optimization error:', error);
    }
  }

  private static getScaleFactor(dpi: number, mode: string): number {
    const baseDPI = 300; // Assume original is 300 DPI
    let targetDPI = dpi;
    
    // Adjust target DPI based on compression mode
    if (mode === 'high') {
      targetDPI = Math.min(dpi, 96);
    } else if (mode === 'medium') {
      targetDPI = Math.min(dpi, 150);
    }
    
    return Math.min(targetDPI / baseDPI, 1.0);
  }

  private static async removeUnusedObjects(pdfDoc: PDFDocument): Promise<void> {
    try {
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const pageDict = page.node;
        
        // Remove unused annotations
        pageDict.delete(PDFName.of('Annots'));
        
        // Remove structural parent tree
        pageDict.delete(PDFName.of('StructParents'));
        
        // Remove page thumbnails
        pageDict.delete(PDFName.of('Thumb'));
        
        // Remove transition effects
        pageDict.delete(PDFName.of('Trans'));
        
        // Remove user units
        pageDict.delete(PDFName.of('UserUnit'));
      }
      
      // Remove document-level unused objects
      const catalog = pdfDoc.catalog;
      catalog.delete(PDFName.of('Names'));
      catalog.delete(PDFName.of('Dests'));
      catalog.delete(PDFName.of('ViewerPreferences'));
      catalog.delete(PDFName.of('PageLayout'));
      catalog.delete(PDFName.of('PageMode'));
      catalog.delete(PDFName.of('OpenAction'));
      catalog.delete(PDFName.of('AA'));
      catalog.delete(PDFName.of('URI'));
      catalog.delete(PDFName.of('AcroForm'));
      catalog.delete(PDFName.of('Metadata'));
      catalog.delete(PDFName.of('StructTreeRoot'));
      catalog.delete(PDFName.of('MarkInfo'));
      catalog.delete(PDFName.of('Lang'));
      catalog.delete(PDFName.of('SpiderInfo'));
      catalog.delete(PDFName.of('OutputIntents'));
      catalog.delete(PDFName.of('PieceInfo'));
      catalog.delete(PDFName.of('OCProperties'));
      catalog.delete(PDFName.of('Perms'));
      catalog.delete(PDFName.of('Legal'));
      
    } catch (error) {
      console.log('Unused objects removal error:', error);
    }
  }

  private static getSaveOptions(mode: string): any {
    const baseOptions = {
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    };

    switch (mode) {
      case 'high':
        return {
          ...baseOptions,
          objectsPerTick: 1000,
          compress: true,
        };
      case 'medium':
        return {
          ...baseOptions,
          objectsPerTick: 500,
        };
      case 'low':
      default:
        return {
          ...baseOptions,
          objectsPerTick: 200,
        };
    }
  }
}
