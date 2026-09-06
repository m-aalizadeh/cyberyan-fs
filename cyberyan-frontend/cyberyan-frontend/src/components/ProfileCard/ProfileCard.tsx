import { Profile } from "../../types/profile.types";
import { formatConnections, formatYearsExperience, industryTabColor, initials, titleCase } from "../../utils/formatters";
import styles from "./ProfileCard.module.css";

interface ProfileCardProps {
  profile: Profile;
  onOpen: (id: string) => void;
}

const VISIBLE_SKILLS = 5;

export function ProfileCard({ profile, onOpen }: ProfileCardProps) {
  const tabColor = industryTabColor(profile.industry);
  const visibleSkills = profile.skills.slice(0, VISIBLE_SKILLS);
  const remainingSkillCount = profile.skills.length - visibleSkills.length;

  const metaParts = [
    profile.locationName,
    formatConnections(profile.linkedinConnections),
    formatYearsExperience(profile.inferredYearsExperience),
  ].filter(Boolean);

  return (
    <button
      type="button"
      className={styles.card}
      data-tab={tabColor}
      onClick={() => onOpen(profile._id)}
      aria-label={`Open profile: ${profile.fullName ?? "Unnamed profile"}`}
    >
      <span className={styles.tab} aria-hidden="true" />

      <div className={styles.avatar} aria-hidden="true">
        {initials(profile.fullName)}
      </div>

      <div className={styles.main}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{profile.fullName ? titleCase(profile.fullName) : "Unnamed profile"}</h3>
          {profile.industry && <span className={styles.industry}>{titleCase(profile.industry)}</span>}
        </div>

        <p className={styles.role}>
          {profile.jobTitle ? titleCase(profile.jobTitle) : "Role not listed"}
          {profile.jobCompanyName && (
            <>
              {" "}
              at <span className={styles.company}>{titleCase(profile.jobCompanyName)}</span>
            </>
          )}
        </p>

        {visibleSkills.length > 0 && (
          <ul className={styles.skills}>
            {visibleSkills.map((skill) => (
              <li key={skill} className={styles.skillTag}>
                {skill}
              </li>
            ))}
            {remainingSkillCount > 0 && <li className={styles.skillMore}>+{remainingSkillCount} more</li>}
          </ul>
        )}

        {metaParts.length > 0 && (
          <p className={styles.metaRow}>
            {metaParts.map((part, i) => (
              <span key={part}>
                {i > 0 && <span className={styles.metaDivider}>·</span>}
                {part}
              </span>
            ))}
          </p>
        )}
      </div>

      <svg className={styles.chevron} viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path d="M7 4 L13 10 L7 16" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
