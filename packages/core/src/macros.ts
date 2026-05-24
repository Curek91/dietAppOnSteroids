import type { DietPlan, Macros, Meal, Product } from "./types";

const empty: Macros = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

export const macrosForItem = (product: Product, grams: number): Macros => {
  const r = grams / 100;
  return {
    kcal: product.kcal * r,
    protein: product.protein * r,
    fat: product.fat * r,
    carbs: product.carbs * r
  };
};

export const macrosForMeal = (meal: Meal, products: Product[]): Macros =>
  meal.items.reduce<Macros>((acc, it) => {
    const p = products.find((x) => x.id === it.productId);
    if (!p) return acc;
    const m = macrosForItem(p, it.grams);
    return {
      kcal: acc.kcal + m.kcal,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
      carbs: acc.carbs + m.carbs
    };
  }, empty);

export const macrosForPlan = (plan: DietPlan, products: Product[]): Macros =>
  plan.meals.reduce<Macros>((acc, m) => {
    const mm = macrosForMeal(m, products);
    return {
      kcal: acc.kcal + mm.kcal,
      protein: acc.protein + mm.protein,
      fat: acc.fat + mm.fat,
      carbs: acc.carbs + mm.carbs
    };
  }, empty);

export const round = (n: number, digits = 0): number => {
  const p = Math.pow(10, digits);
  return Math.round(n * p) / p;
};
