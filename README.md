# Ashveil — AI Text Adventure

An AI-powered text adventure game where player choices shape a dynamic narrative. Built on Cloudflare Workers with React Router 7, powered by the Groq LLM API.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Frontend | React 19 + React Router 7 |
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
                                    response             Stream → Cache → DB
```

**Story structure:** 5 story beats — Introduction → Rising Action → Confrontation → Climax → Resolution

**World themes (randomly seeded per session):**
- Noir Detective — 1940s mystery, 5 scenes, 4 characters
- Fantasy Dungeon — underground exploration, 5 scenes, 3+ characters
- Sci-Fi Colony — space settlement, 5 scenes, 3+ characters

**Intent types:** `explore`, `interact`, `combat`, `dialogue`, `examine`, `use`, `other`

---

## Project Structure

```
app/
├── components/         # UI: BeatProgress, DevOverlay, GameLog, InputBar
├── game/               # Core logic
│   ├── beats.ts        # 5-beat story structure
│   ├── classifier.ts   # Intent classification
│   ├── promptBuilder.ts# LLM prompt construction
│   ├── types.ts        # Shared TypeScript interfaces
│   ├── worldRules.ts   # Per-theme rules, scenes, characters, constraints
│   └── worldSeed.ts    # Random theme selection on session start
├── lib/
│   ├── db.ts           # D1 CRUD operations
│   ├── responseCache.ts# KV cache read/write
│   └── stream.ts       # Groq streaming API client
└── routes/
    ├── _index.tsx          # Home page
    ├── api.action.ts       # POST /api/action — main game loop
    ├── api.session.ts      # POST /api/session — create session
    └── play.$sessionId.tsx # Game UI page
game.css                    # Retro terminal theme (gold on near-black, monospace)
migrations/
└── 0001_initial.sql    # sessions, turns, response_pool tables
```

---

## Development

```bash
pnpm install
pnpm dev          # local dev with Wrangler
pnpm build        # production build
pnpm deploy       # deploy to Cloudflare Workers
```

Requires `GROQ_API_KEY` set as a Cloudflare Workers secret.

---

## What's Done

- [x] Cloudflare Workers + React Router 7 foundation
- [x] Session creation with random world seed
- [x] 3 fully specified world themes (scenes, characters, items, exits, constraints)
- [x] Player intent classifier (7 intents)
- [x] Scene-aware entity validation (no LLM call for impossible actions)
- [x] Groq LLM integration with streaming responses
- [x] Response caching (KV) for generic examine/explore actions
- [x] D1 database: sessions, turn history, response pool
- [x] Beat progress indicator UI
- [x] Game transcript + player input UI
- [x] Beat progression — advances every 3 substantive turns, capped at Resolution
- [x] Developer overlay — `?dev` query param shows session info, world seed, scene details, intent breakdown; toggle with D key
- [x] Retro terminal UI — dark gold-on-black aesthetic, auto-scrolling game log, beat bar with completed/current/future states

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

---

## Database Schema

**sessions** — one row per game run (`id`, `world_seed` JSON, `current_beat`, timestamps)

**turns** — full conversation history (`session_id`, `player_input`, `ai_response`, `intent`, `beat`)

**response_pool** — cached AI responses keyed by `(beat, response_type)`
