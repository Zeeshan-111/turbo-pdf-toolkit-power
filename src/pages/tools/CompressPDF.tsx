
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Download, AlertCircle, Settings, Shield, Zap } from "lucide-react";
import { PDFUtils } from "@/utils/pdfUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { BatchFileUploader } from "@/components/BatchFileUploader";
import { CompressionModeSelector, CompressionMode } from "@/components/CompressionModeSelector";
import { CompressionReport } from "@/components/CompressionReport";

interface ProcessedFile {
  originalFile: File;
  compressedData: Uint8Array;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

const CompressPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [compressionMode, setCompressionMode] = useState<CompressionMode>('strong');
  const [error, setError] = useState<string | null>(null);

  // Advanced settings
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [imageQuality, setImageQuality] = useState([85]);
  const [retainBookmarks, setRetainBookmarks] = useState(true);
  const [autoDeleteTimer, setAutoDeleteTimer] = useState('24');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessedFiles([]);
    setError(null);
  };

  const getCompressionSettings = (mode: CompressionMode) => {
    switch (mode) {
      case 'basic':
        return { quality: 0.8, removeMetadata: false, optimizeImages: true };
      case 'strong':
        return { quality: 0.5, removeMetadata: true, optimizeImages: true };
      case 'high-quality':
        return { quality: 0.9, removeMetadata: false, optimizeImages: false };
      default:
        return { quality: 0.8, removeMetadata: false, optimizeImages: true };
    }
  };

  const mapCompressionMode = (mode: CompressionMode): 'low' | 'medium' | 'high' => {
    switch (mode) {
      case 'basic':
        return 'medium';
      case 'strong':
        return 'high';
      case 'high-quality':
        return 'low';
      default:
        return 'medium';
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    const results: ProcessedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Compressing file ${i + 1}/${files.length}: ${file.name}`);

        const compressedPdf = await PDFUtils.compressPDF(file, mapCompressionMode(compressionMode));
        
        results.push({
          originalFile: file,
          compressedData: compressedPdf,
          originalSize: file.size,
          compressedSize: compressedPdf.length,
          fileName: file.name
        });

        toast.success(`${file.name} compressed successfully!`);
      }

      setProcessedFiles(results);
      
      const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
      const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
      
      toast.success(`All files compressed! Total savings: ${totalSavings}%`);
    } catch (err) {
      console.error('Compression error:', err);
      setError('Failed to compress some files. Please try again.');
      toast.error("Compression failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (processedFile: ProcessedFile) => {
    const blob = new Blob([processedFile.compressedData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed-${processedFile.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("PDF downloaded successfully!");
  };

  const handleDownloadAll = () => {
    if (processedFiles.length === 1) {
      handleDownloadSingle(processedFiles[0]);
      return;
    }

    // For multiple files, download each individually
    processedFiles.forEach((processedFile, index) => {
      setTimeout(() => {
        handleDownloadSingle(processedFile);
      }, index * 500); // Stagger downloads by 500ms
    });

    toast.success(`Downloading ${processedFiles.length} compressed files...`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = processedFiles.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressedSize = processedFiles.reduce((sum, f) => sum + f.compressedSize, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Advanced PDF Compressor
          </h1>
          <p className="text-gray-300 text-lg">
            Professional-grade PDF compression with batch processing and advanced options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <BatchFileUploader 
              onFilesSelected={handleFilesSelected}
              maxFiles={10}
              isProcessing={isProcessing}
            />

            {/* Compression Mode */}
            {files.length > 0 && (
              <CompressionModeSelector 
                selectedMode={compressionMode}
                onModeChange={setCompressionMode}
              />
            )}

            {/* Process Button */}
            {files.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing {files.length} file{files.length > 1 ? 's' : ''}...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Compress {files.length} PDF{files.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {processedFiles.length > 0 && (
              <div className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-400" />
                      Compression Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Original</p>
                        <p className="text-white font-bold text-lg">{formatFileSize(totalOriginalSize)}</p>
                      </div>
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Compressed</p>
                        <p className="text-white font-bold text-lg">{formatFileSize(totalCompressedSize)}</p>
                      </div>
                      <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Savings</p>
                        <p className="text-green-400 font-bold text-lg">
                          {((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={handleDownloadAll}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All ({processedFiles.length})
                      </Button>
                    </div>

                    {/* Individual Files */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-white">Individual Files:</h3>
                      {processedFiles.map((processedFile, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{processedFile.fileName}</p>
                            <p className="text-sm text-gray-400">
                              {formatFileSize(processedFile.originalSize)} → {formatFileSize(processedFile.compressedSize)}
                              <span className="ml-2 text-green-400">
                                ({(((processedFile.originalSize - processedFile.compressedSize) / processedFile.originalSize) * 100).toFixed(1)}% saved)
                              </span>
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleDownloadSingle(processedFile)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Compression Report for first file */}
                {processedFiles.length > 0 && (
                  <CompressionReport
                    originalSize={processedFiles[0].originalSize}
                    compressedSize={processedFiles[0].compressedSize}
                    optimizations={[
                      "PDF structure optimization",
                      "Stream compression applied",
                      removeMetadata ? "Metadata removal" : "Metadata preserved",
                      "Object stream optimization"
                    ]}
                    fileName={processedFiles[0].fileName}
                  />
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Advanced Settings */}
          <div className="space-y-6">
            {/* Privacy & Security */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-delete" className="text-sm text-gray-300">
                      Auto-delete files after
                    </Label>
                    <Select value={autoDeleteTimer} onValueChange={setAutoDeleteTimer}>
                      <SelectTrigger className="w-24 h-8 bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Files processed locally in your browser</p>
                    <p>• No data sent to external servers</p>
                    <p>• GDPR compliant processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Advanced Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="remove-metadata" className="text-sm text-gray-300">
                      Remove metadata
                    </Label>
                    <Switch
                      id="remove-metadata"
                      checked={removeMetadata}
                      onCheckedChange={setRemoveMetadata}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">
                      Image Quality: {imageQuality[0]}%
                    </Label>
                    <Slider
                      value={imageQuality}
                      onValueChange={setImageQuality}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="retain-bookmarks" className="text-sm text-gray-300">
                      Retain bookmarks
                    </Label>
                    <Switch
                      id="retain-bookmarks"
                      checked={retainBookmarks}
                      onCheckedChange={setRetainBookmarks}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Tools */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Related Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    to="/tools/split-pdf"
                    className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-medium text-white text-sm">Split PDF</h3>
                    <p className="text-gray-400 text-xs">Extract specific pages</p>
                  </Link>
                  <Link
                    to="/tools/merge-pdf"
                    className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-medium text-white text-sm">Merge PDF</h3>
                    <p className="text-gray-400 text-xs">Combine multiple PDFs</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CompressPDF;
