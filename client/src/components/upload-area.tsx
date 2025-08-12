import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FolderOpen, X, Loader2, CheckCircle, AlertCircle, Crop, Check } from "lucide-react";
import { useOCR } from "@/hooks/use-ocr";
import { OCRResult, ImageEnhancementLevel, CharacterFocus } from "@/pages/home";
import ImageViewer from "@/components/image-viewer";
import { ProcessingAnimation, UploadAnimation } from "@/components/loading-animations";

interface UploadAreaProps {
  uploadedImage: string | null;
  onImageUploaded: (imageUrl: string) => void;
  onProcessedImage: (imageUrl: string | null) => void;
  onOCRResult: (result: OCRResult) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onError: (error: string) => void;
  onClear: () => void;
  isProcessing: boolean;
  enhancementLevel: ImageEnhancementLevel;
  characterFocus: CharacterFocus;
}

export default function UploadArea({ 
  uploadedImage,
  onImageUploaded, 
  onProcessedImage,
  onOCRResult, 
  onProcessingChange, 
  onError,
  onClear,
  isProcessing,
  enhancementLevel,
  characterFocus
}: UploadAreaProps) {
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
  const { extractText } = useOCR();

  const processImage = useCallback(async (file: File) => {
    try {
      onProcessingChange(true);
      setProgress(0);

      // Create image URL for preview
      const imageUrl = URL.createObjectURL(file);
      onImageUploaded(imageUrl);

      // Extract text using OCR
      const { result, processedImageUrl } = await extractText(file, enhancementLevel, characterFocus, (progress, stage) => {
        setProgress(progress * 100);
        setProcessingStage(stage || 'Processing...');
      });

      onProcessedImage(processedImageUrl);

      onOCRResult(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to process image");
    } finally {
      onProcessingChange(false);
      setProgress(0);
      setProcessingStage('');
    }
  }, [extractText, onImageUploaded, onOCRResult, onProcessingChange, onError, enhancementLevel]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      onError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      onError("Please upload a valid image file (JPG, PNG, or WEBP)");
      return;
    }

    // Show crop dialog
    const previewUrl = URL.createObjectURL(file);
    setPendingFile(file);
    setCropPreviewUrl(previewUrl);
    setShowCropDialog(true);
  }, [onError]);

  const handleSkipCrop = useCallback(() => {
    if (pendingFile) {
      processImage(pendingFile);
      setShowCropDialog(false);
      setPendingFile(null);
      setCropPreviewUrl(null);
    }
  }, [pendingFile, processImage]);

  const handleCropImage = useCallback(async (croppedImageBlob: Blob) => {
    try {
      // Convert blob to file
      const croppedFile = new File([croppedImageBlob], 'cropped-image.png', { type: 'image/png' });
      
      setShowCropDialog(false);
      setPendingFile(null);
      setCropPreviewUrl(null);
      
      // Process the cropped image
      await processImage(croppedFile);
    } catch (error) {
      onError("Failed to process cropped image");
    }
  }, [processImage, onError]);

  const handleCancelCrop = useCallback(() => {
    setShowCropDialog(false);
    setPendingFile(null);
    if (cropPreviewUrl) {
      URL.revokeObjectURL(cropPreviewUrl);
      setCropPreviewUrl(null);
    }
  }, [cropPreviewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <section className="mb-8">
      <div 
        {...getRootProps()}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {uploadedImage && !isProcessing ? (
          // Show uploaded image with delete button
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-2 right-2 z-10 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-4">
              <img 
                src={uploadedImage} 
                alt="Uploaded image" 
                className="max-w-full h-auto rounded-lg shadow-md max-h-64 mx-auto"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Image Ready
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click or drop a new image to replace
            </p>
          </div>
        ) : !isProcessing ? (
          // Show upload prompt with animation
          <UploadAnimation />
        ) : (
          // Show processing state with animated loading
          <ProcessingAnimation
            stage={processingStage || 'processing image'}
            progress={progress}
          />
        )}
      </div>

      {/* Crop Dialog */}
      {showCropDialog && cropPreviewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Crop Your Image
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crop the image to focus on specific text areas, or skip to process the entire image.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <ImageViewer
                  src={cropPreviewUrl}
                  alt="Image to crop"
                  className="w-full"
                  onCrop={handleCropImage}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleCancelCrop}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  onClick={handleSkipCrop}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Check className="w-4 h-4 mr-2 inline" />
                  Skip Crop
                </button>
                <button
                  onClick={() => {
                    // Instructions for crop tool
                    alert("Click the crop tool (scissors icon) in the image viewer, then drag to select the area you want to extract text from.");
                  }}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Crop className="w-4 h-4 mr-2 inline" />
                  How to Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
