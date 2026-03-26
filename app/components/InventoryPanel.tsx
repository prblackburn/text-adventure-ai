import * as styles from "./InventoryPanel.css";

interface Props {
	items: string[];
}

export function InventoryPanel({ items }: Props) {
	if (items.length === 0) return null;

	return (
		<div className={styles.inventoryPanel}>
			<span className={styles.label}>Carrying:</span>
			{items.map((item) => (
				<span key={item} className={styles.chip}>
					{item}
				</span>
			))}
		</div>
	);
}
