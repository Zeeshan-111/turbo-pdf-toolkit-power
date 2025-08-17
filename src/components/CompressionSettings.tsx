
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings, Image, FileText, Zap, Shield, Target } from "lucide-react";

export interface CompressionSettings {
  mode: 'low' | 'medium' | 'high';
  imageDPI: 72 | 96 | 150;
  removeMetadata: boolean;
  removeAnnotations: boolean;
  removeBookmarks: boolean;
  convertImagesToJPEG: boolean;
  imageQuality: number;
}

interface CompressionSettingsProps {
  settings: CompressionSettings;
  onChange: (settings: CompressionSettings) => void;
  disabled?: boolean;
}

export const CompressionSettings = ({ settings, onChange, disabled = false }: CompressionSettingsProps) => {
  const updateSetting = (key: keyof CompressionSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const compressionModes = [
    {
      value: 'low',
      label: 'Low (Lossless)',
      description: 'Maintains full quality',
      savings: '10-25%',
      icon: Shield,
      color: 'text-green-400'
    },
    {
      value: 'medium',
      label: 'Medium (Balanced)',
      description: 'Best balance of quality & size',
      savings: '30-55%',
      icon: Zap,
      color: 'text-blue-400'
    },
    {
      value: 'high',
      label: 'High (Maximum)',
      description: 'Maximum compression',
      savings: '60-85%',
      icon: Target,
      color: 'text-orange-400'
    }
  ];

  const selectedMode = compressionModes.find(mode => mode.value === settings.mode);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Compression Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compression Mode */}
        <div className="space-y-3">
          <Label className="text-gray-300 font-medium">Compression Mode</Label>
          <Select 
            value={settings.mode} 
            onValueChange={(value: any) => updateSetting('mode', value)}
            disabled={disabled}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {selectedMode && (
                    <>
                      <selectedMode.icon className={`w-4 h-4 ${selectedMode.color}`} />
                      <span>{selectedMode.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {selectedMode.savings}
                      </Badge>
                    </>
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {compressionModes.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  <div className="flex items-center gap-3 py-1">
                    <mode.icon className={`w-4 h-4 ${mode.color}`} />
                    <div>
                      <div className="font-medium text-white">{mode.label}</div>
                      <div className="text-xs text-gray-400">{mode.description}</div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {mode.savings}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMode && (
            <p className="text-sm text-gray-400">{selectedMode.description}</p>
          )}
        </div>

        {/* Image Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Image Optimization
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-gray-300 text-sm">Image Resolution (DPI)</Label>
              <Select 
                value={settings.imageDPI.toString()} 
                onValueChange={(value) => updateSetting('imageDPI', parseInt(value) as 72 | 96 | 150)}
                disabled={disabled}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="72">72 DPI (Web quality)</SelectItem>
                  <SelectItem value="96">96 DPI (Standard)</SelectItem>
                  <SelectItem value="150">150 DPI (High quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="convert-images" className="text-gray-300 text-sm">
                Convert images to JPEG
              </Label>
              <Switch
                id="convert-images"
                checked={settings.convertImagesToJPEG}
                onCheckedChange={(checked) => updateSetting('convertImagesToJPEG', checked)}
                disabled={disabled}
              />
            </div>

            {settings.convertImagesToJPEG && (
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  JPEG Quality: {settings.imageQuality}%
                </Label>
                <Slider
                  value={[settings.imageQuality]}
                  onValueChange={([value]) => updateSetting('imageQuality', value)}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Removal */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content Optimization
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="remove-metadata" className="text-gray-300 text-sm">
                Remove metadata & properties
              </Label>
              <Switch
                id="remove-metadata"
                checked={settings.removeMetadata}
                onCheckedChange={(checked) => updateSetting('removeMetadata', checked)}
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="remove-annotations" className="text-gray-300 text-sm">
                Remove annotations & comments
              </Label>
              <Switch
                id="remove-annotations"
                checked={settings.removeAnnotations}
                onCheckedChange={(checked) => updateSetting('removeAnnotations', checked)}
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="remove-bookmarks" className="text-gray-300 text-sm">
                Remove bookmarks & navigation
              </Label>
              <Switch
                id="remove-bookmarks"
                checked={settings.removeBookmarks}
                onCheckedChange={(checked) => updateSetting('removeBookmarks', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Mode-specific warnings */}
        {settings.mode === 'high' && (
          <div className="p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
            <p className="text-orange-300 text-sm">
              <strong>High compression mode:</strong> Maximum size reduction with some quality trade-offs. 
              Images will be heavily compressed and some interactive elements may be removed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
