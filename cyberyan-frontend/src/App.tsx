import { useState } from "react";
import { FilterPanel } from "./components/FilterPanel/FilterPanel";
import { Header } from "./components/Header/Header";
import { ProfileDetail } from "./components/ProfileDetail/ProfileDetail";
import { ProfileList } from "./components/ProfileList/ProfileList";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { useFilterMeta } from "./hooks/useFilterMeta";
import { useProfileSearch } from "./hooks/useProfileSearch";
import styles from "./App.module.css";

export default function App() {
  const search = useProfileSearch();
  const { meta } = useFilterMeta();
  const [openProfileId, setOpenProfileId] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters = search.activeFilterCount > 0;

  return (
    <div className={styles.app}>
      <Header totalProfiles={search.pagination?.total ?? null} />

      <div className={styles.body}>
        <button
          type="button"
          className={styles.mobileFilterToggle}
          onClick={() => setIsMobileFiltersOpen((open) => !open)}
          aria-expanded={isMobileFiltersOpen}
        >
          {isMobileFiltersOpen ? "Hide filters" : "Filters"}
          {hasActiveFilters && (
            <span className={styles.filterBadge}>
              {search.activeFilterCount}
            </span>
          )}
        </button>

        <div
          className={`${styles.sidebar} ${isMobileFiltersOpen ? styles.sidebarOpen : ""}`}
        >
          <FilterPanel
            filters={search.filters}
            setFilter={search.setFilter}
            clearFilters={search.clearFilters}
            activeFilterCount={search.activeFilterCount}
            meta={meta}
          />
        </div>

        <main className={styles.main}>
          <SearchBar
            value={search.filters.keyword}
            onChange={(v) => search.setFilter("keyword", v)}
          />

          <div className={styles.resultsArea} aria-live="polite">
            <ProfileList
              results={search.results}
              isLoading={search.isLoading}
              error={search.error}
              pagination={search.pagination}
              hasActiveFilters={hasActiveFilters}
              onOpenProfile={setOpenProfileId}
              onPageChange={search.setPage}
              onClearFilters={search.clearFilters}
              onRetry={search.retry}
            />
          </div>
        </main>
      </div>

      <ProfileDetail
        profileId={openProfileId}
        onClose={() => setOpenProfileId(null)}
      />
    </div>
  );
}
