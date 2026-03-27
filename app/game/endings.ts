import type { NpcStateMap } from './types';

export interface EndingMeta {
	title: string;
	tagline: string;
}

// ruleIndex → endingPath → metadata
export const ENDING_METADATA: Record<number, Record<string, EndingMeta>> = {
	0: {
		// noir detective
		gundown: { title: 'The Hard Way', tagline: 'Some cases leave a stain.' },
		arrest: { title: 'Justice Served', tagline: 'Viktor Crane will answer for his crimes.' },
		default: { title: 'Case Closed', tagline: 'Another night, another open case.' },
	},
	1: {
		// fantasy dungeon
		conqueror: { title: 'The Stone Broken', tagline: "The dungeon's guardian lies shattered behind you." },
		honored: { title: 'The Honored Path', tagline: 'The Warden recognised the key and stood aside.' },
		default: { title: 'The Relic Claimed', tagline: 'You emerged with the silver compass.' },
	},
	2: {
		// sci-fi colony
		partnership: { title: 'A New Horizon', tagline: 'Osei reaches for the comms panel beside you.' },
		default: { title: 'Signal Received', tagline: 'The rescue ship locks on.' },
	},
};

export function determineEndingPath(ruleIndex: number | undefined, npcState: NpcStateMap, inventory: string[]): string {
	switch (ruleIndex) {
		case 0: // noir detective — revolver in inventory signals weapon-based resolution
			return inventory.some((i) => i.toLowerCase().includes('revolver')) ? 'gundown' : 'arrest';
		case 1: // fantasy dungeon
			// Any combat with the Warden (disposition < 0) → conqueror path
			if ((npcState['The Warden']?.disposition ?? 0) < 0) return 'conqueror';
			// Obsidian key carried through to the end → honored path
			if (inventory.some((i) => i.toLowerCase().includes('obsidian key'))) return 'honored';
			return 'default';
		case 2: // sci-fi colony
			return (npcState['Dr. Osei']?.disposition ?? 0) >= 1 ? 'partnership' : 'default';
		default:
			return 'default';
	}
}

export function getEndingMeta(ruleIndex: number | undefined, endingPath: string): EndingMeta {
	return ENDING_METADATA[ruleIndex ?? -1]?.[endingPath] ?? { title: 'The End', tagline: '' };
}
