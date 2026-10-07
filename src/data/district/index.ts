import type { Business } from "./types";
import { abujaBusinesses } from "./abuja";
import { lagosBusinesses } from "./lagos";

const ALL: Business[] = [...abujaBusinesses, ...lagosBusinesses];

/** Get all businesses for a given state (case-insensitive) */
export function getBusinessesByState(state: string): Business[] {
  const s = (state || "Abuja").toLowerCase();
  // Fallback: if no exact match, show Abuja
  const filtered = ALL.filter((b) => b.state.toLowerCase() === s);
  return filtered.length > 0 ? filtered : abujaBusinesses;
}

export function getBusinessById(id: string): Business | undefined {
  return ALL.find((b) => b.id === id);
}

export function getBusinessesByCategory(state: string, category: string): Business[] {
  return getBusinessesByState(state).filter((b) => b.category === category);
}

export { abujaBusinesses, lagosBusinesses };
