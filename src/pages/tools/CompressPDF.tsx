import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, AlertCircle, Zap, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { BatchFileUploader } from "@/components/BatchFileUploader";
import { CompressionSettings, CompressionSettings as CompressionSettingsType } from "@/components/CompressionSettings";
import { EnhancedCompressionReport } from "@/components/EnhancedCompressionReport";
import { AdvancedPDFCompressor, CompressionResult } from "@/utils/advancedPdfCompression";

interface ProcessedFile extends CompressionResult {
  originalFile: File;
  fileName: string;
  mode: 'low' | 'medium' | 'high';
}

const CompressPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced compression settings
  const [compressionSettings, setCompressionSettings] = useState<CompressionSettingsType>({
    mode: 'medium',
    imageDPI: 96,
    removeMetadata: true,
    removeAnnotations: false,
    removeBookmarks: false,
    convertImagesToJPEG: true,
    imageQuality: 75
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessedFiles([]);
    setError(null);
  };

  const handleCompress = async (customSettings?: CompressionSettingsType) => {
    const settingsToUse = customSettings || compressionSettings;
    
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    const results: ProcessedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Compressing file ${i + 1}/${files.length}: ${file.name} with ${settingsToUse.mode} compression`);

        // Show progress toast with more detail
        toast.loading(`Optimizing ${file.name} - ${settingsToUse.mode} mode...`, {
          id: `compress-${i}`,
        });

        const compressionOptions = {
          mode: settingsToUse.mode,
          imageDPI: settingsToUse.imageDPI,
          removeMetadata: settingsToUse.removeMetadata,
          removeAnnotations: settingsToUse.removeAnnotations,
          removeBookmarks: settingsToUse.removeBookmarks,
          convertImagesToJPEG: settingsToUse.convertImagesToJPEG,
          imageQuality: settingsToUse.imageQuality
        };

        let result = await AdvancedPDFCompressor.compress(file, compressionOptions);
        
        // If compression is insufficient, show warning and suggest higher mode
        if (result.compressionRatio < 10) {
          toast.dismiss(`compress-${i}`);
          toast.warning(`${file.name}: Only ${result.compressionRatio}% reduction. File may already be optimized or contain mainly text.`);
        } else if (result.compressionRatio < 20) {
          toast.dismiss(`compress-${i}`);
          toast.success(`${file.name} compressed by ${result.compressionRatio}% - consider higher compression for more savings`);
        } else {
          toast.dismiss(`compress-${i}`);
          toast.success(`${file.name} compressed by ${result.compressionRatio}% - excellent savings!`);
        }
        
        results.push({
          ...result,
          originalFile: file,
          fileName: file.name,
          mode: result.mode // Now using the mode from the result
        });
      }

      setProcessedFiles(results);
      
      const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
      const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
      
      if (parseFloat(totalSavings) >= 20) {
        toast.success(`🎉 Excellent compression! Average savings: ${totalSavings}%`);
      } else if (parseFloat(totalSavings) >= 10) {
        toast.success(`Good compression achieved: ${totalSavings}% savings`);
      } else {
        toast.info(`Compression completed: ${totalSavings}% savings. Files may already be optimized.`);
      }
    } catch (err) {
      console.error('Compression error:', err);
      setError('Failed to compress some files. This may indicate corrupted files or unsupported PDF features.');
      toast.error("Compression failed - please ensure files are valid PDFs");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecompress = async (fileIndex: number, newMode: 'low' | 'medium' | 'high') => {
    const file = processedFiles[fileIndex];
    if (!file) return;

    const newSettings = { ...compressionSettings, mode: newMode };
    
    setIsProcessing(true);
    toast.loading(`Recompressing with ${newMode} mode...`);

    try {
      const compressionOptions = {
        mode: newMode,
        imageDPI: compressionSettings.imageDPI,
        removeMetadata: compressionSettings.removeMetadata,
        removeAnnotations: compressionSettings.removeAnnotations,
        removeBookmarks: compressionSettings.removeBookmarks,
        convertImagesToJPEG: compressionSettings.convertImagesToJPEG,
        imageQuality: compressionSettings.imageQuality
      };

      const result = await AdvancedPDFCompressor.compress(file.originalFile, compressionOptions);
      
      const updatedFile = {
        ...result,
        originalFile: file.originalFile,
        fileName: file.fileName,
        mode: result.mode // Use the mode from the result
      };

      const updatedFiles = [...processedFiles];
      updatedFiles[fileIndex] = updatedFile;
      setProcessedFiles(updatedFiles);

      toast.success(`Recompressed with ${result.compressionRatio}% reduction!`);
    } catch (err) {
      console.error('Recompression error:', err);
      toast.error("Recompression failed");
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

    processedFiles.forEach((processedFile, index) => {
      setTimeout(() => {
        handleDownloadSingle(processedFile);
      }, index * 500);
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
  const averageCompression = processedFiles.length > 0 
    ? processedFiles.reduce((sum, f) => sum + f.compressionRatio, 0) / processedFiles.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional PDF Compressor
          </h1>
          <p className="text-gray-300 text-lg">
            Advanced compression engine with 20-85% size reduction capability
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
            <span>✓ Smart image optimization</span>
            <span>✓ Metadata removal</span>
            <span>✓ Font optimization</span>
            <span>✓ Auto-retry for maximum savings</span>
          </div>
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

            {/* Compression Settings */}
            {files.length > 0 && !processedFiles.length && (
              <CompressionSettings
                settings={compressionSettings}
                onChange={setCompressionSettings}
                disabled={isProcessing}
              />
            )}

            {/* Process Button */}
            {files.length > 0 && !processedFiles.length && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <Button
                    onClick={() => handleCompress()}
                    disabled={isProcessing}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Optimizing {files.length} PDF{files.length > 1 ? 's' : ''}...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Compress & Optimize {files.length} PDF{files.length > 1 ? 's' : ''} ({compressionSettings.mode} mode)
                      </div>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Expected reduction: {compressionSettings.mode === 'high' ? '60-85%' : compressionSettings.mode === 'medium' ? '30-55%' : '10-25%'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {processedFiles.length > 0 && (
              <div className="space-y-6">
                {/* Overall Summary with enhanced metrics */}
                {processedFiles.length > 1 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Professional Compression Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center mb-4">
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <p className="text-gray-400 text-sm">Files Processed</p>
                          <p className="text-white font-bold text-lg">{processedFiles.length}</p>
                        </div>
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <p className="text-gray-400 text-sm">Total Original</p>
                          <p className="text-white font-bold text-lg">{formatFileSize(totalOriginalSize)}</p>
                        </div>
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <p className="text-gray-400 text-sm">Total Compressed</p>
                          <p className="text-white font-bold text-lg">{formatFileSize(totalCompressedSize)}</p>
                        </div>
                        <div className={`p-3 rounded-lg border ${
                          averageCompression >= 50 ? 'bg-green-900/20 border-green-700' :
                          averageCompression >= 25 ? 'bg-blue-900/20 border-blue-700' :
                          'bg-yellow-900/20 border-yellow-700'
                        }`}>
                          <p className="text-gray-400 text-sm">Average Savings</p>
                          <p className={`font-bold text-lg ${
                            averageCompression >= 50 ? 'text-green-400' :
                            averageCompression >= 25 ? 'text-blue-400' :
                            'text-yellow-400'
                          }`}>{averageCompression.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Space saved display */}
                      <div className="text-center p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg mb-4">
                        <p className="text-2xl font-bold text-purple-400">
                          {formatFileSize(totalOriginalSize - totalCompressedSize)}
                        </p>
                        <p className="text-gray-400 text-sm">Total space saved</p>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button
                          onClick={handleDownloadAll}
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          Download All Compressed Files ({processedFiles.length})
                        </Button>
                        <Button
                          onClick={() => {
                            setFiles([]);
                            setProcessedFiles([]);
                            setError(null);
                          }}
                          variant="outline"
                          className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          New Files
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Individual File Reports */}
                {processedFiles.map((processedFile, index) => (
                  <EnhancedCompressionReport
                    key={index}
                    originalSize={processedFile.originalSize}
                    compressedSize={processedFile.compressedSize}
                    compressionRatio={processedFile.compressionRatio}
                    optimizations={processedFile.optimizations}
                    fileName={processedFile.fileName}
                    mode={processedFile.mode}
                    onRecompress={(newMode) => handleRecompress(index, newMode)}
                    onDownload={() => handleDownloadSingle(processedFile)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy & Security */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• All processing happens locally in your browser</p>
                  <p>• No files uploaded to external servers</p>
                  <p>• Professional-grade compression algorithms</p>
                  <p>• GDPR & CCPA compliant</p>
                  <p>• Files automatically deleted after session</p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Compression Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Compression Technology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <h4 className="font-medium text-green-400 text-sm">Low (Lossless)</h4>
                    <p className="text-xs text-gray-400">10-25% reduction, maintains full quality, removes metadata</p>
                  </div>
                  <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <h4 className="font-medium text-blue-400 text-sm">Medium (Balanced)</h4>
                    <p className="text-xs text-gray-400">30-55% reduction, optimizes images & fonts, removes annotations</p>
                  </div>
                  <div className="p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
                    <h4 className="font-medium text-orange-400 text-sm">High (Maximum)</h4>
                    <p className="text-xs text-gray-400">60-85% reduction, aggressive optimization, removes all non-essential elements</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-900/20 border border-purple-700 rounded-lg">
                  <p className="text-xs text-purple-300">
                    <strong>Smart Auto-Retry:</strong> If compression is less than 10%, automatically upgrades to higher mode for better results.
                  </p>
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
