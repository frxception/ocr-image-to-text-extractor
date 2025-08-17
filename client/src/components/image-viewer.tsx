import { useState, useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Crop } from "lucide-react";

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  onCrop?: (croppedImageBlob: Blob) => void;
}

export default function ImageViewer({ src, alt, className, onCrop }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCropMode, setIsCropMode] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.2, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsCropMode(false);
    setCropStart(null);
    setCropEnd(null);
  }, []);

  const toggleCropMode = useCallback(() => {
    setIsCropMode((prev) => !prev);
    setCropStart(null);
    setCropEnd(null);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isCropMode) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setCropStart({ x, y });
          setCropEnd(null);
          setIsCropping(true);
        }
      } else if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [scale, position, isCropMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isCropping && cropStart) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setCropEnd({ x, y });
        }
      } else if (isDragging && scale > 1 && !isCropMode) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, scale, dragStart, isCropping, cropStart, isCropMode]
  );

  const handleMouseUp = useCallback(async () => {
    setIsDragging(false);

    if (isCropping && cropStart && cropEnd && onCrop) {
      setIsCropping(false);

      // Calculate crop area in container coordinates
      const left = Math.min(cropStart.x, cropEnd.x);
      const top = Math.min(cropStart.y, cropEnd.y);
      const width = Math.abs(cropEnd.x - cropStart.x);
      const height = Math.abs(cropEnd.y - cropStart.y);

      if (width > 10 && height > 10) {
        // Minimum crop size
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = imageRef.current;
          const container = containerRef.current;

          if (ctx && img && container) {
            // Get actual rendered dimensions and position of the image
            const containerRect = container.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();

            // Calculate the image's actual display dimensions accounting for object-contain
            const imgNaturalRatio = img.naturalWidth / img.naturalHeight;
            const containerRatio = containerRect.width / containerRect.height;

            let displayWidth, displayHeight, offsetX, offsetY;

            if (imgNaturalRatio > containerRatio) {
              // Image is wider - width fills container, height is scaled
              displayWidth = containerRect.width;
              displayHeight = containerRect.width / imgNaturalRatio;
              offsetX = 0;
              offsetY = (containerRect.height - displayHeight) / 2;
            } else {
              // Image is taller - height fills container, width is scaled
              displayWidth = containerRect.height * imgNaturalRatio;
              displayHeight = containerRect.height;
              offsetX = (containerRect.width - displayWidth) / 2;
              offsetY = 0;
            }

            // Account for zoom and pan transformations
            const effectiveDisplayWidth = displayWidth * scale;
            const effectiveDisplayHeight = displayHeight * scale;
            const effectiveOffsetX = offsetX + position.x;
            const effectiveOffsetY = offsetY + position.y;

            // Convert crop coordinates to image coordinates
            const cropLeftRel = (left - effectiveOffsetX) / effectiveDisplayWidth;
            const cropTopRel = (top - effectiveOffsetY) / effectiveDisplayHeight;
            const cropWidthRel = width / effectiveDisplayWidth;
            const cropHeightRel = height / effectiveDisplayHeight;

            // Clamp to image bounds
            const clampedLeft = Math.max(0, Math.min(1, cropLeftRel));
            const clampedTop = Math.max(0, Math.min(1, cropTopRel));
            const clampedRight = Math.max(0, Math.min(1, cropLeftRel + cropWidthRel));
            const clampedBottom = Math.max(0, Math.min(1, cropTopRel + cropHeightRel));

            // Convert to actual pixel coordinates
            const sourceX = clampedLeft * img.naturalWidth;
            const sourceY = clampedTop * img.naturalHeight;
            const sourceWidth = (clampedRight - clampedLeft) * img.naturalWidth;
            const sourceHeight = (clampedBottom - clampedTop) * img.naturalHeight;

            if (sourceWidth > 1 && sourceHeight > 1) {
              // Set canvas size to cropped area
              canvas.width = sourceWidth;
              canvas.height = sourceHeight;

              // Draw the cropped portion
              ctx.drawImage(
                img,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                sourceWidth,
                sourceHeight
              );

              // Convert to blob
              canvas.toBlob((blob) => {
                if (blob) {
                  onCrop(blob);
                  setIsCropMode(false);
                  setCropStart(null);
                  setCropEnd(null);
                }
              }, "image/png");
            }
          }
        } catch (error) {
          console.error("Failed to crop image:", error);
        }
      }
    }
  }, [isCropping, cropStart, cropEnd, onCrop, scale, position]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!isCropMode && !isCropping) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 3));
      }
    },
    [isCropMode, isCropping]
  );

  return (
    <div
      className={`relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1">
        <button
          onClick={handleZoomIn}
          className={`p-2 rounded-lg shadow-md transition-colors ${
            isCropMode
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          title="Zoom In"
          disabled={isCropMode}
        >
          <ZoomIn
            className={`w-4 h-4 ${isCropMode ? "text-gray-400" : "text-gray-600 dark:text-gray-400"}`}
          />
        </button>
        <button
          onClick={handleZoomOut}
          className={`p-2 rounded-lg shadow-md transition-colors ${
            isCropMode
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          title="Zoom Out"
          disabled={isCropMode}
        >
          <ZoomOut
            className={`w-4 h-4 ${isCropMode ? "text-gray-400" : "text-gray-600 dark:text-gray-400"}`}
          />
        </button>
        {onCrop && (
          <button
            onClick={toggleCropMode}
            className={`p-2 rounded-lg shadow-md transition-colors ${
              isCropMode
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
            title={isCropMode ? "Exit Crop Mode" : "Crop Image"}
          >
            <Crop className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleReset}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      {scale !== 1 && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/70 text-white text-xs rounded">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Image Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-96 overflow-hidden ${
          isCropMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ position: "relative" }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="max-w-none h-full object-contain mx-auto transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            cursor: isCropMode
              ? "crosshair"
              : scale > 1
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
          }}
          draggable={false}
        />

        {/* Crop Selection Overlay */}
        {isCropMode && cropStart && cropEnd && (
          <>
            {/* Crop selection area with inverse mask */}
            <div
              className="absolute border-2 border-primary-500 bg-transparent pointer-events-none"
              style={{
                left: Math.min(cropStart.x, cropEnd.x),
                top: Math.min(cropStart.y, cropEnd.y),
                width: Math.abs(cropEnd.x - cropStart.x),
                height: Math.abs(cropEnd.y - cropStart.y),
                boxShadow: `
                  0 0 0 ${Math.min(cropStart.y, cropEnd.y)}px rgba(0, 0, 0, 0.5),
                  0 0 0 9999px rgba(0, 0, 0, 0.5)
                `,
              }}
            />

            {/* Rule of thirds grid */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: Math.min(cropStart.x, cropEnd.x),
                top: Math.min(cropStart.y, cropEnd.y),
                width: Math.abs(cropEnd.x - cropStart.x),
                height: Math.abs(cropEnd.y - cropStart.y),
              }}
            >
              {/* Vertical lines */}
              <div
                className="absolute w-px bg-white/50"
                style={{ left: "33.33%", top: 0, bottom: 0 }}
              />
              <div
                className="absolute w-px bg-white/50"
                style={{ left: "66.66%", top: 0, bottom: 0 }}
              />
              {/* Horizontal lines */}
              <div
                className="absolute h-px bg-white/50"
                style={{ top: "33.33%", left: 0, right: 0 }}
              />
              <div
                className="absolute h-px bg-white/50"
                style={{ top: "66.66%", left: 0, right: 0 }}
              />
            </div>

            {/* Corner handles */}
            <div
              className="absolute w-3 h-3 border-2 border-white bg-primary-500 pointer-events-none"
              style={{
                left: Math.min(cropStart.x, cropEnd.x) - 6,
                top: Math.min(cropStart.y, cropEnd.y) - 6,
              }}
            />
            <div
              className="absolute w-3 h-3 border-2 border-white bg-primary-500 pointer-events-none"
              style={{
                left: Math.max(cropStart.x, cropEnd.x) - 6,
                top: Math.min(cropStart.y, cropEnd.y) - 6,
              }}
            />
            <div
              className="absolute w-3 h-3 border-2 border-white bg-primary-500 pointer-events-none"
              style={{
                left: Math.min(cropStart.x, cropEnd.x) - 6,
                top: Math.max(cropStart.y, cropEnd.y) - 6,
              }}
            />
            <div
              className="absolute w-3 h-3 border-2 border-white bg-primary-500 pointer-events-none"
              style={{
                left: Math.max(cropStart.x, cropEnd.x) - 6,
                top: Math.max(cropStart.y, cropEnd.y) - 6,
              }}
            />

            {/* Crop area dimensions */}
            <div
              className="absolute bg-primary-500 text-white text-xs px-2 py-1 rounded pointer-events-none shadow-lg"
              style={{
                left: Math.min(cropStart.x, cropEnd.x),
                top: Math.max(0, Math.min(cropStart.y, cropEnd.y) - 30),
              }}
            >
              {Math.round(Math.abs(cropEnd.x - cropStart.x))} ×{" "}
              {Math.round(Math.abs(cropEnd.y - cropStart.y))}
            </div>
          </>
        )}

        {/* Crop mode indicator */}
        {isCropMode && !cropStart && (
          <div className="absolute inset-0 border-2 border-dashed border-primary-500 bg-primary-500/10 flex items-center justify-center pointer-events-none">
            <div className="bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Click and drag to select crop area
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="absolute bottom-2 left-2 z-10 px-2 py-1 bg-black/70 text-white text-xs rounded">
        {isCropMode
          ? "Click and drag to select crop area"
          : scale > 1
            ? "Drag to pan • Scroll to zoom"
            : "Scroll or use buttons to zoom"}
      </div>
    </div>
  );
}
