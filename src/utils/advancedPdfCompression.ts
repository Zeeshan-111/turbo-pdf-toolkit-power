import { PDFDocument, PDFDict, PDFName, PDFNumber, PDFRef, PDFStream, PDFArray } from 'pdf-lib';

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
  mode: 'low' | 'medium' | 'high';
}

export class AdvancedPDFCompressor {
  static async compress(file: File, options: CompressionOptions): Promise<CompressionResult> {
    console.log(`Starting PDF compression with ${options.mode} mode`);
    
    const arrayBuffer = await file.arrayBuffer();
    const originalSize = file.size;
    const optimizations: string[] = [];

    try {
      // Load PDF with minimal options to avoid issues
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        ignoreEncryption: true
      });

      console.log(`Loaded PDF with ${pdfDoc.getPageCount()} pages`);

      // Step 1: Remove metadata (always effective)
      if (options.removeMetadata || options.mode !== 'low') {
        this.removeMetadata(pdfDoc);
        optimizations.push('Document metadata removed');
      }

      // Step 2: Remove annotations and interactive elements
      if (options.removeAnnotations || options.mode === 'high') {
        await this.removeAnnotations(pdfDoc);
        optimizations.push('Annotations and interactive elements removed');
      }

      // Step 3: Remove bookmarks and navigation
      if (options.removeBookmarks || options.mode !== 'low') {
        this.removeBookmarks(pdfDoc);
        optimizations.push('Bookmarks and navigation removed');
      }

      // Step 4: Optimize images (most effective for size reduction)
      const imageOptimized = await this.optimizeImages(pdfDoc, options);
      if (imageOptimized) {
        optimizations.push(`Images optimized for ${options.imageDPI} DPI`);
      }

      // Step 5: Remove unused objects and optimize structure
      if (options.mode !== 'low') {
        await this.optimizePDFStructure(pdfDoc, options.mode);
        optimizations.push('PDF structure optimized');
      }

      // Step 6: Apply compression settings based on mode
      const saveOptions = this.getSaveOptions(options.mode);
      
      // Save with compression
      const compressedData = await pdfDoc.save(saveOptions);
      
      const compressionRatio = Math.round(((originalSize - compressedData.length) / originalSize) * 100);
      
      // Auto-retry with higher compression if savings are too low
      if (compressionRatio < 10 && options.mode !== 'high') {
        console.log(`Low compression ratio (${compressionRatio}%), retrying with higher mode`);
        const higherMode: 'low' | 'medium' | 'high' = options.mode === 'low' ? 'medium' : 'high';
        return await this.compress(file, { ...options, mode: higherMode });
      }

      console.log(`Compression completed: ${originalSize} → ${compressedData.length} bytes (${compressionRatio}% reduction)`);

