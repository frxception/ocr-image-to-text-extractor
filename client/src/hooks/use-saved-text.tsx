import { useState, useEffect, useCallback } from "react";
import { OCRResult } from "@/pages/home";

export interface SavedTextEntry {
  id: string;
  text: string;
  confidence: number;
  words: number;
  characters: number;
  lines: number;
  timestamp: Date;
  title?: string;
}

const STORAGE_KEY = "ocr_saved_texts";

export function useSavedText() {
  const [savedTexts, setSavedTexts] = useState<SavedTextEntry[]>([]);

  // Load saved texts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setSavedTexts(withDates);
      }
    } catch (error) {
      console.error("Failed to load saved texts:", error);
    }
  }, []);

  // Save texts to localStorage whenever savedTexts changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTexts));
    } catch (error) {
      console.error("Failed to save texts to localStorage:", error);
    }
  }, [savedTexts]);

  const saveText = useCallback((result: OCRResult, title?: string) => {
    const newEntry: SavedTextEntry = {
      id: crypto.randomUUID(),
      text: result.text,
      confidence: result.confidence,
      words: result.words,
      characters: result.characters,
      lines: result.lines,
      timestamp: new Date(),
      title: title || `Text extraction ${new Date().toLocaleString()}`,
    };

    setSavedTexts((prev) => [newEntry, ...prev]);
    return newEntry.id;
  }, []);

  const deleteText = useCallback((id: string) => {
    setSavedTexts((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSavedTexts([]);
  }, []);

  const updateTitle = useCallback((id: string, title: string) => {
    setSavedTexts((prev) => prev.map((entry) => (entry.id === id ? { ...entry, title } : entry)));
  }, []);

  const exportTexts = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: savedTexts.length,
      entries: savedTexts,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ocr-extracted-texts-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [savedTexts]);

  const exportTextsAsText = useCallback(() => {
    if (savedTexts.length === 0) return;

    // Create a formatted text file with all extracted texts
    const textContent = savedTexts
      .map((entry) => {
        const separator = "=".repeat(80);
        const header = `${entry.title || "Untitled"}`;
        const metadata = `Date: ${entry.timestamp.toLocaleString()}
Confidence: ${Math.round(entry.confidence)}%
Words: ${entry.words} | Characters: ${entry.characters} | Lines: ${entry.lines}`;
        
        return `${separator}
${header}
${separator}
${metadata}

${entry.text}

`;
      })
      .join("\n");

    // Add file header
    const fileHeader = `OCR Extracted Texts Export
Generated on: ${new Date().toLocaleString()}
Total entries: ${savedTexts.length}

`;

    const fullContent = fileHeader + textContent;

    const blob = new Blob([fullContent], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ocr-extracted-texts-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [savedTexts]);

  return {
    savedTexts,
    saveText,
    deleteText,
    clearAll,
    updateTitle,
    exportTexts,
    exportTextsAsText,
    count: savedTexts.length,
  };
}
