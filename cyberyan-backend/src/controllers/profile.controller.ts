import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { profileService } from "../services/profile.service";
import { ApiError } from "../utils/ApiError";
import { ProfileSearchQuery } from "../types/profile.types";

function parseSearchQuery(req: Request): ProfileSearchQuery {
  const { keyword, skill, jobTitle, industry, location, page, limit } = req.query;

  return {
    keyword: typeof keyword === "string" ? keyword : undefined,
    skill: typeof skill === "string" ? skill : undefined,
    jobTitle: typeof jobTitle === "string" ? jobTitle : undefined,
    industry: typeof industry === "string" ? industry : undefined,
    location: typeof location === "string" ? location : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  };
}

export const profileController = {

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = parseSearchQuery(req);
      const result = await profileService.search(query);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  async filterMeta(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = await profileService.getFilterMeta();
      res.status(200).json({ success: true, data: meta });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, `Invalid profile id: ${id}`);
      }

      const profile = await profileService.getById(id);

      if (!profile) {
        throw new ApiError(404, `Profile not found: ${id}`);
      }

      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },
};
