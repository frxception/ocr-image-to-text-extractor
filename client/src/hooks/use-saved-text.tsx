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

const STORAGE_KEY = 'ocr_saved_texts';

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
          timestamp: new Date(entry.timestamp)
        }));
        setSavedTexts(withDates);
      }
    } catch (error) {
      console.error('Failed to load saved texts:', error);
    }
  }, []);

  // Save texts to localStorage whenever savedTexts changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTexts));
    } catch (error) {
      console.error('Failed to save texts to localStorage:', error);
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
      title: title || `Text extraction ${new Date().toLocaleString()}`
    };

    setSavedTexts(prev => [newEntry, ...prev]);
    return newEntry.id;
  }, []);

  const deleteText = useCallback((id: string) => {
    setSavedTexts(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSavedTexts([]);
  }, []);

  const updateTitle = useCallback((id: string, title: string) => {
    setSavedTexts(prev => prev.map(entry => 
      entry.id === id ? { ...entry, title } : entry
    ));
  }, []);

  const exportTexts = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: savedTexts.length,
      entries: savedTexts
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocr-extracted-texts-${new Date().toISOString().split('T')[0]}.json`;
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
    count: savedTexts.length
  };
}