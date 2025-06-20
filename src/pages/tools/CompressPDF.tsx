
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Upload, FileText, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { PDFUtils } from "@/utils/pdfUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedData, setCompressedData] = useState<Uint8Array | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setCompressedData(null);
        setError(null);
        toast.success("PDF file uploaded successfully!");
      }
    },
    onDropRejected: () => {
      toast.error("Please upload a valid PDF file");
    }
  });

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const compressedPdf = await PDFUtils.compressPDF(file, compressionLevel);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setCompressedData(compressedPdf);
      setCompressedSize(compressedPdf.length);
      
      const compressionRatio = ((originalSize - compressedPdf.length) / originalSize * 100).toFixed(1);
      toast.success(`PDF compressed successfully! Reduced by ${compressionRatio}%`);
    } catch (err) {
      console.error('Compression error:', err);
      setError('Failed to compress PDF. Please try again with a different file.');
      toast.error("Failed to compress PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedData || !file) return;

    const blob = new Blob([compressedData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Compressed PDF downloaded successfully!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Compress PDF
          </h1>
          <p className="text-gray-300 text-lg">
            Reduce PDF file size while maintaining quality
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-400">Drop the PDF file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-300 mb-2">
                      Drag & drop a PDF file here, or click to select
                    </p>
                    <p className="text-gray-500 text-sm">
                      Maximum file size: 100MB
                    </p>
                  </div>
                )}
              </div>

              {file && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        Size: {formatFileSize(file.size)}
                      </p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compression Settings */}
          {file && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Compression Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { level: 'low' as const, title: 'Low', description: 'Minimal compression, highest quality' },
                    { level: 'medium' as const, title: 'Medium', description: 'Balanced compression and quality' },
                    { level: 'high' as const, title: 'High', description: 'Maximum compression, reduced quality' }
                  ].map((option) => (
                    <button
                      key={option.level}
                      onClick={() => setCompressionLevel(option.level)}
                      className={`p-4 rounded-lg border transition-colors ${
                        compressionLevel === option.level
                          ? 'border-blue-400 bg-blue-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <h3 className="font-medium text-white mb-1">{option.title}</h3>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleCompress}
                  disabled={isProcessing || !file}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isProcessing ? 'Compressing...' : 'Compress PDF'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          {isProcessing && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Compressing PDF...</span>
                    <span className="text-gray-300">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {compressedData && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Compression Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Original Size</p>
                    <p className="text-white font-bold text-lg">{formatFileSize(originalSize)}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Compressed Size</p>
                    <p className="text-white font-bold text-lg">{formatFileSize(compressedSize)}</p>
                  </div>
                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <p className="text-gray-400 text-sm">Size Reduction</p>
                    <p className="text-green-400 font-bold text-lg">{compressionRatio}%</p>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Compressed PDF
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Related Tools */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Related Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/tools/split-pdf"
                  className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-medium text-white mb-1">Split PDF</h3>
                  <p className="text-gray-400 text-sm">Extract specific pages from PDF files</p>
                </Link>
                <Link
                  to="/tools/merge-pdf"
                  className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-medium text-white mb-1">Merge PDF</h3>
                  <p className="text-gray-400 text-sm">Combine multiple PDF files into one</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompressPDF;
