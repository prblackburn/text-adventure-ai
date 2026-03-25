import { globalStyle } from "@vanilla-extract/css";

globalStyle("*, *::before, *::after", {
	boxSizing: "border-box",
	margin: 0,
	padding: 0,
});

globalStyle("html, body", {
	height: "100%",
});

globalStyle("body", {
	background: "#0a0a06",
	color: "#c8b84a",
	fontFamily: "'Courier New', Courier, monospace",
	fontSize: "15px",
	lineHeight: 1.65,
});
