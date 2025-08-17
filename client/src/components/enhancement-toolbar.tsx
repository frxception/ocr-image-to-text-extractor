import { Settings, Contrast, Type, Loader2 } from "lucide-react";
import { ImageEnhancementLevel, CharacterFocus } from "@/pages/home";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancementToolbarProps {
  enhancementLevel: ImageEnhancementLevel;
  onEnhancementLevelChange: (level: ImageEnhancementLevel) => void;
  characterFocus: CharacterFocus;
  onCharacterFocusChange: (focus: CharacterFocus) => void;
  isReprocessing?: boolean;
}

export default function EnhancementToolbar({
  enhancementLevel,
  onEnhancementLevelChange,
  characterFocus,
  onCharacterFocusChange,
  isReprocessing = false,
}: EnhancementToolbarProps) {
  const enhancementOptions = [
    { value: "none", label: "None", description: "Original image" },
    { value: "light", label: "Light", description: "Minimal enhancement" },
    { value: "medium", label: "Medium", description: "Balanced enhancement" },
    { value: "strong", label: "Strong", description: "Maximum enhancement" },
  ] as const;

  const characterFocusOptions = [
    { value: "all", label: "All Characters", description: "Numbers, letters, and symbols" },
    { value: "alphanumeric", label: "Alphanumeric Only", description: "Letters and numbers only" },
    { value: "numbers", label: "Numbers Only", description: "Numeric characters only" },
  ] as const;

  const getCurrentEnhancementOption = () => {
    return enhancementOptions.find((option) => option.value === enhancementLevel);
  };

  const getCurrentFocusOption = () => {
    return characterFocusOptions.find((option) => option.value === characterFocus);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        {/* Toolbar Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
              {isReprocessing && (
                <Loader2 className="w-3 h-3 text-blue-500 mr-1 animate-spin" />
              )}
              Image Enhancement
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isReprocessing 
                ? "Applying new settings..." 
                : "Optimize text recognition for difficult images"
              }
            </p>
          </div>
        </div>

        {/* Enhancement Controls */}
        <div className="flex items-center space-x-4">
          {/* Contrast Enhancement Dropdown */}
          <div className="flex items-center space-x-2">
            <Contrast className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contrast Enhancement
              </label>
              <Select
                value={enhancementLevel}
                onValueChange={(value: ImageEnhancementLevel) => onEnhancementLevelChange(value)}
              >
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue>
                    <span className="font-medium">{getCurrentEnhancementOption()?.label}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {enhancementOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Character Focus Dropdown */}
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Focus Extraction
              </label>
              <Select
                value={characterFocus}
                onValueChange={(value: CharacterFocus) => onCharacterFocusChange(value)}
              >
                <SelectTrigger className="w-40 h-8 text-sm">
                  <SelectValue>
                    <span className="font-medium">{getCurrentFocusOption()?.label}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {characterFocusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
