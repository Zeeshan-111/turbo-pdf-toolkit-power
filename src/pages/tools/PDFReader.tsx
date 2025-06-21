
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, Loader2, CheckCircle, ZoomIn, ZoomOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const PDFReader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setIsLoading(true);
      
      // Create object URL for PDF viewing
      const url = URL.createObjectURL(uploadedFile);
      setPdfUrl(url);
      setIsLoading(false);
      
      toast({
        title: "PDF loaded successfully",
        description: `${uploadedFile.name} is ready for viewing.`,
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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (!file) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your PDF file is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            PDF Reader
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            View and read your PDF files online with zoom controls and dark mode support.
          </p>
        </div>

        {!file && (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-indigo-400 bg-indigo-400/10"
                  : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
              }`}
            >
              <input {...getInputProps()} />
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
                    Start reading your PDF documents instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {file && (
          <>
            {/* Toolbar */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold truncate max-w-xs">{file.name}</h3>
                <span className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleZoomOut}
                  size="sm"
                  variant="outline"
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm px-2">{zoom}%</span>
                <Button
                  onClick={handleZoomIn}
                  size="sm"
                  variant="outline"
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-gray-600 mx-2"></div>
                
                <Button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  size="sm"
                  variant="outline"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={handleDownload}
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className={`bg-gray-800 rounded-lg border border-gray-700 overflow-hidden ${isDarkMode ? 'bg-gray-900' : ''}`}>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                  <span className="ml-2 text-lg">Loading PDF...</span>
                </div>
              ) : pdfUrl ? (
                <div className="h-screen max-h-[80vh] overflow-auto">
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                    className="w-full h-full min-h-[600px]"
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'top left',
                      filter: isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none'
                    }}
                    title="PDF Viewer"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <FileText className="w-12 h-12 mb-4" />
                  <p>No PDF loaded</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <ZoomIn className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Zoom Controls</h3>
            <p className="text-gray-400">
              Zoom in and out to read your PDF documents at your preferred size.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Moon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dark Mode</h3>
            <p className="text-gray-400">
              Toggle dark mode for comfortable reading in low-light environments.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Download Ready</h3>
            <p className="text-gray-400">
              Download the original PDF file anytime during or after viewing.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFReader;
