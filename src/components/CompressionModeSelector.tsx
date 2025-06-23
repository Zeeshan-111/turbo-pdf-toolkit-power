
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Settings } from "lucide-react";

export type CompressionMode = 'basic' | 'strong' | 'high-quality';

interface CompressionModeProps {
  selectedMode: CompressionMode;
  onModeChange: (mode: CompressionMode) => void;
}

const compressionModes = [
  {
    id: 'basic' as const,
    title: 'Basic Compression',
    description: 'Small size, decent quality',
    icon: Zap,
    color: 'from-green-500 to-blue-500',
    savings: '30-50%',
    recommended: false
  },
  {
    id: 'strong' as const,
    title: 'Strong Compression',
    description: 'Smallest size, lower quality',
    icon: Settings,
    color: 'from-orange-500 to-red-500',
    savings: '60-80%',
    recommended: false
  },
  {
    id: 'high-quality' as const,
    title: 'High Quality',
    description: 'Retain visuals/text sharpness',
    icon: CheckCircle2,
    color: 'from-purple-500 to-pink-500',
    savings: '20-40%',
    recommended: true
  }
];

export const CompressionModeSelector = ({ selectedMode, onModeChange }: CompressionModeProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Compression Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {compressionModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`relative p-4 rounded-lg border transition-all duration-300 text-left ${
                selectedMode === mode.id
                  ? 'border-blue-400 bg-blue-400/10 ring-2 ring-blue-400/50'
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
              }`}
            >
              {mode.recommended && (
                <Badge className="absolute -top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  Recommended
                </Badge>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${mode.color}`}>
                  <mode.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">{mode.title}</h3>
                  <p className="text-gray-400 text-xs">{mode.description}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-green-400 text-sm font-medium">
                  {mode.savings} reduction
                </span>
                {selectedMode === mode.id && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
