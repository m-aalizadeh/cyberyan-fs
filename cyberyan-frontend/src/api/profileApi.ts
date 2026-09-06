import { apiGet } from "./client";
import {
  FilterMetaResponse,
  ProfileResponse,
  SearchFilters,
  SearchResponse,
} from "../types/profile.types";

export interface SearchParams extends Partial<SearchFilters> {
  page?: number;
  limit?: number;
}

export const profileApi = {
  search(params: SearchParams): Promise<SearchResponse> {
    return apiGet<SearchResponse>("/profiles/search", {
      keyword: params.keyword,
      skill: params.skill,
      jobTitle: params.jobTitle,
      industry: params.industry,
      location: params.location,
      page: params.page,
      limit: params.limit,
    });
  },

  getFilterMeta(): Promise<FilterMetaResponse> {
    return apiGet<FilterMetaResponse>("/profiles/filters/meta");
  },

  getById(id: string): Promise<ProfileResponse> {
    return apiGet<ProfileResponse>(`/profiles/${id}`);
  },
};
