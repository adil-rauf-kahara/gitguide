# gitguide

> **🛠️ Powerful command-line tool for developers**

AI-powered README generator for any project directory

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)]()

## ✨ Features

- AI-powered README generation using the Google Gemini API.
- Analyzes project directory structure and files to create a tailored README.
- Interactive command-line interface using Inquirer.js for configuration and generation.
- Handles various project types and programming languages.
- Configurable output filename and target directory.
- Robust error handling and informative feedback to the user.
- Supports overwriting existing README files.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)  ([Download Node.js](https://nodejs.org/))
- npm or yarn package manager
- A Google Gemini API key (obtainable from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/gitguide.git
   cd gitguide
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Build:** For production use, build the project:
   ```bash
   npm run build
   ```

### Usage

1. **Configure API Key:** This is a one-time setup.  The tool will guide you through the process interactively.
   ```bash
   gitguide config
   ```
   You will be prompted to enter your Gemini API key securely.

2. **Generate a README:** Navigate to the project directory for which you want to generate a README. Then run:
   ```bash
   gitguide generate
   ```
   This generates a `README.md` in the current directory.  To specify a different directory or output file, use the options:

   ```bash
   gitguide generate -d ./my-project -o myreadme.md
   ```
   Use `--force` to overwrite an existing `README.md` file.

## 📁 Project Structure

```
.
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── index.js
└── src
    ├── commands
    │   ├── config.ts
    │   └── generate.ts
    ├── services
    │   ├── directoryAnalyzer.ts
    │   └── geminiService.ts
    ├── types
    │   └── index.ts
    └── utils
        └── config.ts
```

## 🔧 Configuration

The application uses a configuration file stored in `~/.gitguide/config.json`.  This file stores your Gemini API key.  The `gitguide config` command handles the creation and updating of this file.  It uses the `inquirer` package for a user-friendly interactive experience.

## 📖 Commands

- `gitguide config`: Sets up your Gemini API key. This is required before generating READMEs.  The command will guide you through the process of securely entering your key.
- `gitguide generate` or `gitguide gen`: Generates a README.md file in the specified (or current) directory.  See options above.
- `gitguide --help`: Displays help information.

## 🛠️ Tech Stack

**Core Technologies:**

- Node.js
- TypeScript

**Dependencies:**

- `commander`: Command-line interface parsing.
- `inquirer`: Interactive command-line prompts.
- `chalk`: Terminal styling.
- `ora`: Elegant terminal spinners.
- `node-fetch`: HTTP client.
- `fs-extra`: File system utilities.

## 📚 Components and Functionality

The application is built with a component-based architecture using TypeScript.  Key components include:

- **`cli.ts`:** The command-line interface entry point, using the `commander` library to parse commands and options.  It handles the `config` and `generate` commands, delegating the core logic to other modules.
- **`commands/config.ts`:**  Handles the configuration of the Gemini API key, using `inquirer` for user interaction and `fs-extra` for file system operations.
- **`commands/generate.ts`:** The core logic for README generation. It uses `directoryAnalyzer.ts` to analyze the project directory and `geminiService.ts` to interact with the Google Gemini API.
- **`services/directoryAnalyzer.ts`:**  Recursively analyzes the project directory structure, identifying files and extracting relevant information.  It employs intelligent exclusion patterns to ignore common build artifacts and version control files.
- **`services/geminiService.ts`:**  Handles communication with the Google Gemini API. It constructs a prompt based on the project data and sends it to the API, processing the response to extract the generated README content.
- **`utils/config.ts`:** Manages the configuration file, reading and writing the API key securely.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m "Add some feature"`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Create a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API
- All contributors

---
Made with ❤️ by the gitguide team