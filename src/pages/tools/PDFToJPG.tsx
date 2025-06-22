
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, Loader2, CheckCircle, Image, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { PDFUtils } from "@/utils/pdfUtils";

const PDFToJPG = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setImages([]);
      setError(null);
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
    setProgress(0);
    setError(null);

    try {
      console.log('Starting PDF to JPG conversion for:', file.name);
      
      // Progressive progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 15;
        });
      }, 500);
      
      const convertedImages = await PDFUtils.pdfToImages(file, 'jpeg');
      
      clearInterval(progressInterval);
      setProgress(100);
      setImages(convertedImages);
      
      toast({
        title: "Conversion completed!",
        description: `Successfully converted ${convertedImages.length} pages to JPG format.`,
      });
    } catch (error) {
      console.error('Conversion failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to convert PDF to JPG';
      setError(errorMessage);
      setProgress(0);
      toast({
        title: "Conversion failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = (imageData: string, index: number) => {
    try {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `${file?.name?.replace('.pdf', '') || 'page'}-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Page ${index + 1} JPG is downloading.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadAllImages = () => {
    if (images.length === 0) return;
    
    images.forEach((imageData, index) => {
      setTimeout(() => downloadImage(imageData, index), index * 300);
    });
    
    toast({
      title: "Download started",
      description: `All ${images.length} JPG images are being downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            PDF to JPG Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert each page of your PDF into high-quality JPG images for easy sharing and editing.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-orange-400 bg-orange-400/10"
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
                </div>
              </div>
            )}
          </div>
        </div>

        {file && (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <div className="text-center space-y-6">
              {!isConverting && images.length === 0 && !error && (
                <Button
                  onClick={handleConvert}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                >
                  Convert to JPG
                </Button>
              )}

              {isConverting && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
                    <span className="text-lg">Converting your PDF to JPG...</span>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
                  </div>
                </div>
              )}

              {error && !isConverting && (
                <div className="space-y-4">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-400 mb-2">
                      Conversion Failed
                    </h3>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <Button
                      onClick={handleConvert}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-xl font-semibold text-green-400">
                        Conversion Complete!
                      </h3>
                      <p className="text-gray-300">
                        {images.length} pages converted to JPG
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {images.map((imageData, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageData}
                          alt={`Page ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            onClick={() => downloadImage(imageData, index)}
                            size="sm"
                            className="bg-white/20 hover:bg-white/30"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-center">
                          Page {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={downloadAllImages}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download All Images
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">High Quality</h3>
            <p className="text-gray-400">
              Convert PDF pages to high-resolution JPG images with excellent clarity.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Page by Page</h3>
            <p className="text-gray-400">
              Each PDF page is converted to a separate JPG image file.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Download</h3>
            <p className="text-gray-400">
              Download individual images or get all images at once.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFToJPG;
