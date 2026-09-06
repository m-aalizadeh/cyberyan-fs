export interface Education {
  schoolName: string | null;
  degrees: string[];
  majors: string[];
  startDate: string | null;
  endDate: string | null;
}

export interface Experience {
  companyName: string | null;
  companyIndustry: string | null;
  title: string | null;
  titleRole: string | null;
  startDate: string | null;
  endDate: string | null;
  isPrimary: boolean | null;
}

export interface Profile {
  _id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  industry: string | null;
  jobTitle: string | null;
  jobTitleRole: string | null;
  jobCompanyName: string | null;
  jobCompanyIndustry: string | null;
  jobCompanySize: string | null;
  locationName: string | null;
  locationRegion: string | null;
  locationCountry: string | null;
  linkedinConnections: number | null;
  inferredSalary: string | null;
  inferredYearsExperience: number | null;
  summary: string | null;
  skills: string[];
  interests: string[];
  certifications: string[];
  languages: string[];
  emails: string[];
  education: Education[];
  experience: Experience[];
}

export interface SearchFilters {
  keyword: string;
  skill: string;
  jobTitle: string;
  industry: string;
  location: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchResponse {
  success: boolean;
  data: Profile[];
  pagination: Pagination;
}

export interface FilterMeta {
  skills: string[];
  jobTitles: string[];
  industries: string[];
}

export interface FilterMetaResponse {
  success: boolean;
  data: FilterMeta;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}
