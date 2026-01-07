// Category Configuration for Each Shop Type

export const VEGETABLE_SHOP_CATEGORIES = [
  'Leafy Vegetables',
  'Root Vegetables',
  'Cruciferous Vegetables',
  'Gourds & Squashes',
  'Pods & Beans',
  'Onions & Bulbs',
  'Tomatoes & Nightshades',
  'Fresh Herbs',
  'Exotic Vegetables',
  'Seasonal Vegetables',
  'Organic Vegetables',
  'Sprouts',
  'Mushrooms',
  'Other',
] as const;

export const RESTAURANT_CATEGORIES = [
  'Appetizers',
  'Soups & Salads',
  'Main Course - Veg',
  'Main Course - Non-Veg',
  'Biryanis & Rice',
  'Breads',
  'Chinese',
  'South Indian',
  'North Indian',
  'Continental',
  'Fast Food',
  'Desserts',
  'Beverages',
  'Ice Cream',
  'Other',
] as const;

export const GENERAL_STORE_CATEGORIES = [
  'Groceries',
  'Dairy Products',
  'Bakery Items',
  'Snacks & Namkeen',
  'Beverages',
  'Personal Care',
  'Household Items',
  'Stationery',
  'Baby Products',
  'Health & Wellness',
  'Frozen Foods',
  'Packaged Foods',
  'Cleaning Supplies',
  'Pet Supplies',
  'Other',
] as const;

export const HARDWARE_SHOP_CATEGORIES = [
  'Hand Tools',
  'Power Tools',
  'Electrical Items',
  'Plumbing Materials',
  'Paints & Colors',
  'Building Materials',
  'Nails & Screws',
  'Locks & Hardware',
  'Garden Tools',
  'Safety Equipment',
  'Measuring Tools',
  'Adhesives & Sealants',
  'Lighting Fixtures',
  'Pipes & Fittings',
  'Other',
] as const;

export const FRUIT_SHOP_CATEGORIES = [
  'Citrus Fruits',
  'Tropical Fruits',
  'Berries',
  'Stone Fruits',
  'Melons',
  'Apples & Pears',
  'Grapes',
  'Bananas',
  'Seasonal Fruits',
  'Exotic Fruits',
  'Organic Fruits',
  'Dry Fruits',
  'Nuts',
  'Dried Fruits',
  'Other',
] as const;

export const EGGS_CHICKEN_SHOP_CATEGORIES = [
  'Eggs - White',
  'Eggs - Brown',
  'Eggs - Organic',
  'Chicken - Whole',
  'Chicken - Breast',
  'Chicken - Legs',
  'Chicken - Wings',
  'Chicken - Boneless',
  'Chicken - Curry Cut',
  'Mutton',
  'Fish',
  'Seafood',
  'Marinated Items',
  'Ready to Cook',
  'Other',
] as const;

// Map shop types to their categories
export const SHOP_CATEGORIES_MAP = {
  VEGETABLE_SHOP: VEGETABLE_SHOP_CATEGORIES,
  RESTAURANT: RESTAURANT_CATEGORIES,
  GENERAL_STORE: GENERAL_STORE_CATEGORIES,
  HARDWARE_SHOP: HARDWARE_SHOP_CATEGORIES,
  FRUIT_SHOP: FRUIT_SHOP_CATEGORIES,
  EGGS_CHICKEN_SHOP: EGGS_CHICKEN_SHOP_CATEGORIES,
} as const;

// Type for all possible categories
export type VegetableCategory = typeof VEGETABLE_SHOP_CATEGORIES[number];
export type RestaurantCategory = typeof RESTAURANT_CATEGORIES[number];
export type GeneralStoreCategory = typeof GENERAL_STORE_CATEGORIES[number];
export type HardwareCategory = typeof HARDWARE_SHOP_CATEGORIES[number];
export type FruitCategory = typeof FRUIT_SHOP_CATEGORIES[number];
export type EggsChickenCategory = typeof EGGS_CHICKEN_SHOP_CATEGORIES[number];

export type ShopCategory =
  | VegetableCategory
  | RestaurantCategory
  | GeneralStoreCategory
  | HardwareCategory
  | FruitCategory
  | EggsChickenCategory;

// Helper function to get categories for a shop type
export const getCategoriesForShopType = (shopType: string): readonly string[] => {
  const categories = SHOP_CATEGORIES_MAP[shopType as keyof typeof SHOP_CATEGORIES_MAP];
  return categories || VEGETABLE_SHOP_CATEGORIES;
};

// Helper function to check if a category exists for a shop type
export const isCategoryValidForShopType = (shopType: string, category: string): boolean => {
  const categories = getCategoriesForShopType(shopType);
  return categories.includes(category as any);
};

// Default category
export const DEFAULT_CATEGORY = 'Other';

