<a name="readme-top"></a>

<div align="center">
  <a href="https://nano-canvas-kappa.vercel.app/" target="_blank" rel="noreferrer">
    <img src="public/favicon.svg" alt="Nano Canvas" width="120" />
  </a>
  <h1>🎨 Nano Canvas</h1>
  <p align="center">
    Infinite visual workspaces for AI vision models — drag images, craft prompts, and explore results in one canvas.
  </p>

  <p align="center">
    <a href="#-features">Features</a>
    ·
    <a href="#-getting-started">Getting Started</a>
    ·
    <a href="#-architecture">Architecture</a>
    ·
    <a href="#-roadmap">Roadmap</a>
    ·
    <a href="#-community">Community</a>
  </p>

  <p>
    <a href="https://pnpm.io"><img alt="Built with pnpm" src="https://img.shields.io/badge/pnpm-%23000000.svg?style=for-the-badge&logo=pnpm&logoColor=white" /></a>
    <a href="https://vitejs.dev"><img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /></a>
    <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" /></a>
    <a href="https://tailwindcss.com"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8" /></a>
    <a href="https://vitest.dev"><img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" /></a>
  </p>
</div>

---

> **Nano Canvas** lets you explore vision LLM workflows visually: upload reference images, link prompts, and see results instantly — all on one infinite canvas.

> 💡 **Note:** This is my first open-source project. If you spot something that could be better, please jump in! Learning together is the goal. 🌱

## ✨ Features

| Experience | AI Workflow | Polish |
| --- | --- | --- |
| 🌀 Infinite pan/zoom canvas | 🤖 Google Gemini vision integration | 🎯 Guided drag-to-connect interactions |
| 📷 Drag & drop or paste images | 🧠 Prompt nodes with history & scaling | ♿ Keyboard navigation & focus trapping |
| 🔁 Auto-spawn linked nodes | 🔐 Local storage persistence | ☁️ CSP hardened, production-ready |

## 🚀 Getting Started

**Prerequisites**: Node.js ≥ 18 and pnpm (or npm/yarn)

```bash
# Clone and install
git clone https://github.com/AUT-Valunex/nano-canvas.git
cd nano-canvas
pnpm install

# Start developing
pnpm dev
```

Open [localhost:5173](http://localhost:5173) or try the [live demo](https://nano-canvas-kappa.vercel.app/). Click the ⚙️ icon to add your [Google AI API key](https://makersuite.google.com/app/apikey).

### 🧪 Commands

```bash
pnpm dev       # Start dev server
pnpm build     # Build for production
pnpm test      # Run tests
pnpm lint      # Check code quality
pnpm format    # Format code (optional)
```

## 🧱 Architecture

```
src/
├─ components/        # React components (Canvas, Nodes, Toolbar, Settings)
├─ hooks/            # Custom React hooks (connection logic)
├─ services/         # Google AI integration
├─ store/            # Zustand state management
└─ test/             # Vitest test suites
```

**Key Design Decisions**:
- **Zustand** for simple, reactive state management
- **React Flow** for the infinite canvas experience
- **Accessibility first** — keyboard shortcuts, focus trapping, ARIA labels
- **No tracking** — completely private, works offline after first load

## 🛣️ Roadmap

- [ ] Response streaming for long generations
- [ ] Workspace export/import (save your canvases!)
- [ ] Multi-provider support (OpenAI, Anthropic, etc.)
- [ ] IndexedDB for persistent image storage
- [ ] Real-time collaboration (maybe!)

Have ideas? [Open an issue](https://github.com/AUT-Valunex/nano-canvas/issues) and let's chat. 💬

## 🤝 Community

- 📖 [Contributing Guide](docs/CONTRIBUTING.md) — Help make this better!
- 🤝 [Code of Conduct](docs/CODE_OF_CONDUCT.md) — Be kind, be respectful
- 🔒 [Security Policy](docs/SECURITY.md) — Report vulnerabilities privately
- 📝 [Changelog](docs/CHANGELOG.md) — Track updates and releases
- 🔧 [Google API Guide](docs/GOOGLE_API.md) — Learn about Gemini's image features

## 📄 License

Licensed under **AGPLv3** — see [LICENSE](LICENSE) for details.

**Network Source Notice**: The app includes a "Source & License" link in the footer (required by AGPL §13). Please keep it visible if you deploy your own instance.

**Third-Party Licenses**: See [docs/NOTICE.md](docs/NOTICE.md) for bundled dependencies.

---

<p align="center">
  Built with ❤️ for creative exploration. <a href="#readme-top">⬆️ Back to top</a>
</p>
