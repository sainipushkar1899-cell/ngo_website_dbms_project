/* ─────────────────────────────────────────────────────────────────────────────
   Projects API — wraps mock data with simulated network delay.
   ───────────────────────────────────────────────────────────────────────────── */

import { projects } from "../mock/projects";
import type { Project } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Returns all projects.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    await delay(100);
    return [...projects];
  } catch (err) {
    throw new Error(
      `getProjects failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Returns a single project by project_id, or null if not found.
 */
export async function getProject(id: number): Promise<Project | null> {
  try {
    await delay(100);
    return projects.find((p) => p.project_id === id) ?? null;
  } catch (err) {
    throw new Error(
      `getProject(${id}) failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Returns all projects matching the given category (case-insensitive).
 */
export async function getProjectsByCategory(
  category: string
): Promise<Project[]> {
  try {
    await delay(100);
    const normalised = category.trim().toLowerCase();
    return projects.filter(
      (p) => p.category.toLowerCase() === normalised
    );
  } catch (err) {
    throw new Error(
      `getProjectsByCategory("${category}") failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
