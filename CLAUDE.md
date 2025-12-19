# CLAUDE.md

This file provides guidance to Claude Code when working with this lovstudio Tauri boilerplate.

## Design System

This project uses **Lovstudio Warm Academic Style (暖学术风格)**

Reference complete design guide: file:///Users/mark/@lovstudio/design/design-guide.md

### Quick Rules
1. **禁止硬编码颜色**：必须使用 semantic 类名（如 `bg-primary`、`text-muted-foreground`）
2. **字体配对**：标题用 `font-serif`，正文用默认 `font-sans`
3. **圆角风格**：使用 `rounded-lg`、`rounded-xl`、`rounded-2xl`
4. **主色调**：陶土色（按钮/高亮）+ 暖米色背景 + 炭灰文字
5. **组件优先**：优先使用 shadcn/ui 组件

### Color Palette
- **Primary**: #CC785C (陶土色 Terracotta) - for buttons, highlights
- **Background**: #F9F9F7 (暖米色 Warm Beige) - main background
- **Foreground**: #181818 (炭灰色 Charcoal) - text
- **Muted**: #E8E6DC (浅灰 Light Gray) - secondary backgrounds
- **Border**: #D5D3CB (边框灰 Border Gray)

### Common Patterns
- 主按钮: `bg-primary text-primary-foreground hover:bg-primary/90`
- 次要按钮: `variant="ghost" text-muted-foreground hover:text-foreground hover:bg-muted`
- 卡片: `bg-card border border-border rounded-xl`
- 静音文字: `text-muted-foreground text-sm`
- 标题: `font-serif text-foreground`

