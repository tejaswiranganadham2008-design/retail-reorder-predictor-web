# Retail Reorder Point Predictor 🛒📦

> **Enterprise Supermarket Inventory Demand Forecasting & Supply Chain Routing Engine**  
> Built with **React 18, TypeScript, Vite, Tailwind CSS, Recharts, and SVG/D3 Data Visualizations**. 100% client-side reactive execution with zero backend dependencies.

---

## 📌 Problem Statement
Supermarkets face persistent stockouts of fast-moving consumer goods (e.g., Milk, Bread, Cooking Oil, Eggs) because replenishment relies on manual, reactive inspections. Store managers typically place purchase orders only after shelves are visibly bare, leading to lost revenue and customer frustration.

**The Solution:**  
This application continuously monitors store checkout velocity using a **3-Day Moving Average Demand Forecast** multiplied by supplier lead times to calculate dynamic **Reorder Point Safety Thresholds**. Items below safety buffers are immediately flagged for same-day reordering (`REORDER TODAY`). An **AVL Tree** maintains real-time $O(\log N)$ stock level ranking and lowest-stock item retrieval, while a **Supplier Network Graph** applies **Breadth-First Search (BFS)** to guarantee fastest replenishment through the fewest transit hops.

---

## 🚀 Key Features

1. **Dashboard & Executive Analytics**
   - Real-time KPI cards: Total Monitored SKUs, Urgent Reorders, $O(\log N)$ Lowest Stock Item, Average Daily Forecast.
   - Interactive Recharts Bar Chart: Current Stock vs Reorder Safety Threshold benchmark.
   - Urgent Restock Action Queue with one-click purchase order dispatch.

2. **Interactive Live Inventory Table**
   - Searchable, sortable, filterable table across 12 supermarket SKUs.
   - **Inline Stock Editing**: click any stock number to update; thresholds, forecast status, and the AVL Tree rebalance in real time.
   - Filter by `All`, `Reorder`, `OK`, and Product Category.
   - One-click **CSV Export** of urgent reorder lists and full catalog reports.

3. **Self-Balancing AVL Stock Index Tree**
   - Interactive SVG diagram with stock numbers in nodes and node balance factors ($BF = H(L) - H(R)$).
   - $O(\log N)$ find-minimum highlight with an amber beacon on the lowest-stock item.
   - **Insert & Auto-Rebalance**: Add custom SKUs to test $LL$, $RR$, $LR$, and $RL$ rotations with detailed diagnostic logs.
   - Real-time Tree Height and In-Order Traversal sequence (ascending sorted stock order).

4. **Multi-Tier Supplier Restock Routing Network**
   - Network topology: Central Warehouse (`WH`), Supplier Hubs (`S1`, `S2`, `S3`), and Supermarket Store (`Store`).
   - Routes: `WH-S1`, `WH-S2`, `S1-S3`, `S3-Store`, `S2-Store`.
   - **BFS vs DFS Algorithm Toggle & Side-by-Side Comparison**:
     - **BFS (Optimal)**: Discovers shortest 2-hop route (`WH → S2 → Store`) saving ~15 hours of transit delay.
     - **DFS (First Path)**: Follows deep exploratory 3-hop corridor (`WH → S1 → S3 → Store`).
   - Step-by-step interactive algorithm traversal stepper showing FIFO Queue / LIFO Stack states.

5. **Moving-Average Demand Forecast & Sensitivity Simulator**
   - Product selector dropdown with 5-day sales history and Day 6 predictive demand trajectory.
   - Clear step-by-step mathematical working card: e.g. `(22 + 26 + 28) / 3 = 25.3 units/day`.
   - Interactive **"What-If" Sensitivity Simulator** with sliders for past sales and supplier lead times.

