# lovstudio Tauri Boilerplate

Production-ready Tauri + React + TypeScript boilerplate with modern development tools and best practices.

## Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript 5.8** - Type-safe development
- **Vite 7** - Lightning-fast build tool with HMR
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Zustand** - Lightweight state management

### Backend
- **Tauri v2** - Rust-based desktop app framework
- **Modular architecture** - Organized command structure

### Development Tools
- **ESLint 9** - Code linting with modern flat config
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Rust fmt** - Rust code formatting

## Project Structure

```
lovtauri/
├── src/                        # React frontend
│   ├── components/             # Reusable components
│   │   ├── nav.tsx            # Navigation component
│   │   ├── theme-provider.tsx # Theme management
│   │   └── theme-toggle.tsx   # Theme switcher
│   ├── pages/                  # Route pages
│   │   ├── home.tsx           # Home page
│   │   └── about.tsx          # About page
│   ├── stores/                 # Zustand stores
│   │   └── theme.ts           # Theme store example
│   ├── lib/                    # Utilities
│   │   └── utils.ts           # Helper functions (cn, etc.)
│   ├── App.tsx                # App router
│   ├── main.tsx               # React entry
│   └── globals.css            # Global styles + Tailwind
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   ├── commands/          # Tauri commands (modular)
│   │   │   ├── mod.rs
│   │   │   └── greet.rs       # Example command
│   │   ├── lib.rs             # Main app setup
│   │   └── main.rs            # Entry point
│   └── Cargo.toml             # Rust dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript config with path aliases
├── vite.config.ts              # Vite config with Tauri integration
├── eslint.config.js            # ESLint flat config
└── .prettierrc                 # Prettier config
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Rust 1.70+
- Platform-specific dependencies for Tauri (see [Tauri Prerequisites](https://tauri.app/start/prerequisites/))

### Installation

1. Clone or use as template:
```bash
git clone https://github.com/lovstudio/tauri-boilerplate.git my-app
cd my-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development:
```bash
pnpm tauri dev
```

### Development Commands

```bash
# Frontend
pnpm dev              # Start Vite dev server
pnpm build            # Build frontend
pnpm preview          # Preview production build

# Tauri
pnpm tauri dev        # Start Tauri app (includes frontend)
pnpm tauri build      # Build production app

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting

# Rust
cd src-tauri
cargo fmt             # Format Rust code
cargo clippy          # Lint Rust code
```

## Features

### 🎨 Theme System
- Light/Dark mode with system preference support
- Persistent theme storage with Zustand
- shadcn/ui integration with CSS variables

### 🧭 Routing
- React Router 7 setup
- Example pages (Home, About)
- Navigation component with active state

### 📦 State Management
- Zustand with TypeScript
- Persist middleware example (theme storage)
- Simple, unopinionated structure

### 🎯 Type Safety
- Full TypeScript coverage
- Path aliases (`@/*` imports)
- Tauri command type safety

### 🛠 Development Experience
- Hot Module Replacement (HMR)
- ESLint + Prettier integration
- VS Code ready

## Customization

### Update App Identity

1. **package.json**: Change `name`, `description`, `author`
2. **Cargo.toml**: Update `name`, `description`, `authors`
3. **src-tauri/tauri.conf.json**: Modify app identifier and metadata

### Adding Tauri Commands

1. Create command in `src-tauri/src/commands/your_command.rs`:
```rust
#[tauri::command]
pub fn your_command(param: &str) -> String {
    // Your logic
}
```

2. Export in `src-tauri/src/commands/mod.rs`:
```rust
pub mod your_command;
pub use your_command::your_command;
```

3. Register in `src-tauri/src/lib.rs`:
```rust
.invoke_handler(tauri::generate_handler![greet, your_command])
```

### Adding shadcn/ui Components

Use shadcn CLI or manually add components:
```bash
npx shadcn@latest add button
```

## Best Practices

- Use semantic color tokens (e.g., `bg-background`, `text-foreground`)
- Leverage Tailwind config for theme consistency
- Organize Tauri commands by feature/module
- Keep components small and focused (KISS principle)
- Use TypeScript strictly

## License

MIT

## Credits

Built with ❤️ by [lovstudio](https://github.com/lovstudio)
