// Common Units Configuration for Catalog Items

export const WEIGHT_UNITS = [
  'Kg',
  'Gram',
  '500g',
  '250g',
  '100g',
  '50g',
  'Quintal',
  'Ton',
] as const;

export const VOLUME_UNITS = [
  'Liter',
  'ML',
  '500ml',
  '250ml',
  '100ml',
] as const;

export const COUNT_UNITS = [
  'Piece',
  'Dozen',
  'Bundle',
  'Pack',
  'Box',
  'Carton',
  'Bag',
  'Plate',
  'Bowl',
  'Cup',
] as const;

export const LENGTH_UNITS = [
  'Meter',
  'CM',
  'Feet',
  'Inch',
] as const;

export const CUSTOM_UNITS = [
  'Nag',
  'Unit',
  'Serving',
  'Portion',
  'Half',
  'Full',
  'Small',
  'Medium',
  'Large',
  'Bunch',
  'Pair',
] as const;

// All units combined
export const ALL_UNITS = [
  // Weight
  ...WEIGHT_UNITS,
  // Volume
  ...VOLUME_UNITS,
  // Count
  ...COUNT_UNITS,
  // Length
  ...LENGTH_UNITS,
  // Custom
  ...CUSTOM_UNITS,
] as const;

// Categorized units for easy access
export const UNITS_BY_CATEGORY = {
  'Weight': WEIGHT_UNITS,
  'Volume': VOLUME_UNITS,
  'Count/Quantity': COUNT_UNITS,
  'Length': LENGTH_UNITS,
  'Custom': CUSTOM_UNITS,
} as const;

// Type for all possible units
export type CatalogUnit = typeof ALL_UNITS[number];

// Default unit
export const DEFAULT_UNIT = 'Piece';

// Helper function to check if unit exists
export const isValidUnit = (unit: string): boolean => {
  return ALL_UNITS.includes(unit as any);
};

// Helper function to search units (text-based search)
export const searchUnits = (query: string): readonly string[] => {
  if (!query || query.trim() === '') {
    return ALL_UNITS;
  }

  const lowerQuery = query.toLowerCase();
  return ALL_UNITS.filter(unit =>
    unit.toLowerCase().includes(lowerQuery)
  );
};

// Helper function to get units by category
export const getUnitsByCategory = (category: keyof typeof UNITS_BY_CATEGORY): readonly string[] => {
  return UNITS_BY_CATEGORY[category] || [];
};

