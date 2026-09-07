import { tryParsePythonLiteral } from "./pythonLiteral";
import { IEducation, IExperience, IProfile } from "../types/profile.types";

export type RawCsvRow = Record<string, string>;

function str(row: RawCsvRow, key: string): string | null {
  const value = row[key];
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function num(row: RawCsvRow, key: string): number | null {
  const value = row[key];
  if (value === undefined || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function listField(row: RawCsvRow, key: string): unknown[] {
  const parsed = tryParsePythonLiteral(row[key]);
  return Array.isArray(parsed) ? parsed : [];
}

function stringList(row: RawCsvRow, key: string): string[] {
  return listField(row, key).filter((item): item is string => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapEducation(row: RawCsvRow): IEducation[] {
  return listField(row, "education")
    .filter(isRecord)
    .map((e) => {
      const school = isRecord(e.school) ? e.school : {};
      return {
        schoolName: typeof school.name === "string" ? school.name : null,
        degrees: Array.isArray(e.degrees) ? e.degrees.filter((d): d is string => typeof d === "string") : [],
        majors: Array.isArray(e.majors) ? e.majors.filter((m): m is string => typeof m === "string") : [],
        startDate: typeof e.start_date === "string" ? e.start_date : null,
        endDate: typeof e.end_date === "string" ? e.end_date : null,
      };
    });
}

function mapExperience(row: RawCsvRow): IExperience[] {
  return listField(row, "experience")
    .filter(isRecord)
    .map((ex) => {
      const company = isRecord(ex.company) ? ex.company : {};
      const title = isRecord(ex.title) ? ex.title : {};
      return {
        companyName: typeof company.name === "string" ? company.name : null,
        companyIndustry: typeof company.industry === "string" ? company.industry : null,
        title: typeof title.name === "string" ? title.name : null,
        titleRole: typeof title.role === "string" ? title.role : null,
        startDate: typeof ex.start_date === "string" ? ex.start_date : null,
        endDate: typeof ex.end_date === "string" ? ex.end_date : null,
        isPrimary: typeof ex.is_primary === "boolean" ? ex.is_primary : null,
      };
    });
}

function mapEmails(row: RawCsvRow): string[] {
  return listField(row, "emails")
    .filter(isRecord)
    .map((e) => e.address)
    .filter((address): address is string => typeof address === "string");
}

export function mapCsvRowToProfile(row: RawCsvRow): IProfile {
  return {
    fullName: str(row, "full_name"),
    firstName: str(row, "first_name"),
    lastName: str(row, "last_name"),
    gender: str(row, "gender"),
    linkedinUrl: str(row, "linkedin_url"),
    githubUrl: str(row, "github_url"),
    industry: str(row, "industry"),
    jobTitle: str(row, "job_title"),
    jobTitleRole: str(row, "job_title_role"),
    jobCompanyName: str(row, "job_company_name"),
    jobCompanyIndustry: str(row, "job_company_industry"),
    jobCompanySize: str(row, "job_company_size"),
    locationName: str(row, "location_name"),
    locationRegion: str(row, "location_region"),
    locationCountry: str(row, "location_country"),
    linkedinConnections: num(row, "linkedin_connections"),
    inferredSalary: str(row, "inferred_salary"),
    inferredYearsExperience: num(row, "inferred_years_experience"),
    summary: str(row, "summary"),
    skills: stringList(row, "skills"),
    interests: stringList(row, "interests"),
    certifications: stringList(row, "certifications"),
    languages: stringList(row, "languages"),
    emails: mapEmails(row),
    education: mapEducation(row),
    experience: mapExperience(row),
  };
}
