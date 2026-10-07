/** Nigerian / UK clothing & shoe sizes */

export const CLOTHING_SIZES = [
  { label: "XS", uk: "UK 6" },
  { label: "S", uk: "UK 8" },
  { label: "M", uk: "UK 10" },
  { label: "L", uk: "UK 12" },
  { label: "XL", uk: "UK 14" },
  { label: "XXL", uk: "UK 16" },
  { label: "3XL", uk: "UK 18" },
] as const;

export const SHOE_SIZES = [
  "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12",
] as const;

/** Detect if a menu item is a shoe */
export function isShoe(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes("air force") ||
    n.includes("jordan") ||
    n.includes("dunk") ||
    n.includes("air max") ||
    n.includes("ultraboost") ||
    n.includes("samba") ||
    n.includes("gazelle") ||
    n.includes("superstar") ||
    n.includes("sneaker") ||
    n.includes("shoe")
  );
}

/** Detect if a menu item is clothing (not shoe) */
export function isClothing(name: string, category: string): boolean {
  if (category !== "boutiques") return false;
  if (isShoe(name)) return false;
  const n = name.toLowerCase();
  return (
    n.includes("shirt") ||
    n.includes("dress") ||
    n.includes("gown") ||
    n.includes("blouse") ||
    n.includes("kaftan") ||
    n.includes("agbada") ||
    n.includes("ankara") ||
    n.includes("tracksuit") ||
    n.includes("shorts") ||
    n.includes("jacket") ||
    n.includes("fleece") ||
    n.includes("boubou") ||
    n.includes("iro")
  );
}
