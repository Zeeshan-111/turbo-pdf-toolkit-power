
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, TrendingDown, RefreshCw, CheckCircle2 } from "lucide-react";

interface EnhancedCompressionReportProps {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  optimizations: string[];
  fileName: string;
  mode: 'low' | 'medium' | 'high';
  onRecompress?: (newMode: 'low' | 'medium' | 'high') => void;
  onDownload: () => void;
}

export const EnhancedCompressionReport = ({ 
  originalSize, 
  compressedSize, 
  compressionRatio,
  optimizations, 
  fileName,
  mode,
  onRecompress,
  onDownload
}: EnhancedCompressionReportProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const spaceSaved = originalSize - compressedSize;
  const getRatingColor = (ratio: number) => {
    if (ratio >= 60) return 'text-green-400';
    if (ratio >= 30) return 'text-blue-400';
    if (ratio >= 15) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getRatingText = (ratio: number) => {
    if (ratio >= 60) return 'Excellent';
    if (ratio >= 30) return 'Very Good';
    if (ratio >= 15) return 'Good';
    return 'Fair';
  };

  const modeLabels = {
    low: 'Low (Lossless)',
    medium: 'Medium (Balanced)',
    high: 'High (Maximum)'
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Compression Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
          <FileText className="w-8 h-8 text-blue-400" />
          <div className="flex-1">
            <p className="font-medium text-white">{fileName}</p>
            <p className="text-sm text-gray-400">
              Compressed using {modeLabels[mode]} mode
            </p>
          </div>
          <Badge className={`${getRatingColor(compressionRatio)}`}>
            {compressionRatio}% Reduced
          </Badge>
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

        {/* Compression Achievement */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              Compression Achievement
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getRatingColor(compressionRatio)}`}>
                {getRatingText(compressionRatio)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={Math.min(compressionRatio, 100)} 
              className="h-3" 
            />
            <p className="text-center text-sm text-gray-400">
              File size reduced by {compressionRatio}% • {formatFileSize(spaceSaved)} saved
            </p>
          </div>
        </div>

        {/* Optimizations Applied */}
        <div className="space-y-3">
          <h3 className="font-medium text-white">Optimizations Applied</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {optimizations.map((optimization, index) => (
              <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-700 rounded">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{optimization}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-700">
          <Button
            onClick={onDownload}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Compressed PDF
          </Button>
          
          {onRecompress && (
            <div className="flex gap-2">
              {mode !== 'low' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRecompress('low')}
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Low
                </Button>
              )}
              {mode !== 'medium' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRecompress('medium')}
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Medium
                </Button>
              )}
              {mode !== 'high' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRecompress('high')}
                  className="border-orange-400 text-orange-400 hover:bg-orange-400/10"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  High
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className={`text-xl font-bold ${getRatingColor(compressionRatio)}`}>
              {getRatingText(compressionRatio)}
            </p>
            <p className="text-xs text-gray-400">Quality Rating</p>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-bold text-blue-400">
              {(spaceSaved / (1024 * 1024)).toFixed(1)}MB
            </p>
            <p className="text-xs text-gray-400">Storage Saved</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-purple-400">
              {modeLabels[mode].split(' ')[0]}
            </p>
            <p className="text-xs text-gray-400">Compression Mode</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
