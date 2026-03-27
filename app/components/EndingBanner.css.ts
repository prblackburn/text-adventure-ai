import { style } from '@vanilla-extract/css';

export const banner = style({
	borderTop: '1px solid #f5c518',
	borderBottom: '1px solid #f5c518',
	padding: '1.5rem 1rem',
	margin: '1rem 0',
	textAlign: 'center',
});

export const eyebrow = style({
	fontFamily: '"Courier New", Courier, monospace',
	fontSize: '0.7rem',
	letterSpacing: '0.2em',
	color: '#888',
	textTransform: 'uppercase',
	marginBottom: '0.5rem',
});

export const title = style({
	fontFamily: '"Courier New", Courier, monospace',
	fontSize: '1.3rem',
	color: '#f5c518',
	fontWeight: 'bold',
	marginBottom: '0.4rem',
});

export const tagline = style({
	fontFamily: '"Courier New", Courier, monospace',
	fontSize: '0.85rem',
	color: '#aaa',
	fontStyle: 'italic',
	marginBottom: '1.2rem',
});

export const newGameLink = style({
	display: 'inline-block',
	fontFamily: '"Courier New", Courier, monospace',
	fontSize: '0.8rem',
	color: '#0a0a06',
	backgroundColor: '#f5c518',
	padding: '0.4rem 1rem',
	textDecoration: 'none',
	letterSpacing: '0.05em',
	':hover': {
		backgroundColor: '#ffd740',
	},
});
