
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Lock, Upload, Download, Loader2, CheckCircle, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { PDFUtils } from "@/utils/pdfUtils";

const LockPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lockedPdfUrl, setLockedPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setLockedPdfUrl(null);
      setProgress(0);
      toast({
        title: "File uploaded successfully",
        description: `${uploadedFile.name} is ready for password protection.`,
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

  const handleLockPDF = async () => {
    if (!file || !password) return;

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 4) {
      toast({
        title: "Password too short",
        description: "Password must be at least 4 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
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

      const lockedPdf = await PDFUtils.lockPDF(file, password);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const blob = new Blob([lockedPdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setLockedPdfUrl(url);

      toast({
        title: "PDF locked successfully!",
        description: "Your PDF has been password protected.",
      });
    } catch (error) {
      console.error("Lock PDF error:", error);
      toast({
        title: "Failed to lock PDF",
        description: error instanceof Error ? error.message : "An error occurred while protecting the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!lockedPdfUrl || !file) return;

    const link = document.createElement('a');
    link.href = lockedPdfUrl;
    link.download = `${file.name.replace('.pdf', '')}_locked.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your password-protected PDF is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Lock PDF with Password
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Protect your PDF files with password encryption to keep your documents secure.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-red-400 bg-red-400/10"
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
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Set Password Protection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="text-center space-y-6">
                {!isProcessing && !lockedPdfUrl && (
                  <Button
                    onClick={handleLockPDF}
                    disabled={!password || password !== confirmPassword}
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Lock PDF
                  </Button>
                )}

                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-6 h-6 animate-spin text-red-400" />
                      <span className="text-lg">Protecting your PDF...</span>
                    </div>
                    <div className="max-w-md mx-auto">
                      <Progress value={progress} className="h-3" />
                      <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
                    </div>
                  </div>
                )}

                {lockedPdfUrl && (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-green-400 mb-2">
                        PDF Protected Successfully!
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Your PDF has been password protected and is ready for download.
                      </p>
                      <Button
                        onClick={handleDownload}
                        size="lg"
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Protected PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Encryption</h3>
            <p className="text-gray-400">
              Your PDF is protected with strong password encryption for maximum security.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Custom Password</h3>
            <p className="text-gray-400">
              Set your own password to control access to your PDF documents.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Download</h3>
            <p className="text-gray-400">
              Download your password-protected PDF instantly after processing.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LockPDF;
