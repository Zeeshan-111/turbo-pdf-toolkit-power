
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, PageBreak } from 'docx';

export class DocxUtils {
  // Create comprehensive DOCX document with all extracted content
  static async createDocxDocument(textContent: string, fileName: string, pageCount: number = 1): Promise<Blob> {
    console.log('Creating comprehensive DOCX document with all content preserved');
    
    const documentParagraphs: Paragraph[] = [];
    
    // Add document title with better formatting
    documentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Converted from PDF: ${fileName.replace('.pdf', '')}`,
            bold: true,
            size: 32, // 16pt
            color: "2E5897",
          }),
        ],
        heading: HeadingLevel.TITLE,
        spacing: {
          after: 400,
        },
        alignment: AlignmentType.CENTER,
      })
    );
    
    // Split content by page breaks and process each section
    const sections = this.splitContentBySections(textContent);
    
    console.log(`Processing ${sections.length} content sections`);
    
    let currentPageNum = 1;
    
    sections.forEach((section, sectionIndex) => {
      // Add page break and page number for new pages
      if (section.isPageBreak && sectionIndex > 0) {
        documentParagraphs.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
        
        currentPageNum++;
        
        // Add subtle page indicator
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `--- Page ${currentPageNum} ---`,
                italics: true,
                size: 18,
                color: "808080",
              }),
            ],
            spacing: {
              after: 200,
            },
            alignment: AlignmentType.CENTER,
          })
        );
      }
      
      // Process the content paragraphs
      const paragraphs = this.parseContentIntoParagraphs(section.content);
      
      paragraphs.forEach((para) => {
        if (!para.text.trim()) return;
        
        if (para.type === 'title') {
          documentParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para.text,
                  bold: true,
                  size: 28, // 14pt
                  color: "1F497D",
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 240,
                after: 120,
              },
              alignment: AlignmentType.CENTER,
            })
          );
        } else if (para.type === 'heading') {
          documentParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para.text,
                  bold: true,
                  size: 24, // 12pt
                  color: "365F91",
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 200,
                after: 100,
              },
            })
          );
        } else {
          // Regular paragraph with proper formatting
          documentParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para.text,
                  size: 22, // 11pt
                }),
              ],
              spacing: {
                after: 120,
                line: 276, // 1.15 line spacing
              },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
      });
    });
    
    // Create the final document
    const doc = new Document({
      creator: "PDF Converter Tool",
      title: `Converted from ${fileName}`,
      description: "PDF converted to Word document with complete content preservation",
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 22, // 11pt
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
              },
            },
          },
        },
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Times New Roman",
              size: 22,
            },
            paragraph: {
              spacing: {
                line: 276,
                after: 120,
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          children: documentParagraphs,
        },
      ],
    });
    
    // Generate the DOCX file
    const blob = await Packer.toBlob(doc);
    
    console.log(`Comprehensive DOCX document created with ${documentParagraphs.length} paragraphs, size:`, blob.size, 'bytes');
    
    return blob;
  }
  
  // Split content by sections and page breaks
  static splitContentBySections(text: string): Array<{content: string, isPageBreak: boolean}> {
    const sections: Array<{content: string, isPageBreak: boolean}> = [];
    
    // First split by explicit page breaks
    const pageBreakSections = text.split(/--- PAGE BREAK ---/);
    
    pageBreakSections.forEach((section, index) => {
      const cleanSection = section.trim();
      if (cleanSection) {
        sections.push({
          content: cleanSection,
          isPageBreak: index > 0
        });
      }
    });
    
    // If no explicit page breaks, create sections based on content length
    if (sections.length === 1 && sections[0].content.length > 2000) {
      const longContent = sections[0].content;
      sections.length = 0; // Clear array
      
      const chunks = this.splitLongContent(longContent);
      chunks.forEach((chunk, index) => {
        sections.push({
          content: chunk,
          isPageBreak: index > 0
        });
      });
    }
    
    console.log(`Split content into ${sections.length} sections`);
    return sections;
  }
  
  // Split very long content into manageable chunks
  static splitLongContent(content: string): string[] {
    const maxChunkSize = 2500;
    const chunks: string[] = [];
    
    if (content.length <= maxChunkSize) {
      return [content];
    }
    
    // Split by paragraphs first
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    
    let currentChunk = '';
    
    paragraphs.forEach((paragraph) => {
      // If adding this paragraph would exceed chunk size
      if ((currentChunk + paragraph).length > maxChunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph + '\n\n';
      } else {
        currentChunk += paragraph + '\n\n';
      }
    });
    
    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
  
  // Parse content into structured paragraphs
  static parseContentIntoParagraphs(content: string): Array<{type: string, text: string}> {
    const paragraphs: Array<{type: string, text: string}> = [];
    
    // Split by double line breaks to get paragraphs
    const rawParagraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    
    rawParagraphs.forEach((para) => {
      const cleanPara = para.trim();
      if (!cleanPara) return;
      
      // Determine paragraph type
      if (this.isMainTitle(cleanPara)) {
        paragraphs.push({
          type: 'title',
          text: cleanPara
        });
      } else if (this.isHeading(cleanPara)) {
        paragraphs.push({
          type: 'heading',
          text: cleanPara
        });
      } else {
        // Split very long paragraphs
        if (cleanPara.length > 800) {
          const subParagraphs = this.splitLongParagraph(cleanPara);
          subParagraphs.forEach(subPara => {
            paragraphs.push({
              type: 'paragraph',
              text: subPara
            });
          });
        } else {
          paragraphs.push({
            type: 'paragraph',
            text: cleanPara
          });
        }
      }
    });
    
    return paragraphs;
  }
  
  // Split very long paragraphs into smaller ones
  static splitLongParagraph(paragraph: string): string[] {
    const maxLength = 600;
    const sentences = paragraph.split(/[.!?]+\s+/);
    const parts: string[] = [];
    
    let currentPart = '';
    
    sentences.forEach((sentence, index) => {
      const sentenceWithPeriod = sentence.trim() + (index < sentences.length - 1 ? '. ' : '');
      
      if ((currentPart + sentenceWithPeriod).length > maxLength && currentPart) {
        parts.push(currentPart.trim());
        currentPart = sentenceWithPeriod;
      } else {
        currentPart += sentenceWithPeriod;
      }
    });
    
    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }
    
    return parts;
  }
  
  // Enhanced title detection
  static isMainTitle(text: string): boolean {
    return (
      text.length < 120 &&
      (
        /^[A-Z][A-Z\s\d\-.,!?:]+$/.test(text) || // ALL CAPS
        /^Welcome to/.test(text) ||
        /INDUSTRIES|COMPANY|CORPORATION|PRESENTATION/.test(text) ||
        (text.split(' ').length <= 6 && text.split(' ').every(word => 
          word[0] === word[0].toUpperCase() && word.length > 1
        ))
      )
    );
  }
  
  // Enhanced heading detection
  static isHeading(text: string): boolean {
    return (
      text.length < 100 &&
      (
        text.endsWith(':') ||
        /^(Tagline|Overview|Mission|Vision|Engagement|About|Services|Products|Introduction|Conclusion|Summary):/i.test(text) ||
        /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:?\s*$/.test(text) ||
        /^\d+[\.\)]\s+[A-Z]/.test(text)
      )
    );
  }
}
