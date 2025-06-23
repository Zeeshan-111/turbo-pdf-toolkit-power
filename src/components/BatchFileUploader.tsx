
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Folder } from "lucide-react";

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  compressedSize?: number;
  error?: string;
}

interface BatchFileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  isProcessing?: boolean;
}

export const BatchFileUploader = ({ 
  onFilesSelected, 
  maxFiles = 10,
  isProcessing = false 
}: BatchFileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles,
    multiple: true,
    onDrop: useCallback((acceptedFiles: File[], rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error(`${rejectedFiles.length} files were rejected. Please upload only PDF files.`);
      }

      if (acceptedFiles.length > 0) {
        const newFiles = acceptedFiles.map(file => ({
          file,
          progress: 0,
          status: 'pending' as const
        }));

        setSelectedFiles(prev => {
          const combined = [...prev, ...newFiles];
          if (combined.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed. Only first ${maxFiles} files will be processed.`);
            return combined.slice(0, maxFiles);
          }
          return combined;
        });

        onFilesSelected(acceptedFiles);
        toast.success(`${acceptedFiles.length} PDF files added successfully!`);
      }
    }, [maxFiles, onFilesSelected])
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    onFilesSelected([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'processing': return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const totalSize = selectedFiles.reduce((sum, item) => sum + item.file.size, 0);
  const completedFiles = selectedFiles.filter(f => f.status === 'completed').length;

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Batch Upload PDFs
            <Badge variant="secondary" className="ml-2">
              {selectedFiles.length}/{maxFiles}
            </Badge>
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
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-400">Drop the PDF files here...</p>
            ) : (
              <div>
                <p className="text-gray-300 mb-2">
                  Drag & drop PDF files here, or click to select
                </p>
                <p className="text-gray-500 text-sm">
                  Maximum {maxFiles} files • Up to 100MB each
                </p>
              </div>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  <span className="font-medium">{selectedFiles.length} files selected</span>
                  <span className="ml-2 text-gray-500">({formatFileSize(totalSize)})</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-gray-400 hover:text-white"
                >
                  Clear All
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {selectedFiles.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    {getStatusIcon(item.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {item.file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(item.file.size)}
                            {item.compressedSize && (
                              <span className="ml-2 text-green-400">
                                → {formatFileSize(item.compressedSize)}
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white shrink-0"
                          disabled={isProcessing}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {item.status === 'processing' && (
                        <div className="mt-2">
                          <Progress value={item.progress} className="h-1" />
                        </div>
                      )}

                      {item.error && (
                        <p className="text-xs text-red-400 mt-1">{item.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {completedFiles > 0 && (
                <div className="text-center text-sm text-green-400">
                  ✅ {completedFiles} of {selectedFiles.length} files compressed successfully
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
