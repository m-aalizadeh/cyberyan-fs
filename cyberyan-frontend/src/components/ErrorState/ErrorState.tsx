import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <svg viewBox="0 0 20 20" width="18" height="18" className={styles.icon} aria-hidden="true">
        <path
          d="M10 2 L18.5 17 H1.5 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinejoin="round"
        />
        <line x1="10" y1="8" x2="10" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="0.9" fill="currentColor" />
      </svg>
      <div>
        <p className={styles.title}>Search request failed</p>
        <p className={styles.body}>{message}</p>
      </div>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
