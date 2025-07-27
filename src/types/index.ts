export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  content?: string;
  size?: number;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  owner: string;
  url: string;
  files: GitHubFile[];
}

export interface GeneratedReadme {
  content: string;
  sections: string[];
}

export type AppStep = 'input' | 'analyzing' | 'generating' | 'preview' | 'edit';