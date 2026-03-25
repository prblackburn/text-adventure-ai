import { useState, useEffect } from "react";
import type { Beat, WorldRules, WorldSeed } from "../game/types";
import type { Turn } from "../lib/db";

interface Props {
  sessionId: string;
  seed: WorldSeed;
  ruleIndex: number | undefined;
  currentBeat: number;
  beats: Beat[];
  turns: Turn[];
  rules: WorldRules | undefined;
  createdAt: number;
}

const TURNS_PER_BEAT = 3;

const S = {
  toggle: {
    position: "fixed" as const,
    bottom: "1rem",
    right: "1rem",
    zIndex: 9999,
    background: "#1a1a0e",
    color: "#f5c518",
    border: "1px solid #f5c518",
    borderRadius: "4px",
    padding: "4px 10px",
    fontFamily: "monospace",
    fontSize: "11px",
    cursor: "pointer",
    opacity: 0.7,
  },
  overlay: {
    position: "fixed" as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: "320px",
    background: "#0d0d07",
    borderLeft: "1px solid #3a3a1a",
    color: "#c8b84a",
    fontFamily: "monospace",
    fontSize: "11px",
    overflowY: "auto" as const,
    zIndex: 9998,
    padding: "1rem",
    boxSizing: "border-box" as const,
  },
  section: {
    marginBottom: "1.2rem",
  },
  heading: {
    color: "#f5c518",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
    borderBottom: "1px solid #2a2a12",
    paddingBottom: "4px",
  },
  row: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    marginBottom: "3px",
    gap: "8px",
  },
  label: {
    color: "#7a7a40",
    flexShrink: 0,
  },
  value: {
    color: "#d4c455",
    textAlign: "right" as const,
    wordBreak: "break-all" as const,
  },
  beatRow: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "6px",
    marginBottom: "4px",
  },
  beatDot: (active: boolean, current: boolean) => ({
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: current ? "#f5c518" : active ? "#6a6a30" : "#2a2a12",
    flexShrink: 0,
  }),
  bar: (_pct: number) => ({
    flex: 1,
    height: "4px",
    background: "#1a1a0e",
    borderRadius: "2px",
    overflow: "hidden" as const,
  }),
  barFill: (pct: number) => ({
    width: `${pct}%`,
    height: "100%",
    background: "#f5c518",
    borderRadius: "2px",
  }),
  pill: (intent: string) => ({
    display: "inline-block" as const,
    background: intentColor(intent),
    color: "#0d0d07",
    borderRadius: "3px",
    padding: "1px 5px",
    marginRight: "4px",
    marginBottom: "3px",
    fontSize: "10px",
  }),
  chip: {
    display: "inline-block" as const,
    background: "#1a1a0e",
    border: "1px solid #2a2a12",
    color: "#a09840",
    borderRadius: "3px",
    padding: "1px 5px",
    marginRight: "3px",
    marginBottom: "3px",
    fontSize: "10px",
  },
  dimText: {
    color: "#5a5a28",
    fontStyle: "italic" as const,
  },
};

function intentColor(intent: string): string {
  const map: Record<string, string> = {
    explore: "#4a9a4a",
    interact: "#4a6a9a",
    combat: "#9a4a4a",
    dialogue: "#7a5a9a",
    examine: "#4a8a8a",
    use: "#9a7a30",
    other: "#5a5a5a",
  };
  return map[intent] ?? "#5a5a5a";
}

