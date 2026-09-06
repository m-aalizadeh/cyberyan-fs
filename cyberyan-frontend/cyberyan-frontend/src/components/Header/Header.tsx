import styles from "./Header.module.css";

interface HeaderProps {
  totalProfiles: number | null;
}

export function Header({ totalProfiles }: HeaderProps) {
  return (
    <header className={styles.header}>
      <svg
        className={styles.mark}
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="none"
        aria-hidden="true"
      >
        <rect x="4" y="6" width="20" height="22" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M24 6 L28 10 L24 10 Z" fill="currentColor" />
        <path d="M4 6 L24 6 L28 10 L28 28 L4 28 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="8" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div>
        <h1 className={styles.title}>Talent Index</h1>
        <p className={styles.subtitle}>
          {totalProfiles !== null
            ? `Searching ${totalProfiles.toLocaleString()} profiles from the LinkedIn dataset`
            : "Search and filter the LinkedIn profile dataset"}
        </p>
      </div>
    </header>
  );
}
