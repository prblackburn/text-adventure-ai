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
        completionConditions: [
          {
            id: "noir_0_mara_reveals",
            description: "Get Mara Voss to reveal the Blackwater Hotel and the blue envelope",
            possibleMethods: [
              "Ask Mara directly about her husband or what she needs help with",
              "Examine the case file and ask Mara to explain it",
              "Build enough trust by listening that Mara opens up about Emil",
            ],
          },
        ],
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
        completionConditions: [
          {
            id: "noir_1_sal_info",
            description: "Get Sal to give you the Blackwater Hotel layout and Emil Voss's whereabouts",
            possibleMethods: [
              "Pay Sal in cash or with something he values",
              "Threaten Sal with knowledge of his criminal dealings",
              "Trade information you have about Mara or the blue envelope",
            ],
          },
        ],
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
        completionConditions: [
          {
            id: "noir_2_emils_location",
            description: "Discover Emil Voss's location from Viktor Crane or the hotel room",
            possibleMethods: [
              "Search the hotel room while Viktor is distracted or absent",
              "Confront Viktor and find evidence of Emil's location among his belongings",
              "Find and read the matchbook address",
            ],
          },
        ],
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
        completionConditions: [
          {
            id: "noir_3_secure_ledger",
            description: "Obtain the incriminating ledger as evidence",
            possibleMethods: [
              "Pick up or take the ledger from the room",
              "Force Viktor away from it through combat or credible threat",
              "Grab it while Viktor is distracted by Emil or by you",
            ],
          },
          {
            id: "noir_3_neutralize_viktor",
            description: "Neutralize Viktor Crane so you and Emil can escape",
            possibleMethods: [
              "Physically overpower or disarm Viktor",
              "Hold Viktor at gunpoint with the loaded revolver",
              "Stall Viktor until the police arrive — you must explicitly wait or signal them",
            ],
          },
        ],
        combatOutcomes: {
          "Viktor Crane": ["noir_3_neutralize_viktor"],
        },
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
        completionConditions: [],
      },
    },
    endingVariants: {
      // Viktor was shot — hard-boiled, morally complicated victory
      gundown: {
        items: ["badge of the arresting officer", "loaded revolver", "your final invoice"],
        characters: [
          {
            name: "Mara Voss",
            personality: "exhausted, shaken by the violence, quietly grateful",
            knowledgeOf: ["what happened", "Emil is safe", "Viktor was shot"],
            ignorantOf: ["what is in your case file about her"],
          },
        ],
        exits: ["street — the case is closed"],
        constraints: ["The story is resolving — Viktor is down. No new threats can emerge."],
        completionConditions: [],
      },
      // Viktor was handed to the police — cleaner resolution
      arrest: {
        items: ["badge of the arresting officer", "your final invoice"],
        characters: [
          {
            name: "Mara Voss",
            personality: "exhausted, relieved, grateful",
            knowledgeOf: ["what happened", "Emil is safe", "Viktor was arrested"],
            ignorantOf: ["what is in your case file about her"],
          },
        ],
        exits: ["street — the case is closed"],
        constraints: ["The story is resolving — Viktor is in custody. No new threats can emerge."],
        completionConditions: [],
      },
      // Fallback — mirrors scenes[4]
      default: {
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
        completionConditions: [],
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
        completionConditions: [
          {
            id: "dungeon_0_follow_map",
            description: "Use the crude map to navigate north into the dungeon",
            possibleMethods: [
              "Examine or read the map to understand the route ahead",
              "Take the map and head north through the narrow passage",
              "Use the map and torch together to plan a safe path forward",
            ],
          },
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
        completionConditions: [
          {
            id: "dungeon_1_open_iron_door",
            description: "Open the locked iron door to progress west",
            possibleMethods: [
              "Recruit Grix's help to work the stuck portcullis lever together",
              "Find a pry tool in the environment and force the lever alone",
              "Trade with or convince Grix — he may know another method or have a key",
            ],
          },
        ],
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
        completionConditions: [
          {
            id: "dungeon_2_present_key",
            description: "Present the obsidian key to the Warden to gain passage",
            possibleMethods: [
              "Pick up the obsidian key from the altar or where it rests",
              "Hold the obsidian key up and present it directly to the Warden",
              "Place the obsidian key at the Warden's feet as a formal offering",
            ],
          },
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
        completionConditions: [
          {
            id: "dungeon_3_take_relic",
            description: "Claim the silver compass relic",
            possibleMethods: [
              "Pick up or take the relic from its resting place",
              "Secure the relic while the Warden is occupied or disabled",
            ],
          },
          {
            id: "dungeon_3_bypass_warden",
            description: "Get past the Warden with the relic in hand",
            possibleMethods: [
              "Present the obsidian key again — it may also pacify the Warden",
              "Use the collapsed scaffolding to create a distraction or barrier",
              "Fight or disable the Warden using physical force and the environment",
            ],
          },
        ],
      },
      4: {
        items: ["the relic", "Grix's thank-you note (if Grix survived)"],
        characters: [],
        exits: ["rope climb to the surface — the dungeon is behind you"],
        constraints: ["The adventure is complete — no new enemies appear"],
        completionConditions: [],
      },
    },
    endingVariants: {
      // Fought and destroyed the Warden — violent but decisive
      conqueror: {
        items: ["the silver compass relic", "broken stone fragments of the Warden"],
        characters: [],
        exits: ["rope climb to the surface — the dungeon is silent behind you"],
        constraints: ["The adventure is complete — the Warden is destroyed. No new enemies appear."],
        completionConditions: [],
      },
      // Presented the obsidian key — the Warden let you pass with honour
      honored: {
        items: ["the silver compass relic", "obsidian key"],
        characters: [],
        exits: ["rope climb to the surface — the Warden watches you leave in silence"],
        constraints: ["The adventure is complete — the Warden acknowledged your right of passage. No new enemies appear."],
        completionConditions: [],
      },
      // Clever escape (scaffolding, distraction) — fallback
      default: {
        items: ["the relic", "Grix's thank-you note (if Grix survived)"],
        characters: [],
        exits: ["rope climb to the surface — the dungeon is behind you"],
        constraints: ["The adventure is complete — no new enemies appear"],
        completionConditions: [],
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
        completionConditions: [
          {
            id: "scifi_0_get_briefing",
            description: "Get Dr. Osei to fully brief you on the seismic anomaly and the downed array",
            possibleMethods: [
              "Ask Dr. Osei directly about the array or the anomaly",
              "Examine the personal datapad and ask Dr. Osei to explain the readings",
              "Express willingness to investigate and ask Dr. Osei where to start",
            ],
          },
        ],
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
        completionConditions: [
          {
            id: "scifi_1_suit_up",
            description: "Acquire the pressure suit for outside access",
            possibleMethods: [
              "Take or put on the pressure suit",
              "Ask Rover-7 where the suit is stored and retrieve it",
            ],
          },
          {
            id: "scifi_1_fault_code",
            description: "Get the array's last known fault code from Rover-7",
            possibleMethods: [
              "Ask Rover-7 directly about the array fault",
              "Query Rover-7 for its last diagnostic report",
              "Examine the geological scanner alongside Rover-7's data",
            ],
          },
        ],
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
        completionConditions: [
          {
            id: "scifi_2_install_relay",
            description: "Install the replacement relay coil to restart the array",
            possibleMethods: [
              "Take the relay coil and install it in the array access terminal",
              "Use the crowbar to clear the frozen conduit, then install the coil",
              "Follow Rover-7's repair instructions to fit the coil correctly",
            ],
          },
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
        completionConditions: [
          {
            id: "scifi_3_signal_rescue",
            description: "Decode the incoming signal and transmit a response to the rescue ship",
            possibleMethods: [
              "Use the activated array terminal to read and respond to the signal",
              "Ask Dr. Osei to help interpret and transmit the reply",
              "Manually operate the terminal controls to send a confirmation signal",
            ],
          },
        ],
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
        completionConditions: [],
      },
    },
    endingVariants: {
      // Dr. Osei trusts you fully — genuine partnership
      partnership: {
        items: ["confirmed signal receipt", "colony manifest", "Dr. Osei's personal frequency badge"],
        characters: [
          {
            name: "Dr. Osei",
            personality: "grateful, trusting, openly curious about your past",
            knowledgeOf: ["the colony is saved", "you risked everything for people you barely knew", "she wants you to stay"],
            ignorantOf: ["the full truth of your past — but she's ready to hear it"],
          },
        ],
        exits: ["landing pad — the rescue ship is inbound, and Osei walks beside you"],
        constraints: ["The story is resolving — you face the future together. No new threats can emerge."],
        completionConditions: [],
      },
      // Standard rescue — Osei is grateful but still distant
      default: {
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
        completionConditions: [],
      },
    },
  },
];

export function getRules(ruleIndex: number): WorldRules {
  return RULES[ruleIndex] ?? RULES[0];
}
