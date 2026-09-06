export interface IEducation {
  schoolName: string | null;
  degrees: string[];
  majors: string[];
  startDate: string | null;
  endDate: string | null;
}

export interface IExperience {
  companyName: string | null;
  companyIndustry: string | null;
  title: string | null;
  titleRole: string | null;
  startDate: string | null;
  endDate: string | null;
  isPrimary: boolean | null;
}

export interface IProfile {
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
  education: IEducation[];
  experience: IExperience[];
}

export interface ProfileSearchQuery {
  keyword?: string;
  skill?: string;
  jobTitle?: string;
  industry?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
