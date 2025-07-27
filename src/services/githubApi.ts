import { GitHubFile, Repository } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        if (i === retries - 1) throw new Error(`GitHub API error: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Failed to fetch from GitHub API');
  }

  async getRepository(repoUrl: string): Promise<Repository> {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');
    
    const repoResponse = await this.fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${cleanRepo}`);
    const repoData = await repoResponse.json();
    
    if (repoData.private) {
      throw new Error('Repository is private. Please use a public repository.');
    }
    
    const files = await this.getRepositoryFiles(owner, cleanRepo);
    
    return {
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      owner: repoData.owner.login,
      url: repoData.html_url,
      files
    };
  }

  private async getRepositoryFiles(owner: string, repo: string, path = ''): Promise<GitHubFile[]> {
    const response = await this.fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`);
    const contents = await response.json();
    
    if (!Array.isArray(contents)) {
      return [];
    }
    
    const files: GitHubFile[] = [];
    const importantFiles = [
      'package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 
      'pom.xml', 'Gemfile', 'composer.json', 'setup.py', 'Dockerfile',
      'docker-compose.yml', '.env.example', 'config.js', 'config.json',
      'logo.png', 'logo.svg', 'logo.jpg', 'logo.jpeg', 'icon.png', 'icon.svg',
      'brand.png', 'brand.svg', 'assets/logo.png', 'assets/logo.svg',
      'public/logo.png', 'public/logo.svg', 'src/assets/logo.png', 'src/assets/logo.svg'
    ];
    
    // First, collect all files in current directory
    for (const item of contents) {
      if (item.type === 'file') {
        const shouldFetchContent = importantFiles.includes(item.name) || 
                                  item.name.toLowerCase().includes('logo') ||
                                  item.name.toLowerCase().includes('icon') ||
                                  item.name.toLowerCase().includes('brand') ||
                                  item.name.toLowerCase().includes('readme') ||
                                  item.name.toLowerCase().includes('license') ||
                                  item.size < 10000; // Fetch small files
        
        let content = '';
        if (shouldFetchContent) {
          try {
            const fileResponse = await this.fetchWithRetry(item.download_url);
            content = await fileResponse.text();
          } catch (error) {
            console.warn(`Failed to fetch content for ${item.path}`);
          }
        }
        
        files.push({
          name: item.name,
          path: item.path,
          type: 'file',
          content,
          size: item.size
        });
      } else if (item.type === 'dir' && files.length < 50) { // Limit depth
        files.push({
          name: item.name,
          path: item.path,
          type: 'dir'
        });
        
        // Recursively fetch important directories
        if (['src', 'app', 'lib', 'components', 'pages', 'api'].includes(item.name.toLowerCase())) {
          try {
            const subFiles = await this.getRepositoryFiles(owner, repo, item.path);
            files.push(...subFiles.slice(0, 20)); // Limit files per directory
          } catch (error) {
            console.warn(`Failed to fetch directory ${item.path}`);
          }
        }
      }
    }
    
    return files;
  }
}