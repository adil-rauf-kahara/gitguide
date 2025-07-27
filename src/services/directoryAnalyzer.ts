import path from 'path';
import fs from 'fs-extra';
import { ProjectData, ProjectFile, ProjectStructure, ExtractedProjectInfo } from '../types';

export class DirectoryAnalyzer {
  private readonly maxFileSize = 100 * 1024; // 100KB
  private readonly maxFiles = 200;
  private readonly excludePatterns = [
    /node_modules/,
    /\.git/,
    /dist/,
    /build/,
    /coverage/,
    /\.next/,
    /\.nuxt/,
    /\.cache/,
    /\.vscode/,
    /\.idea/,
    /\.DS_Store/,
    /\.env\.local/,
    /\.env\.production/,
    /package-lock\.json/,
    /yarn\.lock/,
    /pnpm-lock\.yaml/,
    /composer\.lock/,
    /Pipfile\.lock/,
    /poetry\.lock/,
    /\.pyc$/,
    /\.log$/,
    /\.tmp$/,
    /\.temp$/
  ];

  private readonly importantFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.js',
    'vite.config.js',
    'webpack.config.js',
    'tailwind.config.js',
    'requirements.txt',
    'Pipfile',
    'pyproject.toml',
    'setup.py',
    'Cargo.toml',
    'go.mod',
    'pom.xml',
    'build.gradle',
    'Gemfile',
    'composer.json',
    'Dockerfile',
    'docker-compose.yml',
    '.env.example',
    'config.js',
    'config.json'
  ];

  async analyzeDirectory(dirPath: string): Promise<ProjectData> {
    const structure = await this.getDirectoryStructure(dirPath);
    const files = await this.getProjectFiles(dirPath);
    const projectInfo = this.extractProjectInfo(dirPath, files);

    return {
      name: projectInfo.name,
      description: projectInfo.description,
      language: projectInfo.language,
      path: dirPath,
      files,
      structure,
      ...projectInfo
    };
  }

  private async getDirectoryStructure(dirPath: string): Promise<ProjectStructure> {
    let fileCount = 0;
    let directoryCount = 0;
    const languages: { [key: string]: number } = {};

    const scanDirectory = async (currentPath: string, depth: number = 0): Promise<void> => {
      if (depth > 10) return; // Prevent infinite recursion

      try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
          const relativePath = path.relative(dirPath, fullPath);

          if (this.shouldExclude(relativePath)) {
            continue;
          }

          if (entry.isDirectory()) {
            directoryCount++;
            await scanDirectory(fullPath, depth + 1);
          } else if (entry.isFile()) {
            fileCount++;
            const ext = path.extname(entry.name).toLowerCase();
            if (ext) {
              languages[ext] = (languages[ext] || 0) + 1;
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    await scanDirectory(dirPath);

    return {
      files: fileCount,
      directories: directoryCount,
      languages
    };
  }

  private async getProjectFiles(dirPath: string): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];
    let processedFiles = 0;

    const scanDirectory = async (currentPath: string, depth: number = 0): Promise<void> => {
      if (depth > 8 || processedFiles >= this.maxFiles) return;

      try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        // Process important files first
        const sortedEntries = entries.sort((a, b) => {
          const aImportant = this.importantFiles.includes(a.name);
          const bImportant = this.importantFiles.includes(b.name);
          if (aImportant && !bImportant) return -1;
          if (!aImportant && bImportant) return 1;
          return 0;
        });

        for (const entry of sortedEntries) {
          if (processedFiles >= this.maxFiles) break;

          const fullPath = path.join(currentPath, entry.name);
          const relativePath = path.relative(dirPath, fullPath);

          if (this.shouldExclude(relativePath)) {
            continue;
          }

          if (entry.isFile()) {
            const file = await this.processFile(fullPath, relativePath);
            if (file) {
              files.push(file);
              processedFiles++;
            }
          } else if (entry.isDirectory()) {
            files.push({
              name: entry.name,
              path: relativePath,
              type: 'directory',
              size: 0
            });
            await scanDirectory(fullPath, depth + 1);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    await scanDirectory(dirPath);
    return files;
  }

  private async processFile(fullPath: string, relativePath: string): Promise<ProjectFile | null> {
    try {
      const stats = await fs.stat(fullPath);
      const fileName = path.basename(relativePath);

      if (stats.size > this.maxFileSize) {
        return {
          name: fileName,
          path: relativePath,
          type: 'file',
          size: stats.size,
          content: `[File too large: ${Math.round(stats.size / 1024)}KB]`
        };
      }

      const shouldReadContent = this.shouldReadFileContent(fileName, relativePath);
      let content = '';

      if (shouldReadContent) {
        try {
          const buffer = await fs.readFile(fullPath);
          // Check if file is binary
          if (this.isBinaryFile(buffer)) {
            content = `[Binary file: ${path.extname(fileName)}]`;
          } else {
            content = buffer.toString('utf8').slice(0, 5000); // Limit content size
          }
        } catch (error) {
          content = '[Unable to read file content]';
        }
      }

      return {
        name: fileName,
        path: relativePath,
        type: 'file',
        size: stats.size,
        content
      };
    } catch (error) {
      return null;
    }
  }

  private shouldExclude(relativePath: string): boolean {
    return this.excludePatterns.some(pattern => pattern.test(relativePath));
  }

  private shouldReadFileContent(fileName: string, relativePath: string): boolean {
    // Always read important configuration files
    if (this.importantFiles.includes(fileName)) {
      return true;
    }

    // Read text files and common source files
    const ext = path.extname(fileName).toLowerCase();
    const textExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte',
      '.py', '.rb', '.php', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.hpp',
      '.css', '.scss', '.sass', '.less', '.styl',
      '.html', '.htm', '.xml', '.svg',
      '.json', '.yaml', '.yml', '.toml', '.ini', '.conf',
      '.md', '.txt', '.rst', '.adoc',
      '.sh', '.bash', '.zsh', '.fish',
      '.sql', '.graphql', '.gql',
      '.dockerfile', '.gitignore', '.gitattributes'
    ];

    return textExtensions.includes(ext) || fileName.startsWith('.env');
  }

  private isBinaryFile(buffer: Buffer): boolean {
    // Simple binary detection: check for null bytes in first 1KB
    const sample = buffer.slice(0, 1024);
    for (let i = 0; i < sample.length; i++) {
      if (sample[i] === 0) {
        return true;
      }
    }
    return false;
  }

  private extractProjectInfo(dirPath: string, files: ProjectFile[]): ExtractedProjectInfo {
    const dirName = path.basename(dirPath);
    let name = dirName;
    let description = '';
    let language = 'Unknown';
    let version = '1.0.0';

    // Extract info from package.json
    const packageJson = files.find(f => f.name === 'package.json');
    if (packageJson?.content && packageJson.content !== '[Binary file: .json]') {
      try {
        const pkg = JSON.parse(packageJson.content);
        name = pkg.name || name;
        description = pkg.description || description;
        version = pkg.version || version;
        if (pkg.dependencies?.react || pkg.devDependencies?.react) {
          language = 'JavaScript/React';
        } else if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
          language = 'JavaScript/Vue';
        } else if (pkg.dependencies?.next || pkg.devDependencies?.next) {
          language = 'JavaScript/Next.js';
        } else {
          language = 'JavaScript/Node.js';
        }
      } catch (error) {
        // Ignore JSON parse errors
      }
    }

    // Detect other languages
    if (files.some(f => f.name === 'requirements.txt' || f.name === 'setup.py')) {
      language = 'Python';
    } else if (files.some(f => f.name === 'Cargo.toml')) {
      language = 'Rust';
    } else if (files.some(f => f.name === 'go.mod')) {
      language = 'Go';
    } else if (files.some(f => f.name === 'pom.xml' || f.name === 'build.gradle')) {
      language = 'Java';
    } else if (files.some(f => f.name === 'Gemfile')) {
      language = 'Ruby';
    } else if (files.some(f => f.name === 'composer.json')) {
      language = 'PHP';
    }

    return {
      name,
      description,
      language,
      version
    };
  }
}