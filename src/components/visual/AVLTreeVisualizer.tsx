import React, { useState, useMemo } from 'react';
import { AVLNodeData, RotationEvent } from '../../types';
import { computeTreeLayout, VisualNode, VisualEdge } from '../../lib/avlTree';
import { StatusBadge } from '../common/StatusBadge';
import {
  Binary,
  Layers,
  Sparkles,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Activity,
  Award,
} from 'lucide-react';

interface AVLTreeVisualizerProps {
  rootData: AVLNodeData | null;
  height: number;
  minNode: AVLNodeData | null;
  inOrder: AVLNodeData[];
  rotationLogs: RotationEvent[];
  onSelectSKU?: (id: string) => void;
  onOpenAddModal?: () => void;
}

export const AVLTreeVisualizer: React.FC<AVLTreeVisualizerProps> = ({
  rootData,
  height,
  minNode,
  inOrder,
  rotationLogs,
  onSelectSKU,
  onOpenAddModal,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(minNode?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRotationHistory, setShowRotationHistory] = useState(false);

  // Compute SVG layout coordinates for all nodes and edges
  const { nodes, edges } = useMemo(() => {
    return computeTreeLayout(rootData, minNode?.id, 960, 480);
  }, [rootData, minNode]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return minNode;
    return nodes.find((n) => n.id === selectedNodeId) || minNode;
  }, [selectedNodeId, nodes, minNode]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue dark:text-blue-400">
              <Binary size={22} />
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                Self-Balancing AVL Stock Index Tree
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Binary Search Tree strictly keyed by current stock level with O(log N) operations and automatic LL/RR/LR/RL rotations.
              </p>
            </div>
          </div>
        </div>

        {/* Tree Metrics & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Layers size={16} className="text-brand-blue dark:text-blue-400" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Tree Height:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {height} levels
            </span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60">
            <Award size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">Lowest Stock:</span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400 font-mono">
              {minNode ? `${minNode.name} (${minNode.stock})` : 'N/A'}
            </span>
          </div>

          {onOpenAddModal && (
            <button onClick={onOpenAddModal} className="btn-primary text-xs">
              <Sparkles size={14} />
              <span>+ Add SKU (Insert & Rotate)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: SVG Canvas */}
        <div className="lg:col-span-3 glass-card p-4 relative overflow-hidden flex flex-col">
          {/* Canvas Controls Bar */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Interactive AVL Visualization
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
                {nodes.length} Nodes
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setShowRotationHistory(!showRotationHistory)}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                  showRotationHistory
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="Toggle rotation diagnostics log"
              >
                <Activity size={14} />
                <span className="hidden sm:inline">Rotations ({rotationLogs.length})</span>
              </button>
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="w-full h-[450px] overflow-auto flex items-center justify-center bg-gradient-to-b from-slate-50/50 to-blue-50/20 dark:from-slate-950/40 dark:to-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-2">
            <svg
              viewBox="0 0 960 480"
              className="w-full h-full min-w-[700px] transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Glowing drop shadow for lowest stock node */}
                <filter id="glow-amber-filter" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-blue-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Gradients */}
                <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1F5FD6" />
                  <stop offset="100%" stopColor="#0D2A5C" />
                </linearGradient>
                <linearGradient id="edgeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* Render Tree Edges */}
              <g className="edges">
                {edges.map((edge: VisualEdge) => (
                  <g key={`edge-${edge.fromId}-${edge.toId}`}>
                    <path
                      d={`M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${(edge.fromY + edge.toY) / 2}, ${edge.toX} ${(edge.fromY + edge.toY) / 2}, ${edge.toX} ${edge.toY}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="dark:stroke-slate-700 transition-all duration-300"
                    />
                    {/* Branch direction pill */}
                    <circle
                      cx={(edge.fromX + edge.toX) / 2}
                      cy={(edge.fromY + edge.toY) / 2}
                      r="7"
                      fill="#e2e8f0"
                      className="dark:fill-slate-800"
                    />
                    <text
                      x={(edge.fromX + edge.toX) / 2}
                      y={(edge.fromY + edge.toY) / 2 + 3}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-slate-500 dark:fill-slate-400"
                    >
                      {edge.direction === 'left' ? 'L' : 'R'}
                    </text>
                  </g>
                ))}
              </g>

              {/* Render Tree Nodes */}
              <g className="nodes">
                {nodes.map((node: VisualNode) => {
                  const isMin = node.id === minNode?.id;
                  const isSelected = node.id === (selectedNode?.id || '');

                  return (
                    <g
                      key={`node-${node.id}`}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (onSelectSKU) onSelectSKU(node.id);
                      }}
                      className="cursor-pointer group focus:outline-none"
                    >
                      {/* Lowest stock animated pulse ring */}
                      {isMin && (
                        <circle
                          cx="0"
                          cy="0"
                          r="28"
                          className="pulse-ring fill-amber-400/20 stroke-amber-500 stroke-2"
                        />
                      )}

                      {/* Selected node outer highlight */}
                      {isSelected && !isMin && (
                        <circle
                          cx="0"
                          cy="0"
                          r="28"
                          className="fill-blue-400/20 stroke-brand-blue stroke-2"
                        />
                      )}

                      {/* Node Main Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill={isMin ? 'url(#amberGrad)' : isSelected ? 'url(#blueGrad)' : '#ffffff'}
                        stroke={isMin ? '#F59E0B' : isSelected ? '#1F5FD6' : '#0D2A5C'}
                        strokeWidth={isMin ? '3.5' : isSelected ? '3' : '2'}
                        filter={isMin ? 'url(#glow-amber-filter)' : isSelected ? 'url(#glow-blue-filter)' : undefined}
                        className="transition-all duration-300 group-hover:scale-110 dark:fill-slate-900"
                      />

                      {/* Stock Number in Center */}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className={`text-sm font-bold font-mono select-none ${
                          isMin
                            ? 'fill-slate-950 font-extrabold'
                            : isSelected
                            ? 'fill-white font-extrabold'
                            : 'fill-slate-900 dark:fill-white'
                        }`}
                      >
                        {node.stock}
                      </text>

                      {/* Item Name label below node */}
                      <text
                        x="0"
                        y="36"
                        textAnchor="middle"
                        className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300 select-none group-hover:fill-brand-blue transition-colors"
                      >
                        {node.name.length > 13 ? `${node.name.slice(0, 11)}...` : node.name}
                      </text>

                      {/* Balance Factor badge top-right */}
                      <g transform="translate(16, -16)">
                        <circle
                          cx="0"
                          cy="0"
                          r="8"
                          className="fill-slate-800 text-white dark:fill-slate-200"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          className="text-[9px] font-mono font-bold fill-white dark:fill-slate-900 select-none"
                        >
                          {node.balanceFactor >= 0 ? `+${node.balanceFactor}` : node.balanceFactor}
                        </text>
                      </g>

                      {/* Minimum stock badge above node */}
                      {isMin && (
                        <g transform="translate(0, -32)">
                          <rect
                            x="-38"
                            y="-9"
                            width="76"
                            height="16"
                            rx="8"
                            fill="#F59E0B"
                            className="shadow-sm"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            className="text-[8.5px] font-bold uppercase tracking-wider fill-slate-950 select-none"
                          >
                            MIN STOCK
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Legend / Helper Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 inline-block"></span>
                Lowest Stock Node (Min)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-brand-blue inline-block"></span>
                Selected Node
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-800 border border-[#0D2A5C] inline-block"></span>
                Standard Balanced Node
              </span>
            </div>
            <span className="text-[11px] font-mono">
              Badge top-right = Balance Factor (BF = H(L) - H(R))
            </span>
          </div>
        </div>

        {/* Right 1 col: Node Inspector & Diagnostics */}
        <div className="space-y-4">
          {/* Selected Node Details Card */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info size={16} className="text-brand-blue" />
                Node Inspector
              </h3>
              {selectedNode && <StatusBadge status={selectedNode.sku.status} size="sm" />}
            </div>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Product Name</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedNode.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: {selectedNode.id} • Category: {selectedNode.sku.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">
                      Current Stock (Key)
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                      {selectedNode.stock} units
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">
                      Lead Time
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                      {selectedNode.sku.leadTimeDays} days
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">
                      3-Day Forecast
                    </span>
                    <p className="text-base font-bold text-brand-blue dark:text-blue-400 font-mono">
                      {selectedNode.sku.forecastDemand}/day
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">
                      Reorder Threshold
                    </span>
                    <p className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {selectedNode.sku.reorderThreshold} units
                    </p>
                  </div>
                </div>

                {/* Subtree Properties */}
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Node Height:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedNode.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Balance Factor:</span>
                    <span className="font-mono font-bold text-brand-blue dark:text-blue-400">
                      {selectedNode.balanceFactor >= 0 ? `+${selectedNode.balanceFactor}` : selectedNode.balanceFactor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Left Child:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {selectedNode.left ? `${selectedNode.left.name} (${selectedNode.left.stock})` : 'null'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Right Child:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {selectedNode.right ? `${selectedNode.right.name} (${selectedNode.right.stock})` : 'null'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Click any node to view details.</p>
            )}
          </div>

          {/* In-Order Traversal (Sorted Stock List) */}
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>In-Order Traversal (Sorted)</span>
              <span className="text-[10px] text-brand-blue font-mono font-normal">O(N)</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {inOrder.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedNodeId(item.id)}
                  className={`text-[11px] px-2 py-1 rounded-lg font-mono transition-colors flex items-center gap-1 ${
                    selectedNode?.id === item.id
                      ? 'bg-brand-blue text-white font-bold shadow-sm'
                      : item.id === minNode?.id
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-[9px] opacity-60">#{idx + 1}</span>
                  <span>{item.name}</span>
                  <span className="font-bold opacity-80">({item.stock})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rotation Activity Log Drawer / Panel */}
      {showRotationHistory && (
        <div className="glass-card p-5 animate-slide-up border-brand-blue/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-brand-blue" />
              AVL Self-Balancing Rotation Event Log
            </h3>
            <span className="text-xs text-slate-500">
              Total Rotations Triggered: {rotationLogs.length}
            </span>
          </div>

          {rotationLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">
              Tree is in balance. No rotations were required for the current dataset.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {rotationLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex items-start gap-3"
                >
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.type === 'LL' || log.type === 'RR'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}
                  >
                    {log.type} ROTATION
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {log.reason}
                    </p>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
