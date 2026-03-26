import { style } from '@vanilla-extract/css';

export const inventoryPanel = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.3rem',
	padding: '0.35rem 0',
	borderBottom: '1px solid #1a1a0e',
	marginBottom: '0.6rem',
	flexShrink: 0,
});

export const toggle = style({
	display: 'flex',
	alignItems: 'center',
	gap: '0.35rem',
	background: 'none',
	border: 'none',
	padding: 0,
	cursor: 'pointer',
	':focus-visible': {
		outline: '1px solid #5a5a28',
		outlineOffset: '2px',
	},
});

export const label = style({
	fontSize: '10px',
	letterSpacing: '0.1em',
	textTransform: 'uppercase',
	color: '#5a5a28',
});

export const caret = style({
	fontSize: '10px',
	color: '#5a5a28',
});

export const itemRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: '0.4rem',
	paddingLeft: '0.1rem',
});

export const chip = style({
	display: 'inline-block',
	background: '#1a1a0e',
	border: '1px solid #2a2a12',
	color: '#a09840',
	borderRadius: '3px',
	padding: '1px 6px',
	fontSize: '10px',
	letterSpacing: '0.05em',
});

export const empty = style({
	fontSize: '10px',
	color: '#3a3a18',
	fontStyle: 'italic',
});
