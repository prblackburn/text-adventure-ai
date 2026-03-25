# Ashveil — AI Text Adventure

An AI-powered text adventure game where player choices shape a dynamic narrative. Built on Cloudflare Workers with React Router 7, powered by the Groq LLM API.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Frontend | React 19 + React Router 7 |
| Styling | Vanilla Extract 1.20 (CSS-in-JS, zero runtime) |
| Database | Cloudflare D1 (SQLite) |
| Cache | Cloudflare KV |
| LLM | Groq `llama-3.3-70b-versatile` |
| Build | Vite 6 + Wrangler 4 |

---

## How It Works

```
Player Input → Intent Classifier → Entity Presence Check
                                          │
                              ┌───────────┴───────────┐
                         Not Found               Found / Generic
                              │                       │
                    "No X here" error          Check KV Cache
                                                      │
                                         ┌────────────┴────────────┐
                                      Cache Hit               Cache Miss
                                         │                         │
                                   Return cached            Call Groq LLM
                                    response         Stream → Extract Conditions
                                                          → Cache → DB
                                                               │
                                                    Check completion conditions
                                                    → Advance beat if all met
```

**Story structure:** 5 story beats — Introduction → Rising Action → Confrontation → Climax → Resolution

Beat progression is condition-based: the LLM appends `[CONDITIONS_MET: [...]]` markers when story conditions are satisfied. The beat advances once all completion conditions for the current scene are met.

**World themes (randomly seeded per session):**
- Noir Detective — 1940s mystery, 5 scenes, 4 characters
- Fantasy Dungeon — underground exploration, 5 scenes, 3+ characters
- Sci-Fi Colony — space settlement, 5 scenes, 3+ characters

**Intent types:** `explore`, `interact`, `combat`, `dialogue`, `examine`, `use`, `other`, `intro`

---

## Project Structure

```
app/
├── components/         # UI components (each paired with a .css.ts file)
│   ├── BeatProgress    # 5-beat story progress bar
│   ├── DevOverlay      # Debug panel (toggle with D key in ?dev mode)
│   ├── GameLog         # Scrollable game transcript
│   └── InputBar        # Player command input form
├── game/               # Core logic (no React)
│   ├── beats.ts        # 5-beat story structure
│   ├── classifier.ts   # Keyword-based intent classification (8 types)
│   ├── promptBuilder.ts# LLM prompt construction
│   ├── types.ts        # Shared TypeScript interfaces
│   ├── worldRules.ts   # Per-theme rules, scenes, characters, constraints
│   └── worldSeed.ts    # Random theme selection on session start
├── hooks/
│   └── useTypewriter.ts# Typewriter animation for AI responses
├── lib/
│   ├── db.ts           # D1 CRUD operations
│   ├── responseCache.ts# KV cache read/write
│   └── stream.ts       # Groq streaming API client (SSE)
├── routes/
│   ├── _index.tsx          # Home page
│   ├── api.action.ts       # POST /api/action — main game loop
│   ├── api.session.ts      # POST /api/session — create session
│   └── play.$sessionId.tsx # Game UI page (SSR)
└── styles/
    └── global.css.ts   # Body reset and global styles
.github/
└── workflows/
    └── ci.yml          # ESLint + TypeScript CI checks
migrations/
├── 0001_initial.sql    # sessions, turns, response_pool tables
└── 0002_conditions.sql # Add completed_conditions to sessions
```

---

## Development

```bash
pnpm install
pnpm dev          # local dev with React Router dev server
pnpm start        # local dev via Wrangler (closer to production)
pnpm build        # production build
pnpm deploy       # deploy to Cloudflare Workers
```

Requires `GROQ_API_KEY` set as a Cloudflare Workers secret.

Append `?dev` to any `/play/{sessionId}` URL to enable the developer overlay. Press `D` to toggle it while the input field is not focused.

---

## What's Done

- [x] Cloudflare Workers + React Router 7 foundation
- [x] Session creation with random world seed
- [x] 3 fully specified world themes (scenes, characters, items, exits, constraints)
- [x] Player intent classifier (8 intents)
- [x] Scene-aware entity validation (no LLM call for impossible actions)
- [x] Groq LLM integration with streaming responses
- [x] Response caching (KV) for generic examine/explore actions
- [x] D1 database: sessions, turn history, response pool
- [x] Beat progress indicator UI
- [x] Game transcript + player input UI
- [x] Intro scene generation — atmospheric opening scene generated on session start
- [x] Completion conditions system — beat advances when LLM-signalled story conditions are met
- [x] Typewriter effect on AI responses (`useTypewriter` hook)
- [x] Developer overlay — `?dev` query param shows session info, world seed, scene details, intent breakdown; toggle with D key
- [x] Retro terminal UI — dark gold-on-black aesthetic, auto-scrolling game log, beat bar with completed/current/future states
- [x] Vanilla Extract CSS-in-JS migration (zero-runtime styling, `.css.ts` files)
- [x] Pre-commit hook — ESLint + TypeScript checks enforced before every commit
- [x] CI/CD — GitHub Actions workflow for lint and type checking

---

## What's Next

- [ ] **Inventory system** — track items picked up/dropped per session
- [ ] **Character relationship state** — track NPC disposition toward player
- [ ] **Branching endings** — multiple resolution paths per theme
- [ ] **Combat resolution** — dice-style outcome logic for combat intents
- [ ] **Session expiry** — TTL or cleanup job for old sessions
- [ ] **Rate limiting** — guard against runaway Groq API spend
- [ ] **Smarter intent classifier** — replace keyword matching with lightweight LLM call or embeddings
- [ ] **World theme expansion** — add more themes beyond the initial 3
- [ ] **Test coverage** — no tests yet; Vitest is the planned runner

---

## Ideas for Next Sessions

- **ElevenLabs audio** — TTS for NPC dialogue lines, plus ambient soundscapes and SFX keyed to theme and scene; investigate storing generated audio in Cloudflare R2 or KV for reuse, avoiding repeat API calls for identical content
- **Inventory & information UI** — dedicated panel(s) for items and collected clues, rather than relying solely on prose responses
- **Minimise LLM usage** — push as much as possible into hardcoded rules, classifiers, and deterministic logic; reserve the LLM for genuinely creative narrative moments to reduce token spend and keep responses fresher

---

## Database Schema

**sessions** — one row per game run (`id`, `world_seed` JSON, `current_beat`, `completed_conditions` JSON array, timestamps)

**turns** — full conversation history (`session_id`, `player_input`, `ai_response`, `intent`, `beat`)

**response_pool** — cached AI responses keyed by `(beat, response_type)`
