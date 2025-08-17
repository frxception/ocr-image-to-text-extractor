import { Archive, Copy, Download, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import ImageViewer from "@/components/image-viewer";
import { CropProcessingAnimation } from "@/components/loading-animations";
import SavedTextsPanel from "@/components/saved-texts-panel";
import TextSearch from "@/components/text-search";
import { useOCR } from "@/hooks/use-ocr";
import { useSavedText } from "@/hooks/use-saved-text";
import { useToast } from "@/hooks/use-toast";
import type { CharacterFocus, ImageEnhancementLevel, OCRResult } from "@/pages/home";

interface ResultsSectionProps {
  result: OCRResult;
  originalImageUrl: string;
  processedImageUrl: string | null;
  enhancementLevel: ImageEnhancementLevel;
  onClear: () => void;
  onOCRResult: (result: OCRResult) => void;
  characterFocus: CharacterFocus;
}

export default function ResultsSection({
  result,
  originalImageUrl,
  processedImageUrl,
  enhancementLevel,
  onClear,
  onOCRResult,
  characterFocus,
}: ResultsSectionProps) {
  const { toast } = useToast();
  const { extractText } = useOCR();
  const { savedTexts, saveText, deleteText, clearAll, updateTitle, exportTexts } = useSavedText();
  const [highlightedText, setHighlightedText] = useState(result.text);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);
  const [showSavedTexts, setShowSavedTexts] = useState(false);

  const handleHighlight = (highlighted: string, term: string, count: number) => {
    setHighlightedText(highlighted);
    setSearchTerm(term);
    setMatchCount(count);
  };

  const handleCrop = async (croppedImageBlob: Blob) => {
    try {
      setIsProcessingCrop(true);

      toast({
        title: "Processing cropped image...",
        description: "Running OCR on the selected area.",
      });

      // Convert blob to file for OCR processing
      const file = new File([croppedImageBlob], "cropped-image.png", { type: "image/png" });

      // Run OCR on the cropped image
      const { result: cropResult } = await extractText(file, enhancementLevel, characterFocus);

      // Update the OCR result
      onOCRResult(cropResult);

      toast({
        title: "Crop processed successfully",
        description: "Text extraction updated with cropped area.",
      });
    } catch (error) {
      toast({
        title: "Crop processing failed",
        description: "Unable to process the cropped image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleSaveText = () => {
    const savedId = saveText(result);
    toast({
      title: "Text saved successfully",
      description: "Your extracted text has been saved to your collection.",
    });
  };

  const handleShowSavedTexts = () => {
    setShowSavedTexts(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      toast({
        title: "Text copied!",
        description: "The extracted text has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([result.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "The extracted text file is being downloaded.",
    });
  };

  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Extracted Text
          </h3>
        </div>

        {/* Enhanced Image Preview */}
        <div className="mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              {processedImageUrl && enhancementLevel !== "none"
                ? `Enhanced Image (${enhancementLevel} enhancement)`
                : "Processed Image"}
            </h4>
            <ImageViewer
              src={processedImageUrl || originalImageUrl}
              alt={processedImageUrl ? "Enhanced image used for OCR" : "Original uploaded image"}
              className="w-full"
              onCrop={handleCrop}
            />
            {isProcessingCrop && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <CropProcessingAnimation />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              {processedImageUrl &&
                enhancementLevel !== "none" &&
                "This enhanced version was used for text extraction • "}
              Use mouse wheel or buttons to zoom • Drag to pan when zoomed • Click crop tool to
              extract text from specific area
            </p>
          </div>
        </div>

        <h4 className="text-2xl font-medium text-gray-900 dark:text-white">Text Results</h4>

        {/* Text Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.characters}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Characters</div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.words}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Character Groups</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {result.lines}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Lines</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(result.confidence)}%
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Confidence</div>
          </div>
        </div>

        {/* Extracted Text Results */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              {searchTerm && matchCount > 0 && (
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {matchCount} matches found
                </span>
              )}
              {/* <span className="text-sm text-gray-500 dark:text-gray-400">
                {result.characters} characters
              </span> */}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
            <div
              className="text-gray-900 dark:text-gray-100 leading-normal whitespace-pre font-mono text-sm overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: highlightedText || "No text found in the image.",
              }}
            />
          </div>
        </div>

        {/* Button actions */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <TextSearch text={result.text} onHighlight={handleHighlight} />

          <button
            onClick={handleSaveText}
            className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Text
          </button>

          <button
            onClick={handleShowSavedTexts}
            className="relative inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Archive className="w-4 h-4 mr-2" />
            Viewed saved texts ({savedTexts.length})
          </button>

          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </button>

          <button
            onClick={downloadText}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>

          <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Saved Texts Panel */}
      {showSavedTexts && (
        <SavedTextsPanel
          savedTexts={savedTexts}
          onClose={() => setShowSavedTexts(false)}
          onDelete={deleteText}
          onClearAll={clearAll}
          onUpdateTitle={updateTitle}
          onExport={exportTexts}
        />
      )}
    </section>
  );
}
