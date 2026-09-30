import { CalculatedSKU } from '../types';

export interface PipelineExecutionLog {
  id: string;
  stage: 'JAVA_EXPORT' | 'SALES_CSV' | 'PYTHON_ML' | 'FORECAST_CSV' | 'JAVA_ADSA_ENGINE';
  title: string;
  techBadge: string;
  codeSnippet: string;
  outputSummary: string;
  timestamp: string;
  status: 'pending' | 'running' | 'success';
}

export function generatePipelineSteps(skus: CalculatedSKU[]): PipelineExecutionLog[] {
  const urgentCount = skus.filter((s) => s.status === 'REORDER TODAY').length;
  const lowestStock = skus.reduce((min, s) => (s.currentStock < min.currentStock ? s : min), skus[0]);

  return [
    {
      id: 'step-1',
      stage: 'JAVA_EXPORT',
      title: 'Stage 1: Java POS Transaction Aggregator',
      techBadge: 'OOPJ (Java 21)',
      codeSnippet: `// SupermarketPOSSystem.java
public class SupermarketPOSSystem {
    public void exportDailySales(List<SKUItem> inventory) throws IOException {
        try (BufferedWriter writer = Files.newBufferedWriter(Paths.get("data/sales.csv"))) {
            writer.write("sku_id,name,category,current_stock,lead_time_days,d1,d2,d3,d4,d5\\n");
            for (SKUItem sku : inventory) {
                writer.write(sku.toCSVRow() + "\\n");
            }
        }
    }
}`,
      outputSummary: `Aggregated 5 days of checkout receipts across ${skus.length} SKUs. Written to sales.csv.`,
      timestamp: '00:00:01',
      status: 'pending',
    },
    {
      id: 'step-2',
      stage: 'SALES_CSV',
      title: 'Stage 2: Intermediate Data Interchange (sales.csv)',
      techBadge: 'CSV File Stream',
      codeSnippet: `sku_id,name,category,current_stock,lead_time,d1,d2,d3,d4,d5
SKU-001,Milk 1L,Dairy,18,1,20,24,22,26,28
SKU-002,Rice 5kg,Grains,48,3,10,12,11,13,14
SKU-004,Cooking Oil,Pantry,24,2,12,14,15,18,17
SKU-006,Bread,Bakery,14,1,28,30,32,35,38
... (${skus.length} items logged)`,
      outputSummary: `Validated schema: ${skus.length} rows, 10 columns, no missing values.`,
      timestamp: '00:00:02',
      status: 'pending',
    },
    {
      id: 'step-3',
      stage: 'PYTHON_ML',
      title: 'Stage 3: Python Demand Forecasting & Threshold Engine',
      techBadge: 'Python 3.11 / AI & Data Science',
      codeSnippet: `# forecast_engine.py
import pandas as pd
import numpy as np

def calculate_reorders(sales_csv_path: str, output_csv_path: str):
    df = pd.read_csv(sales_csv_path)
    # 3-Day Moving Average Forecast
    df['forecast_demand'] = df[['d3', 'd4', 'd5']].mean(axis=1).round(1)
    # Reorder Threshold = Forecast * Lead Time
    df['reorder_threshold'] = (df['forecast_demand'] * df['lead_time_days']).round(1)
    df['reorder_flag'] = np.where(df['current_stock'] < df['reorder_threshold'], 'REORDER TODAY', 'OK')
    df.to_csv(output_csv_path, index=False)
    print(f"Processed {len(df)} SKUs. Triggered {sum(df['reorder_flag'] == 'REORDER TODAY')} alerts.")`,
      outputSummary: `Computed moving-average forecasts. Flagged ${urgentCount} urgent restock triggers. Output to forecast.csv.`,
      timestamp: '00:00:04',
      status: 'pending',
    },
    {
      id: 'step-4',
      stage: 'FORECAST_CSV',
      title: 'Stage 4: Enriched Forecast Output (forecast.csv)',
      techBadge: 'CSV Data Contract',
      codeSnippet: `sku_id,name,current_stock,forecast_demand,reorder_threshold,reorder_flag
SKU-001,Milk 1L,18,25.3,25.3,REORDER TODAY
SKU-002,Rice 5kg,48,12.7,38.0,OK
SKU-004,Cooking Oil,24,16.7,33.3,REORDER TODAY
SKU-006,Bread,14,35.0,35.0,REORDER TODAY
SKU-007,Eggs,38,30.0,60.0,REORDER TODAY
SKU-011,Detergent,12,6.0,24.0,REORDER TODAY`,
      outputSummary: `Delivered predictive table ready for high-throughput ADSA ingestion.`,
      timestamp: '00:00:05',
      status: 'pending',
    },
    {
      id: 'step-5',
      stage: 'JAVA_ADSA_ENGINE',
      title: 'Stage 5: Java Inventory Engine (AVL Tree & BFS Graph Dispatch)',
      techBadge: 'ADSA (Advanced Data Structures)',
      codeSnippet: `// InventoryOptimizationEngine.java
public class InventoryOptimizationEngine {
    private AVLTree stockTree = new AVLTree();
    private SupplierGraph supplierGraph = new SupplierGraph();

    public void processForecastData(List<ForecastRecord> records) {
        // 1. Insert into self-balancing AVL Tree keyed by stock
        records.forEach(stockTree::insert);
        
        // 2. O(log N) query for lowest stock item
        AVLNode lowest = stockTree.findMinimum();
        
        // 3. Dispatch BFS shortest-hop route (WH -> S2 -> Store, 2 hops)
        PathResult optimalRoute = supplierGraph.runBFS("WH", "Store");
        
        dispatchPurchaseOrders(records.stream().filter(ForecastRecord::isUrgent).toList(), optimalRoute);
    }
}`,
      outputSummary: `AVL Tree built (Height = 4). Lowest stock item identified: ${lowestStock?.name} (${lowestStock?.currentStock} units). Optimal route computed via BFS (2 hops).`,
      timestamp: '00:00:07',
      status: 'pending',
    },
  ];
}
