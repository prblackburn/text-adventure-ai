import { style } from "@vanilla-extract/css";

export const inventoryPanel = style({
	display: "flex",
	alignItems: "center",
	gap: "0.4rem",
	flexWrap: "wrap",
	padding: "0.35rem 0",
	borderBottom: "1px solid #1a1a0e",
	marginBottom: "0.6rem",
	flexShrink: 0,
});

export const label = style({
	fontSize: "10px",
	letterSpacing: "0.1em",
	textTransform: "uppercase",
	color: "#5a5a28",
	flexShrink: 0,
});

export const chip = style({
	display: "inline-block",
	background: "#1a1a0e",
	border: "1px solid #2a2a12",
	color: "#a09840",
	borderRadius: "3px",
	padding: "1px 6px",
	fontSize: "10px",
	letterSpacing: "0.05em",
});
