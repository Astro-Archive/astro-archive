# AGENTS.md — Astro Archive

Guidance for AI agents and contributors working in this repository.

## What this project is

**Astro Archive** — a 3D solar-system simulator (React 18 + Vite + Three.js + Tailwind)
that lets cadets pilot a craft, inspect NASA relics in 3D, and read mission telemetry.

## Commands

```bash
npm run dev       # Vite dev server (base = "/")
npm run build     # production build (base = "/astro-archive/")
npm run preview   # serve dist — URLs live under /astro-archive/
```

There are **two entry points**:

| Entry | Purpose |
| --- | --- |
| `index.html` → `src/main.jsx` | The app |
| `kit.html` → `src/kit.jsx` | Showcase of the ported UI kit |

When running `npm run preview`, open `http://localhost:4173/astro-archive/`
and `http://localhost:4173/astro-archive/kit.html`.

## Repo layout

```
src/
  components/           app features (3D, HUD, panels…)
  components/ui/        Sci-fi UI Kit components  ← design system
  components/ui/sci-fi-assets/   SVG masks used by the kit
  data/                 static content (artifacts, solar system, curiosities)
  styles/sci-fi-tokens.css       design tokens (CSS variables)
  utils/                helpers (getAssetPath, procedural textures…)
kit.html / src/kit.jsx  UI kit showcase (not part of the app)
```

## Design system: Sci-fi UI Kit

The UI components come from a Figma community kit
(`PEse2mXAsE9al2kYhm4hzF`, "Sci-fi UI Kit (Free)"). They were ported by hand and
**visually verified against Figma renders**, so their internals are intentionally
specific. Read this before touching them.

### Available components

```jsx
import SciFiButton from './components/ui/SciFiButton';
import SciFiTag from './components/ui/SciFiTag';
import SciFiLoader from './components/ui/SciFiLoader';
import SciFiInput from './components/ui/SciFiInput';
import SciFiSearch from './components/ui/SciFiSearch';
```

| Component | Props |
| --- | --- |
| `SciFiButton` | `variant`: `primary` \| `secondary` \| `single-stroke` \| `transparent`; `size`: `md` (32px) \| `lg` (42px); `showArrow`; `icon`; standard `<button>` props |
| `SciFiTag` | `type`: `primary` \| `neutral` \| `error` \| `warning` \| `information` \| `success`; `size`: `md` \| `lg`; `shape`: `cut-edge` \| `rectangle` \| `rounded`; `stroke`; `onDark`; `showArrow` |
| `SciFiLoader` | `size`: `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `2xl`; `direction`: `top` \| `right` \| `bottom` \| `left`; `label` |
| `SciFiInput` | `label`; `hint`; `error`; `state`: `default` \| `hover` \| `focus` \| `active` \| `error` \| `disable`; `size`: `md` \| `lg`; `required`; `icon`; standard `<input>` props |
| `SciFiSearch` | `value`; `onChange`; `onSearch`; `placeholder`; `buttonLabel`; `icon`; `micIcon` |

### Rules

1. **Do not restyle these components from the outside.** They expose variants on
   purpose. If a variant is missing, add it to the component and its CSS, not
   with `className` overrides at the call site.
2. **Do not "simplify" the internals.** The button frame is built from flex
   pieces + SVG masks so that chamfers/notches stay fixed while the middle
   stretches. The secondary button is *not* an outline of the primary: it is a
   rectangle with two chamfered corners plus a keystone. Replacing this with a
   `clip-path` or a single stretched SVG breaks at other widths.
3. **Colors come from tokens.** Use the palette in `src/styles/sci-fi-tokens.css`
   (`--sf-neutral-400`, …) or the Tailwind classes `sf-*`
   (`bg-sf-primary-600`, `text-sf-h2`, `gap-sf-5`, `font-display`).
   Do not hardcode new hex values.
4. **Fonts:** the kit uses `Nippo` for headings and `Exo 2` for UI text.
   Nippo is not bundled (paid license) — `font-display` falls back to
   Chakra Petch. `Exo 2` is loaded from Google Fonts in `index.html`.
5. **`SciFiInput` / `SciFiSearch` are light-only.** The kit has no `onDark`
   variant for text fields. On dark surfaces, place them on a light panel
   instead of recoloring them ad hoc.
6. **Never delete `kit.html` or `src/kit.jsx`.** They are the visual regression
   reference for the design system. Add a section there when you add a component.

### Verifying UI changes

```bash
npm run build && npm run preview
# open /astro-archive/kit.html and compare against the Figma component
```

If you change a UI-kit component, check the showcase page before and after —
every variant (sizes × states) is rendered there.

## App conventions

- Components are `.jsx`, function components, named exports for utils and
  `export default` for components.
- Asset URLs must go through `getAssetPath()` from `src/utils/assets.js`
  (works with the GitHub Pages sub-path). Vite `?url` imports are also fine.
- Tailwind only — no new CSS frameworks. Component-scoped CSS files are allowed
  next to the component (see `components/ui/*.css`).
- Keep 3D/scene work out of the UI components; they must stay render-cheap.

## Internationalization (EN/ES)

The app is bilingual; **English is the default language**.

- UI copy lives in `src/i18n/messages/<namespace>.js` (`common`, `hud`,
  `badges`, `curiosity`, `observatory`, `surface`). Add the key to **both**
  `en` and `es`; `t()` falls back to English, then to the key itself.
- In components: `const { t, lang } = useI18n()` from `src/i18n`, then
  `t('hud.destination')`. Variables use `{name}` placeholders:
  `t('hud.progress', { scanned: 3, total: 7 })`.
- Content data (missions, planets, curiosities…) keeps each natural-language
  value as `{ en, es }` and exports a getter, e.g.
  `getArtifacts(lang)`; resolve it with `useMemo(() => getArtifacts(lang), [lang])`
  or `localize(value, lang)` from `src/i18n/localize.js`. Numbers, ids, URLs,
  colors and coordinates stay plain strings/numbers.
- Never hardcode visible copy outside the dictionaries, and keep
  `<html lang>` in sync (the provider does it automatically).
- The EN/ES switch lives only in the HUD settings panel (next to the other
  preferences); it persists to `localStorage` under `astro-archive:lang`.

## Before finishing a task

1. `npm run build` passes.
2. No console errors on the page you touched.
3. If you added a UI component: it appears in `kit.html` and uses tokens.
4. Commit messages follow `feat(scope): …` / `fix(scope): …`.
