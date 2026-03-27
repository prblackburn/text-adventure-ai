import { getEndingMeta } from '../game/endings';
import * as styles from './EndingBanner.css';

interface Props {
	ruleIndex: number | undefined;
	endingPath: string;
}

export function EndingBanner({ ruleIndex, endingPath }: Props) {
	const { title, tagline } = getEndingMeta(ruleIndex, endingPath);

	return (
		<div className={styles.banner}>
			<p className={styles.eyebrow}>— The End —</p>
			<p className={styles.title}>{title}</p>
			<p className={styles.tagline}>{tagline}</p>
			<a href="/" className={styles.newGameLink}>
				Begin New Adventure
			</a>
		</div>
	);
}
