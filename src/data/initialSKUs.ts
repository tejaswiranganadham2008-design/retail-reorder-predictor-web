import { SKUItem } from '../types';

export const INITIAL_SKUS: SKUItem[] = [
  {
    id: 'SKU-001',
    name: 'Milk 1L',
    category: 'Dairy',
    currentStock: 18,
    leadTimeDays: 1,
    salesHistory: [20, 24, 22, 26, 28], // Last 3 days: 22, 26, 28 -> Forecast: 25.3 -> Threshold: 25.3 -> Stock 18 < 25.3 -> REORDER TODAY!
  },
  {
    id: 'SKU-002',
    name: 'Rice 5kg',
    category: 'Grains',
    currentStock: 48,
    leadTimeDays: 3,
    salesHistory: [10, 12, 11, 13, 14], // Last 3: 11, 13, 14 -> Avg: 12.7 -> Threshold: 38.0 -> Stock 48 >= 38.0 -> OK
  },
  {
    id: 'SKU-003',
    name: 'Salt 1kg',
    category: 'Pantry',
    currentStock: 80,
    leadTimeDays: 4,
    salesHistory: [5, 6, 6, 7, 6], // Last 3: 6, 7, 6 -> Avg: 6.3 -> Threshold: 25.3 -> Stock 80 -> OK
  },
  {
    id: 'SKU-004',
    name: 'Cooking Oil',
    category: 'Pantry',
    currentStock: 24,
    leadTimeDays: 2,
    salesHistory: [12, 14, 15, 18, 17], // Last 3: 15, 18, 17 -> Avg: 16.7 -> Threshold: 33.3 -> Stock 24 < 33.3 -> REORDER TODAY!
  },
  {
    id: 'SKU-005',
    name: 'Sugar 1kg',
    category: 'Pantry',
    currentStock: 35,
    leadTimeDays: 2,
    salesHistory: [14, 16, 15, 17, 16], // Last 3: 15, 17, 16 -> Avg: 16.0 -> Threshold: 32.0 -> Stock 35 -> OK
  },
  {
    id: 'SKU-006',
    name: 'Bread',
    category: 'Bakery',
    currentStock: 14,
    leadTimeDays: 1,
    salesHistory: [28, 30, 32, 35, 38], // Last 3: 32, 35, 38 -> Avg: 35.0 -> Threshold: 35.0 -> Stock 14 < 35.0 -> REORDER TODAY!
  },
  {
    id: 'SKU-007',
    name: 'Eggs',
    category: 'Dairy',
    currentStock: 38,
    leadTimeDays: 2,
    salesHistory: [24, 26, 28, 30, 32], // Last 3: 28, 30, 32 -> Avg: 30.0 -> Threshold: 60.0 -> Stock 38 < 60.0 -> REORDER TODAY!
  },
  {
    id: 'SKU-008',
    name: 'Wheat Flour',
    category: 'Grains',
    currentStock: 42,
    leadTimeDays: 3,
    salesHistory: [8, 9, 10, 12, 11], // Last 3: 10, 12, 11 -> Avg: 11.0 -> Threshold: 33.0 -> Stock 42 -> OK
  },
  {
    id: 'SKU-009',
    name: 'Tea Powder',
    category: 'Beverages',
    currentStock: 50,
    leadTimeDays: 5,
    salesHistory: [6, 7, 7, 8, 8], // Last 3: 7, 8, 8 -> Avg: 7.7 -> Threshold: 38.3 -> Stock 50 -> OK
  },
  {
    id: 'SKU-010',
    name: 'Biscuits',
    category: 'Snacks',
    currentStock: 65,
    leadTimeDays: 3,
    salesHistory: [18, 19, 20, 22, 21], // Last 3: 20, 22, 21 -> Avg: 21.0 -> Threshold: 63.0 -> Stock 65 -> OK
  },
  {
    id: 'SKU-011',
    name: 'Detergent',
    category: 'Household',
    currentStock: 12,
    leadTimeDays: 4,
    salesHistory: [4, 5, 5, 6, 7], // Last 3: 5, 6, 7 -> Avg: 6.0 -> Threshold: 24.0 -> Stock 12 < 24.0 -> REORDER TODAY!
  },
  {
    id: 'SKU-012',
    name: 'Soap',
    category: 'Personal Care',
    currentStock: 58,
    leadTimeDays: 3,
    salesHistory: [9, 10, 11, 12, 12], // Last 3: 11, 12, 12 -> Avg: 11.7 -> Threshold: 35.0 -> Stock 58 -> OK
  },
];
