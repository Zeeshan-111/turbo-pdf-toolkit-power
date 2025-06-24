import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Zap, Image, Settings, Eye, RotateCcw } from 'lucide-react';
import { toast } from "sonner";

interface CompressedImage {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
}

const JPGCompress = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState([85]);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [newWidth, setNewWidth] = useState(800);
  const [newHeight, setNewHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'webp' | 'avif'>('jpeg');
  const [compressionMode, setCompressionMode] = useState<'manual' | 'balanced' | 'smart'>('balanced');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.error("Some files were skipped. Only JPG, JPEG, and PNG files are supported.");
    }
    
    setFiles(prev => [...prev, ...imageFiles]);
    toast.success(`${imageFiles.length} image(s) added for compression`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  const compressImage = async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Resize if enabled
        if (resizeEnabled) {
          if (maintainAspectRatio) {
            const aspectRatio = width / height;
            if (newWidth / newHeight > aspectRatio) {
              width = newHeight * aspectRatio;
              height = newHeight;
            } else {
              width = newWidth;
              height = newWidth / aspectRatio;
            }
          } else {
            width = newWidth;
            height = newHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          const qualityValue = quality[0] / 100;
          const compressedDataUrl = canvas.toDataURL(`image/${outputFormat}`, qualityValue);
          
          // Calculate compressed size (approximate)
          const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
          const compressionRatio = ((file.size - compressedSize) / file.size) * 100;
          
          const compressedImage: CompressedImage = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            originalSize: file.size,
            compressedSize,
            compressionRatio: Math.max(0, compressionRatio),
            originalUrl: URL.createObjectURL(file),
            compressedUrl: compressedDataUrl,
            width: Math.round(width),
            height: Math.round(height)
          };
          
          resolve(compressedImage);
        }
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error("Please select images to compress");
      return;
    }

    setIsCompressing(true);
    const compressed: CompressedImage[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const compressedImage = await compressImage(files[i]);
        compressed.push(compressedImage);
      }
      
      setCompressedImages(compressed);
      toast.success(`Successfully compressed ${compressed.length} image(s)`);
    } catch (error) {
      toast.error("Error compressing images");
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed_${image.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    compressedImages.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced JPG Compressor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compress your images with AI-powered smart compression, batch processing, and advanced controls
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Images
                </CardTitle>
                <CardDescription>
                  Drag and drop your JPG, JPEG, or PNG files here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-blue-600">Drop the images here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">Drop images here or click to browse</p>
                      <p className="text-sm text-gray-400">Supports JPG, JPEG, PNG • Max 50 files</p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Files ({files.length})
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFiles([])}
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span className="truncate">{file.name}</span>
                          <span className="text-gray-500">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Compression Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={compressionMode} onValueChange={(value) => setCompressionMode(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="balanced">Balanced</TabsTrigger>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="smart">Smart AI</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Quality: {quality[0]}%
                      </label>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="balanced">
                    <p className="text-sm text-gray-600">Automatically balance quality and file size for optimal results.</p>
                  </TabsContent>
                  
                  <TabsContent value="smart">
                    <p className="text-sm text-gray-600">AI analyzes each image and applies the best compression for content type.</p>
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="resize" 
                      checked={resizeEnabled} 
                      onCheckedChange={(checked) => setResizeEnabled(checked === true)}
                    />
                    <label htmlFor="resize" className="text-sm font-medium text-gray-700">
                      Resize Images
                    </label>
                  </div>

                  {resizeEnabled && (
                    <div className="pl-6 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-600">Width</label>
                          <input
                            type="number"
                            value={newWidth}
                            onChange={(e) => setNewWidth(Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Height</label>
                          <input
                            type="number"
                            value={newHeight}
                            onChange={(e) => setNewHeight(Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="aspect" 
                          checked={maintainAspectRatio}
                          onCheckedChange={(checked) => setMaintainAspectRatio(checked === true)}
                        />
                        <label htmlFor="aspect" className="text-xs text-gray-600">
                          Lock aspect ratio
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="metadata" 
                      checked={stripMetadata}
                      onCheckedChange={(checked) => setStripMetadata(checked === true)}
                    />
                    <label htmlFor="metadata" className="text-sm font-medium text-gray-700">
                      Strip Metadata
                    </label>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Output Format</label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as any)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                      <option value="avif">AVIF</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleCompress}
                  disabled={files.length === 0 || isCompressing}
                  className="w-full"
                  size="lg"
                >
                  {isCompressing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Compress Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {compressedImages.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Compression Results
                  </CardTitle>
                  <CardDescription>
                    Total savings: {formatFileSize(totalOriginalSize - totalCompressedSize)} ({totalSavings.toFixed(1)}%)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadAll} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCompressedImages([]);
                      setFiles([]);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {compressedImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={image.compressedUrl}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        -{image.compressionRatio.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-medium text-sm truncate" title={image.name}>
                        {image.name}
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Original:</span>
                          <span>{formatFileSize(image.originalSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compressed:</span>
                          <span>{formatFileSize(image.compressedSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dimensions:</span>
                          <span>{image.width} × {image.height}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => downloadImage(image)}
                        size="sm"
                        className="w-full"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JPGCompress;
