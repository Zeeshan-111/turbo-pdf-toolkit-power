
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen } from "lucide-react";

interface PageSelectorProps {
  totalPages: number;
  selectedPages: number[];
  onPagesChange: (pages: number[]) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

export const PageSelector = ({
  totalPages,
  selectedPages,
  onPagesChange,
  onSelectAll,
  onSelectNone
}: PageSelectorProps) => {
  const [rangeInput, setRangeInput] = useState("");

  const handleRangeInput = () => {
    try {
      const ranges = rangeInput.split(',').map(range => range.trim());
      const pages: number[] = [];
      
      ranges.forEach(range => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(n => parseInt(n.trim()));
          if (start && end && start <= end && start >= 1 && end <= totalPages) {
            for (let i = start; i <= end; i++) {
              if (!pages.includes(i)) pages.push(i);
            }
          }
        } else {
          const page = parseInt(range);
          if (page >= 1 && page <= totalPages && !pages.includes(page)) {
            pages.push(page);
          }
        }
      });
      
      onPagesChange(pages.sort((a, b) => a - b));
    } catch (error) {
      console.error('Invalid page range format');
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Page Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSelectAll}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSelectNone}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Select None
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Page Range (e.g., 1-5, 8, 10-12)</Label>
          <div className="flex gap-2">
            <Input
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="1-5, 8, 10-12"
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={handleRangeInput} size="sm">
              Apply
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Selected: {selectedPages.length} of {totalPages} pages
        </div>

        <div className="max-h-32 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <div key={page} className="flex items-center space-x-1">
                <Checkbox
                  id={`page-${page}`}
                  checked={selectedPages.includes(page)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onPagesChange([...selectedPages, page].sort((a, b) => a - b));
                    } else {
                      onPagesChange(selectedPages.filter(p => p !== page));
                    }
                  }}
                />
                <Label 
                  htmlFor={`page-${page}`} 
                  className="text-xs text-gray-300 cursor-pointer"
                >
                  {page}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
