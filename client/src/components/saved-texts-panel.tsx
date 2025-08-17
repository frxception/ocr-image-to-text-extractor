import { BarChart3, Calendar, Download, Edit3, FileText, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { SavedTextEntry } from "@/hooks/use-saved-text";

interface SavedTextsPanelProps {
  savedTexts: SavedTextEntry[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onUpdateTitle: (id: string, title: string) => void;
  onExport: () => void;
  onExportAsText: () => void;
}

export default function SavedTextsPanel({
  savedTexts,
  onClose,
  onDelete,
  onClearAll,
  onUpdateTitle,
  onExport,
  onExportAsText,
}: SavedTextsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredTexts = savedTexts.filter(
    (entry) =>
      entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (entry: SavedTextEntry) => {
    setEditingId(entry.id);
    setEditTitle(entry.title || "");
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onUpdateTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Saved Extracted Texts
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved texts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={onExport}
                disabled={savedTexts.length === 0}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                title="Export as JSON file"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export JSON
              </button>

              <button
                onClick={onExportAsText}
                disabled={savedTexts.length === 0}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
                title="Export as text file with preserved formatting"
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Export Text
              </button>

              <button
                onClick={onClearAll}
                disabled={savedTexts.length === 0}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Clear All
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {savedTexts.length} total entries
            </span>
            {filteredTexts.length !== savedTexts.length && (
              <span>{filteredTexts.length} matching search</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
          {filteredTexts.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No texts match your search" : "No saved texts yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTexts.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  {/* Title and Actions */}
                  <div className="flex items-center justify-between mb-3">
                    {editingId === entry.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-gray-900 dark:text-white flex-1">
                          {entry.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Edit title"
                          >
                            <Edit3 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.timestamp.toLocaleString()}
                    </span>
                    <span>{entry.words} words</span>
                    <span>{entry.characters} chars</span>
                    <span>{Math.round(entry.confidence)}% confidence</span>
                  </div>

                  {/* Text Preview */}
                  <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-900 dark:text-gray-100 font-mono leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                      {entry.text.length > 200
                        ? `${entry.text.substring(0, 200)}...`
                        : entry.text || "No text extracted"}
                    </div>

                    <button
                      onClick={() => copyToClipboard(entry.text)}
                      className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      Copy full text
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