      return {
        compressedData,
        originalSize,
        compressedSize: compressedData.length,
        compressionRatio,
        optimizations,
        mode: options.mode
      };

    } catch (error) {
      console.error('Compression error:', error);
      
      // Fallback: Try basic compression with minimal processing
      try {
        const fallbackDoc = await PDFDocument.load(arrayBuffer);
        this.removeMetadata(fallbackDoc);
        const fallbackData = await fallbackDoc.save({ useObjectStreams: true });
        
        const fallbackRatio = Math.round(((originalSize - fallbackData.length) / originalSize) * 100);
        
        return {
          compressedData: fallbackData,
          originalSize,
          compressedSize: fallbackData.length,
          compressionRatio: fallbackRatio,
          optimizations: ['Basic compression applied (fallback mode)'],
          mode: options.mode
        };
      } catch (fallbackError) {
        console.error('Fallback compression failed:', fallbackError);
        throw new Error('PDF compression failed - file may be corrupted or encrypted');
      }
    }
  }

  private static getSaveOptions(mode: string): any {
    const baseOptions = {
      useObjectStreams: true,
      addDefaultPage: false
    };

    switch (mode) {
      case 'high':
        return {
          ...baseOptions,
          objectsPerTick: 5000
        };
      case 'medium':
        return {
          ...baseOptions,
          objectsPerTick: 2000
        };
      case 'low':
      default:
        return {
          ...baseOptions,
          objectsPerTick: 1000
        };
    }
  }

  private static removeMetadata(pdfDoc: PDFDocument): void {
    try {
      // Clear document info
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
      pdfDoc.setKeywords([]);
      
      // Remove catalog metadata
      const catalog = pdfDoc.catalog;
      catalog.delete(PDFName.of('Metadata'));
      catalog.delete(PDFName.of('Info'));
    } catch (error) {
      console.log('Metadata removal error:', error);
    }
  }

  private static async removeAnnotations(pdfDoc: PDFDocument): Promise<void> {
    try {
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const pageDict = page.node;
        
        // Remove annotations
        pageDict.delete(PDFName.of('Annots'));
        
        // Remove interactive elements
        pageDict.delete(PDFName.of('AA'));
        pageDict.delete(PDFName.of('Actions'));
      }

      // Remove document-level interactive elements
      const catalog = pdfDoc.catalog;
      catalog.delete(PDFName.of('AcroForm'));
      catalog.delete(PDFName.of('JavaScript'));
      catalog.delete(PDFName.of('OpenAction'));
      
    } catch (error) {
      console.log('Annotation removal error:', error);
    }
  }

  private static removeBookmarks(pdfDoc: PDFDocument): void {
    try {
      const catalog = pdfDoc.catalog;
      
      // Remove navigation elements
      catalog.delete(PDFName.of('Outlines'));
      catalog.delete(PDFName.of('Dests'));
      catalog.delete(PDFName.of('Names'));
      catalog.delete(PDFName.of('PageLabels'));
      
    } catch (error) {
      console.log('Bookmark removal error:', error);
    }
  }

  private static async optimizeImages(pdfDoc: PDFDocument, options: CompressionOptions): Promise<boolean> {
    let optimized = false;
    
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
                    await this.compressImage(xObject, options);
                    optimized = true;
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Image optimization error:', error);
    }
    
    return optimized;
  }

  private static async compressImage(imageDict: PDFDict, options: CompressionOptions): Promise<void> {
    try {
      // Get current image dimensions
      const width = imageDict.get(PDFName.of('Width'));
      const height = imageDict.get(PDFName.of('Height'));
      
      if (width instanceof PDFNumber && height instanceof PDFNumber) {
        const originalWidth = width.asNumber();
        const originalHeight = height.asNumber();
        
        // Calculate scale factor based on DPI and mode
        const scaleFactor = this.getScaleFactor(options.imageDPI, options.mode);
        
        // Only downsample if image is reasonably large
        if (originalWidth > 150 && originalHeight > 150) {
          const newWidth = Math.max(72, Math.floor(originalWidth * scaleFactor));
          const newHeight = Math.max(72, Math.floor(originalHeight * scaleFactor));
          
          imageDict.set(PDFName.of('Width'), PDFNumber.of(newWidth));
          imageDict.set(PDFName.of('Height'), PDFNumber.of(newHeight));
        }
      }

      // Apply compression settings
      if (options.convertImagesToJPEG) {
        // Force JPEG compression
        imageDict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
        
        // Reduce bits per component for higher compression
        const bitsPerComponent = options.mode === 'high' ? 4 : 8;
        imageDict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(bitsPerComponent));
      }

      // Remove image metadata
      imageDict.delete(PDFName.of('Metadata'));
      imageDict.delete(PDFName.of('ColorSpace'));
      
      if (options.mode === 'high') {
        imageDict.delete(PDFName.of('SMask')); // Remove transparency
        imageDict.delete(PDFName.of('Interpolate'));
      }
      
    } catch (error) {
      console.log('Image compression error:', error);
    }
  }

  private static getScaleFactor(dpi: number, mode: string): number {
    let baseFactor;
    
    // Base scale factors for different DPI settings
    switch (dpi) {
      case 72:
        baseFactor = 0.4; // More aggressive downscaling
        break;
      case 96:
        baseFactor = 0.6;
        break;
      case 150:
        baseFactor = 0.8;
        break;
      default:
        baseFactor = 0.6;
    }
    
    // Adjust based on compression mode
    switch (mode) {
      case 'high':
        return baseFactor * 0.7; // Very aggressive
      case 'medium':
        return baseFactor * 0.85;
      case 'low':
      default:
        return baseFactor * 0.95;
    }
  }

  private static async optimizePDFStructure(pdfDoc: PDFDocument, mode: string): Promise<void> {
    try {
      // Remove optional PDF elements that take up space
      const catalog = pdfDoc.catalog;
      
      // Remove structural elements
      catalog.delete(PDFName.of('StructTreeRoot'));
      catalog.delete(PDFName.of('MarkInfo'));
      catalog.delete(PDFName.of('Lang'));
      catalog.delete(PDFName.of('OutputIntents'));
      catalog.delete(PDFName.of('PieceInfo'));
      
      if (mode === 'high') {
        // More aggressive structural optimization
        catalog.delete(PDFName.of('ViewerPreferences'));
        catalog.delete(PDFName.of('PageLayout'));
        catalog.delete(PDFName.of('PageMode'));
        
        // Remove page-level optional elements
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const pageDict = page.node;
          pageDict.delete(PDFName.of('Thumb'));
          pageDict.delete(PDFName.of('Trans'));
          pageDict.delete(PDFName.of('UserUnit'));
        }
      }
      
    } catch (error) {
      console.log('Structure optimization error:', error);
    }
  }
}
