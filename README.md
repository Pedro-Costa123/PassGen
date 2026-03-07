# PassGen — Secure Password Generator

An Angular single-page application for generating secure, configurable passwords entirely in the browser.

---

## Features

- **Secure generation** — uses `crypto.getRandomValues()` for cryptographic randomness
- **Configurable rules** — length (4–128), uppercase, lowercase, numbers, special characters, and character exclusions
- **Strength indicator** — real-time scoring based on length and character-set diversity
- **Password history** — the last 10 generated passwords with one-click copy
- **Dark / Light mode** — system preference detection, toggle button, persisted to `localStorage`
- **Fully responsive** — works on desktop, tablet, and mobile

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open your browser at `http://localhost:4200`.

### Build for Production

```bash
npm run build
```

Output is placed in `dist/passgen/`.

---

## Project Structure

```
src/
├── index.html                          # Entry HTML (Google Fonts, meta tags)
├── main.ts                             # Bootstrap entry point
├── styles.scss                         # Global styles & CSS custom properties (themes)
└── app/
    ├── app.config.ts                   # Angular application config
    ├── app.component.ts                # Root component (shell)
    ├── models/
    │   └── password-options.model.ts   # PasswordOptions interface defining user-selected options
    │   └── password-strength.model.ts  # PasswordStrength interface defining strength scoring thresholds and types
    │   └── password-history-entry.model.ts   # PasswordHistoryEntry interface for storing generated passwords
    ├── utils/
    │   └── password-strength.util.ts   # Strength scoring logic
    ├── services/
    │   ├── password.service.ts         # Character pool building & password generation
    │   └── theme.service.ts            # Theme state, localStorage persistence, DOM class toggling
    └── components/
        └── password-generator/
            ├── password-generator.component.ts    # Main component logic (signals, reactive forms)
            ├── password-generator.component.html  # Template (Angular 21 control flow)
            └── password-generator.component.scss  # Component styles (CSS variables)
```

---

## Password Generation Logic

1. Build character pool from selected options (`A-Z`, `a-z`, `0-9`, `!@#$%...`)
2. Remove any characters listed in the "Exclude Characters" field
3. Validate pool is non-empty; show error if not
4. Fill a `Uint32Array` with `crypto.getRandomValues()`
5. Map each value to `pool[value % pool.length]`

---

## Strength Scoring

| Score | Strength |
|---|---|
| 0–1 | Weak |
| 2–3 | Moderate |
| 4–5 | Strong |
| 6+ | Very Strong |

Points are awarded for:
- **Length**: ≥20 → +3, ≥16 → +2, ≥12 → +1
- **Diversity**: each additional character class beyond the first → +1 (max +3)
