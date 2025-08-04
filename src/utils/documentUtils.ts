
// Enhanced Word document creation utilities
export class DocumentUtils {
  // Create proper Word document with better formatting
  static createFormattedWordContent(textContent: string, fileName: string): string {
    // Split text into paragraphs based on line breaks and content structure
    const paragraphs = this.splitIntoMeaningfulParagraphs(textContent);
    
    // Create proper RTF structure with formatting
    const rtfHeader = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0\\fswiss\\fcharset0 Arial;}}`;
    const rtfStyles = `{\\stylesheet {\\s0\\f0\\fs22\\lang1033 Normal;}{\\s1\\f0\\fs28\\b\\lang1033 Title;}{\\s2\\f0\\fs24\\b\\lang1033 Heading;}}`;
    
    let rtfContent = rtfHeader + rtfStyles + '\n';
    
    // Add title
    rtfContent += `\\s1\\b\\fs28 Converted from PDF: ${fileName}\\b0\\par\\par\n`;
    
    // Add each paragraph with proper spacing
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        // Check if it looks like a heading (short line, often all caps or title case)
        const isHeading = this.isLikelyHeading(paragraph);
        
        if (isHeading) {
          rtfContent += `\\s2\\b\\fs24 ${this.escapeRtf(paragraph.trim())}\\b0\\par\\par\n`;
        } else {
          rtfContent += `\\s0\\fs22 ${this.escapeRtf(paragraph.trim())}\\par\\par\n`;
        }
      }
    });
    
    rtfContent += '}';
    return rtfContent;
  }
  
  // Split text into meaningful paragraphs
  static splitIntoMeaningfulParagraphs(text: string): string[] {
    // Clean the text first
    const cleanText = text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Normalize paragraph breaks
      .trim();
    
    // Split by double line breaks first
    let paragraphs = cleanText.split(/\n\s*\n/);
    
    // If no clear paragraph breaks, split by sentence patterns
    if (paragraphs.length === 1) {
      paragraphs = this.splitBySentencePatterns(cleanText);
    }
    
    // Further split very long paragraphs
    const finalParagraphs: string[] = [];
    paragraphs.forEach(para => {
      if (para.length > 500) {
        const subParagraphs = this.splitLongParagraph(para);
        finalParagraphs.push(...subParagraphs);
      } else if (para.trim()) {
        finalParagraphs.push(para.trim());
      }
    });
    
    return finalParagraphs;
  }
  
  // Split by sentence patterns for better paragraph structure
  static splitBySentencePatterns(text: string): string[] {
    const paragraphs: string[] = [];
    const sentences = text.split(/[.!?]+\s+/);
    
    let currentParagraph = '';
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence.trim();
      
      // Add period back if not last sentence
      if (index < sentences.length - 1) {
        currentParagraph += '. ';
      }
      
      // Create paragraph break after 2-4 sentences or based on content patterns
      if (
        (currentParagraph.split('. ').length >= 3 && currentParagraph.length > 200) ||
        currentParagraph.length > 400 ||
        this.shouldBreakHere(sentence)
      ) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    });
    
    // Add remaining content
    if (currentParagraph.trim()) {
      paragraphs.push(currentParagraph.trim());
    }
    
    return paragraphs;
  }
  
  // Split very long paragraphs
  static splitLongParagraph(paragraph: string): string[] {
    const maxLength = 400;
    const parts: string[] = [];
    
    if (paragraph.length <= maxLength) {
      return [paragraph];
    }
    
    // Split by sentences first
    const sentences = paragraph.split(/[.!?]+\s+/);
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
  
  // Detect if a line is likely a heading
  static isLikelyHeading(text: string): boolean {
    const trimmed = text.trim();
    
    // Check various heading patterns
    return (
      trimmed.length < 80 &&  // Short lines
      (
        /^[A-Z][A-Z\s:.-]+$/.test(trimmed) ||  // All caps
        /^[A-Z][a-z]+(?: [A-Z][a-z]+)*:?\s*$/.test(trimmed) ||  // Title Case
        /^\d+\.\s*[A-Z]/.test(trimmed) ||  // Numbered headings
        /^(Chapter|Section|Part|Overview|Mission|Vision|Objective|Introduction|Conclusion)\b/i.test(trimmed)
      )
    );
  }
  
  // Determine if paragraph break should occur
  static shouldBreakHere(sentence: string): boolean {
    const breakPatterns = [
      /^(Overview|Mission|Vision|Objective|Introduction|Conclusion|Summary)/i,
      /^(Chapter|Section|Part)\s+\d+/i,
      /^(In addition|Furthermore|Moreover|However|Nevertheless)/i
    ];
    
    return breakPatterns.some(pattern => pattern.test(sentence.trim()));
  }
  
  // Escape special RTF characters
  static escapeRtf(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\n/g, '\\par ')
      .replace(/\t/g, '\\tab ');
  }
  
  // Create DOCX-like structure (more advanced format)
  static createDocxLikeContent(textContent: string, fileName: string): string {
    const paragraphs = this.splitIntoMeaningfulParagraphs(textContent);
    
    let docContent = `=== DOCUMENT: ${fileName} ===\n\n`;
    
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        const isHeading = this.isLikelyHeading(paragraph);
        
        if (isHeading) {
          docContent += `## ${paragraph.trim()}\n\n`;
        } else {
          docContent += `${paragraph.trim()}\n\n`;
        }
      }
    });
    
    return docContent;
  }
}
