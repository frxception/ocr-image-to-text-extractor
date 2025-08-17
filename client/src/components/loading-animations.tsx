import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, Zap, Brain, CheckCircle, FolderOpen } from "lucide-react";

interface LoadingAnimationProps {
  stage: string;
  progress: number;
  className?: string;
}

interface ProcessingStage {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const PROCESSING_STAGES: Record<string, ProcessingStage> = {
  "initializing worker": {
    icon: <Loader2 className="w-8 h-8 animate-spin" />,
    label: "Initializing",
    description: "Setting up OCR engine...",
    color: "text-blue-500",
  },
  "loading language traineddata": {
    icon: <Brain className="w-8 h-8 animate-pulse" />,
    label: "Loading AI Model",
    description: "Downloading language data...",
    color: "text-purple-500",
  },
  "initializing api": {
    icon: <Zap className="w-8 h-8 animate-bounce" />,
    label: "Preparing",
    description: "Initializing text recognition...",
    color: "text-yellow-500",
  },
  "recognizing text": {
    icon: <ImageIcon className="w-8 h-8 animate-pulse" />,
    label: "Analyzing Image",
    description: "Extracting text from image...",
    color: "text-green-500",
  },
  "processing image": {
    icon: <ImageIcon className="w-8 h-8 animate-pulse" />,
    label: "Processing",
    description: "Enhancing image quality...",
    color: "text-indigo-500",
  },
  default: {
    icon: <Loader2 className="w-8 h-8 animate-spin" />,
    label: "Processing",
    description: "Working on your image...",
    color: "text-gray-500",
  },
};

export function ProcessingAnimation({ stage, progress, className = "" }: LoadingAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const currentStage = PROCESSING_STAGES[stage.toLowerCase()] || PROCESSING_STAGES.default;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(animationPhase);

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Animated Icon with Glow Effect */}
      <div className="relative mb-6">
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-30 ${currentStage.color.replace("text-", "bg-")}`}
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        />
        <div className={`relative ${currentStage.color}`}>{currentStage.icon}</div>
      </div>

      {/* Stage Information */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {currentStage.label}
        {dots}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-sm">
        {currentStage.description}
      </p>

      {/* Enhanced Progress Bar */}
      <div className="w-full max-w-md mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${currentStage.color.replace("text-", "bg-")}`}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}% complete
          </span>
          {progress > 95 && <CheckCircle className="w-4 h-4 text-green-500 animate-bounce" />}
        </div>
      </div>

      {/* Floating Particles Animation */}
      <div className="relative w-full h-8 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${currentStage.color.replace("text-", "bg-")} rounded-full opacity-60`}
            style={{
              left: `${10 + i * 20}%`,
              animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function CropProcessingAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-orange-400 blur-xl opacity-30 animate-pulse" />
        <div className="relative">
          <ImageIcon className="w-8 h-8 text-orange-500 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Processing Crop...
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-center">
        Analyzing cropped area for text
      </p>

      <div className="mt-4 flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function UploadAnimation({ className = "" }: { className?: string }) {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Animated Upload Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary-400 blur-xl opacity-20 animate-ping" />
        <div className="relative bg-primary-100 dark:bg-primary-900 rounded-full p-4">
          <ImageIcon className="w-12 h-12 text-primary-500 animate-bounce" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Drop your image here
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">or click to browse files</p>

      <button
        type="button"
        className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
      >
        <FolderOpen className="w-5 h-5 mr-2" />
        Choose File
      </button>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Supports JPG, PNG, WEBP • Max size: 10MB
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              pulsePhase === i ? "bg-primary-500 scale-125" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* CSS Animations to be added to index.css */
export const animationStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
`;
