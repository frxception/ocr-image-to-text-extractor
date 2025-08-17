import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface TextSearchProps {
  text: string;
  onHighlight: (highlightedText: string, searchTerm: string, matchCount: number) => void;
}

export default function TextSearch({ text, onHighlight }: TextSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !text) return { matches: [], count: 0 };

    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = Array.from(text.matchAll(regex));

    return {
      matches: matches.map((match) => ({
        index: match.index || 0,
        text: match[0],
      })),
      count: matches.length,
    };
  }, [searchTerm, text]);

  const highlightedText = useMemo(() => {
    if (!searchTerm.trim() || searchResults.count === 0) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    let highlightIndex = 0;

    const highlighted = text.replace(regex, (match) => {
      const isCurrent = highlightIndex === currentMatch;
      highlightIndex++;
      return `<mark class="${isCurrent ? "bg-yellow-400 dark:bg-yellow-600" : "bg-yellow-200 dark:bg-yellow-800"} px-1 rounded">${match}</mark>`;
    });

    return highlighted;
  }, [text, searchTerm, currentMatch, searchResults.count]);

  useEffect(() => {
    onHighlight(highlightedText, searchTerm, searchResults.count);
  }, [highlightedText, searchTerm, searchResults.count, onHighlight]);

  const handleNext = () => {
    if (searchResults.count > 0) {
      setCurrentMatch((prev) => (prev + 1) % searchResults.count);
    }
  };

  const handlePrevious = () => {
    if (searchResults.count > 0) {
      setCurrentMatch((prev) => (prev - 1 + searchResults.count) % searchResults.count);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setCurrentMatch(0);
    setIsVisible(false);
  };

  useEffect(() => {
    setCurrentMatch(0);
  }, [searchTerm]);

  return (
    <div className="relative">
      {/* Search Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center px-3 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
        title="Search in text"
      >
        <Search className="w-4 h-4 mr-1" />
        Search
      </button>

      {/* Search Panel */}
      {isVisible && (
        <div className="absolute top-12  z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 min-w-80">
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in extracted text..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {searchTerm && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {searchResults.count > 0
                  ? `${currentMatch + 1} of ${searchResults.count} matches`
                  : "No matches found"}
              </span>

              {searchResults.count > 0 && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevious}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                    disabled={searchResults.count <= 1}
                    title="Previous match"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                    disabled={searchResults.count <= 1}
                    title="Next match"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
