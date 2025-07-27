# GitGuide - AI README Generator CLI

> **🚀 Transform any project directory into professional documentation with AI**

GitGuide is a powerful command-line tool that analyzes your project directory and generates comprehensive README.md files using Google's Gemini AI.

[![NPM Version](https://img.shields.io/npm/v/gitguide.svg)](https://www.npmjs.com/package/gitguide)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

## ✨ Features

- 🤖 **AI-Powered** - Uses Google Gemini AI for intelligent README generation
- 📁 **Local Analysis** - Works with any local project directory
- 🔧 **Easy Setup** - Simple configuration with your Gemini API key
- 🎯 **Smart Detection** - Automatically detects project type, tech stack, and structure
- 📝 **Professional Output** - Generates GitHub-ready markdown documentation
- ⚡ **Fast & Efficient** - Analyzes projects quickly with intelligent file filtering
- 🌐 **Universal** - Works with any programming language or framework

## 🚀 Quick Start

### Installation

Install GitGuide globally via npm:

```bash
npm install -g gitguide
```

### Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Configure GitGuide with your API key:

```bash
gitguide config
```

### Usage

Generate a README for your current directory:

```bash
gitguide generate
```

Or specify a different directory:

```bash
gitguide generate -d ./my-project
```

## 📖 Commands

### `gitguide config`
Set up your Gemini API key. This only needs to be done once.

### `gitguide generate` (or `gitguide gen`)
Generate a README.md file for your project.

**Options:**
- `-d, --directory <path>` - Target directory (default: current directory)
- `-o, --output <filename>` - Output filename (default: README.md)
- `--force` - Overwrite existing README.md

**Examples:**
```bash
# Generate README for current directory
gitguide generate

# Generate for specific directory
gitguide gen -d ./my-awesome-project

# Custom output filename
gitguide generate -o DOCUMENTATION.md

# Force overwrite existing README
gitguide gen --force
```

### `gitguide help`
Show help information and usage examples.

## 🏗️ How It Works

1. **Directory Analysis** - Scans your project directory and subdirectories
2. **File Processing** - Intelligently reads and processes relevant files
3. **Project Detection** - Identifies programming language, frameworks, and project type
4. **AI Generation** - Uses Gemini AI to create comprehensive documentation
5. **README Creation** - Saves the generated README.md to your project

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe development
- **Commander.js** - CLI framework
- **Inquirer.js** - Interactive prompts
- **Chalk** - Terminal styling
- **Ora** - Loading spinners
- **Google Gemini AI** - Content generation

## 📁 Project Structure

```
gitguide/
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 README.md
├── 📁 src/
│   ├── 📄 cli.ts              # CLI entry point
│   ├── 📄 index.ts            # Main exports
│   ├── 📁 commands/           # CLI commands
│   │   ├── 📄 config.ts       # API key configuration
│   │   └── 📄 generate.ts     # README generation
│   ├── 📁 services/           # Core services
│   │   ├── 📄 directoryAnalyzer.ts
│   │   └── 📄 geminiService.ts
│   ├── 📁 utils/              # Utilities
│   │   └── 📄 config.ts       # Config management
│   └── 📁 types/              # TypeScript types
│       └── 📄 index.ts
└── 📁 dist/                   # Compiled JavaScript
```

## 🔐 Privacy & Security

- Your API key is stored locally in `~/.gitguide/config.json`
- No project data is stored or transmitted except to Gemini AI for generation
- All file processing happens locally on your machine

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful content generation
- The open-source community for inspiration
- All contributors and users of GitGuide

---

**Need help?** Open an issue on GitHub or check out our [documentation](https://github.com/yourusername/gitguide).

Made with ❤️ by developers, for developers.