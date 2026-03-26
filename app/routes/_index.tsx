import type { MetaFunction } from "react-router";
import { SEEDS } from "../game/worldSeed";
import * as styles from "./_index.css";

export const meta: MetaFunction = () => [{ title: "Ashveil — A Text Adventure" }];

export default function Index() {
	return (
		<main className={styles.home}>
			<h1 className={styles.heading}>Ashveil</h1>
			<p className={styles.subtitle}>Choose your adventure.</p>
			<div className={styles.cardGrid}>
				{SEEDS.map((seed, i) => (
					<form key={i} method="post" action="/api/session">
						<input type="hidden" name="seedIndex" value={i} />
						<button type="submit" className={styles.card}>
							<span className={styles.cardTitle}>{seed.theme}</span>
							<span className={styles.cardSetting}>{seed.setting}</span>
							<span className={styles.cardHook}>{seed.hook}</span>
						</button>
					</form>
				))}
			</div>
		</main>
	);
}
