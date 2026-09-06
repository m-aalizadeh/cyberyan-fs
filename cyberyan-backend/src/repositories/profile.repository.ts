import { FilterQuery } from "mongoose";
import { ProfileModel, ProfileDocument } from "../models/profile.model";

export interface BuiltFilter {
  mongoFilter: FilterQuery<ProfileDocument>;
  /** true when a $text keyword search is part of the filter (affects sort/projection) */
  hasTextSearch: boolean;
}

/**
 * Repository: the only layer that talks to Mongoose/MongoDB directly.
 * Controllers/services never import the model directly — this keeps
 * persistence concerns isolated from business logic, so the database
 * could be swapped later without touching the service layer.
 */
export class ProfileRepository {
  async findMany(
    filter: FilterQuery<ProfileDocument>,
    options: { skip: number; limit: number; hasTextSearch: boolean }
  ): Promise<ProfileDocument[]> {
    const query = ProfileModel.find(
      filter,
      options.hasTextSearch ? { score: { $meta: "textScore" } } : undefined
    );

    if (options.hasTextSearch) {
      query.sort({ score: { $meta: "textScore" } });
    } else {
      query.sort({ fullName: 1 });
    }

    return query.skip(options.skip).limit(options.limit).exec();
  }

  async count(filter: FilterQuery<ProfileDocument>): Promise<number> {
    return ProfileModel.countDocuments(filter).exec();
  }

  async findById(id: string): Promise<ProfileDocument | null> {
    return ProfileModel.findById(id).exec();
  }

  async distinctSkills(): Promise<string[]> {
    return ProfileModel.distinct("skills").exec();
  }

  async distinctJobTitles(): Promise<string[]> {
    return ProfileModel.distinct("jobTitle").exec();
  }

  async distinctIndustries(): Promise<string[]> {
    return ProfileModel.distinct("industry").exec();
  }

  async insertMany(profiles: unknown[]): Promise<number> {
    const result = await ProfileModel.insertMany(profiles);
    return result.length;
  }

  async deleteAll(): Promise<void> {
    await ProfileModel.deleteMany({});
  }
}

export const profileRepository = new ProfileRepository();
