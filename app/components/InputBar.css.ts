import { globalStyle, style } from "@vanilla-extract/css";

export const inputBar = style({
	display: "flex",
	alignItems: "center",
	borderTop: "1px solid #1a1a0e",
	padding: "0.75rem 0",
	flexShrink: 0,
	gap: "0.6rem",
	selectors: {
		"&::before": {
			content: "'>'",
			color: "#f5c518",
			flexShrink: 0,
		},
	},
});

globalStyle(`${inputBar} input[type="text"]`, {
	flex: 1,
	background: "transparent",
	border: "none",
	outline: "none",
	color: "#f5c518",
	fontFamily: "inherit",
	fontSize: "inherit",
	caretColor: "#f5c518",
});

globalStyle(`${inputBar} input[type="text"]::placeholder`, {
	color: "#2e2e16",
});

globalStyle(`${inputBar} input[type="text"]:disabled`, {
	opacity: 0.4,
});

globalStyle(`${inputBar} button`, {
	background: "transparent",
	border: "1px solid #2a2a14",
	color: "#5a5a28",
	fontFamily: "inherit",
	fontSize: "10px",
	letterSpacing: "0.12em",
	textTransform: "uppercase",
	padding: "3px 10px",
	cursor: "pointer",
	borderRadius: "2px",
	transition: "color 0.12s, border-color 0.12s",
});

globalStyle(`${inputBar} button:hover:not(:disabled)`, {
	color: "#f5c518",
	borderColor: "#f5c518",
});

globalStyle(`${inputBar} button:disabled`, {
	opacity: 0.2,
	cursor: "not-allowed",
});
