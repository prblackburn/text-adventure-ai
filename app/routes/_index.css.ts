import { style } from "@vanilla-extract/css";

export const home = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "100vh",
	textAlign: "center",
	padding: "2rem",
	gap: "1.5rem",
});

export const heading = style({
	fontSize: "2.4rem",
	letterSpacing: "0.22em",
	color: "#f5c518",
	textTransform: "uppercase",
});

export const subtitle = style({
	color: "#7a7a40",
	fontSize: "13px",
	letterSpacing: "0.06em",
	maxWidth: "360px",
});

export const cardGrid = style({
	display: "flex",
	gap: "1.5rem",
	flexWrap: "wrap",
	justifyContent: "center",
	width: "100%",
	maxWidth: "960px",
});

export const card = style({
	flex: "1 1 260px",
	maxWidth: "300px",
	background: "transparent",
	border: "1px solid #4a4a20",
	borderRadius: "2px",
	padding: "1.25rem 1.5rem",
	textAlign: "left",
	cursor: "pointer",
	fontFamily: '"Courier New", Courier, monospace',
	transition: "border-color 0.15s, background 0.15s",
	selectors: {
		"&:hover": {
			borderColor: "#f5c518",
			background: "rgba(245, 197, 24, 0.05)",
		},
	},
});

export const cardTitle = style({
	color: "#f5c518",
	fontSize: "13px",
	letterSpacing: "0.18em",
	textTransform: "uppercase",
	marginBottom: "0.5rem",
	display: "block",
});

export const cardSetting = style({
	color: "#7a7a40",
	fontSize: "11px",
	letterSpacing: "0.06em",
	marginBottom: "0.75rem",
	display: "block",
});

export const cardHook = style({
	color: "#c8b84a",
	fontSize: "12px",
	fontStyle: "italic",
	lineHeight: 1.6,
	display: "block",
});
