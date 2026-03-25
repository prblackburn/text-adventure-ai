import type { WorldRules } from "./types";

// Indexed to match SEEDS[] order in worldSeed.ts:
//   0 = noir detective
//   1 = fantasy dungeon
//   2 = sci-fi colony

export const RULES: WorldRules[] = [
  // 0 — Noir detective
  {
    global: [
      "This is 1940s Earth — no magic, no futuristic technology exists",
      "You cannot fly or teleport",
      "You cannot conjure objects that are not present",
    ],
    scenes: {
      0: {
        items: ["desk lamp", "bottle of whiskey", "battered case file", "rotary telephone", "ashtray"],
        characters: [
          {
            name: "Mara Voss",
            personality: "desperate, secretive, barely holding it together",
            knowledgeOf: ["her missing husband Emil", "Blackwater Hotel", "a blue envelope"],
            ignorantOf: ["the underground operation", "who hired her husband", "your past"],
          },
        ],
        exits: ["door to the hallway", "window to the fire escape"],
        constraints: ["The office door is currently unlocked", "It is night and raining heavily outside"],
      },
      1: {
        items: ["crumpled note", "city map", "loaded revolver"],
        characters: [
          {
            name: "Sal",
            personality: "nervous fence, loyal for a price",
            knowledgeOf: ["Blackwater Hotel layout", "Emil Voss's debts"],
            ignorantOf: ["Mara Voss", "the blue envelope contents"],
          },
        ],
        exits: ["back alley exit", "street door"],
        constraints: ["This is a back-room pawn shop, not open to the public"],
      },
      2: {
        items: ["hotel key", "matchbook with address", "broken lock"],
        characters: [
          {
            name: "Viktor Crane",
            personality: "cold, well-dressed, dangerous",
            knowledgeOf: ["the underground operation", "Emil Voss's location"],
            ignorantOf: ["you have the blue envelope", "Sal talked"],
          },
        ],
        exits: ["hotel corridor", "fire exit stairwell"],
        constraints: ["The hotel room door can be forced open", "Viktor is armed"],
      },
      3: {
        items: ["blue envelope", "incriminating ledger", "escape car keys"],
        characters: [
          {
            name: "Viktor Crane",
            personality: "cornered, volatile",
            knowledgeOf: ["everything about the operation"],
            ignorantOf: ["the police are two minutes away"],
          },
          {
            name: "Emil Voss",
            personality: "broken, relieved",
            knowledgeOf: ["who runs the operation", "where the money went"],
            ignorantOf: ["Mara hired a detective"],
          },
        ],
        exits: ["window ledge", "only door (blocked by Viktor)"],
        constraints: ["You cannot leave without confronting Viktor", "The ledger is the key evidence"],
      },
      4: {
        items: ["badge of the arresting officer", "your final invoice"],
        characters: [
          {
            name: "Mara Voss",
            personality: "exhausted, grateful",
            knowledgeOf: ["what happened", "Emil is safe"],
            ignorantOf: ["what is in your case file about her"],
          },
        ],
        exits: ["street — the case is closed"],
        constraints: ["The story is resolving — no new threats can emerge"],
      },
    },
  },

  // 1 — Fantasy dungeon
  {
    global: [
      "Magic exists but requires components, concentration, or a known spell",
      "You cannot pass through solid stone walls",
      "You cannot conjure food, weapons, or light from nothing",
      "Wounds are real and persistent — you do not heal instantly",
    ],
    scenes: {
      0: {
        items: ["torch (lit)", "frayed rope", "crude map scratched on leather"],
        characters: [],
        exits: ["narrow passage north", "collapsed tunnel south (blocked)"],
        constraints: [
          "The entrance has collapsed — there is no way back",
          "The torch will last roughly an hour",
        ],
      },
      1: {
        items: ["rusted portcullis lever", "scattered bones", "iron shield leaning on wall"],
        characters: [
          {
            name: "Grix",
            personality: "suspicious, pragmatic goblin scavenger",
            knowledgeOf: ["the dungeon's upper levels", "where the traps are", "the iron door"],
            ignorantOf: ["what lies below level two", "the relics"],
          },
        ],
        exits: ["passage east", "iron door west (locked)", "back south"],
        constraints: ["The portcullis lever is stuck — it needs two people or a pry tool"],
      },
      2: {
        items: ["cracked altar", "obsidian key", "pools of black water"],
        characters: [
          {
            name: "The Warden",
            personality: "ancient, territorial stone construct — speaks in short commands",
            knowledgeOf: ["the relics' location", "the dungeon's layout"],
            ignorantOf: ["the outside world", "who sent you"],
          },
        ],
        exits: ["descending staircase (guarded)", "side alcove"],
        constraints: [
          "The Warden will not allow passage without the obsidian key being presented",
          "The black water pools are cold but not dangerous",
        ],
      },
      3: {
        items: ["the lost relic (a silver compass that points to truth)", "collapsed scaffolding", "ancient torch bracket"],
        characters: [
          {
            name: "The Warden",
            personality: "hostile — its purpose is being violated",
            knowledgeOf: ["you have entered without permission"],
            ignorantOf: ["you have the obsidian key"],
          },
        ],
        exits: ["only way out is back through the Warden"],
        constraints: ["The relic cannot be destroyed by mundane means", "You must get past the Warden to escape"],
      },
      4: {
        items: ["the relic", "Grix's thank-you note (if Grix survived)"],
        characters: [],
        exits: ["rope climb to the surface — the dungeon is behind you"],
        constraints: ["The adventure is complete — no new enemies appear"],
      },
    },
  },

  // 2 — Sci-fi colony
  {
    global: [
      "This is a low-tech colony — no teleportation, no faster-than-light travel available locally",
      "The communication array is offline — no outside contact is possible",
      "Breathable air exists inside colony structures; the outside atmosphere is thin and cold",
      "You cannot fabricate complex machinery from nothing",
    ],
    scenes: {
      0: {
        items: ["colony-issue flashlight", "personal datapad (offline)", "emergency ration pack"],
        characters: [
          {
            name: "Dr. Osei",
            personality: "calm, methodical, hiding worry",
            knowledgeOf: ["the array went offline three hours ago", "a seismic anomaly north of the colony"],
            ignorantOf: ["what is causing the anomaly", "your hidden past"],
          },
        ],
        exits: ["habitat corridor", "airlock (requires suit)", "comms room"],
        constraints: ["The outer airlock requires a pressure suit to use safely", "Power is at 60% — non-essential systems are dim"],
      },
      1: {
        items: ["pressure suit (one size)", "geological scanner", "crowbar"],
        characters: [
          {
            name: "Rover-7",
            personality: "literal, helpful maintenance drone — speaks in status reports",
            knowledgeOf: ["colony infrastructure", "the array's last known fault code"],
            ignorantOf: ["anything beyond its sensor range", "organic biology"],
          },
        ],
        exits: ["north service tunnel", "back to habitat"],
        constraints: ["The service tunnel is pressurised — no suit needed inside"],
      },
      2: {
        items: ["array access terminal (damaged)", "replacement relay coil", "frozen conduit"],
        characters: [
          {
            name: "Dr. Osei",
            personality: "alarmed — she followed you",
            knowledgeOf: ["the fault is not mechanical — something cut it deliberately"],
            ignorantOf: ["who or what did it"],
          },
        ],
        exits: ["array tower roof hatch", "back south"],
        constraints: [
          "The relay coil must be installed before the array can restart",
          "The roof hatch is exposed to the outside — suit required",
        ],
      },
      3: {
        items: ["activated array terminal", "signal data (the incoming contact is not hostile — it's a rescue ship)"],
        characters: [
          {
            name: "Dr. Osei",
            personality: "stunned, reassessing",
            knowledgeOf: ["what the signal data means", "the colony's survival depends on this"],
            ignorantOf: ["your hidden past connects to the rescue ship"],
          },
        ],
        exits: ["back to colony", "roof observation point"],
        constraints: ["The rescue ship will arrive in 12 hours — you must signal back"],
      },
      4: {
        items: ["confirmed signal receipt", "colony manifest"],
        characters: [
          {
            name: "Dr. Osei",
            personality: "grateful, curious about you",
            knowledgeOf: ["the colony is saved", "you knew more than you let on"],
            ignorantOf: ["the full truth of your past — unless you tell her"],
          },
        ],
        exits: ["landing pad — the rescue ship is inbound"],
        constraints: ["The story is resolving — the external threat has passed"],
      },
    },
  },
];

export function getRules(ruleIndex: number): WorldRules {
  return RULES[ruleIndex] ?? RULES[0];
}
