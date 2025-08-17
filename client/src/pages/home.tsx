import Header from "@/components/header";
import UploadArea from "@/components/upload-area";
import ResultsSection from "@/components/results-section";
import FeaturesSection from "@/components/features-section";
import EnhancementToolbar from "@/components/enhancement-toolbar";
import { useOCR } from "@/hooks/use-ocr";
import { useState, useEffect, useRef } from "react";

export interface OCRResult {
  text: string;
  confidence: number;
  words: number;
  characters: number;
  lines: number;
}

export type ImageEnhancementLevel = "none" | "light" | "medium" | "strong";
export type CharacterFocus = "all" | "alphanumeric" | "numbers";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancementLevel, setEnhancementLevel] = useState<ImageEnhancementLevel>("medium");
  const [characterFocus, setCharacterFocus] = useState<CharacterFocus>("all");
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [isReprocessing, setIsReprocessing] = useState(false);
  
  // Refs to track initial settings and avoid re-processing on mount
  const initialRender = useRef(true);
  const lastEnhancementLevel = useRef<ImageEnhancementLevel>("medium");
  const lastCharacterFocus = useRef<CharacterFocus>("all");
  
  const { extractText } = useOCR();

  const handleClear = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setOcrResult(null);
    setError(null);
    setOriginalImageFile(null);
    setIsReprocessing(false);
  };

  const reprocessImage = async () => {
    if (!originalImageFile || isProcessing || isReprocessing) return;

    try {
      setIsReprocessing(true);
      setError(null);

      const { result, processedImageUrl } = await extractText(
        originalImageFile,
        enhancementLevel,
        characterFocus,
        () => {} // No progress callback needed for reprocessing
      );

      setProcessedImage(processedImageUrl);
      setOcrResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reprocess image");
    } finally {
      setIsReprocessing(false);
    }
  };

  // Auto-reprocess when enhancement settings change (but only after initial extraction)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      lastEnhancementLevel.current = enhancementLevel;
      lastCharacterFocus.current = characterFocus;
      return;
    }

    // Only reprocess if we have an original file and OCR results, and settings actually changed
    if (
      originalImageFile &&
      ocrResult &&
      (lastEnhancementLevel.current !== enhancementLevel || lastCharacterFocus.current !== characterFocus)
    ) {
      lastEnhancementLevel.current = enhancementLevel;
      lastCharacterFocus.current = characterFocus;
      reprocessImage();
    }
  }, [enhancementLevel, characterFocus, originalImageFile, ocrResult]);

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleOCRResult = (result: OCRResult) => {
    setOcrResult(result);
  };

  const handleImageFileStored = (file: File) => {
    setOriginalImageFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Extract Text from Images
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload any image and instantly extract all text, characters, and numbers using advanced
            OCR technology. Works with JPG, PNG, and WEBP formats.
          </p>
        </section>

        {/* Enhancement Toolbar */}
        <section className="mb-8">
          <EnhancementToolbar
            enhancementLevel={enhancementLevel}
            onEnhancementLevelChange={setEnhancementLevel}
            characterFocus={characterFocus}
            onCharacterFocusChange={setCharacterFocus}
            isReprocessing={isReprocessing}
          />
        </section>

        {/* Upload Area */}
        <UploadArea
          uploadedImage={uploadedImage}
          onImageUploaded={handleImageUploaded}
          onProcessedImage={setProcessedImage}
          onOCRResult={handleOCRResult}
          onProcessingChange={setIsProcessing}
          onError={setError}
          onClear={handleClear}
          isProcessing={isProcessing}
          enhancementLevel={enhancementLevel}
          characterFocus={characterFocus}
          hasOCRResults={ocrResult !== null}
          onImageFileStored={handleImageFileStored}
          isReprocessing={isReprocessing}
        />

        {/* Error Display */}
        {error && (
          <section className="mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-2xl text-red-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Processing Error
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-times mr-2"></i>
                Dismiss
              </button>
            </div>
          </section>
        )}

        {/* Results Section */}
        {ocrResult && uploadedImage && (
          <ResultsSection
            result={ocrResult}
            originalImageUrl={uploadedImage}
            processedImageUrl={processedImage}
            enhancementLevel={enhancementLevel}
            onClear={handleClear}
            onOCRResult={handleOCRResult}
            characterFocus={characterFocus}
            isReprocessing={isReprocessing}
          />
        )}

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-text-width text-white text-sm"></i>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                OCR Extract
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Powerful, privacy-first OCR text extraction tool
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 OCR Extract. Built with Tesseract.js and modern web technologies.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
