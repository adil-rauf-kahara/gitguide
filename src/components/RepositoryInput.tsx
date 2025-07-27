import React, { useState } from 'react';
import { Github, Search, AlertCircle } from 'lucide-react';

interface RepositoryInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
  error: string | null;
}

export const RepositoryInput: React.FC<RepositoryInputProps> = ({ onSubmit, loading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const isValidGitHubUrl = (url: string) => {
    return /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/.test(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Github className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI README Generator</h1>
        <p className="text-gray-600">
          Transform any GitHub repository into a professional README.md file using AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="repo-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isValidGitHubUrl(url) && (
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter the URL of a public GitHub repository to analyze
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isValidGitHubUrl(url)}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing Repository...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Generate README
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">How it works</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-semibold">1</span>
            </div>
            <p className="text-sm text-gray-600">Analyze repository structure and code</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-semibold">2</span>
            </div>
            <p className="text-sm text-gray-600">Generate comprehensive README with AI</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-semibold">3</span>
            </div>
            <p className="text-sm text-gray-600">Preview, edit, and download your README</p>
          </div>
        </div>
      </div>
    </div>
  );
};