
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import { CheckCircle2, AlertCircle, Upload, FileText, X, Download } from "lucide-react";

interface ConversionJob {
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  outputBlob?: Blob;
  error?: string;
  pages?: number;
}

interface BatchPDFConverterProps {
  onConversionComplete: (jobs: ConversionJob[]) => void;
  maxFiles?: number;
}

export const BatchPDFConverter = ({ onConversionComplete, maxFiles = 10 }: BatchPDFConverterProps) => {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles,
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newJobs = acceptedFiles.map(file => ({
        file,
        status: 'pending' as const,
        progress: 0
      }));
      setJobs(prev => [...prev, ...newJobs]);
    }
  });

  const removeJob = (index: number) => {
    setJobs(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (!isProcessing) {
      setJobs([]);
    }
  };

  const startBatchConversion = async () => {
    if (jobs.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      for (let i = 0; i < jobs.length; i++) {
        setJobs(prev => prev.map((job, index) => 
          index === i ? { ...job, status: 'processing', progress: 10 } : job
        ));

        try {
          // Simulate conversion process
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setJobs(prev => prev.map((job, index) => 
            index === i ? { ...job, progress: 50 } : job
          ));

          // Here would be the actual conversion logic
          const mockBlob = new Blob(['Mock converted content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          
          setJobs(prev => prev.map((job, index) => 
            index === i ? { 
              ...job, 
              status: 'completed', 
              progress: 100, 
              outputBlob: mockBlob,
              pages: Math.floor(Math.random() * 20) + 1
            } : job
          ));

        } catch (error) {
          setJobs(prev => prev.map((job, index) => 
            index === i ? { 
              ...job, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Conversion failed'
            } : job
          ));
        }
      }

      onConversionComplete(jobs);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    jobs.forEach((job, index) => {
      if (job.outputBlob) {
        const url = URL.createObjectURL(job.outputBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${job.file.name.replace('.pdf', '')}_converted.docx`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'processing': return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const hasCompletedJobs = completedJobs > 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Batch PDF Conversion
            <Badge variant="secondary">{jobs.length}/{maxFiles}</Badge>
          </div>
          {jobs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isProcessing}
              className="text-gray-400 hover:text-white"
            >
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-400">Drop PDF files here...</p>
          ) : (
            <div>
              <p className="text-gray-300 mb-1">
                Drag & drop PDF files here, or click to select
              </p>
              <p className="text-gray-500 text-sm">
                Maximum {maxFiles} files
              </p>
            </div>
          )}
        </div>

        {jobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">
                {completedJobs}/{jobs.length} files converted
              </div>
              <div className="flex gap-2">
                {hasCompletedJobs && (
                  <Button size="sm" onClick={downloadAll}>
                    <Download className="w-4 h-4 mr-1" />
                    Download All
                  </Button>
                )}
                <Button
                  onClick={startBatchConversion}
                  disabled={isProcessing || jobs.length === 0}
                  size="sm"
                >
                  {isProcessing ? 'Converting...' : 'Start Conversion'}
                </Button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {jobs.map((job, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  {getStatusIcon(job.status)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {job.file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(job.file.size / 1024 / 1024).toFixed(2)} MB
                          {job.pages && ` • ${job.pages} pages`}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeJob(index)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white shrink-0"
                        disabled={isProcessing}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>

                    {job.status === 'processing' && (
                      <div className="mt-2">
                        <Progress value={job.progress} className="h-1" />
                      </div>
                    )}

                    {job.error && (
                      <p className="text-xs text-red-400 mt-1">{job.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
