
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { Upload, Download, FileText, Scissors, ArrowLeft, CheckSquare, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PDFUtils } from "@/utils/pdfUtils";

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [processedFile, setProcessedFile] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setProcessedFile(null);
      setSelectedPages([]);
      setPageImages([]);
      
      try {
        setIsProcessing(true);
        setProgress(20);
        
        // Get page count
        const pageCount = await PDFUtils.getPageCount(uploadedFile);
        setTotalPages(pageCount);
        setProgress(40);
        
        // Generate page thumbnails
        const images = await PDFUtils.pdfToImages(uploadedFile, 'jpeg');
        setPageImages(images);
        setProgress(100);
        
        toast({
          title: "PDF loaded successfully",
          description: `${pageCount} pages ready for selection`,
        });
      } catch (error) {
        console.error('Error processing PDF:', error);
        toast({
          title: "Error",
          description: "Failed to load PDF. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNumber)) {
        return prev.filter(p => p !== pageNumber);
      } else {
        return [...prev, pageNumber].sort((a, b) => a - b);
      }
    });
  };

  const selectAllPages = () => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  const selectPageRange = (start: number, end: number) => {
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    setSelectedPages(range);
  };

  const processSplitPDF = async () => {
    if (!file || selectedPages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one page to extract.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(25);

      const result = await PDFUtils.splitPDF(file, selectedPages);
      setProgress(100);
      setProcessedFile(result);

      toast({
        title: "PDF split successfully",
        description: `Extracted ${selectedPages.length} pages`,
      });
    } catch (error) {
      console.error('Error splitting PDF:', error);
      toast({
        title: "Error",
        description: "Failed to split PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadFile = () => {
    if (!processedFile) return;

    const blob = new Blob([processedFile], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `split-${file?.name || 'document.pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setProcessedFile(null);
    setSelectedPages([]);
    setPageImages([]);
    setTotalPages(0);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mr-4">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Split PDF
                </h1>
                <p className="text-gray-400 mt-2">Extract specific pages from your PDF document</p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragActive
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? "Drop your PDF here" : "Upload PDF to Split"}
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop your PDF file here, or click to browse
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Choose File
              </Button>
            </div>
          )}

          {/* Processing */}
          {isProcessing && !pageImages.length && (
            <div className="bg-gray-800 rounded-xl p-8 text-center animate-fade-in">
              <Loader2 className="w-12 h-12 text-orange-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-4">Processing PDF...</h3>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
              <p className="text-gray-400 mt-2">{progress}% complete</p>
            </div>
          )}

          {/* Page Selection */}
          {file && pageImages.length > 0 && !processedFile && (
            <div className="bg-gray-800 rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Select Pages to Extract</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllPages}
                    className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                  >
                    {selectedPages.length === totalPages ? "Deselect All" : "Select All"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectPageRange(1, Math.ceil(totalPages / 2))}
                    className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                  >
                    First Half
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectPageRange(Math.ceil(totalPages / 2) + 1, totalPages)}
                    className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                  >
                    Second Half
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {pageImages.map((image, index) => {
                  const pageNumber = index + 1;
                  const isSelected = selectedPages.includes(pageNumber);
                  
                  return (
                    <div
                      key={index}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isSelected ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-gray-800" : ""
                      }`}
                      onClick={() => togglePageSelection(pageNumber)}
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <img
                          src={image}
                          alt={`Page ${pageNumber}`}
                          className="w-full h-auto"
                        />
                        <div className="p-2 text-center text-gray-800 text-sm font-medium">
                          Page {pageNumber}
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        {isSelected ? (
                          <CheckSquare className="w-6 h-6 text-orange-400 bg-white rounded" />
                        ) : (
                          <Square className="w-6 h-6 text-gray-400 bg-white rounded" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  {selectedPages.length} of {totalPages} pages selected
                </p>
                
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={resetTool}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Upload New PDF
                  </Button>
                  
                  <Button
                    onClick={processSplitPDF}
                    disabled={selectedPages.length === 0 || isProcessing}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Splitting...
                      </>
                    ) : (
                      <>
                        <Scissors className="w-4 h-4 mr-2" />
                        Split PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Processing Split */}
          {isProcessing && processedFile === null && pageImages.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-8 text-center animate-fade-in mt-6">
              <Loader2 className="w-12 h-12 text-orange-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-4">Splitting PDF...</h3>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
              <p className="text-gray-400 mt-2">Extracting {selectedPages.length} pages</p>
            </div>
          )}

          {/* Download Result */}
          {processedFile && (
            <div className="bg-gray-800 rounded-xl p-8 text-center animate-fade-in">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">PDF Split Successfully!</h3>
              <p className="text-gray-400 mb-6">
                Your PDF has been split. Extracted {selectedPages.length} pages.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={downloadFile}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Split PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetTool}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  Split Another PDF
                </Button>
              </div>
            </div>
          )}

          {/* Related Tools */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/tools/merge-pdf"
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Merge PDF</h4>
                <p className="text-gray-400">Combine multiple PDF files into one document</p>
              </Link>

              <Link
                to="/tools/pdf-to-jpg"
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold mb-2">PDF to JPG</h4>
                <p className="text-gray-400">Convert PDF pages to high-quality JPG images</p>
              </Link>

              <Link
                to="/tools/pdf-to-png"
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold mb-2">PDF to PNG</h4>
                <p className="text-gray-400">Convert PDF pages to high-quality PNG images</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SplitPDF;
