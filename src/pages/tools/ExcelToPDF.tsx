
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Download, FileSpreadsheet, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PDFUtils } from "@/utils/pdfUtils";

const ExcelToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const excelFiles = acceptedFiles.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );
    
    if (excelFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only Excel files (.xlsx, .xls)",
        variant: "destructive",
      });
    }
    
    setFiles(excelFiles);
    setProcessedFile(null);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleConvert = async () => {
    if (!files.length) return;

    setIsProcessing(true);
    try {
      const result = await PDFUtils.excelToPDF(files[0]);
      setProcessedFile(result);
      toast({
        title: "Success!",
        description: "Excel file converted to PDF successfully",
      });
    } catch (error) {
      console.error('Excel to PDF conversion error:', error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "Failed to convert Excel to PDF",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;

    const blob = new Blob([processedFile], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${files[0]?.name.replace(/\.[^/.]+$/, '') || 'converted'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "PDF file downloaded successfully",
    });
  };

  const resetFiles = () => {
    setFiles([]);
    setProcessedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Excel to PDF Converter
            </h1>
            <p className="text-gray-300 text-lg">
              Convert your Excel spreadsheets to PDF documents quickly and easily
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Upload Excel File
              </CardTitle>
              <CardDescription className="text-gray-400">
                Supports .xlsx and .xls files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!files.length ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">
                    {isDragActive
                      ? "Drop your Excel file here"
                      : "Drag & drop an Excel file here, or click to browse"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supports .xlsx and .xls files
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-green-400" />
                        <div>
                          <p className="text-white font-medium">{files[0].name}</p>
                          <p className="text-gray-400 text-sm">
                            {(files[0].size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFiles}
                        className="text-gray-400 hover:text-white"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleConvert}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        "Convert to PDF"
                      )}
                    </Button>

                    {processedFile && (
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>

                  {processedFile && (
                    <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Conversion Complete!</span>
                      </div>
                      <p className="text-gray-300 mt-1">
                        Your Excel file has been successfully converted to PDF.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-white">High Quality Output</h3>
                  <p className="text-sm">Maintains formatting and layout of your spreadsheets</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-white">Fast Processing</h3>
                  <p className="text-sm">Quick conversion without compromising quality</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-white">Secure & Private</h3>
                  <p className="text-sm">Files are processed locally in your browser</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-white">Multiple Formats</h3>
                  <p className="text-sm">Supports both .xlsx and .xls file formats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExcelToPDF;
