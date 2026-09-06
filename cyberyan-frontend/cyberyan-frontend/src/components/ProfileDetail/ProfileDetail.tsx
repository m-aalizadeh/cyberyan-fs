import { ReactNode, useEffect, useRef } from "react";
import { useProfileDetail } from "../../hooks/useProfileDetail";
import {
  formatConnections,
  formatDateRange,
  formatYearsExperience,
  industryTabColor,
  initials,
  titleCase,
} from "../../utils/formatters";
import styles from "./ProfileDetail.module.css";

interface ProfileDetailProps {
  profileId: string | null;
  onClose: () => void;
}

export function ProfileDetail({ profileId, onClose }: ProfileDetailProps) {
  const { profile, isLoading, error } = useProfileDetail(profileId);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = profileId !== null;

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabColor = industryTabColor(profile?.industry ?? null);

  return (
    <div className={styles.overlay}>
      <button className={styles.backdrop} aria-label="Close profile detail" onClick={onClose} />

      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Profile detail">
        <div className={styles.panelHeader} data-tab={tabColor}>
          <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={onClose}>
            ✕ <span>Close</span>
          </button>

          {profile && (
            <>
              <div className={styles.avatar}>{initials(profile.fullName)}</div>
              <h2 className={styles.name}>{profile.fullName ? titleCase(profile.fullName) : "Unnamed profile"}</h2>
              <p className={styles.role}>
                {profile.jobTitle ? titleCase(profile.jobTitle) : "Role not listed"}
                {profile.jobCompanyName && ` at ${titleCase(profile.jobCompanyName)}`}
              </p>
            </>
          )}
        </div>

        <div className={styles.panelBody}>
          {isLoading && <p className={styles.status}>Loading profile…</p>}
          {error && <p className={styles.statusError}>{error}</p>}

          {profile && !isLoading && (
            <>
              <Section title="Overview">
                <dl className={styles.factGrid}>
                  <Fact label="Location" value={profile.locationName} />
                  <Fact label="Industry" value={profile.industry ? titleCase(profile.industry) : null} />
                  <Fact label="Connections" value={formatConnections(profile.linkedinConnections)} mono />
                  <Fact label="Experience" value={formatYearsExperience(profile.inferredYearsExperience)} mono />
                </dl>
                {profile.summary && <p className={styles.summary}>{profile.summary}</p>}
              </Section>

              {profile.skills.length > 0 && (
                <Section title="Skills">
                  <ul className={styles.tagList}>
                    {profile.skills.map((skill) => (
                      <li key={skill} className={styles.tag}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {profile.experience.length > 0 && (
                <Section title="Experience">
                  <ul className={styles.timeline}>
                    {profile.experience.map((exp, i) => (
                      <li key={i} className={styles.timelineItem}>
                        <p className={styles.timelineTitle}>
                          {exp.title ? titleCase(exp.title) : "Role not listed"}
                          {exp.companyName && ` · ${titleCase(exp.companyName)}`}
                        </p>
                        <p className={styles.timelineDate}>{formatDateRange(exp.startDate, exp.endDate)}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {profile.education.length > 0 && (
                <Section title="Education">
                  <ul className={styles.timeline}>
                    {profile.education.map((edu, i) => (
                      <li key={i} className={styles.timelineItem}>
                        <p className={styles.timelineTitle}>{edu.schoolName ? titleCase(edu.schoolName) : "School not listed"}</p>
                        {(edu.degrees.length > 0 || edu.majors.length > 0) && (
                          <p className={styles.timelineSub}>
                            {[...edu.degrees, ...edu.majors].map(titleCase).join(", ")}
                          </p>
                        )}
                        <p className={styles.timelineDate}>{formatDateRange(edu.startDate, edu.endDate)}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {(profile.certifications.length > 0 || profile.languages.length > 0) && (
                <Section title="Certifications & languages">
                  {profile.certifications.length > 0 && (
                    <ul className={styles.tagList}>
                      {profile.certifications.map((cert) => (
                        <li key={cert} className={styles.tag}>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  )}
                  {profile.languages.length > 0 && (
                    <p className={styles.languages}>{profile.languages.map(titleCase).join(", ")}</p>
                  )}
                </Section>
              )}

              {(profile.linkedinUrl || profile.githubUrl || profile.emails.length > 0) && (
                <Section title="Contact">
                  <ul className={styles.contactList}>
                    {profile.linkedinUrl && (
                      <li>
                        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                          LinkedIn profile
                        </a>
                      </li>
                    )}
                    {profile.githubUrl && (
                      <li>
                        <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                          GitHub profile
                        </a>
                      </li>
                    )}
                    {profile.emails.map((email) => (
                      <li key={email} className={styles.email}>
                        {email}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function Fact({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className={styles.fact}>
      <dt className={styles.factLabel}>{label}</dt>
      <dd className={mono ? `${styles.factValue} ${styles.mono}` : styles.factValue}>{value}</dd>
    </div>
  );
}
