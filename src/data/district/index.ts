import type { Business } from "./types";

// Stub — business data will be provided by the new District package
const ALL: Business[] = [];

/** Get all businesses for a given state (case-insensitive) */
export function getBusinessesByState(_state: string): Business[] {
  return ALL;
}

export function getBusinessById(_id: string): Business | undefined {
  return undefined;
}

export function getBusinessesByCategory(_state: string, _category: string): Business[] {
  return [];
}

export const abujaBusinesses: Business[] = [];
export const lagosBusinesses: Business[] = [];
