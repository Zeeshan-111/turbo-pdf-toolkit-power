import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { PDFUtils } from "@/utils/pdfUtils";

const WordToPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && (
      uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      uploadedFile.type === "application/msword" ||
      uploadedFile.name.endsWith('.docx') ||
      uploadedFile.name.endsWith('.doc')
    )) {
      setFile(uploadedFile);
      setPdfUrl(null);
      setProgress(0);
      toast({
        title: "File uploaded successfully",
        description: `${uploadedFile.name} is ready for conversion.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word document (.docx or .doc file).",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"]
    },
    multiple: false
  });

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 20;
        });
      }, 300);

      // Since we can't do actual Word to PDF conversion in browser,
      // we'll create a basic PDF with extracted text content
      const pdfBytes = await PDFUtils.wordToPDF(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      toast({
        title: "Conversion completed!",
        description: "Your Word document has been converted to PDF.",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred during conversion.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl || !file) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${file.name.replace(/\.(docx?|doc)$/i, '')}_converted.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your converted PDF is being downloaded.",
    });
  };

  const toolData = {
    title: "Convert Word to PDF Online Free - DOC DOCX to PDF Converter",
    description: "Convert Word documents (DOC, DOCX) to PDF format online for free. Maintain formatting and layout while converting Microsoft Word files to PDF instantly.",
    toolName: "Word to PDF Converter",
    toolUrl: "https://pdftoolspro.com/tools/word-to-pdf",
    breadcrumbs: [
      { name: "Tools", url: "https://pdftoolspro.com/#tools" },
      { name: "Document Conversion", url: "https://pdftoolspro.com/tools/word-to-pdf" }
    ],
    howToSteps: [
      "Upload your Word document (.doc or .docx) by clicking or dragging it into the upload area",
      "Wait for the file to be processed and validated",
      "Click 'Convert to PDF' to start the conversion process",
      "Download your converted PDF file once the conversion is complete"
    ],
    faqs: [
      {
        question: "Which Word formats are supported?",
        answer: "Our tool supports both .doc (older Word format) and .docx (newer Word format) files. You can upload documents created in any version of Microsoft Word."
      },
      {
        question: "Will my document formatting be preserved?",
        answer: "We do our best to preserve basic formatting like text, paragraphs, and structure. However, complex formatting like advanced tables or embedded objects may not be perfectly preserved due to browser limitations."
      },
      {
        question: "Is there a file size limit for Word documents?",
        answer: "While there's no strict limit, we recommend keeping files under 25MB for optimal performance. Larger files may take longer to process or may not work properly."
      }
    ],
    keywords: "Word to PDF converter, DOC to PDF, DOCX to PDF, convert Word document to PDF, Microsoft Word to PDF online free"
  };

  return (
    <ToolPageLayout {...toolData}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Word to PDF Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert your Microsoft Word documents (.docx, .doc) to PDF format quickly and easily with our free online tool.
          </p>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Browser Limitation Notice</h4>
              <p className="text-yellow-300 text-sm">
                This tool provides basic text extraction and conversion. For advanced formatting preservation, 
                consider using desktop software or server-based solutions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-blue-400 bg-blue-400/10"
                : file
                ? "border-green-400 bg-green-400/10"
                : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
            }`}
          >
            <input {...getInputProps()} />
            
            {file ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">File Ready</h3>
                  <p className="text-gray-300">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isDragActive ? "Drop your Word document here" : "Upload Word Document"}
                  </h3>
                  <p className="text-gray-400">
                    Drag and drop your .docx or .doc file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: .docx, .doc
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {file && (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <div className="text-center space-y-6">
              {!isConverting && !pdfUrl && (
                <Button
                  onClick={handleConvert}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
                >
                  Convert to PDF
                </Button>
              )}

              {isConverting && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="text-lg">Converting document...</span>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
                  </div>
                </div>
              )}

              {pdfUrl && (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-2">
                      Conversion Complete!
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Your Word document has been converted to PDF format.
                    </p>
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Document Conversion</h3>
            <p className="text-gray-400">
              Convert Word documents to PDF format for better compatibility and sharing.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-400">
              Supports both .docx and .doc file formats for maximum compatibility.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Download</h3>
            <p className="text-gray-400">
              Get your converted PDF file instantly after processing completes.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default WordToPDF;