6. **Enterprise Architecture & Multi-Discipline Integration (About Page)**
   - Theoretical and engineering breakdown across 4 academic subjects:
     - **ADSA (Advanced Data Structures & Algorithms)**: AVL Tree balancing, $O(\log N)$ minimums, BFS/DFS graph traversals.
     - **AI / Machine Learning**: Time-series moving-average predictive demand forecasting.
     - **OOPJ (Object-Oriented Java)**: Domain entity encapsulation and POS checkout models.
     - **Python**: Pandas automated data ETL transformations.
   - Interactive 5-stage architecture pipeline simulator: `Java POS → sales.csv → Python ML → forecast.csv → Java ADSA Engine`.

---

## 🧮 Mathematical & Algorithmic Logic

### 1. Moving-Average Demand Forecast
$$\text{Forecast} = \frac{\text{Sales}_{D-2} + \text{Sales}_{D-1} + \text{Sales}_{D}}{3}$$
*Example:* If the last 3 days of sales are $22, 26, 28$:
$$\text{Forecast} = \frac{22 + 26 + 28}{3} = \frac{76}{3} = 25.3 \text{ units/day}$$

### 2. Reorder Point Safety Threshold
$$\text{Threshold} = \text{Forecast} \times \text{Lead Time (Days)}$$
$$\text{Status} = \begin{cases} \text{"REORDER TODAY"}, & \text{if } \text{Current Stock} < \text{Threshold} \\ \text{"OK"}, & \text{otherwise} \end{cases}$$

### 3. AVL Tree Key & Tie-Breaker
- **Primary Key**: `currentStock` (Number).
- **Tie-Breaker**: `sku.id` (Lexicographical String comparison).
- **Height-Balancing Rotations**: Left-Left ($LL$), Right-Right ($RR$), Left-Right ($LR$), and Right-Left ($RL$).

### 4. Supplier Network Routing
- **BFS Shortest Hops**: `WH → S2 → Store` (2 hops) $\rightarrow$ guarantees minimum transit hubs and lowest handling risk.
- **DFS Depth Route**: `WH → S1 → S3 → Store` (3 hops).

---

## 📊 Initial Seed Dataset

| SKU ID | Product Name | Category | Current Stock | Lead Time | 5-Day Sales History | 3-Day Forecast | Threshold | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `SKU-001` | Milk 1L | Dairy | 18 | 1d | 20, 24, 22, 26, 28 | 25.3 u/d | 25.3 | ⚠️ **REORDER TODAY** |
| `SKU-002` | Rice 5kg | Grains | 48 | 3d | 10, 12, 11, 13, 14 | 12.7 u/d | 38.0 | ✅ **OK** |
| `SKU-003` | Salt 1kg | Pantry | 80 | 4d | 5, 6, 6, 7, 6 | 6.3 u/d | 25.3 | ✅ **OK** |
| `SKU-004` | Cooking Oil | Pantry | 24 | 2d | 12, 14, 15, 18, 17 | 16.7 u/d | 33.3 | ⚠️ **REORDER TODAY** |
| `SKU-005` | Sugar 1kg | Pantry | 35 | 2d | 14, 16, 15, 17, 16 | 16.0 u/d | 32.0 | ✅ **OK** |
| `SKU-006` | Bread | Bakery | 14 | 1d | 28, 30, 32, 35, 38 | 35.0 u/d | 35.0 | ⚠️ **REORDER TODAY** |
| `SKU-007` | Eggs | Dairy | 38 | 2d | 24, 26, 28, 30, 32 | 30.0 u/d | 60.0 | ⚠️ **REORDER TODAY** |
| `SKU-008` | Wheat Flour | Grains | 42 | 3d | 8, 9, 10, 12, 11 | 11.0 u/d | 33.0 | ✅ **OK** |
| `SKU-009` | Tea Powder | Beverages | 50 | 5d | 6, 7, 7, 8, 8 | 7.7 u/d | 38.3 | ✅ **OK** |
| `SKU-010` | Biscuits | Snacks | 65 | 3d | 18, 19, 20, 22, 21 | 21.0 u/d | 63.0 | ✅ **OK** |
| `SKU-011` | Detergent | Household | 12 | 4d | 4, 5, 5, 6, 7 | 6.0 u/d | 24.0 | ⚠️ **REORDER TODAY** |
| `SKU-012` | Soap | Personal Care | 58 | 3d | 9, 10, 11, 12, 12 | 11.7 u/d | 35.0 | ✅ **OK** |

