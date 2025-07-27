export interface ProjectFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  content?: string;
}

export interface ProjectStructure {
  files: number;
  directories: number;
  languages: { [key: string]: number };
}

export interface ProjectData {
  name: string;
  description: string;
  language: string;
  version?: string;
  path: string;
  files: ProjectFile[];
  structure: ProjectStructure;
}

export interface GeneratedReadme {
  content: string;
  sections: string[];
}

export interface ExtractedProjectInfo {
  name: string;
  description: string;
  language: string;
  version: string;
}