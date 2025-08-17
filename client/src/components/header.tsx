import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, FileText } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FileText className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">OCR Extract</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {theme === "light" ? (
                <Sun className="text-yellow-500 w-5 h-5" />
              ) : (
                <Moon className="text-blue-400 w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
