import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function EmptyState({ onClearFilters, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <svg viewBox="0 0 40 40" width="36" height="36" className={styles.icon} aria-hidden="true">
        <rect x="6" y="9" width="28" height="24" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="12" y1="17" x2="28" y2="17" stroke="currentColor" strokeWidth="1.6" />
        <line x1="12" y1="23" x2="22" y2="23" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <p className={styles.title}>No profiles match these filters</p>
      <p className={styles.body}>
        Try loosening a filter or clearing the keyword — the dataset has 336 profiles, but this
        combination doesn't match any of them.
      </p>
      {hasActiveFilters && (
        <button type="button" className={styles.action} onClick={onClearFilters}>
          Clear all filters
        </button>
      )}
    </div>
  );
}
