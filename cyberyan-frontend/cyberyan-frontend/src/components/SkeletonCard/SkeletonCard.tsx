import styles from "./SkeletonCard.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.avatar} />
      <div className={styles.lines}>
        <div className={`${styles.line} ${styles.wide}`} />
        <div className={`${styles.line} ${styles.medium}`} />
        <div className={styles.tagsRow}>
          <div className={styles.tag} />
          <div className={styles.tag} />
          <div className={styles.tag} />
        </div>
      </div>
    </div>
  );
}
