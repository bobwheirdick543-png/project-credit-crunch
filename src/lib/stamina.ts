/** Food & Stamina system helpers */

export type FoodEffect = {
  sustenance: number;
  stamina: number;
};

/** Map price tier to sustenance + stamina gains */
export function getFoodEffect(price: number): FoodEffect {
  if (price >= 50000) return { sustenance: 100, stamina: 75 };
  if (price >= 15000) return { sustenance: 60, stamina: 40 };
  if (price >= 5000) return { sustenance: 30, stamina: 20 };
  return { sustenance: 15, stamina: 10 };
}

const SUST_KEY = "sl-sustenance";
const STAM_KEY = "sl-stamina";

export function getSustenance(): number {
  return Number(localStorage.getItem(SUST_KEY) || 50);
}

export function getStamina(): number {
  return Number(localStorage.getItem(STAM_KEY) || 50);
}

export function setSustenance(n: number) {
  localStorage.setItem(SUST_KEY, String(Math.min(100, Math.max(0, n))));
}

export function setStamina(n: number) {
  localStorage.setItem(STAM_KEY, String(Math.min(100, Math.max(0, n))));
}

export function consumeFood(price: number): {
  ok: boolean;
  message: string;
  newSustenance: number;
  newStamina: number;
} {
  const current = getSustenance();
  if (current >= 100) {
    return { ok: false, message: "You are full. Can't eat more.", newSustenance: 100, newStamina: getStamina() };
  }
  const effect = getFoodEffect(price);
  const newSust = Math.min(100, current + effect.sustenance);
  const newStam = Math.min(100, getStamina() + effect.stamina);
  setSustenance(newSust);
  setStamina(newStam);
  return {
    ok: true,
    message: `Sustenance +${effect.sustenance}%, Stamina +${effect.stamina}%`,
    newSustenance: newSust,
    newStamina: newStam,
  };
}
