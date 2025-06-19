
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { PDFUtils } from "@/utils/pdfUtils";

const PDFToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedText, setConvertedText] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setConvertedText(null);
      setProgress(0);
      toast({
        title: "File uploaded successfully",
        description: `${uploadedFile.name} is ready for conversion.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    multiple: false
  });

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(10);

    try {
      console.log("Starting PDF to text extraction...");
      
      // Extract text from PDF
      setProgress(30);
      const extractedText = await PDFUtils.extractText(file);
      setProgress(70);
      
      if (!extractedText.trim()) {
        throw new Error("No text content found in the PDF. The PDF might contain only images.");
      }

      setConvertedText(extractedText);
      setProgress(100);

      toast({
        title: "Conversion completed!",
        description: "Your PDF text has been extracted successfully.",
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
    if (!convertedText || !file) return;

    try {
      // Create a simple RTF document (Rich Text Format) which can be opened by Word
      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${convertedText.replace(/\n/g, '\\par ')}}`;
      
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}_converted.rtf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your converted file is being downloaded as RTF format.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "An error occurred while downloading the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            PDF to Word Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Extract text content from PDF files and download as RTF format (compatible with Word).
          </p>
        </div>

        {/* Upload Area */}
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
                    {isDragActive ? "Drop your PDF here" : "Upload PDF File"}
                  </h3>
                  <p className="text-gray-400">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Controls */}
        {file && (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <div className="text-center space-y-6">
              {!isConverting && !convertedText && (
                <Button
                  onClick={handleConvert}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
                >
                  Extract Text from PDF
                </Button>
              )}

              {isConverting && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="text-lg">Extracting text from PDF...</span>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
                  </div>
                </div>
              )}

              {convertedText && (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-2">
                      Text Extraction Complete!
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Text has been successfully extracted from your PDF.
                    </p>
                    
                    {/* Preview of extracted text */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto text-left">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {convertedText.substring(0, 500)}
                        {convertedText.length > 500 && "..."}
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download as RTF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Text Extraction</h3>
            <p className="text-gray-400">
              Extracts all readable text content from your PDF files.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">RTF Format</h3>
            <p className="text-gray-400">
              Downloads as RTF format which is compatible with Microsoft Word.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Client-Side Processing</h3>
            <p className="text-gray-400">
              Your files are processed locally in your browser for privacy.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFToWord;
