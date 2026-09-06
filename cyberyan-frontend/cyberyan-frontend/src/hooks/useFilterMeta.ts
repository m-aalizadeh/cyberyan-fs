import { useEffect, useState } from "react";
import { profileApi } from "../api/profileApi";
import { FilterMeta } from "../types/profile.types";

const EMPTY_META: FilterMeta = { skills: [], jobTitles: [], industries: [] };

/** Loads the distinct skills/jobTitles/industries used to power filter suggestions. */
export function useFilterMeta(): { meta: FilterMeta; isLoading: boolean } {
  const [meta, setMeta] = useState<FilterMeta>(EMPTY_META);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    profileApi
      .getFilterMeta()
      .then((response) => {
        if (!cancelled) setMeta(response.data);
      })
      .catch(() => {
        // Non-critical: filter suggestions just won't populate. The user can
        // still type free text into skill/job title/industry filters.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { meta, isLoading };
}
