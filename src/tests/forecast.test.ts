import { describe, it, expect } from 'vitest';
import {
  calculateMovingAverageForecast,
  calculateReorderThreshold,
  determineReorderStatus,
  calculateSKUDetails,
} from '../lib/forecast';
import { SKUItem } from '../types';

describe('Demand Forecasting & Reorder Logic', () => {
  it('correctly calculates 3-day moving average matching the prompt example: (22+26+28)/3 = 25.3', () => {
    const sales = [20, 24, 22, 26, 28];
    const { forecast, last3Days, formula } = calculateMovingAverageForecast(sales);

    expect(last3Days).toEqual([22, 26, 28]);
    expect(forecast).toBe(25.3);
    expect(formula).toBe('(22 + 26 + 28) / 3 = 25.3');
  });

  it('handles sales history with exactly 3 days', () => {
    const sales = [15, 18, 21];
    const { forecast, last3Days } = calculateMovingAverageForecast(sales);

    expect(last3Days).toEqual([15, 18, 21]);
    expect(forecast).toBe(18.0);
  });

  it('correctly calculates reorder threshold (forecast * leadTimeDays)', () => {
    // 25.3 forecast * 1 day lead time = 25.3
    expect(calculateReorderThreshold(25.3, 1)).toBe(25.3);

    // 16.7 forecast * 2 days lead time = 33.4
    expect(calculateReorderThreshold(16.7, 2)).toBe(33.4);

    // 30.0 forecast * 2 days lead time = 60.0
    expect(calculateReorderThreshold(30.0, 2)).toBe(60.0);
  });

  it('flags "REORDER TODAY" when current stock < threshold', () => {
    // Stock = 18, Threshold = 25.3 -> Stock is less than threshold
    expect(determineReorderStatus(18, 25.3)).toBe('REORDER TODAY');

    // Stock = 12, Threshold = 24.0 -> REORDER TODAY
    expect(determineReorderStatus(12, 24.0)).toBe('REORDER TODAY');
  });

  it('flags "OK" when current stock >= threshold', () => {
    // Stock = 48, Threshold = 38.0
    expect(determineReorderStatus(48, 38.0)).toBe('OK');

    // Stock = 80, Threshold = 25.3
    expect(determineReorderStatus(80, 25.3)).toBe('OK');

    // Exact match: Stock = 35, Threshold = 35.0
    expect(determineReorderStatus(35, 35.0)).toBe('OK');
  });

  it('enriches complete SKU with accurate calculations and formula strings', () => {
    const rawSKU: SKUItem = {
      id: 'SKU-001',
      name: 'Milk 1L',
      category: 'Dairy',
      currentStock: 18,
      leadTimeDays: 1,
      salesHistory: [20, 24, 22, 26, 28],
    };

    const calculated = calculateSKUDetails(rawSKU);
    expect(calculated.forecastDemand).toBe(25.3);
    expect(calculated.reorderThreshold).toBe(25.3);
    expect(calculated.status).toBe('REORDER TODAY');
    expect(calculated.stockDeficit).toBe(7.3);
    expect(calculated.formulaString).toBe('(22 + 26 + 28) / 3 = 25.3');
  });
});
