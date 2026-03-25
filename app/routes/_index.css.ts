import { globalStyle, style } from "@vanilla-extract/css";

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

globalStyle(`${home} h1`, {
	fontSize: "2.4rem",
	letterSpacing: "0.22em",
	color: "#f5c518",
	textTransform: "uppercase",
});

globalStyle(`${home} p`, {
	color: "#7a7a40",
	fontSize: "13px",
	letterSpacing: "0.06em",
	maxWidth: "360px",
});

globalStyle(`${home} button`, {
	background: "transparent",
	border: "1px solid #f5c518",
	color: "#f5c518",
	fontFamily: "inherit",
	fontSize: "12px",
	letterSpacing: "0.18em",
	textTransform: "uppercase",
	padding: "8px 28px",
	cursor: "pointer",
	borderRadius: "2px",
	transition: "background 0.15s, color 0.15s",
});

globalStyle(`${home} button:hover`, {
	background: "#f5c518",
	color: "#0a0a06",
});
