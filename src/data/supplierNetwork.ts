import { GraphNode, GraphEdge } from '../types';

export const SUPPLIER_NODES: GraphNode[] = [
  {
    id: 'WH',
    label: 'Central Warehouse (WH)',
    type: 'warehouse',
    x: 100,
    y: 200,
    description: 'Primary Regional Distribution Center holding bulk inventory buffer',
  },
  {
    id: 'S1',
    label: 'Supplier Hub 1 (S1)',
    type: 'supplier',
    x: 320,
    y: 100,
    description: 'Northern Regional Logistics Facility & Wholesale Hub',
  },
  {
    id: 'S2',
    label: 'Supplier Hub 2 (S2)',
    type: 'supplier',
    x: 420,
    y: 300,
    description: 'Express Southern Transit Corridor & Direct Freight Link',
  },
  {
    id: 'S3',
    label: 'Supplier Hub 3 (S3)',
    type: 'supplier',
    x: 560,
    y: 100,
    description: 'Sub-Regional Intermediate Distribution Depot',
  },
  {
    id: 'Store',
    label: 'Supermarket Store',
    type: 'store',
    x: 760,
    y: 200,
    description: 'Retail Supermarket Storefront & Local Customer Fulfillment Point',
  },
];

export const SUPPLIER_EDGES: GraphEdge[] = [
  { from: 'WH', to: 'S1', id: 'WH-S1', leadTimeHours: 12, description: 'Inter-hub bulk truckload corridor' },
  { from: 'WH', to: 'S2', id: 'WH-S2', leadTimeHours: 8, description: 'Direct high-frequency express route' },
  { from: 'S1', to: 'S3', id: 'S1-S3', leadTimeHours: 10, description: 'Secondary regional transfer lane' },
  { from: 'S3', to: 'Store', id: 'S3-Store', leadTimeHours: 6, description: 'Depot to retail store delivery' },
  { from: 'S2', to: 'Store', id: 'S2-Store', leadTimeHours: 7, description: 'Express direct terminal delivery' },
];