export function DevOverlay({ sessionId, seed, ruleIndex, currentBeat, beats, turns, rules, createdAt }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "d" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") setVisible((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- derived stats ---
  const turnsPerBeat: Record<number, number> = {};
  for (const t of turns) {
    if (t.beat !== null) turnsPerBeat[t.beat] = (turnsPerBeat[t.beat] ?? 0) + 1;
  }
  const turnsAtCurrent = turnsPerBeat[currentBeat] ?? 0;
  const progressPct = Math.min((turnsAtCurrent / TURNS_PER_BEAT) * 100, 100);
  const remaining = Math.max(TURNS_PER_BEAT - turnsAtCurrent, 0);
  const isLastBeat = currentBeat >= beats.length - 1;

  const intentCounts: Record<string, number> = {};
  for (const t of turns) {
    if (t.intent) intentCounts[t.intent] = (intentCounts[t.intent] ?? 0) + 1;
  }

  const scene = rules?.scenes[currentBeat];
  const currentBeatDef = beats[currentBeat];

  // eslint-disable-next-line react-hooks/purity
  const age = Math.round((Date.now() - createdAt) / 1000);
  const ageStr = age < 60 ? `${age}s` : age < 3600 ? `${Math.round(age / 60)}m` : `${Math.round(age / 3600)}h`;

  return (
    <>
      <button style={S.toggle} onClick={() => setVisible((v) => !v)} title="Toggle dev overlay (D)">
        DEV {visible ? "▼" : "▲"}
      </button>

      {visible && (
        <aside style={S.overlay}>
          <div style={{ ...S.heading, fontSize: "12px", marginBottom: "1rem" }}>
            ⚙ Dev Overlay
          </div>

          {/* Session */}
          <div style={S.section}>
            <div style={S.heading}>Session</div>
            <div style={S.row}>
              <span style={S.label}>ID</span>
              <span style={{ ...S.value, fontSize: "9px" }}>{sessionId}</span>
            </div>
            <div style={S.row}>
              <span style={S.label}>Age</span>
              <span style={S.value}>{ageStr}</span>
            </div>
            <div style={S.row}>
              <span style={S.label}>Turns</span>
              <span style={S.value}>{turns.length}</span>
            </div>
          </div>

          {/* World */}
          <div style={S.section}>
            <div style={S.heading}>World Seed</div>
            <div style={S.row}>
              <span style={S.label}>Theme</span>
              <span style={S.value}>{seed.theme}</span>
            </div>
            <div style={S.row}>
              <span style={S.label}>Setting</span>
              <span style={S.value}>{seed.setting}</span>
            </div>
            <div style={S.row}>
              <span style={S.label}>Protagonist</span>
              <span style={S.value}>{seed.protagonist}</span>
            </div>
            {ruleIndex !== undefined && (
              <div style={S.row}>
                <span style={S.label}>Rule set</span>
                <span style={S.value}>{ruleIndex}</span>
              </div>
            )}
            <div style={{ ...S.row, alignItems: "flex-start" }}>
              <span style={{ ...S.label, flexShrink: 0 }}>Hook</span>
              <span style={{ ...S.value, fontSize: "10px" }}>{seed.hook}</span>
            </div>
          </div>

          {/* Beat Progress */}
          <div style={S.section}>
            <div style={S.heading}>Beat Progress</div>
            {beats.map((b) => {
              const count = turnsPerBeat[b.id] ?? 0;
              const isCurrent = b.id === currentBeat;
              const isDone = b.id < currentBeat;
              return (
                <div key={b.id} style={S.beatRow}>
                  <div style={S.beatDot(isDone || isCurrent, isCurrent)} />
                  <span style={{ color: isCurrent ? "#f5c518" : isDone ? "#7a7a40" : "#2a2a20", minWidth: "100px" }}>
                    {b.name}
                  </span>
                  <span style={{ color: "#5a5a28", marginLeft: "auto" }}>{count}/{TURNS_PER_BEAT}</span>
                </div>
              );
            })}
            {!isLastBeat && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ ...S.row, marginBottom: "4px" }}>
                  <span style={S.label}>Next beat in</span>
                  <span style={{ color: remaining === 0 ? "#f5c518" : "#c8b84a" }}>
                    {remaining === 0 ? "advancing…" : `${remaining} turn${remaining !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div style={S.bar(progressPct)}>
                  <div style={S.barFill(progressPct)} />
                </div>
              </div>
            )}
          </div>

          {/* Current Beat */}
          <div style={S.section}>
            <div style={S.heading}>Current Beat — {currentBeatDef?.name}</div>
            <div style={{ ...S.dimText, marginBottom: "6px" }}>{currentBeatDef?.description}</div>
            {scene ? (
              <>
                {scene.items.length > 0 && (
                  <div style={{ marginBottom: "6px" }}>
                    <div style={{ ...S.label, marginBottom: "3px" }}>Items</div>
                    <div>{scene.items.map((i) => <span key={i} style={S.chip}>{i}</span>)}</div>
                  </div>
                )}
                {scene.exits.length > 0 && (
                  <div style={{ marginBottom: "6px" }}>
                    <div style={{ ...S.label, marginBottom: "3px" }}>Exits</div>
                    <div>{scene.exits.map((e) => <span key={e} style={S.chip}>{e}</span>)}</div>
                  </div>
                )}
                {scene.characters.length > 0 && (
                  <div style={{ marginBottom: "6px" }}>
                    <div style={{ ...S.label, marginBottom: "4px" }}>Characters</div>
                    {scene.characters.map((c) => (
                      <div key={c.name} style={{ marginBottom: "6px", paddingLeft: "6px", borderLeft: "2px solid #2a2a12" }}>
                        <div style={{ color: "#f5c518", marginBottom: "2px" }}>{c.name}</div>
                        <div style={S.dimText}>{c.personality}</div>
                        <div style={{ marginTop: "3px" }}>
                          <span style={S.label}>Knows: </span>
                          <span style={{ color: "#7aaa6a", fontSize: "10px" }}>{c.knowledgeOf.join(", ")}</span>
                        </div>
                        <div>
                          <span style={S.label}>Unaware: </span>
                          <span style={{ color: "#9a5a5a", fontSize: "10px" }}>{c.ignorantOf.join(", ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {scene.constraints.length > 0 && (
                  <div>
                    <div style={{ ...S.label, marginBottom: "3px" }}>Constraints</div>
                    {scene.constraints.map((c) => (
                      <div key={c} style={{ ...S.dimText, marginBottom: "2px" }}>— {c}</div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={S.dimText}>No scene rules defined for this beat.</div>
            )}
          </div>

          {/* Intent breakdown */}
          {Object.keys(intentCounts).length > 0 && (
            <div style={S.section}>
              <div style={S.heading}>Intent Breakdown</div>
              <div>
                {Object.entries(intentCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([intent, count]) => (
                    <span key={intent} style={S.pill(intent)}>
                      {intent} ×{count}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Global rules */}
          {rules?.global && rules.global.length > 0 && (
            <div style={S.section}>
              <div style={S.heading}>Global Rules</div>
              {rules.global.map((r) => (
                <div key={r} style={{ ...S.dimText, marginBottom: "2px" }}>— {r}</div>
              ))}
            </div>
          )}
        </aside>
      )}
    </>
  );
}
