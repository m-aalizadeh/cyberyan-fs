import { FilterQuery } from "mongoose";
import { profileRepository } from "../repositories/profile.repository";
import { ProfileDocument } from "../models/profile.model";
import { PaginatedResult, ProfileSearchQuery } from "../types/profile.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Escapes user input before it's dropped into a RegExp, so a keyword like
 * "c++" or "(react)" can't throw or be interpreted as regex syntax.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function partialMatch(value: string): RegExp {
  return new RegExp(escapeRegex(value.trim()), "i");
}

/**
 * Service layer: translates an HTTP-shaped query object into a Mongo
 * filter and pagination options, and applies business rules (limit
 * clamping, defaults). Controllers stay thin; repository stays dumb.
 */
export class ProfileService {
  buildFilter(query: ProfileSearchQuery): {
    mongoFilter: FilterQuery<ProfileDocument>;
    hasTextSearch: boolean;
  } {
    const mongoFilter: FilterQuery<ProfileDocument> = {};
    const and: FilterQuery<ProfileDocument>[] = [];
    let hasTextSearch = false;

    if (query.keyword && query.keyword.trim().length > 0) {
      mongoFilter.$text = { $search: query.keyword.trim() };
      hasTextSearch = true;
    }

    // Filter 1: skill — matches if ANY skill in the profile's skills array
    // partially matches the requested skill (case-insensitive).
    if (query.skill && query.skill.trim().length > 0) {
      and.push({ skills: { $elemMatch: { $regex: partialMatch(query.skill) } } });
    }

    // Filter 2: job title — partial, case-insensitive match.
    if (query.jobTitle && query.jobTitle.trim().length > 0) {
      and.push({ jobTitle: { $regex: partialMatch(query.jobTitle) } });
    }

    // Bonus filter: industry.
    if (query.industry && query.industry.trim().length > 0) {
      and.push({ industry: { $regex: partialMatch(query.industry) } });
    }

    // Bonus filter: location (matches city/region/country string).
    if (query.location && query.location.trim().length > 0) {
      and.push({ locationName: { $regex: partialMatch(query.location) } });
    }

    if (and.length > 0) {
      mongoFilter.$and = and;
    }

    return { mongoFilter, hasTextSearch };
  }

  resolvePagination(query: ProfileSearchQuery): { page: number; limit: number; skip: number } {
    let page = Number(query.page) || DEFAULT_PAGE;
    let limit = Number(query.limit) || DEFAULT_LIMIT;

    if (page < 1) page = DEFAULT_PAGE;
    if (limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }

  async search(query: ProfileSearchQuery): Promise<PaginatedResult<ProfileDocument>> {
    const { mongoFilter, hasTextSearch } = this.buildFilter(query);
    const { page, limit, skip } = this.resolvePagination(query);

    const [data, total] = await Promise.all([
      profileRepository.findMany(mongoFilter, { skip, limit, hasTextSearch }),
      profileRepository.count(mongoFilter),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getById(id: string): Promise<ProfileDocument | null> {
    return profileRepository.findById(id);
  }

  async getFilterMeta(): Promise<{ skills: string[]; jobTitles: string[]; industries: string[] }> {
    const [skills, jobTitles, industries] = await Promise.all([
      profileRepository.distinctSkills(),
      profileRepository.distinctJobTitles(),
      profileRepository.distinctIndustries(),
    ]);

    return {
      skills: skills.filter(Boolean).sort(),
      jobTitles: jobTitles.filter(Boolean).sort(),
      industries: industries.filter(Boolean).sort(),
    };
  }
}

export const profileService = new ProfileService();
