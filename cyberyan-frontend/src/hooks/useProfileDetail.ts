import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { profileApi } from "../api/profileApi";
import { Profile } from "../types/profile.types";

interface UseProfileDetailResult {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

/** Fetches full profile detail by id whenever `id` changes; clears state when `id` is null. */
export function useProfileDetail(id: string | null): UseProfileDetailResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProfile(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    profileApi
      .getById(id)
      .then((response) => {
        if (!cancelled) setProfile(response.data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load this profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { profile, isLoading, error };
}
