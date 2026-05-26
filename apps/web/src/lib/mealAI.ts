import type { MealItem, Product } from "@/lib/types";

/**
 * Naive "AI" substitution — for each item, pick a different product that:
 *   1. Shares the dominant macro (protein / carbs / fat),
 *   2. Has similar kcal/100g (±40%),
 *   3. Then rescale grams to keep the same kcal as the original item.
 *
 * Pure function so the same call is deterministic per seed; we still randomise
 * the candidate pick to make repeated clicks feel "alive".
 */
export function suggestSubstitute(items: MealItem[], products: Product[]): MealItem[] {
  return items.map((it) => {
    const original = products.find((p) => p.id === it.productId);
    if (!original) return it;

    const dominant = dominantMacro(original);
    const candidates = products.filter((p) => {
      if (p.id === it.productId) return false;
      if (p.kcal === 0) return false;
      if (Math.abs(p.kcal - original.kcal) > original.kcal * 0.4 + 50) return false;
      return dominantMacro(p) === dominant;
    });

    if (candidates.length === 0) return it;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    const originalKcal = (original.kcal * it.grams) / 100;
    const rawGrams = (originalKcal / pick.kcal) * 100;
    const grams = Math.max(20, Math.round(rawGrams / 5) * 5);

    return { productId: pick.id, grams };
  });
}

type Macro = "protein" | "carbs" | "fat" | "balanced";

function dominantMacro(p: Product): Macro {
  if (p.protein > p.carbs && p.protein > p.fat) return "protein";
  if (p.carbs > p.protein && p.carbs > p.fat) return "carbs";
  if (p.fat > p.protein && p.fat > p.carbs) return "fat";
  return "balanced";
}
