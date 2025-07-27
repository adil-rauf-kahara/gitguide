import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Eye, Edit3, Download, Copy, Check, FileText } from 'lucide-react';
import { GeneratedReadme } from '../types';

interface ReadmePreviewProps {
  readme: GeneratedReadme;
  onEdit: () => void;
  onDownload: () => void;
}

export const ReadmePreview: React.FC<ReadmePreviewProps> = ({ readme, onEdit, onDownload }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(readme.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Generated README.md</h2>
          <p className="text-gray-600">Preview how your README will look on GitHub</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </button>
        </div>
      </div>

      {/* GitHub-style file container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* GitHub-style file header */}
        <div className="bg-gray-50 border-b border-gray-300 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-900">README.md</span>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors border border-gray-300"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </button>
        </div>

        {/* README content with GitHub styling */}
        <div className="p-8 bg-white">
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Code blocks
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={prism}
                      language={match[1]}
                      PreTag="div"
                      className="!bg-gray-50 !border border-gray-200 rounded-md"
                      customStyle={{
                        margin: '16px 0',
                        fontSize: '14px',
                        lineHeight: '1.45',
                        padding: '16px',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code 
                      className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200" 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                
                // Headers with GitHub styling
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200 mt-0 leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 mt-8 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6 leading-tight">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-5 leading-tight">
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 className="text-base font-semibold text-gray-900 mb-2 mt-4 leading-tight">
                    {children}
                  </h5>
                ),
                h6: ({ children }) => (
                  <h6 className="text-sm font-semibold text-gray-900 mb-2 mt-4 leading-tight">
                    {children}
                  </h6>
                ),
                
                // Paragraphs
                p: ({ children }) => (
                  <p className="text-gray-900 mb-4 leading-7 text-base">
                    {children}
                  </p>
                ),
                
                // Lists
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4 space-y-2 text-gray-900">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-4 space-y-2 text-gray-900">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-900 leading-7">
                    {children}
                  </li>
                ),
                
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 ml-0 mb-4 text-gray-700 bg-gray-50 py-3 rounded-r-md">
                    {children}
                  </blockquote>
                ),
                
                // Tables
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="border-collapse border border-gray-300 w-full rounded-md overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 border border-gray-300 text-left font-semibold text-gray-900 text-sm">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 border border-gray-300 text-gray-900 text-sm">
                    {children}
                  </td>
                ),
                
                // Links
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                
                // Text formatting
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-900">
                    {children}
                  </em>
                ),
                
                // Horizontal rule
                hr: () => (
                  <hr className="border-0 border-t border-gray-300 my-8" />
                ),
                
                // Images with proper styling
                img: ({ src, alt, title }) => (
                  <img 
                    src={src} 
                    alt={alt}
                    title={title}
                    className="max-w-full h-auto rounded-md border border-gray-200 my-4 shadow-sm" 
                  />
                ),
                
                // Task lists (checkboxes)
                input: ({ type, checked, ...props }) => {
                  if (type === 'checkbox') {
                    return (
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="mr-2 rounded border-gray-300"
                        {...props}
                      />
                    );
                  }
                  return <input type={type} {...props} />;
                },
              }}
            >
              {readme.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};