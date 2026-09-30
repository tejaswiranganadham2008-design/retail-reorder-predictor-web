import { CalculatedSKU, ReorderStatus, SKUItem } from '../types';

/**
 * Calculates the moving-average demand forecast based on the last 3 days of sales history.
 * Example: if sales history is [20, 24, 22, 26, 28], the last 3 days are 22, 26, 28.
 * Forecast = (22 + 26 + 28) / 3 = 76 / 3 = 25.33 (rounded to 1 decimal place = 25.3)
 *
 * @param salesHistory Array of daily sales figures (at least 3 entries expected)
 * @returns Forecasted daily demand rounded to 1 decimal place
 */
export function calculateMovingAverageForecast(salesHistory: number[]): {
  forecast: number;
  last3Days: number[];
  formula: string;
} {
  if (!salesHistory || salesHistory.length === 0) {
    return { forecast: 0, last3Days: [], formula: 'No sales data' };
  }

  // Take the last 3 days (or all if fewer than 3)
  const count = Math.min(3, salesHistory.length);
  const last3Days = salesHistory.slice(-count);
  const sum = last3Days.reduce((acc, val) => acc + val, 0);
  const rawAvg = sum / count;
  const forecast = Math.round(rawAvg * 10) / 10;

  const formula = `(${last3Days.join(' + ')}) / ${count} = ${forecast}`;

  return {
    forecast,
    last3Days,
    formula,
  };
}

/**
 * Calculates the Reorder Point Threshold = Forecast × Lead Time (in days).
 *
 * @param forecast Daily forecasted demand
 * @param leadTimeDays Supplier lead time in days
 * @returns Reorder threshold rounded to 1 decimal place
 */
export function calculateReorderThreshold(forecast: number, leadTimeDays: number): number {
  const rawThreshold = forecast * leadTimeDays;
  return Math.round(rawThreshold * 10) / 10;
}

/**
 * Determines whether an item needs immediate reordering.
 * Flag "REORDER TODAY" when currentStock < reorderThreshold.
 *
 * @param currentStock Current inventory units on hand
 * @param threshold Reorder point threshold
 */
export function determineReorderStatus(currentStock: number, threshold: number): ReorderStatus {
  return currentStock < threshold ? 'REORDER TODAY' : 'OK';
}

/**
 * Enriches a raw SKU item with calculated forecast, threshold, status, and formula.
 */
export function calculateSKUDetails(sku: SKUItem): CalculatedSKU {
  const { forecast, formula } = calculateMovingAverageForecast(sku.salesHistory);
  const threshold = calculateReorderThreshold(forecast, sku.leadTimeDays);
  const status = determineReorderStatus(sku.currentStock, threshold);
  const stockDeficit = Math.round((threshold - sku.currentStock) * 10) / 10;

  return {
    ...sku,
    forecastDemand: forecast,
    reorderThreshold: threshold,
    status,
    stockDeficit: stockDeficit > 0 ? stockDeficit : 0,
    formulaString: formula,
  };
}

/**
 * Processes an array of raw SKUs into calculated SKUs.
 */
export function processAllSKUs(skus: SKUItem[]): CalculatedSKU[] {
  return skus.map(calculateSKUDetails);
}
