import { Pagination as PaginationData } from "../../types/profile.types";
import styles from "./Pagination.module.css";

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const rangeStart = (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <nav className={styles.wrapper} aria-label="Search results pages">
      <p className={styles.range}>
        Showing {rangeStart}–{rangeEnd} of {total}
      </p>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ← Prev
        </button>

        {pageNumbers.map((n, i) =>
          n === "…" ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              className={n === page ? `${styles.pageButton} ${styles.pageButtonActive}` : styles.pageButton}
              onClick={() => onPageChange(n)}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </nav>
  );
}

function buildPageNumbers(current: number, total: number): Array<number | "…"> {
  const delta = 1;
  const pages: Array<number | "…"> = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return pages;
}
