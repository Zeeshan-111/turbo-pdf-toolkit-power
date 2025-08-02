import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Download, Loader2, CheckCircle, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useToast } from "@/hooks/use-toast";
import { PDFUtils } from "@/utils/pdfUtils";

const PNGToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/png')
    );
    
    if (imageFiles.length > 0) {
      setFiles(prev => [...prev, ...imageFiles]);
      setPdfUrl(null);
      toast({
        title: "Images uploaded successfully",
        description: `${imageFiles.length} PNG images added for conversion.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG files only.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"]
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setProgress(0);

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

      const pdfBytes = await PDFUtils.imagesToPDF(files);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsConverting(false);
      
      toast({
        title: "Conversion completed!",
        description: `Successfully converted ${files.length} PNG images to PDF.`,
      });
    } catch (error) {
      setIsConverting(false);
      setProgress(0);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your images. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'converted-images.pdf';
      link.click();
    }
  };

  const toolData = {
    title: "Convert PNG to PDF Online Free - High Quality Image to PDF Converter",
    description: "Convert PNG images to PDF instantly. Combine multiple PNG files into one PDF document with high quality. Free, fast, and secure PNG to PDF conversion.",
    toolName: "PNG to PDF Converter",
    toolUrl: "https://pdftoolspro.com/tools/png-to-pdf",
    breadcrumbs: [
      { name: "Tools", url: "https://pdftoolspro.com/#tools" },
      { name: "Image Conversion", url: "https://pdftoolspro.com/tools/png-to-pdf" }
    ],
    howToSteps: [
      "Upload your PNG image files by clicking or dragging them into the upload area",
      "Preview your selected images and remove any you don't want to include",
      "Click 'Convert to PDF' to start the conversion process",
      "Download your converted PDF file once the process is complete"
    ],
    faqs: [
      {
        question: "Can I convert multiple PNG images to one PDF?",
        answer: "Yes! You can upload multiple PNG files and our tool will combine them into a single PDF document. Each image will appear on a separate page in the PDF."
      },
      {
        question: "Will the image quality be preserved?",
        answer: "Absolutely. Our PNG to PDF converter maintains the original image quality and resolution. Your images will look exactly the same in the PDF as they do in their original PNG format."
      },
      {
        question: "Is there a file size limit for PNG images?",
        answer: "There are no strict file size limits. However, very large images may take longer to process. We recommend keeping individual images under 50MB for optimal performance."
      }
    ],
    keywords: "PNG to PDF converter, convert PNG to PDF, image to PDF, PNG to PDF online free, combine PNG files PDF"
  };

  return (
    <ToolPageLayout {...toolData}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            PNG to PDF Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert multiple PNG images into a single PDF document with high quality output and perfect formatting.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-teal-400 bg-teal-400/10"
                : files.length > 0
                ? "border-green-400 bg-green-400/10"
                : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {isDragActive ? "Drop your PNG files here" : "Upload PNG Files"}
                </h3>
                <p className="text-gray-400">
                  Drag and drop your PNG files here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload multiple images to create a single PDF
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Selected Images ({files.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-400 mt-1 text-center truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
            <div className="text-center space-y-6">
              {!isConverting && !pdfUrl && (
                <Button
                  onClick={handleConvert}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                >
                  Convert to PDF
                </Button>
              )}

              {isConverting && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
                    <span className="text-lg">Converting images...</span>
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
                      Your PNG images have been successfully converted to PDF.
                    </p>
                    <Button
                      onClick={downloadPDF}
                      size="lg"
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
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
            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">High Quality</h3>
            <p className="text-gray-400">
              Maintain image quality while creating professional PDF documents.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Images</h3>
            <p className="text-gray-400">
              Upload multiple PNG files and combine them into a single PDF.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Download</h3>
            <p className="text-gray-400">
              Get your converted PDF instantly with a single click.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default PNGToPDF;
