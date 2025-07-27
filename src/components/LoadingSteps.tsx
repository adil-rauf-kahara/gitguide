import React from 'react';
import { CheckCircle, Circle, Loader } from 'lucide-react';

interface LoadingStepsProps {
  currentStep: 'analyzing' | 'generating';
}

export const LoadingSteps: React.FC<LoadingStepsProps> = ({ currentStep }) => {
  const steps = [
    { key: 'analyzing', label: 'Analyzing repository structure', description: 'Reading files and understanding project' },
    { key: 'generating', label: 'Generating README content', description: 'Using AI to create comprehensive documentation' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your README</h2>
        <p className="text-gray-600">Please wait while we analyze your repository and generate the perfect README</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
          
          return (
            <div key={step.key} className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : isActive ? (
                  <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {step.label}
                </h3>
                <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
                {isActive && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> We're analyzing your repository files to understand the project structure, 
          dependencies, and purpose to generate a comprehensive README that matches your project perfectly.
        </p>
      </div>
    </div>
  );
};