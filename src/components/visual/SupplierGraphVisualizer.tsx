import React, { useState } from 'react';
import { SUPPLIER_NODES, SUPPLIER_EDGES } from '../../data/supplierNetwork';
import { SupplierGraph, TraversalStep } from '../../lib/graph';
import {
  GitFork,
  Zap,
  Route,
  ArrowRight,
  Compass,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SupplierGraphVisualizerProps {
  graph: SupplierGraph;
}

export const SupplierGraphVisualizer: React.FC<SupplierGraphVisualizerProps> = ({ graph }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'BFS' | 'DFS' | 'COMPARE'>('BFS');
  const [stepIndex, setStepIndex] = useState<number>(-1);

  const bfsData = graph.runBFS('WH', 'Store');
  const dfsData = graph.runDFS('WH', 'Store');

  const currentAlgorithmData = activeAlgorithm === 'BFS' ? bfsData : dfsData;
  const activeSteps: TraversalStep[] = currentAlgorithmData.steps;

  // Active path nodes and edges
  const currentPath =
    stepIndex >= 0 && stepIndex < activeSteps.length
      ? activeSteps[stepIndex].currentPath
      : activeAlgorithm === 'BFS'
      ? bfsData.result.path
      : activeAlgorithm === 'DFS'
      ? dfsData.result.path
      : [];

  const handleNextStep = () => {
    if (stepIndex < activeSteps.length - 1) {
      setStepIndex((s) => s + 1);
    }
  };

  const handlePrevStep = () => {
    if (stepIndex > 0) {
      setStepIndex((s) => s - 1);
    }
  };

  const handleResetTrace = () => {
    setStepIndex(-1);
  };

  // Node position map
  const nodeMap = new Map(SUPPLIER_NODES.map((n) => [n.id, n]));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue dark:text-blue-400">
              <GitFork size={22} />
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                Multi-Tier Supplier Restock Routing Network
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Breadth-First Search (Shortest Path / Fewest Hops) vs Depth-First Search (Deep Path Traversal).
              </p>
            </div>
          </div>
        </div>

        {/* Algorithm Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveAlgorithm('BFS');
              handleResetTrace();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAlgorithm === 'BFS'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap size={14} />
            BFS (Shortest Hops)
          </button>
          <button
            onClick={() => {
              setActiveAlgorithm('DFS');
              handleResetTrace();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAlgorithm === 'DFS'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Route size={14} />
            DFS (First Path)
          </button>
          <button
            onClick={() => {
              setActiveAlgorithm('COMPARE');
              handleResetTrace();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAlgorithm === 'COMPARE'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Compass size={14} />
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* BFS Metric Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            activeAlgorithm === 'BFS' || activeAlgorithm === 'COMPARE'
              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              BFS (Fastest Restock)
            </span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 font-bold">
              Optimal
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {bfsData.result.hopCount} Hops
            </span>
            <span className="text-xs text-slate-500">
              (WH &rarr; S2 &rarr; Store)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Guarantees minimum transfer depots to prevent transit delay.
          </p>
        </div>

        {/* DFS Metric Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            activeAlgorithm === 'DFS' || activeAlgorithm === 'COMPARE'
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700/60 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
              DFS (First Found Path)
            </span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200 font-bold">
              Deep Path
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {dfsData.result.hopCount} Hops
            </span>
            <span className="text-xs text-slate-500">
              (WH &rarr; S1 &rarr; S3 &rarr; Store)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Deep recursive exploration explores northern hubs before terminal.
          </p>
        </div>

        {/* Efficiency Difference Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Routing Advantage
            </span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div className="mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              -33% Hop Overhead
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            BFS saves 1 hub transit vs DFS, shortening delivery window by ~15 hours.
          </p>
        </div>
      </div>

      {/* Main SVG Graph & Path Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Interactive Network Diagram */}
        <div className="lg:col-span-3 glass-card p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Supplier Topology Canvas
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                Source: Central Warehouse (WH) &rarr; Destination: Store
              </span>
            </div>

            {/* Stepper Controls */}
            {activeAlgorithm !== 'COMPARE' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevStep}
                  disabled={stepIndex <= 0}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-40"
                >
                  &larr; Prev
                </button>
                <span className="text-xs font-mono text-slate-500 px-1">
                  {stepIndex === -1 ? 'Full' : `Step ${stepIndex + 1}/${activeSteps.length}`}
                </span>
                <button
                  onClick={handleNextStep}
                  disabled={stepIndex >= activeSteps.length - 1}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-40"
                >
                  Next &rarr;
                </button>
                <button
                  onClick={handleResetTrace}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  title="Reset to completed path"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            )}
          </div>

          {/* SVG Network Canvas */}
          <div className="w-full h-[380px] bg-slate-900/5 dark:bg-slate-950/60 rounded-xl mt-3 p-4 flex items-center justify-center border border-slate-200/60 dark:border-slate-800/60">
            <svg viewBox="0 0 860 380" className="w-full h-full">
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="28"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrow-amber"
                  viewBox="0 0 10 10"
                  refX="28"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
                </marker>
                <marker
                  id="arrow-blue"
                  viewBox="0 0 10 10"
                  refX="28"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#1F5FD6" />
                </marker>

                {/* Glow Filter */}
                <filter id="route-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="route-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render Network Edges */}
              <g className="edges">
                {SUPPLIER_EDGES.map((edge) => {
                  const source = nodeMap.get(edge.from);
                  const target = nodeMap.get(edge.to);
                  if (!source || !target) return null;

                  const isBFSPath = graph.isEdgeInPath(edge.from, edge.to, bfsData.result.path);
                  const isDFSPath = graph.isEdgeInPath(edge.from, edge.to, dfsData.result.path);

                  const isCurrentActive =
                    activeAlgorithm === 'COMPARE'
                      ? isBFSPath || isDFSPath
                      : graph.isEdgeInPath(edge.from, edge.to, currentPath);

                  const strokeColor =
                    activeAlgorithm === 'COMPARE'
                      ? isBFSPath
                        ? '#F59E0B'
                        : isDFSPath
                        ? '#1F5FD6'
                        : '#cbd5e1'
                      : isCurrentActive
                      ? activeAlgorithm === 'BFS'
                        ? '#F59E0B'
                        : '#1F5FD6'
                      : '#cbd5e1';

                  const markerId =
                    activeAlgorithm === 'COMPARE'
                      ? isBFSPath
                        ? 'url(#arrow-amber)'
                        : isDFSPath
                        ? 'url(#arrow-blue)'
                        : 'url(#arrow-default)'
                      : isCurrentActive
                      ? activeAlgorithm === 'BFS'
                        ? 'url(#arrow-amber)'
                        : 'url(#arrow-blue)'
                      : 'url(#arrow-default)';

                  return (
                    <g key={edge.id}>
                      {/* Edge Line */}
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={isCurrentActive ? 4 : 2}
                        strokeDasharray={isCurrentActive ? undefined : '5,5'}
                        markerEnd={markerId}
                        filter={
                          isCurrentActive
                            ? activeAlgorithm === 'BFS' || (activeAlgorithm === 'COMPARE' && isBFSPath)
                              ? 'url(#route-glow-amber)'
                              : 'url(#route-glow-blue)'
                            : undefined
                        }
                        className="transition-all duration-300"
                      />

                      {/* Edge Label / Transit time */}
                      <rect
                        x={(source.x + target.x) / 2 - 24}
                        y={(source.y + target.y) / 2 - 10}
                        width="48"
                        height="20"
                        rx="10"
                        className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700"
                      />
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 + 4}
                        textAnchor="middle"
                        className="text-[10px] font-mono font-bold fill-slate-600 dark:fill-slate-400 select-none"
                      >
                        {edge.leadTimeHours}h
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Render Network Nodes */}
              <g className="nodes">
                {SUPPLIER_NODES.map((node) => {
                  const isInBFS = bfsData.result.path.includes(node.id);
                  const isInDFS = dfsData.result.path.includes(node.id);
                  const isNodeActive =
                    activeAlgorithm === 'COMPARE'
                      ? isInBFS || isInDFS
                      : currentPath.includes(node.id);

                  const isSource = node.id === 'WH';
                  const isDest = node.id === 'Store';

                  const nodeColor = isSource
                    ? '#0D2A5C'
                    : isDest
                    ? '#10B981'
                    : activeAlgorithm === 'BFS' && isNodeActive
                    ? '#F59E0B'
                    : activeAlgorithm === 'DFS' && isNodeActive
                    ? '#1F5FD6'
                    : '#475569';

                  return (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                      {/* Glowing Pulse for active path nodes */}
                      {isNodeActive && (
                        <circle
                          cx="0"
                          cy="0"
                          r="28"
                          className="pulse-ring"
                          fill={
                            activeAlgorithm === 'BFS' || (activeAlgorithm === 'COMPARE' && isInBFS)
                              ? '#F59E0B22'
                              : '#1F5FD622'
                          }
                          stroke={
                            activeAlgorithm === 'BFS' || (activeAlgorithm === 'COMPARE' && isInBFS)
                              ? '#F59E0B'
                              : '#1F5FD6'
                          }
                          strokeWidth="2"
                        />
                      )}

                      {/* Node Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill={nodeColor}
                        className="shadow-md transition-all duration-300 cursor-pointer"
                      />

                      {/* Node Label ID */}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="text-xs font-bold font-mono fill-white select-none pointer-events-none"
                      >
                        {node.id}
                      </text>

                      {/* Subtitle / Descriptive Name */}
                      <text
                        x="0"
                        y="34"
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-800 dark:fill-slate-200 select-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block"></span>
                BFS Optimal Route (Orange: WH &rarr; S2 &rarr; Store)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-brand-blue inline-block"></span>
                DFS Traversal Route (Blue: WH &rarr; S1 &rarr; S3 &rarr; Store)
              </span>
            </div>
            <span className="text-[11px] font-mono">Arrows show direction of stock freight</span>
          </div>
        </div>

        {/* Right 1 col: Path Breakdown & Step Explanation */}
        <div className="space-y-4">
          {/* Path Details Card */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Route size={16} className="text-brand-blue" />
              Route Computation Details
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                  Algorithm In Focus
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {activeAlgorithm === 'BFS'
                    ? 'Breadth-First Search (Queue)'
                    : activeAlgorithm === 'DFS'
                    ? 'Depth-First Search (Stack)'
                    : 'BFS vs DFS Direct Comparison'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                  Discovered Path
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-slate-900 dark:text-white">
                  {currentPath.map((node, i) => (
                    <React.Fragment key={node}>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {node}
                      </span>
                      {i < currentPath.length - 1 && <ArrowRight size={12} className="text-slate-400" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeAlgorithm === 'BFS'
                    ? bfsData.result.explanation
                    : activeAlgorithm === 'DFS'
                    ? dfsData.result.explanation
                    : 'BFS finds the optimal 2-hop route via S2, whereas DFS commits to the 3-hop route via S1 and S3.'}
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Log / Queue Card */}
          {activeAlgorithm !== 'COMPARE' && (
            <div className="glass-card p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {activeAlgorithm === 'BFS' ? 'FIFO Queue State' : 'LIFO Call Stack State'}
              </h4>
              <div className="space-y-1.5 text-xs">
                {stepIndex >= 0 && stepIndex < activeSteps.length ? (
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                    <p className="font-semibold text-brand-blue dark:text-blue-300">
                      Step {activeSteps[stepIndex].stepNumber}: {activeSteps[stepIndex].action}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                      {activeSteps[stepIndex].description}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Buffer: [{activeSteps[stepIndex].queueOrStack.join(', ')}]
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 py-1">
                    Click "Next" or "Prev" above to inspect step-by-step algorithm traversal in the network.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
