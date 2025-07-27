import React, { useState } from 'react';
import { RepositoryInput } from './components/RepositoryInput';
import { LoadingSteps } from './components/LoadingSteps';
import { ReadmePreview } from './components/ReadmePreview';
import { ReadmeEditor } from './components/ReadmeEditor';
import { GitHubService } from './services/githubApi';
import { GeminiService } from './services/geminiApi';
import { Repository, GeneratedReadme, AppStep } from './types';

function App() {
  const [step, setStep] = useState<AppStep>('input');
  const [repository, setRepository] = useState<Repository | null>(null);
  const [readme, setReadme] = useState<GeneratedReadme | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRepositorySubmit = async (url: string) => {
    setError(null);
    setStep('analyzing');

    try {
      const githubService = new GitHubService();
      const geminiService = new GeminiService();
      
      const repo = await githubService.getRepository(url);
      setRepository(repo);
      setStep('generating');

      const generatedReadme = await geminiService.generateReadme(repo);
      setReadme(generatedReadme);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep('input');
    }
  };

  const handleEditReadme = () => {
    setStep('edit');
  };

  const handleSaveReadme = (content: string) => {
    if (readme) {
      const updatedReadme: GeneratedReadme = {
        ...readme,
        content
      };
      setReadme(updatedReadme);
      setStep('preview');
    }
  };

  const handleCancelEdit = () => {
    setStep('preview');
  };

  const handleDownloadReadme = () => {
    if (readme) {
      const blob = new Blob([readme.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleStartOver = () => {
    setStep('input');
    setRepository(null);
    setReadme(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {step === 'input' && (
          <RepositoryInput
            onSubmit={handleRepositorySubmit}
            loading={false}
            error={error}
          />
        )}

        {(step === 'analyzing' || step === 'generating') && (
          <LoadingSteps currentStep={step} />
        )}

        {step === 'preview' && readme && (
          <>
            <div className="text-center mb-8">
              <button
                onClick={handleStartOver}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                ← Generate another README
              </button>
            </div>
            <ReadmePreview
              readme={readme}
              onEdit={handleEditReadme}
              onDownload={handleDownloadReadme}
            />
          </>
        )}

        {step === 'edit' && readme && (
          <>
            <div className="text-center mb-8">
              <button
                onClick={handleStartOver}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                ← Generate another README
              </button>
            </div>
            <ReadmeEditor
              readme={readme}
              onSave={handleSaveReadme}
              onCancel={handleCancelEdit}
              onDownload={handleDownloadReadme}
            />
          </>
        )}
      </div>

    </div>
  );
}

export default App;