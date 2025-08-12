import { Eye, FileImage, Smartphone, Shield, Copy, Gauge } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Eye,
      title: "High Accuracy",
      description: "Advanced OCR technology with 95%+ accuracy for clear text recognition",
      color: "blue"
    },
    {
      icon: FileImage,
      title: "Multiple Formats",
      description: "Support for JPG, PNG, and WEBP image formats up to 10MB",
      color: "green"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Responsive design that works perfectly on all devices and screen sizes",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Client-side processing means your images never leave your device",
      color: "yellow"
    },
    {
      icon: Copy,
      title: "Easy Export",
      description: "Copy to clipboard or download extracted text as a .txt file",
      color: "red"
    },
    {
      icon: Gauge,
      title: "Fast Processing",
      description: "Quick text extraction with real-time progress indicators",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-500",
      green: "bg-green-100 dark:bg-green-900 text-green-500",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-500",
      yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-500",
      red: "bg-red-100 dark:bg-red-900 text-red-500",
      indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-500"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section className="mt-16">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Powerful OCR Features
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Advanced text extraction capabilities designed for accuracy and ease of use
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${getColorClasses(feature.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
