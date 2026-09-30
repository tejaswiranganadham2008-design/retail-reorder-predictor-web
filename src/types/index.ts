export type ItemCategory = 
  | 'Dairy'
  | 'Grains'
  | 'Pantry'
  | 'Bakery'
  | 'Beverages'
  | 'Snacks'
  | 'Household'
  | 'Personal Care';

export type ReorderStatus = 'REORDER TODAY' | 'OK';

export interface SKUItem {
  id: string;
  name: string;
  category: ItemCategory;
  currentStock: number;
  leadTimeDays: number;
  salesHistory: number[]; // e.g., 5 days of past sales [day1, day2, day3, day4, day5]
  customAdded?: boolean;
}

export interface CalculatedSKU extends SKUItem {
  forecastDemand: number;   // Moving-average of last 3 days
  reorderThreshold: number; // forecastDemand * leadTimeDays
  status: ReorderStatus;
  stockDeficit: number;     // threshold - currentStock (positive if reorder needed)
  formulaString: string;    // e.g., "(22 + 26 + 28) / 3 = 25.3"
}

export type RotationType = 'NONE' | 'LL' | 'RR' | 'LR' | 'RL';

export interface AVLNodeData {
  id: string;
  name: string;
  stock: number;
  sku: CalculatedSKU;
  height: number;
  balanceFactor: number;
  x?: number;
  y?: number;
  left: AVLNodeData | null;
  right: AVLNodeData | null;
}

export interface RotationEvent {
  type: RotationType;
  nodeName: string;
  nodeStock: number;
  reason: string;
  timestamp: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'warehouse' | 'supplier' | 'store';
  x: number;
  y: number;
  description: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  id: string;
  leadTimeHours?: number;
  description?: string;
}

export interface PathResult {
  algorithm: 'BFS' | 'DFS';
  path: string[];          // List of node IDs e.g. ['WH', 'S2', 'Store']
  hopCount: number;        // Number of edges in the path
  traversalOrder: string[]; // Order nodes were discovered/visited
  found: boolean;
  explanation: string;
}

export interface PipelineStep {
  step: number;
  component: 'Java POS' | 'sales.csv' | 'Python ML' | 'forecast.csv' | 'Java Inventory Engine';
  action: string;
  input: string;
  output: string;
  status: 'pending' | 'running' | 'completed';
  payload?: any;
}
