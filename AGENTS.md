<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repo shape

- Single Next.js 16.4.5 App Router app (create-next-app scaffold + shadcn). Not a monorepo, no API/backend code yet.
- All source lives under `src/`: routes in `src/app/` (`layout.tsx`, `page.tsx`), shadcn UI in `src/components/ui/`, helpers in `src/lib/`. There is no root-level `app/` directory despite what the stock README implies.
- Path alias `@/*` → `./src/*` (tsconfig.json).
- npm is the package manager (`package-lock.json`); don't introduce another lockfile.

## Commands

- Dev: `npm run dev`
- Verify before finishing: `npm run lint` (the script is a bare `eslint` — flat config, lints the cwd) then `npx tsc --noEmit`; run `npm run build` for a full check. Both lint and tsc were verified passing on the current tree.
- There is **no test script, no test framework, and no CI workflow**. Don't invent test commands or create test configs unless asked.
- To verify UI work visually (there is no test suite): `npm run build`, then `npm run start -- -p 3100`, then headless Chrome — `"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=<out.png> --window-size=1440,950 http://localhost:3100/`. Always pass a fresh `--user-data-dir` per run: Chrome caches `/_next/image` responses across runs and will show you stale images.
- For mobile widths, `--window-size=375` LIES: headless Chrome clamps layout to innerWidth≈512 and crops the screenshot. Use CDP `Emulation.setDeviceMetricsOverride` instead — a working script (screenshot + overflowing-elements report) lives at `%LOCALAPPDATA%\Temp\opencode\cdp-shot.js` (`node cdp-shot.js <url> <w> <h> <out.png> [cssSelectorToClick]`).
- Responsive layout (verified by CDP emulation at 320/375/768/1024/1440): navbar swaps to the hamburger below `lg` — desktop links + auth buttons overflow the 768px header, so don't move it back to `md`. Breakpoints in use: `sm` 640 (auth buttons show, hero CTAs inline, stats 2-col), `lg` 1024 (desktop nav, 2-col hero, stats 4-col). Page has `overflowing: []` at every width above.
- No `.env` files and no `process.env` usage yet.

## Toolchain quirks

- Turbopack is the default bundler for both `next dev` and `next build` in Next 16.
- Tailwind CSS v4 is wired **only** through the `turbopack.rules` loader in `next.config.ts` (`@tailwindcss/turbopack`). There is no `postcss.config.*` or `tailwind.config.*` — don't add one. Styling is CSS-first: theme tokens live in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`, shadcn CSS variables).
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler` in devDeps). Don't hand-memoize components.
- shadcn style is `base-nova` (`components.json`): generated components use **Base UI** primitives (`@base-ui/react/button`, etc.), not Radix — match those imports in hand-written components. Add components with `npx shadcn add <name>` (local `shadcn` dep; needs network for the registry).
- The `cn` helper comes from the npm `cn` package: `src/lib/utils.ts` re-exports it and generated components import `{ cn } from "cn"` directly. Don't add `clsx`/`tailwind-merge`.
- `next/image` caches optimized derivatives by URL in `.next/cache/images`. After replacing a file at an existing `public/` path, delete `.next/cache/images` and restart the server — otherwise the old image keeps serving.
- Fonts: body **and** headings are Poppins (`--font-sans` and `--font-heading` in `globals.css` both point at `--font-poppins`, loaded in `layout.tsx`). Adding a font weight means editing the `Poppins({ weight: [...] })` list there.

## AGENTS.md maintenance

- Everything between the `<!-- BEGIN/END:nextjs-agent-rules -->` markers is machine-managed and rewritten in place by `next dev` (upsert logic in `node_modules/next/dist/server/lib/generate-agent-files.js`). Put custom guidance outside the markers — content outside is preserved. Keep the whole file committed so the tree stays clean.
