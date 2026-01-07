// Shop Type Configuration
export const SHOP_TYPES = [
  { value: 'VEGETABLE_SHOP', label: 'Vegetable Shop' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'GENERAL_STORE', label: 'General Store' },
  { value: 'HARDWARE_SHOP', label: 'Hardware Shop' },
  { value: 'FRUIT_SHOP', label: 'Fruit Shop' },
  { value: 'EGGS_CHICKEN_SHOP', label: 'Eggs & Chicken Shop' },
] as const;

export type ShopType = typeof SHOP_TYPES[number]['value'];

export const DEFAULT_SHOP_TYPE: ShopType = 'VEGETABLE_SHOP';

// Helper function to get label from value
export const getShopTypeLabel = (value: string): string => {
  const shopType = SHOP_TYPES.find(type => type.value === value);
  return shopType ? shopType.label : value;
};

// Helper function to get value from label
export const getShopTypeValue = (label: string): string => {
  const shopType = SHOP_TYPES.find(type => type.label === label);
  return shopType ? shopType.value : DEFAULT_SHOP_TYPE;
};

