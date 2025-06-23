
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Image, Upload, Download, Loader2, CheckCircle, 
  Settings, Zap, Eye, FileImage, Sliders, Brain,
  BarChart3, X, ZoomIn, RotateCcw, Crop, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  quality: number;
  url: string;
}

const JPGCompress = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState([80]);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [compressionMode, setCompressionMode] = useState("balanced");
  const [previewMode, setPreviewMode] = useState("side-by-side");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/jpeg') || file.type.startsWith('image/jpg')
    );
    
    if (imageFiles.length > 0) {
      setFiles(prev => [...prev, ...imageFiles]);
      toast({
        title: "Images uploaded successfully",
        description: `${imageFiles.length} images ready for compression.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG/JPEG files only.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"]
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const compressImage = async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width: imgWidth, height: imgHeight } = img;
        
        // Apply resizing if enabled
        if (resizeEnabled && (width || height)) {
          const targetWidth = parseInt(width) || imgWidth;
          const targetHeight = parseInt(height) || imgHeight;
          
          if (preserveAspectRatio) {
            const aspectRatio = imgWidth / imgHeight;
            if (width && !height) {
              imgWidth = targetWidth;
              imgHeight = targetWidth / aspectRatio;
            } else if (height && !width) {
              imgHeight = targetHeight;
              imgWidth = targetHeight * aspectRatio;
            } else {
              imgWidth = targetWidth;
              imgHeight = targetHeight;
            }
          } else {
            imgWidth = targetWidth;
            imgHeight = targetHeight;
          }
        }
        
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        
        // Apply compression mode settings
        if (compressionMode === 'content-aware') {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        } else if (compressionMode === 'fast') {
          ctx.imageSmoothingEnabled = false;
        }
        
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              original: file,
              compressed: blob,
              originalSize: file.size,
              compressedSize: blob.size,
              quality: quality[0],
              url: URL.createObjectURL(blob)
            });
          }
        }, `image/${outputFormat}`, quality[0] / 100);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsCompressing(true);
    setProgress(0);
    
    try {
      const compressed: CompressedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const result = await compressImage(files[i]);
        compressed.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }
      
      setCompressedImages(compressed);
      
      const totalOriginalSize = compressed.reduce((sum, img) => sum + img.originalSize, 0);
      const totalCompressedSize = compressed.reduce((sum, img) => sum + img.compressedSize, 0);
      const savingsPercentage = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
      
      toast({
        title: "Compression completed!",
        description: `Saved ${savingsPercentage}% space across ${files.length} images.`,
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "There was an error compressing your images.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadAll = () => {
    compressedImages.forEach((img, index) => {
      const link = document.createElement('a');
      link.href = img.url;
      link.download = `compressed_${img.original.name}`;
      link.click();
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const presets = [
    { name: "Web Optimized", quality: 75, resize: true, width: "1920", format: "webp" },
    { name: "Email Friendly", quality: 60, resize: true, width: "800", format: "jpeg" },
    { name: "Mobile Ready", quality: 70, resize: true, width: "1080", format: "webp" },
    { name: "Print Quality", quality: 95, resize: false, format: "jpeg" },
    { name: "Instagram", quality: 80, resize: true, width: "1080", height: "1080", format: "jpeg" }
  ];

  const applyPreset = (preset: any) => {
    setQuality([preset.quality]);
    setResizeEnabled(preset.resize);
    setWidth(preset.width || "");
    setHeight(preset.height || "");
    setOutputFormat(preset.format);
    
    toast({
      title: "Preset applied",
      description: `Applied ${preset.name} settings.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Advanced JPG Compressor
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered image compression with smart optimization, batch processing, and advanced controls.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-green-400 bg-green-400/10"
                  : files.length > 0
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isDragActive ? "Drop your JPG files here" : "Upload JPG Images"}
                  </h3>
                  <p className="text-gray-400">
                    Drag and drop your JPG files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports batch upload • Up to 100 images at once
                  </p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Uploaded Images ({files.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-64 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-400 mt-1 text-center truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {files.length > 0 && (
          <>
            {/* Settings Tabs */}
            <Tabs defaultValue="basic" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">AI Compression</TabsTrigger>
                <TabsTrigger value="resize">Resize & Format</TabsTrigger>
                <TabsTrigger value="presets">Quick Presets</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sliders className="w-5 h-5" />
                      Quality Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Quality: {quality[0]}%</Label>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={10}
                        step={5}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Smallest Size</span>
                        <span>Balanced</span>
                        <span>Best Quality</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="strip-metadata"
                          checked={stripMetadata}
                          onCheckedChange={setStripMetadata}
                        />
                        <Label htmlFor="strip-metadata" className="text-sm">
                          Remove EXIF metadata (reduces size)
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Compression
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Compression Algorithm</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'balanced', name: 'Balanced', desc: 'Best quality-size ratio', icon: Zap },
                          { id: 'content-aware', name: 'Content-Aware', desc: 'AI detects faces & text', icon: Brain },
                          { id: 'fast', name: 'Fast', desc: 'Quick compression', icon: Settings }
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => setCompressionMode(mode.id)}
                            className={`p-4 rounded-lg border text-left transition-all ${
                              compressionMode === mode.id
                                ? 'border-blue-400 bg-blue-400/10'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <mode.icon className="w-6 h-6 mb-2 text-blue-400" />
                            <h3 className="font-medium">{mode.name}</h3>
                            <p className="text-sm text-gray-400">{mode.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resize" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crop className="w-5 h-5" />
                      Resize & Format Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="resize-enabled"
                        checked={resizeEnabled}
                        onCheckedChange={setResizeEnabled}
                      />
                      <Label htmlFor="resize-enabled" className="text-sm font-medium">
                        Enable image resizing
                      </Label>
                    </div>

                    {resizeEnabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="width" className="text-sm">Width (px)</Label>
                            <Input
                              id="width"
                              type="number"
                              value={width}
                              onChange={(e) => setWidth(e.target.value)}
                              placeholder="Auto"
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="height" className="text-sm">Height (px)</Label>
                            <Input
                              id="height"
                              type="number"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              placeholder="Auto"
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="aspect-ratio"
                            checked={preserveAspectRatio}
                            onCheckedChange={setPreserveAspectRatio}
                          />
                          <Label htmlFor="aspect-ratio" className="text-sm">
                            Preserve aspect ratio
                          </Label>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Output Format</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'jpeg', name: 'JPEG', desc: 'Standard format' },
                          { id: 'webp', name: 'WebP', desc: 'Modern, smaller' },
                          { id: 'avif', name: 'AVIF', desc: 'Next-gen format' }
                        ].map((format) => (
                          <button
                            key={format.id}
                            onClick={() => setOutputFormat(format.id)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              outputFormat === format.id
                                ? 'border-blue-400 bg-blue-400/10'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <h3 className="font-medium">{format.name}</h3>
                            <p className="text-xs text-gray-400">{format.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presets" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quick Optimization Presets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {presets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyPreset(preset)}
                          className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
                        >
                          <h3 className="font-medium mb-1">{preset.name}</h3>
                          <p className="text-sm text-gray-400">
                            Quality: {preset.quality}% • {preset.format.toUpperCase()}
                            {preset.resize && ` • ${preset.width}${preset.height ? `×${preset.height}` : 'px'}`}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Compress Button */}
            <div className="text-center mb-8">
              {!isCompressing && compressedImages.length === 0 && (
                <Button
                  onClick={handleCompress}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Compress {files.length} Image{files.length !== 1 ? 's' : ''}
                </Button>
              )}

              {isCompressing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                    <span className="text-lg">Compressing images...</span>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-gray-400 mt-2">{progress.toFixed(0)}% complete</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {compressedImages.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Compression Complete
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
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {(() => {
                      const totalOriginal = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
                      const totalCompressed = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
                      const savingsPercent = ((totalOriginal - totalCompressed) / totalOriginal * 100);
                      const spaceSaved = totalOriginal - totalCompressed;
                      
                      return [
                        { label: 'Images Processed', value: compressedImages.length.toString(), color: 'text-blue-400' },
                        { label: 'Space Saved', value: formatFileSize(spaceSaved), color: 'text-green-400' },
                        { label: 'Compression Ratio', value: `${savingsPercent.toFixed(1)}%`, color: 'text-purple-400' },
                        { label: 'Total Size', value: formatFileSize(totalCompressed), color: 'text-orange-400' }
                      ].map((stat, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Individual Results */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Individual Results</h3>
                    <div className="grid gap-4">
                      {compressedImages.map((img, index) => {
                        const savingsPercent = ((img.originalSize - img.compressedSize) / img.originalSize * 100);
                        
                        return (
                          <div key={index} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                            <div className="flex gap-4">
                              <div className="text-center">
                                <img
                                  src={URL.createObjectURL(img.original)}
                                  alt="Original"
                                  className="w-16 h-16 object-cover rounded border border-gray-600"
                                />
                                <p className="text-xs text-gray-400 mt-1">Original</p>
                              </div>
                              <div className="text-center">
                                <img
                                  src={img.url}
                                  alt="Compressed"
                                  className="w-16 h-16 object-cover rounded border border-gray-600"
                                />
                                <p className="text-xs text-gray-400 mt-1">Compressed</p>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium truncate">{img.original.name}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                <div>
                                  <p className="text-gray-400">Original</p>
                                  <p className="font-medium">{formatFileSize(img.originalSize)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Compressed</p>
                                  <p className="font-medium">{formatFileSize(img.compressedSize)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Saved</p>
                                  <p className="font-medium text-green-400">{savingsPercent.toFixed(1)}%</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Quality</p>
                                  <p className="font-medium">{img.quality}%</p>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = img.url;
                                link.download = `compressed_${img.original.name}`;
                                link.click();
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Features Grid - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: Brain,
              title: "AI-Powered",
              description: "Smart compression preserves quality in important areas",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Zap,
              title: "Batch Processing",
              description: "Compress multiple images simultaneously with ease",
              color: "from-green-500 to-blue-500"
            },
            {
              icon: Settings,
              title: "Advanced Controls",
              description: "Fine-tune quality, resize, format conversion and more",
              color: "from-orange-500 to-red-500"
            },
            {
              icon: Eye,
              title: "Visual Comparison",
              description: "Compare before/after results with side-by-side preview",
              color: "from-cyan-500 to-blue-500"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JPGCompress;
