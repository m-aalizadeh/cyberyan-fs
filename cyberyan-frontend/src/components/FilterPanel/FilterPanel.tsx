import { ChangeEvent } from "react";
import { FilterMeta, SearchFilters } from "../../types/profile.types";
import { titleCase } from "../../utils/formatters";
import styles from "./FilterPanel.module.css";

interface FilterPanelProps {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  meta: FilterMeta;
}

interface FieldConfig {
  key: "skill" | "jobTitle" | "industry" | "location";
  label: string;
  placeholder: string;
  options?: string[];
}

export function FilterPanel({ filters, setFilter, clearFilters, activeFilterCount, meta }: FilterPanelProps) {
  const fields: FieldConfig[] = [
    { key: "skill", label: "Skill", placeholder: "e.g. React, leadership…", options: meta.skills },
    { key: "jobTitle", label: "Job title", placeholder: "e.g. recruiting manager…", options: meta.jobTitles },
    { key: "industry", label: "Industry", placeholder: "e.g. civil engineering…", options: meta.industries },
    { key: "location", label: "Location", placeholder: "e.g. texas, united states…" },
  ];

  function handleChange(key: FieldConfig["key"]) {
    return (event: ChangeEvent<HTMLInputElement>) => setFilter(key, event.target.value);
  }

  return (
    <aside className={styles.panel} aria-label="Filters">
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Filters</h2>
        {activeFilterCount > 0 && (
          <button type="button" className={styles.clearAll} onClick={clearFilters}>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {fields.map((field) => (
        <div className={styles.field} key={field.key}>
          <label className={styles.label} htmlFor={`filter-${field.key}`}>
            {field.label}
          </label>
          <input
            id={`filter-${field.key}`}
            type="text"
            className={styles.input}
            placeholder={field.placeholder}
            value={filters[field.key]}
            onChange={handleChange(field.key)}
            list={field.options ? `${field.key}-options` : undefined}
            autoComplete="off"
          />
          {field.options && (
            <datalist id={`${field.key}-options`}>
              {field.options.slice(0, 200).map((option) => (
                <option key={option} value={option}>
                  {titleCase(option)}
                </option>
              ))}
            </datalist>
          )}
        </div>
      ))}
      <p className={styles.hint}>Filters combine — a skill and a job title narrow together.</p>
    </aside>
  );
}
