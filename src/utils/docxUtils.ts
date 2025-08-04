import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';

export class DocxUtils {
  // Create proper DOCX document from PDF text
  static async createDocxDocument(textContent: string, fileName: string): Promise<Blob> {
    console.log('Creating proper DOCX document from PDF content');
    
    const paragraphs = this.processTextContent(textContent);
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
    
    // Process each paragraph
    paragraphs.forEach((paragraphText, index) => {
      if (!paragraphText.trim()) return;
      
      const isHeading = this.isHeading(paragraphText);
      const isSubheading = this.isSubheading(paragraphText);
      
      if (isHeading) {
        // Main heading
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: paragraphText.trim(),
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
          })
        );
      } else if (isSubheading) {
        // Subheading
        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: paragraphText.trim(),
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
        // Regular paragraph
        const formattedText = this.formatTextRuns(paragraphText.trim());
        
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
    
    // Create the document
    const doc = new Document({
      creator: "PDF Converter Tool",
      title: `Converted from ${fileName}`,
      description: "PDF converted to Word document",
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
    
    console.log('DOCX document created successfully, size:', blob.size, 'bytes');
    
    return blob;
  }
  
  // Process and clean text content
  static processTextContent(text: string): string[] {
    // Clean and normalize text
    const cleanedText = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .replace(/([.!?])\s*\n(?!\n)/g, '$1 ')
      .trim();
    
    // Split into paragraphs
    const paragraphs = cleanedText
      .split(/\n\s*\n/)
      .filter(p => p.trim().length > 0)
      .map(p => p.trim());
    
    // Further process long paragraphs
    const processedParagraphs: string[] = [];
    
    paragraphs.forEach(para => {
      if (para.length > 600) {
        // Split long paragraphs at sentence boundaries
        const sentences = para.split(/(?<=[.!?])\s+/);
        let currentPara = '';
        
        sentences.forEach((sentence, index) => {
          if ((currentPara + sentence).length > 400 && currentPara) {
            processedParagraphs.push(currentPara.trim());
            currentPara = sentence + ' ';
          } else {
            currentPara += sentence + (index < sentences.length - 1 ? ' ' : '');
          }
        });
        
        if (currentPara.trim()) {
          processedParagraphs.push(currentPara.trim());
        }
      } else {
        processedParagraphs.push(para);
      }
    });
    
    return processedParagraphs;
  }
  
  // Check if text is a main heading
  static isHeading(text: string): boolean {
    const trimmed = text.trim();
    return (
      trimmed.length < 100 &&
      (
        /^[A-Z][A-Z\s:.-]+$/.test(trimmed) || // ALL CAPS
        /^(Chapter|Section|Part|Article)\s+\d+/i.test(trimmed) || // Chapter 1, Section 2, etc.
        /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:?\s*$/.test(trimmed) || // Title Case
        /^\d+\.\s*[A-Z]/.test(trimmed) // Numbered heading
      )
    );
  }
  
  // Check if text is a subheading
  static isSubheading(text: string): boolean {
    const trimmed = text.trim();
    return (
      trimmed.length < 80 &&
      !this.isHeading(text) &&
      (
        /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}:?\s*$/.test(trimmed) || // Short Title Case
        /^\d+\.\d+\s*[A-Z]/.test(trimmed) || // 1.1, 2.3 etc.
        /^[A-Z][a-z]+\s*(Overview|Summary|Introduction|Conclusion)/i.test(trimmed)
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
