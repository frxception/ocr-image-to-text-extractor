import { useCallback } from "react";
import { createWorker } from "tesseract.js";
import { OCRResult, ImageEnhancementLevel, CharacterFocus } from "@/pages/home";

export function useOCR() {
  // Image preprocessing function to enhance text recognition
  const preprocessImage = useCallback((file: File, enhancementLevel: ImageEnhancementLevel): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply image enhancements based on selected level
        if (enhancementLevel !== 'none') {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convert to grayscale with improved luminance formula
            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            
            let enhanced = gray;
            
            // Apply enhancement based on level
            switch (enhancementLevel) {
              case 'light':
                // Minimal enhancement
                enhanced = ((enhanced - 128) * 1.2) + 128 + 10;
                if (enhanced > 180) enhanced = 255;
                else if (enhanced < 80) enhanced = 0;
                break;
                
              case 'medium':
                // Balanced enhancement 
                enhanced = ((enhanced - 128) * 1.5) + 128 + 20;
                if (enhanced > 160) enhanced = 255;
                else if (enhanced < 100) enhanced = 0;
                else enhanced = enhanced > 130 ? 255 : 0;
                break;
                
              case 'strong':
                // Maximum enhancement for very difficult images
                enhanced = ((enhanced - 128) * 2.0) + 128 + 30;
                if (enhanced > 140) enhanced = 255;
                else if (enhanced < 120) enhanced = 0;
                else enhanced = enhanced > 130 ? 255 : 0;
                break;
            }
            
            // Clamp values
            enhanced = Math.max(0, Math.min(255, enhanced));
            
            // Set RGB channels to the enhanced value
            data[i] = enhanced;     // Red
            data[i + 1] = enhanced; // Green
            data[i + 2] = enhanced; // Blue
            // Alpha channel remains unchanged
          }
        }

        // Put the enhanced image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Apply additional sharpening filter for medium and strong enhancement
        if (enhancementLevel === 'medium' || enhancementLevel === 'strong') {
          const sharpenedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const sharpenedData = sharpenedImageData.data;
          const width = canvas.width;
          const height = canvas.height;

          // Adjust sharpening intensity based on enhancement level
          const sharpenIntensity = enhancementLevel === 'strong' ? 7 : 5;
          const kernel = [
            0, -1, 0,
            -1, sharpenIntensity, -1,
            0, -1, 0
          ];
          
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              let r = 0, g = 0, b = 0;
              
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const pixel = ((y + ky) * width + (x + kx)) * 4;
                  const kernelValue = kernel[(ky + 1) * 3 + (kx + 1)];
                  
                  r += data[pixel] * kernelValue;
                  g += data[pixel + 1] * kernelValue;
                  b += data[pixel + 2] * kernelValue;
                }
              }
              
              const targetPixel = (y * width + x) * 4;
              sharpenedData[targetPixel] = Math.max(0, Math.min(255, r));
              sharpenedData[targetPixel + 1] = Math.max(0, Math.min(255, g));
              sharpenedData[targetPixel + 2] = Math.max(0, Math.min(255, b));
            }
          }
          
          ctx.putImageData(sharpenedImageData, 0, 0);
        }
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png', 1.0);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const extractText = useCallback(async (
    file: File, 
    enhancementLevel: ImageEnhancementLevel,
    characterFocus: CharacterFocus = 'all',
    onProgress?: (progress: number, stage?: string) => void
  ): Promise<{ result: OCRResult; processedImageUrl: string | null }> => {
    // Report preprocessing stage
    onProgress?.(0.1, 'Enhancing image for better text recognition...');
    
    // Preprocess the image for better OCR accuracy
    const preprocessedBlob = await preprocessImage(file, enhancementLevel);
    const processedImageUrl = enhancementLevel !== 'none' ? URL.createObjectURL(preprocessedBlob) : null;
    
    onProgress?.(0.2, 'Initializing OCR engine...');
    
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(0.2 + m.progress * 0.8, 'Extracting text from image...');
        }
      }
    });

    try {
      // Configure character whitelist based on focus setting
      let charWhitelist = '';
      switch (characterFocus) {
        case 'numbers':
          charWhitelist = '0123456789 .,';
          break;
        case 'alphanumeric':
          charWhitelist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
          break;
        case 'all':
        default:
          charWhitelist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%^&*()-_=+[]{}|;:\'",.<>/\\`~';
          break;
      }

      // Configure Tesseract for better accuracy with enhanced images and character focus
      await worker.setParameters({
        tessedit_char_whitelist: charWhitelist,
      });

      const { data } = await worker.recognize(preprocessedBlob);
      
      // Preserve original spacing and indentation while applying character focus filtering
      let processedText = data.text;
      
      if (characterFocus === 'numbers') {
        // Keep only numbers, spaces, periods, commas, and line breaks - preserve formatting
        processedText = processedText.replace(/[^0-9 .,\n\t\r]/g, '');
      } else if (characterFocus === 'alphanumeric') {
        // Keep only letters, numbers, spaces, and line breaks - preserve formatting  
        processedText = processedText.replace(/[^A-Za-z0-9 \n\t\r]/g, '');
      }
      
      // Preserve exact indentation, spacing, and line breaks 
      // Only clean up the very end and beginning to avoid empty results
      processedText = processedText
        .replace(/^\n+/, '') // Remove leading empty lines only
        .replace(/\n+$/, ''); // Remove trailing empty lines only
        
      // If result is empty after filtering, provide a meaningful message
      if (!processedText.trim()) {
        processedText = characterFocus === 'numbers' 
          ? 'No numbers found in the image.'
          : characterFocus === 'alphanumeric' 
          ? 'No alphanumeric characters found in the image.'
          : 'No text found in the image.';
      }
      
      // Calculate statistics
      const words = processedText.split(/\s+/).filter(word => word.length > 0).length;
      const characters = processedText.length;
      const lines = processedText.split('\n').filter(line => line.trim().length > 0).length;
      const confidence = data.confidence;

      return {
        result: {
          text: processedText,
          confidence,
          words,
          characters,
          lines
        },
        processedImageUrl
      };
    } finally {
      await worker.terminate();
    }
  }, [preprocessImage]);

  return { extractText };
}
