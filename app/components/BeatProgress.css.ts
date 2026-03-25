import { globalStyle, style } from "@vanilla-extract/css";

export const beatProgress = style({
	display: "flex",
	alignItems: "center",
	padding: "0.55rem 0",
	borderBottom: "1px solid #1a1a0e",
	marginBottom: "1rem",
	flexShrink: 0,
});

globalStyle(`${beatProgress} span`, {
	fontSize: "10px",
	letterSpacing: "0.1em",
	textTransform: "uppercase",
});

globalStyle(`${beatProgress} span + span::before`, {
	content: "'  ·  '",
	color: "#1e1e0e",
});

export const inactive = style({ color: "#2a2a14" });
export const active = style({ color: "#5a5a28" });
export const current = style({ color: "#f5c518" });
