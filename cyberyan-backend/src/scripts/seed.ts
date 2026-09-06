/**
 * Seeds MongoDB directly from the raw dataset file:
 *   data/300_user_linkedin.csv
 *
 * That file IS the reference data — a CSV export where several columns
 * (skills, experience, education, emails, interests, certifications,
 * languages) hold stringified Python literals (e.g. "['react', 'node.js']").
 * We parse the CSV structure with `csv-parse` and those Python-literal
 * cells with our own parser (src/utils/pythonLiteral.ts) — no separate
 * conversion step, no other language involved; it's read as-is at seed time.
 *
 * Run with: npm run seed
 */
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { profileRepository } from "../repositories/profile.repository";
import { mapCsvRowToProfile, RawCsvRow } from "../utils/csvProfileMapper";

const CSV_FILENAME = "300_user_linkedin.csv";

async function seed(): Promise<void> {
  const csvPath = path.join(__dirname, "..", "..", "data", CSV_FILENAME);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Reference dataset not found at ${csvPath}`);
  }

  console.log(`[seed] reading ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const rows: RawCsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log(`[seed] parsed ${rows.length} CSV rows`);

  const profiles = rows.map(mapCsvRowToProfile);

  const withSkills = profiles.filter((p) => p.skills.length > 0).length;
  const withJobTitle = profiles.filter((p) => p.jobTitle).length;
  console.log(`[seed] mapped ${profiles.length} profiles (${withSkills} with skills, ${withJobTitle} with jobTitle)`);

  await connectDatabase();

  console.log("[seed] clearing existing profiles collection...");
  await profileRepository.deleteAll();

  console.log("[seed] inserting profiles...");
  const inserted = await profileRepository.insertMany(profiles);

  console.log(`[seed] done — inserted ${inserted} profiles`);

  await disconnectDatabase();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed] failed:", error);
    process.exit(1);
  });
