
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, Image, FileText, Link } from "lucide-react";

export interface ConversionSettings {
  preserveLayout: boolean;
  preserveImages: boolean;
  preserveHyperlinks: boolean;
  preserveBookmarks: boolean;
  imageQuality: number;
  imageHandling: 'keep' | 'remove' | 'extract';
  outputFormat: 'docx' | 'rtf' | 'odt';
  enableOCR: boolean;
  ocrLanguage: string;
  compressOutput: boolean;
}

interface ConversionOptionsProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  isScannedPDF?: boolean;
}

export const ConversionOptions = ({ settings, onChange, isScannedPDF }: ConversionOptionsProps) => {
  const updateSetting = (key: keyof ConversionSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Conversion Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Layout & Structure */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Layout & Structure
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserveLayout"
                checked={settings.preserveLayout}
                onCheckedChange={(checked) => updateSetting('preserveLayout', checked)}
              />
              <Label htmlFor="preserveLayout" className="text-gray-300 text-sm">
                Preserve original layout (WYSIWYG)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserveBookmarks"
                checked={settings.preserveBookmarks}
                onCheckedChange={(checked) => updateSetting('preserveBookmarks', checked)}
              />
              <Label htmlFor="preserveBookmarks" className="text-gray-300 text-sm">
                Preserve bookmarks & table of contents
              </Label>
            </div>
          </div>
        </div>

        {/* Image Handling */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Image Handling
          </h4>
          <div className="space-y-3">
            <div>
              <Label className="text-gray-300 text-sm">Image handling mode</Label>
              <Select value={settings.imageHandling} onValueChange={(value: any) => updateSetting('imageHandling', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="keep">Keep images in place</SelectItem>
                  <SelectItem value="remove">Remove all images (text-only)</SelectItem>
                  <SelectItem value="extract">Extract images separately</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {settings.imageHandling === 'keep' && (
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  Image quality: {settings.imageQuality}%
                </Label>
                <Slider
                  value={[settings.imageQuality]}
                  onValueChange={([value]) => updateSetting('imageQuality', value)}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Links & Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Link className="w-4 h-4" />
            Links & Navigation
          </h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="preserveHyperlinks"
              checked={settings.preserveHyperlinks}
              onCheckedChange={(checked) => updateSetting('preserveHyperlinks', checked)}
            />
            <Label htmlFor="preserveHyperlinks" className="text-gray-300 text-sm">
              Preserve hyperlinks and annotations
            </Label>
          </div>
        </div>

        {/* OCR Settings */}
        {isScannedPDF && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">OCR Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableOCR"
                  checked={settings.enableOCR}
                  onCheckedChange={(checked) => updateSetting('enableOCR', checked)}
                />
                <Label htmlFor="enableOCR" className="text-gray-300 text-sm">
                  Enable OCR for scanned content
                </Label>
              </div>
              
              {settings.enableOCR && (
                <div>
                  <Label className="text-gray-300 text-sm">OCR Language</Label>
                  <Select value={settings.ocrLanguage} onValueChange={(value) => updateSetting('ocrLanguage', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Output Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Output Options</h4>
          <div className="space-y-3">
            <div>
              <Label className="text-gray-300 text-sm">Output format</Label>
              <Select value={settings.outputFormat} onValueChange={(value: any) => updateSetting('outputFormat', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="docx">Word Document (.docx)</SelectItem>
                  <SelectItem value="rtf">Rich Text Format (.rtf)</SelectItem>
                  <SelectItem value="odt">Open Document (.odt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="compressOutput"
                checked={settings.compressOutput}
                onCheckedChange={(checked) => updateSetting('compressOutput', checked)}
              />
              <Label htmlFor="compressOutput" className="text-gray-300 text-sm">
                Compress output file
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
