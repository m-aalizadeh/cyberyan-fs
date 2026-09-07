import { Schema, model, Document } from "mongoose";
import { IProfile } from "../types/profile.types";

export type ProfileDocument = IProfile & Document;

const EducationSchema = new Schema(
  {
    schoolName: { type: String, default: null },
    degrees: { type: [String], default: [] },
    majors: { type: [String], default: [] },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    companyName: { type: String, default: null },
    companyIndustry: { type: String, default: null },
    title: { type: String, default: null },
    titleRole: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    isPrimary: { type: Boolean, default: null },
  },
  { _id: false }
);

const ProfileSchema = new Schema<ProfileDocument>(
  {
    fullName: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    gender: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    githubUrl: { type: String, default: null },
    industry: { type: String, default: null },
    jobTitle: { type: String, default: null },
    jobTitleRole: { type: String, default: null },
    jobCompanyName: { type: String, default: null },
    jobCompanyIndustry: { type: String, default: null },
    jobCompanySize: { type: String, default: null },
    locationName: { type: String, default: null },
    locationRegion: { type: String, default: null },
    locationCountry: { type: String, default: null },
    linkedinConnections: { type: Number, default: null },
    inferredSalary: { type: String, default: null },
    inferredYearsExperience: { type: Number, default: null },
    summary: { type: String, default: null },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
  },
  { timestamps: true }
);

ProfileSchema.index(
  {
    fullName: "text",
    jobTitle: "text",
    industry: "text",
    jobCompanyName: "text",
    skills: "text",
    interests: "text",
    summary: "text",
  },
  {
    weights: {
      fullName: 10,
      jobTitle: 8,
      skills: 6,
      jobCompanyName: 4,
      industry: 3,
      interests: 2,
      summary: 1,
    },
    name: "ProfileTextIndex",
  }
);

ProfileSchema.index({ skills: 1 });
ProfileSchema.index({ jobTitle: 1 });
ProfileSchema.index({ industry: 1 });
ProfileSchema.index({ locationCountry: 1 });

export const ProfileModel = model<ProfileDocument>("Profile", ProfileSchema);
