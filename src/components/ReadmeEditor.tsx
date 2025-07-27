import React, { useState } from 'react';
import { Save, Eye, Download, X } from 'lucide-react';
import { GeneratedReadme } from '../types';

interface ReadmeEditorProps {
  readme: GeneratedReadme;
  onSave: (content: string) => void;
  onCancel: () => void;
  onDownload: () => void;
}

export const ReadmeEditor: React.FC<ReadmeEditorProps> = ({ readme, onSave, onCancel, onDownload }) => {
  const [content, setContent] = useState(readme.content);
  const [hasChanges, setHasChanges] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(e.target.value !== readme.content);
  };

  const handleSave = () => {
    onSave(content);
    setHasChanges(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit README.md</h2>
          <p className="text-gray-600">Make changes to your README content</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            You have unsaved changes. Don't forget to save your modifications!
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">README.md Content</h3>
            <div className="text-sm text-gray-500">
              {content.split('\n').length} lines • {content.length} characters
            </div>
          </div>
        </div>
        <div className="p-0">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-[600px] p-6 border-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed"
            placeholder="Enter your README content here..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Markdown Tips:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p><code className="bg-blue-100 px-1 rounded"># Heading 1</code> - Main title</p>
            <p><code className="bg-blue-100 px-1 rounded">## Heading 2</code> - Section title</p>
            <p><code className="bg-blue-100 px-1 rounded">**bold text**</code> - Bold formatting</p>
          </div>
          <div>
            <p><code className="bg-blue-100 px-1 rounded">`code`</code> - Inline code</p>
            <p><code className="bg-blue-100 px-1 rounded">- item</code> - Bullet list</p>
            <p><code className="bg-blue-100 px-1 rounded">[link](url)</code> - Links</p>
          </div>
        </div>
      </div>
    </div>
  );
};