import { CalculatedSKU } from '../types';

/**
 * Generates and triggers download of a CSV file containing inventory and reorder recommendations.
 */
export function exportSKUsToCSV(
  skus: CalculatedSKU[],
  filename = `supermarket_reorder_list_${new Date().toISOString().slice(0, 10)}.csv`,
  onlyUrgent = false
): void {
  const dataToExport = onlyUrgent ? skus.filter((sku) => sku.status === 'REORDER TODAY') : skus;

  const headers = [
    'SKU ID',
    'Product Name',
    'Category',
    'Current Stock',
    'Lead Time (Days)',
    '3-Day Moving Avg Forecast (Units/Day)',
    'Reorder Threshold (Units)',
    'Stock Deficit',
    'Status',
    'Last 3-Day Sales',
    'Optimal Supplier Route (BFS)',
    'Export Timestamp',
  ];

  const timestamp = new Date().toLocaleString();

  const rows = dataToExport.map((sku) => {
    const last3 = sku.salesHistory.slice(-3).join(';');
    const route = sku.status === 'REORDER TODAY' ? 'WH -> S2 -> Store (2 Hops)' : 'Standard Routine';

    return [
      `"${sku.id}"`,
      `"${sku.name}"`,
      `"${sku.category}"`,
      sku.currentStock,
      sku.leadTimeDays,
      sku.forecastDemand,
      sku.reorderThreshold,
      sku.stockDeficit,
      `"${sku.status}"`,
      `"${last3}"`,
      `"${route}"`,
      `"${timestamp}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
