import { useState } from 'react';
import * as styles from './InventoryPanel.css';

interface Props {
	items: string[];
}

export function InventoryPanel({ items }: Props) {
	const [open, setOpen] = useState(true);

	return (
		<div className={styles.inventoryPanel}>
			<button className={styles.toggle} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
				<span className={styles.label}>Inventory</span>
				<span className={styles.caret}>{open ? '▾' : '▸'}</span>
			</button>
			{open && (
				<div className={styles.itemRow}>
					{items.length === 0 ? (
						<span className={styles.empty}>Nothing carried</span>
					) : (
						items.map((item) => (
							<span key={item} className={styles.chip}>
								{item}
							</span>
						))
					)}
				</div>
			)}
		</div>
	);
}
