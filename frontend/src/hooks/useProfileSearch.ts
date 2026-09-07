import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "../api/client";
import { profileApi } from "../api/profileApi";
import { Pagination, Profile, SearchFilters } from "../types/profile.types";
import { useDebouncedValue } from "./useDebouncedValue";

const EMPTY_FILTERS: SearchFilters = {
  keyword: "",
  skill: "",
  jobTitle: "",
  industry: "",
  location: "",
};

const PAGE_SIZE = 12;
const KEYWORD_DEBOUNCE_MS = 350;

interface UseProfileSearchResult {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  activeFilterCount: number;

  page: number;
  setPage: (page: number) => void;
  pagination: Pagination | null;

  results: Profile[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  retry: () => void;
}

export function useProfileSearch(): UseProfileSearchResult {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Profile[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  const debouncedKeyword = useDebouncedValue(filters.keyword, KEYWORD_DEBOUNCE_MS);

  const requestIdRef = useRef(0);

  const effectiveFilters = useMemo(
    () => ({ ...filters, keyword: debouncedKeyword }),
    [filters, debouncedKeyword]
  );

  function setFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]): void {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function clearFilters(): void {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  const activeFilterCount = Object.values(filters).filter((v) => v.trim() !== "").length;

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    profileApi
      .search({ ...effectiveFilters, page, limit: PAGE_SIZE })
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        setResults(response.data);
        setPagination(response.pagination);
        setHasSearched(true);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof ApiError ? err.message : "Something went wrong while searching.");
        setResults([]);
        setPagination(null);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setIsLoading(false);
      });
  }, [effectiveFilters, page, retryToken]);

  return {
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
    page,
    setPage,
    pagination,
    results,
    isLoading,
    error,
    hasSearched,
    retry: () => setRetryToken((t) => t + 1),
  };
}
