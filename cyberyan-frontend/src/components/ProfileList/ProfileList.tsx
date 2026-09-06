import { Pagination as PaginationData, Profile } from "../../types/profile.types";
import { EmptyState } from "../EmptyState/EmptyState";
import { ErrorState } from "../ErrorState/ErrorState";
import { Pagination } from "../Pagination/Pagination";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import { SkeletonCard } from "../SkeletonCard/SkeletonCard";
import styles from "./ProfileList.module.css";

interface ProfileListProps {
  results: Profile[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
  hasActiveFilters: boolean;
  onOpenProfile: (id: string) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

const SKELETON_COUNT = 6;

export function ProfileList({
  results,
  isLoading,
  error,
  pagination,
  hasActiveFilters,
  onOpenProfile,
  onPageChange,
  onClearFilters,
  onRetry,
}: ProfileListProps) {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <div className={styles.list} aria-busy="true" aria-label="Loading profiles">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <div>
      <div className={styles.list} role="list" aria-label="Profile search results">
        {results.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} onOpen={onOpenProfile} />
        ))}
      </div>

      {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
}
