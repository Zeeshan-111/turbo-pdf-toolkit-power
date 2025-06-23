
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Download, TrendingDown } from "lucide-react";

interface CompressionReportProps {
  originalSize: number;
  compressedSize: number;
  optimizations: string[];
  fileName: string;
}

export const CompressionReport = ({ 
  originalSize, 
  compressedSize, 
  optimizations, 
  fileName 
}: CompressionReportProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionPercentage = ((originalSize - compressedSize) / originalSize * 100);
  const spaceSaved = originalSize - compressedSize;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Compression Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
          <FileText className="w-8 h-8 text-blue-400" />
          <div>
            <p className="font-medium text-white">{fileName}</p>
            <p className="text-sm text-gray-400">PDF Document</p>
          </div>
        </div>

        {/* Size Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-1">Original Size</p>
            <p className="text-white font-bold text-lg">{formatFileSize(originalSize)}</p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-1">Compressed Size</p>
            <p className="text-white font-bold text-lg">{formatFileSize(compressedSize)}</p>
          </div>
          
          <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-1">Space Saved</p>
            <p className="text-green-400 font-bold text-lg">{formatFileSize(spaceSaved)}</p>
          </div>
        </div>

        {/* Compression Percentage */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              Compression Achievement
            </h3>
            <Badge className="bg-green-900 text-green-100">
              {compressionPercentage.toFixed(1)}% Reduced
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={compressionPercentage} 
              className="h-3" 
            />
            <p className="text-center text-sm text-gray-400">
              File size reduced by {compressionPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Optimizations Applied */}
        {optimizations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-white">Optimizations Applied</h3>
            <div className="space-y-2">
              {optimizations.map((optimization, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">{optimization}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {compressionPercentage >= 50 ? 'Excellent' : compressionPercentage >= 30 ? 'Good' : 'Fair'}
            </p>
            <p className="text-sm text-gray-400">Compression Rating</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {(spaceSaved / (1024 * 1024)).toFixed(1)}MB
            </p>
            <p className="text-sm text-gray-400">Storage Saved</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
