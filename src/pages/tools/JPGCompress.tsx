import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Image, Settings, FileImage, Trash2, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  compressionRatio: number;
  previewUrl: string;
}

const JPGCompress = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState([80]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [maxWidth, setMaxWidth] = useState([0]);
  const [maxHeight, setMaxHeight] = useState([0]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid files detected",
        description: "Only JPG and PNG images are supported",
        variant: "destructive"
      });
    }
    
    setFiles(prev => [...prev, ...imageFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  const compressImage = async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Apply max dimensions if specified
        if (maxWidth[0] > 0 && width > maxWidth[0]) {
          height = (height * maxWidth[0]) / width;
          width = maxWidth[0];
        }
        
        if (maxHeight[0] > 0 && height > maxHeight[0]) {
          width = (width * maxHeight[0]) / height;
          height = maxHeight[0];
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx!.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressionRatio = ((file.size - blob.size) / file.size) * 100;
              resolve({
                id: Math.random().toString(36).substr(2, 9),
                originalFile: file,
                originalSize: file.size,
                compressedBlob: blob,
                compressedSize: blob.size,
                compressionRatio,
                previewUrl: URL.createObjectURL(blob)
              });
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png',
          quality[0] / 100
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select images to compress",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCompressedImages([]);

    try {
      const compressed: CompressedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const compressedImage = await compressImage(files[i]);
        compressed.push(compressedImage);
        setProgress(((i + 1) / files.length) * 100);
      }
      
      setCompressedImages(compressed);
      toast({
        title: "Compression complete",
        description: `Successfully compressed ${compressed.length} image(s)`
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "An error occurred while compressing images",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (compressedImage: CompressedImage) => {
    const url = URL.createObjectURL(compressedImage.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${compressedImage.originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    compressedImages.forEach(downloadSingle);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setCompressedImages([]);
    setProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              JPG Compressor
            </h1>
            <p className="text-gray-300 text-lg">
              Reduce image file sizes while maintaining quality
            </p>
          </div>

          <Tabs defaultValue="compress" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compress">Compress Images</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="compress" className="space-y-6">
              {/* File Upload Area */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Images
                  </CardTitle>
                  <CardDescription>
                    Select JPG or PNG images to compress
                  </CardDescription>
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
                    <FileImage className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-blue-400">Drop the images here...</p>
                    ) : (
                      <div>
                        <p className="text-gray-300 mb-2">
                          Drag & drop images here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG and PNG files
                        </p>
                      </div>
                    )}
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAll}
                          className="text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {files.map((file, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium truncate">
                                {file.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:bg-red-400/10 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={handleCompress}
                          disabled={isProcessing || files.length === 0}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          {isProcessing ? 'Compressing...' : 'Compress Images'}
                        </Button>
                      </div>

                      {isProcessing && (
                        <div className="mt-4">
                          <Label className="text-sm text-gray-300 mb-2 block">
                            Compression Progress
                          </Label>
                          <Progress value={progress} className="w-full" />
                          <p className="text-sm text-gray-400 mt-1">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              {compressedImages.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Compressed Images
                      </CardTitle>
                      <Button
                        onClick={downloadAll}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {compressedImages.map((img) => (
                        <div key={img.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={img.previewUrl}
                              alt="Compressed preview"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium mb-2 truncate">
                                {img.originalFile.name}
                              </h4>
                              <div className="space-y-1 text-sm text-gray-300">
                                <div className="flex justify-between">
                                  <span>Original:</span>
                                  <span>{formatFileSize(img.originalSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Compressed:</span>
                                  <span>{formatFileSize(img.compressedSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Saved:</span>
                                  <Badge variant="secondary" className="text-green-400">
                                    {img.compressionRatio.toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                onClick={() => downloadSingle(img)}
                                size="sm"
                                className="mt-3 w-full"
                                variant="outline"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Compression Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Quality: {quality[0]}%
                    </Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Higher quality means larger file size
                    </p>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Maximum Width (0 = no limit)
                    </Label>
                    <Slider
                      value={maxWidth}
                      onValueChange={setMaxWidth}
                      max={4000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Current: {maxWidth[0] === 0 ? 'No limit' : `${maxWidth[0]}px`}
                    </p>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Maximum Height (0 = no limit)
                    </Label>
                    <Slider
                      value={maxHeight}
                      onValueChange={setMaxHeight}
                      max={4000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Current: {maxHeight[0] === 0 ? 'No limit' : `${maxHeight[0]}px`}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onCheckedChange={(checked) => setMaintainAspectRatio(!!checked)}
                      />
                      <Label htmlFor="aspect-ratio">
                        Maintain aspect ratio
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remove-metadata"
                        checked={removeMetadata}
                        onCheckedChange={(checked) => setRemoveMetadata(!!checked)}
                      />
                      <Label htmlFor="remove-metadata">
                        Remove metadata (EXIF data)
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JPGCompress;