### Logo Assets
- Main Logo: `/lovpen-logo.svg` (陶土色 #D97757)
- Original: file:///Users/mark/@lovstudio/assets/lovpen-logo/LovPen-pure-logo_primaryColor.svg

## Project Overview

**lovstudio Tauri Boilerplate** - Production-ready Tauri + React + TypeScript starter with modern tooling.

**Architecture:**
- Frontend: React 19 + TypeScript + Vite + React Router 7
- UI: Tailwind CSS 4 + shadcn/ui
- State: Zustand
- Backend: Rust (Tauri v2) with modular command structure
- Communication: Tauri commands via `@tauri-apps/api/core` invoke

## Tech Stack

### Frontend
- **React 19** with TypeScript 5.8
- **Vite 7** for development and building
- **React Router 7** for routing
- **Tailwind CSS 4** with semantic color tokens
- **shadcn/ui** components (via manual setup)
- **Zustand** for state management
- **Lucide React** for icons

### Backend
- **Tauri v2** framework
- Modular Rust command structure in `src-tauri/src/commands/`
- Example: `greet` command

### Development Tools
- ESLint 9 (flat config)
- Prettier
- TypeScript path aliases (`@/*`)
- Rust fmt

## Development Commands

### Frontend
```bash
pnpm dev          # Vite dev server (port 1420)
pnpm build        # Build frontend
pnpm preview      # Preview build
```

### Tauri
```bash
pnpm tauri dev    # Start Tauri app (includes frontend)
pnpm tauri build  # Build production app
```

### Code Quality
```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

### Rust
```bash
cd src-tauri
cargo fmt         # Format Rust code
cargo clippy      # Lint Rust code
cargo build       # Build backend
```

## Project Structure

```
lovtauri/
├── src/
│   ├── components/          # React components
│   │   ├── nav.tsx         # Navigation with theme toggle
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── pages/              # Route pages
│   │   ├── home.tsx        # Main page with greet demo
│   │   └── about.tsx       # About page
│   ├── stores/             # Zustand stores
│   │   └── theme.ts        # Theme store (light/dark/system)
│   ├── lib/
│   │   └── utils.ts        # cn() and utilities
│   ├── App.tsx             # Router setup
│   ├── main.tsx            # React entry
│   └── globals.css         # Tailwind + theme CSS variables
├── src-tauri/
│   ├── src/
│   │   ├── commands/       # Modular Tauri commands
│   │   │   ├── mod.rs
│   │   │   └── greet.rs
│   │   ├── lib.rs          # App builder
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── tailwind.config.ts      # Tailwind + shadcn theme
├── tsconfig.json           # TS with path aliases
├── vite.config.ts          # Vite + Tauri integration
├── eslint.config.js        # ESLint flat config
└── .prettierrc
```

## Key Patterns

### Path Aliases
Use `@/*` imports everywhere:
```typescript
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme";
```

### Tailwind Semantic Colors
Always use semantic tokens from `globals.css`:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`, etc.

**Don't hardcode colors** (e.g., `bg-gray-100`). Use the theme system.

### Zustand Stores
Located in `src/stores/`. Example pattern:
```typescript
import { create } from "zustand";

interface Store {
  value: string;
  setValue: (value: string) => void;
}

export const useStore = create<Store>()((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}));
```

Use persist middleware for localStorage:
```typescript
import { persist } from "zustand/middleware";

export const useStore = create<Store>()(
  persist(
    (set) => ({ ... }),
    { name: "storage-key" }
  )
);
```

### Tauri Commands

**Backend (Rust):**
1. Create in `src-tauri/src/commands/your_command.rs`:
```rust
#[tauri::command]
pub fn your_command(param: &str) -> String {
    format!("Result: {}", param)
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

**Frontend (TypeScript):**
```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke<string>("your_command", { param: "value" });
```

### shadcn/ui Components

**Manual setup** (no CLI auto-install in this boilerplate):
1. Copy component from [shadcn/ui](https://ui.shadcn.com/)
2. Place in `src/components/ui/`
3. Adjust imports to use `@/lib/utils`

Common components to add:
- Button: `npx shadcn@latest add button`
- Input, Card, Dialog, etc.

### React Router

Routes defined in `src/App.tsx`:
```typescript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
```

Pages in `src/pages/`. Navigation in `src/components/nav.tsx`.

## Configuration

### Vite
- Dev server: Port 1420 (strict)
- HMR: Port 1421
- Ignores `src-tauri/` for file watching

### Tauri
- App identifier: `ai.lovstudio.tauri` (customize in `tauri.conf.json`)
- Window: 800x600 default

### TypeScript
- Strict mode enabled
- Path aliases configured
- React 19 JSX runtime

## Best Practices

### Code Style
- Follow ESLint/Prettier configs
- Use functional components (no class components)
- Prefer `const` over `let`
- Use TypeScript strictly (no `any`)

### React
- Use hooks (useState, useEffect, custom hooks)
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use React.memo sparingly (only when needed)

### Tailwind
- Mobile-first responsive design
- Use semantic color tokens
- Prefer Tailwind utilities over custom CSS
- Group utilities logically (layout, spacing, colors)

### State Management
- Use Zustand for global state
- Use React state for local component state
- Persist important data (theme, user preferences)

### Rust/Tauri
- Organize commands by feature/module
- Use Result<T, E> for error handling
- Keep commands focused and testable
- Format with `cargo fmt` before committing

## Common Tasks

### Add a new page
1. Create `src/pages/my-page.tsx`
2. Add route in `src/App.tsx`
3. Add nav link in `src/components/nav.tsx` (optional)

### Add a shadcn component
```bash
npx shadcn@latest add button
# Component appears in src/components/ui/button.tsx
```

### Add a Zustand store
1. Create `src/stores/my-store.ts`
2. Use in components: `const { value, setValue } = useMyStore()`

### Add a Tauri command
1. Create `src-tauri/src/commands/my_command.rs`
2. Export in `commands/mod.rs`
3. Register in `lib.rs`
4. Invoke from frontend with `invoke("my_command")`

## Notes

- This is a **boilerplate/template** project
- Customize `package.json`, `Cargo.toml`, and `tauri.conf.json` for your app
- Frontend has hot reload; backend requires restart on Rust changes
- Theme system uses CSS variables (light/dark mode ready)
- All dependencies are pinned to compatible versions

## Troubleshooting

### Tailwind classes not working
- Check `globals.css` is imported in `main.tsx`
- Verify `tailwind.config.ts` content paths
- Restart dev server

### Tauri command not found
- Check command is exported in `commands/mod.rs`
- Verify registration in `lib.rs`
- Rebuild Rust: `cd src-tauri && cargo build`

### Import path errors
- Ensure `tsconfig.json` has `baseUrl` and `paths` config
- Check `vite.config.ts` has alias resolver
- Restart TypeScript server in IDE
