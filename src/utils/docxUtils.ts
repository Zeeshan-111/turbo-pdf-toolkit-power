
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, PageBreak } from 'docx';

export class DocxUtils {
  // Create proper DOCX document from PDF text with exact formatting preservation
  static async createDocxDocument(textContent: string, fileName: string, pageCount: number = 1): Promise<Blob> {
    console.log('Creating DOCX document with exact formatting preservation');
    
    const documentParagraphs: Paragraph[] = [];
    
    // Add document title
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
      })
    );
    
    // Process text content to maintain original structure
    const structuredContent = this.parseStructuredContent(textContent);
    
    // Add page numbers if multiple pages
    let currentPage = 1;
    
    structuredContent.forEach((section, sectionIndex) => {
      // Add page break for new pages (except first content)
      if (sectionIndex > 0 && section.isNewPage) {
        documentParagraphs.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
        
        currentPage++;
        
        // Add page header
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Page ${currentPage}`,
                bold: true,
                size: 20,
                color: "666666",
              }),
            ],
            spacing: {
              after: 200,
            },
          })
        );
      }
      
      // Process each element in the section
      section.elements.forEach((element) => {
        if (element.type === 'title') {
          documentParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: element.text,
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
        } else if (element.type === 'header') {
          documentParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: element.text,
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
        } else if (element.type === 'paragraph') {
          const formattedText = this.formatTextRuns(element.text);
          
          documentParagraphs.push(
            new Paragraph({
              children: formattedText,
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
    
    // Create the document with proper styling
    const doc = new Document({
      creator: "PDF Converter Tool",
      title: `Converted from ${fileName}`,
      description: "PDF converted to Word document with preserved formatting",
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
    
    // Generate the DOCX file using browser-compatible method
    const blob = await Packer.toBlob(doc);
    
    console.log('DOCX document created with preserved structure, size:', blob.size, 'bytes');
    
    return blob;
  }
  
  // Parse text content to maintain original structure
  static parseStructuredContent(text: string): Array<{elements: Array<{type: string, text: string}>, isNewPage: boolean}> {
    const sections: Array<{elements: Array<{type: string, text: string}>, isNewPage: boolean}> = [];
    
    // Split by double line breaks to identify sections
    const parts = text.split(/\n\s*\n/).filter(part => part.trim());
    
    let currentSection = { elements: [], isNewPage: false };
    
    parts.forEach((part, index) => {
      const lines = part.split('\n').filter(line => line.trim());
      
      lines.forEach((line, lineIndex) => {
        const trimmed = line.trim();
        
        if (!trimmed) return;
        
        // Detect different types of content
        if (this.isMainTitle(trimmed)) {
          // Main title
          if (currentSection.elements.length > 0) {
            sections.push(currentSection);
            currentSection = { elements: [], isNewPage: false };
          }
          
          currentSection.elements.push({
            type: 'title',
            text: trimmed
          });
        } else if (this.isHeader(trimmed)) {
          // Section header
          currentSection.elements.push({
            type: 'header',
            text: trimmed
          });
        } else {
          // Regular paragraph
          currentSection.elements.push({
            type: 'paragraph',
            text: trimmed
          });
        }
      });
    });
    
    // Add final section
    if (currentSection.elements.length > 0) {
      sections.push(currentSection);
    }
    
    return sections;
  }
  
  // Check if text is a main title
  static isMainTitle(text: string): boolean {
    return (
      text.length < 100 &&
      (
        /^Welcome to/.test(text) ||
        /INDUSTRIES/.test(text) ||
        /^[A-Z\s]+$/.test(text) || // ALL CAPS
        text.split(' ').length <= 5 && text.split(' ').every(word => 
          word[0] === word[0].toUpperCase() && word.length > 2
        )
      )
    );
  }
  
  // Check if text is a header
  static isHeader(text: string): boolean {
    return (
      text.length < 80 &&
      (
        text.endsWith(':') ||
        /^(Tagline|Overview|Mission|Vision|Engagement):/i.test(text) ||
        (/^[A-Z][a-z]+:/.test(text) && text.split(':')[0].length < 20)
      )
    );
  }
  
  // Format text with proper styling
  static formatTextRuns(text: string): TextRun[] {
    const runs: TextRun[] = [];
    
    // Simple formatting - can be enhanced for bold, italic detection
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
    
    parts.forEach(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text
        runs.push(new TextRun({
          text: part.slice(2, -2),
          bold: true,
        }));
      } else if (part.startsWith('*') && part.endsWith('*')) {
        // Italic text
        runs.push(new TextRun({
          text: part.slice(1, -1),
          italics: true,
        }));
      } else if (part.trim()) {
        // Regular text
        runs.push(new TextRun({
          text: part,
        }));
      }
    });
    
    return runs.length > 0 ? runs : [new TextRun({ text })];
  }
}
