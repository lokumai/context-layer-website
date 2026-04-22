import type { Job } from "../types.js";
import { readJSON } from "./_fs.js";

interface JobsFile {
  jobs: Job[];
}

export async function listJobs(): Promise<Job[]> {
  const f = await readJSON<JobsFile>("activity/wikigen-jobs.json");
  return f.jobs;
}