---

## 🛠️ Project Setup & Local Run

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Run Unit Tests (Vitest)
```bash
npm test
```
Runs 17 automated unit tests covering:
- 3-day moving average calculation & threshold comparisons
- AVL Tree balance maintenance, $LL/RR/LR/RL$ rotations, $O(\log N)$ find-min, and in-order sort
- Supplier Graph BFS (shortest hops) and DFS (first path) traversals

### 4. Build for Production
```bash
npm run build
```
Creates an optimized, tree-shaken static bundle in the `dist/` directory ready for zero-configuration static hosting.

---

## 🌐 Static Deployment

The project is pre-configured with `base: './'` in `vite.config.ts` for instant static hosting:

### GitHub Pages (Automated via GitHub Actions)
A pre-built workflow is located at `.github/workflows/deploy.yml`. Pushing to `main` automatically runs tests, builds the bundle, and deploys to GitHub Pages.

### Vercel / Netlify
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 📁 Repository Structure

```
retail-reorder-predictor/
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── KPICard.tsx      # Dashboard KPI metric cards
│   │   │   └── StatusBadge.tsx  # REORDER TODAY (amber) vs OK (green) badges
│   │   ├── forms/
│   │   │   └── AddSKUModal.tsx  # Add custom SKU with live calculation preview
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Navigation bar with dark mode & export actions
│   │   │   ├── Footer.tsx       # Multi-discipline footer tags
│   │   │   └── ToastContainer.tsx # Real-time interactive toast notifications
│   │   └── visual/
│   │       ├── AVLTreeVisualizer.tsx       # SVG AVL Tree visualizer & rotation inspector
│   │       └── SupplierGraphVisualizer.tsx # SVG Supplier Network BFS/DFS visualizer
│   ├── context/
│   │   ├── InventoryContext.tsx # Central reactive inventory, AVL & graph state
│   │   └── ThemeContext.tsx     # Light/Dark mode state with localStorage persistence
│   ├── data/
│   │   ├── initialSKUs.ts       # 12 initial supermarket SKUs with sales histories
│   │   └── supplierNetwork.ts   # WH, S1, S2, S3, Store nodes and transit corridors
│   ├── lib/
│   │   ├── avlTree.ts           # Complete self-balancing AVL Tree implementation
│   │   ├── csvExport.ts         # CSV exporter for reorder lists
│   │   ├── forecast.ts          # Moving-average forecast and threshold logic
│   │   ├── graph.ts             # SupplierGraph with BFS & DFS algorithms
│   │   └── pipelineSimulation.ts # Java -> Python -> Java pipeline engine
│   ├── pages/
│   │   ├── DashboardPage.tsx    # KPIs, Recharts bar chart, urgent action queue
│   │   ├── InventoryPage.tsx    # Searchable, sortable, inline-editable inventory table
│   │   ├── AVLTreePage.tsx      # Full AVL tree visualizer and rotation diagnostics
│   │   ├── SupplierGraphPage.tsx# BFS vs DFS shortest path routing visualizer
│   │   ├── ForecastPage.tsx     # Line chart with Day 6 forecast and What-If simulator
│   │   └── AboutPage.tsx        # Supermarket problem statement and pipeline runner
│   ├── tests/
│   │   ├── avlTree.test.ts      # 7 AVL Tree unit tests
│   │   ├── forecast.test.ts     # 6 Forecast & Threshold unit tests
│   │   └── graph.test.ts        # 4 BFS & DFS unit tests
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for SKU, AVL, Graph, and Pipeline
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Tailwind CSS, custom scrollbars, glowing effects
│   └── main.tsx                 # React DOM mount point
├── index.html                   # HTML template with SEO tags & fonts
├── package.json
├── tailwind.config.js           # Custom color palette, typography & animations
├── tsconfig.json
├── vite.config.ts               # Vite configuration with relative base path
└── README.md
```

---

## 📜 License
MIT License. Built for enterprise supermarket supply chain operations and computer science inventory optimization.
