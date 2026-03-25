import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const blink = keyframes({
	"0%, 100%": { opacity: 1 },
	"50%": { opacity: 0 },
});

export const gameLog = style({
	flex: 1,
	overflowY: "auto",
	padding: "0.5rem 0 1.25rem",
	scrollbarWidth: "thin",
	scrollbarColor: "#2a2a12 transparent",
	selectors: {
		"&::-webkit-scrollbar": {
			width: "3px",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#2a2a12",
			borderRadius: "2px",
		},
	},
});

export const entry = style({
	marginBottom: "1.5rem",
});

export const playerInput = style({
	marginBottom: "0.4rem",
});

globalStyle(`${playerInput} em`, {
	fontStyle: "normal",
	color: "#f5c518",
});

export const aiResponse = style({
	color: "#a89e56",
	lineHeight: 1.75,
});

export const introResponse = style({
	color: "#c8b96e",
	lineHeight: 1.85,
	fontStyle: "italic",
	marginBottom: "2rem",
	borderLeft: "2px solid #3a3520",
	paddingLeft: "0.75rem",
});

export const cursor = style({
	display: "inline-block",
	color: "#a89e56",
	animation: `${blink} 0.7s step-end infinite`,
});
