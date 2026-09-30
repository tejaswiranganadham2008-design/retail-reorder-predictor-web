import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { generatePipelineSteps, PipelineExecutionLog } from '../lib/pipelineSimulation';
import {
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Database,
  Code2,
  ShieldCheck,
  Terminal,
  BookOpen,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { calculatedSKUs } = useInventory();
  const [pipelineSteps, setPipelineSteps] = useState<PipelineExecutionLog[]>(() =>
    generatePipelineSteps(calculatedSKUs)
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);

  const runPipelineSimulation = async () => {
    setIsRunningPipeline(true);
    const steps = generatePipelineSteps(calculatedSKUs);

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      steps[i].status = 'running';
      setPipelineSteps([...steps]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      steps[i].status = 'success';
      setPipelineSteps([...steps]);
    }
    setIsRunningPipeline(false);
  };

  const resetPipeline = () => {
    const steps = generatePipelineSteps(calculatedSKUs);
    setPipelineSteps(steps);
    setActiveStepIndex(0);
    setIsRunningPipeline(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Problem Statement Hero Card */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-br from-white via-blue-50/30 to-amber-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border-brand-blue/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0D2A5C] text-white shadow-md">
            <HelpCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
              Supermarket Supply Chain Problem Statement
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Transforming reactive manual replenishment into predictive, algorithmically balanced inventory.
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 pt-2">
          <p>
            <strong>The Core Challenge:</strong> Supermarkets and high-throughput retail stores consistently run out of fast-moving essential goods (e.g., Milk, Bread, Cooking Oil, Eggs) because traditional store replenishment operates on manual, reactive inspections. Store managers only place purchase orders after shelves are visibly depleted, leading to costly stockouts, lost retail revenue, and customer dissatisfaction.
          </p>
          <p>
            <strong>The Predictive Solution:</strong> This application continuously analyzes recent checkout sales velocity using a <strong>3-day Moving Average forecast</strong> multiplied by supplier lead times to calculate the dynamic <strong>Reorder Point Safety Threshold</strong>. When inventory dips below this threshold, the item is instantly flagged for same-day reordering. An <strong>AVL Tree</strong> maintains real-time O(log N) stock priority rankings, while a <strong>Supplier Graph</strong> uses Breadth-First Search (BFS) to route purchase orders along the fastest corridor (WH &rarr; S2 &rarr; Store) to prevent transit bottlenecks.
          </p>
        </div>
      </div>

      {/* 4 Academic & Engineering Disciplines Grid */}
      <div>
        <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-brand-blue" />
          Academic & Engineering Subjects Applied
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ADSA */}
          <div className="glass-card p-5 space-y-3 border-t-4 border-t-blue-600 hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ADSA
                </h3>
                <p className="text-[10px] text-slate-500">Data Structures & Algorithms</p>
              </div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Self-balancing <strong>AVL Tree</strong> with height-balanced rotations (LL, RR, LR, RL).</li>
              <li>O(log N) minimum stock item identification.</li>
              <li>O(N) in-order traversal sorting.</li>
              <li><strong>BFS vs DFS</strong> graph search across regional supplier nodes.</li>
            </ul>
          </div>

          {/* AI / Data Science */}
          <div className="glass-card p-5 space-y-3 border-t-4 border-t-purple-600 hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI / Machine Learning
                </h3>
                <p className="text-[10px] text-slate-500">Time-Series Demand Forecasting</p>
              </div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li>3-day sliding window moving-average demand prediction.</li>
              <li>Dynamic safety stock buffer calculation.</li>
              <li>Lead-time sensitivity modeling.</li>
              <li>Stockout probability mitigation.</li>
            </ul>
          </div>

          {/* OOPJ */}
          <div className="glass-card p-5 space-y-3 border-t-4 border-t-amber-600 hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Code2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  OOPJ
                </h3>
                <p className="text-[10px] text-slate-500">Object-Oriented Java</p>
              </div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Strongly-typed domain models (<code>SKUItem</code>, <code>AVLNode</code>, <code>GraphEdge</code>).</li>
              <li>Encapsulated rebalancing and routing services.</li>
              <li>Streamlined file I/O serialization contracts.</li>
              <li>Robust error handling & validation.</li>
            </ul>
          </div>

          {/* Python */}
          <div className="glass-card p-5 space-y-3 border-t-4 border-t-emerald-600 hover:shadow-soft-lg transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Python
                </h3>
                <p className="text-[10px] text-slate-500">Analytics & ETL Automation</p>
              </div>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Pandas tabular batch data transformations.</li>
              <li>Automated CSV generation & ingestion.</li>
              <li>Data validation against missing receipts.</li>
              <li>Seamless bridge between POS and ADSA engines.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architecture Flow Section (Java -> sales.csv -> Python -> forecast.csv -> Java) */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal size={20} className="text-brand-blue" />
              Enterprise Architecture Data Pipeline Flow
            </h2>
            <p className="text-xs text-slate-500">
              Architecture contract: <code>Java (POS) &rarr; sales.csv &rarr; Python (ML) &rarr; forecast.csv &rarr; Java (ADSA Engine)</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runPipelineSimulation}
              disabled={isRunningPipeline}
              className="btn-primary text-xs"
            >
              <Play size={14} className={isRunningPipeline ? 'animate-spin' : ''} />
              <span>{isRunningPipeline ? 'Executing Pipeline...' : 'Run Pipeline Simulation'}</span>
            </button>
            <button onClick={resetPipeline} className="btn-secondary text-xs" title="Reset steps">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Visual Pipeline Sequence Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {pipelineSteps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = step.status === 'success';

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isActive
                    ? 'border-brand-blue bg-blue-50/80 dark:bg-blue-950/60 shadow-md ring-2 ring-brand-blue/30'
                    : isCompleted
                    ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Step {idx + 1}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  )}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                  {step.title.split(':')[1] || step.title}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  {step.techBadge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Terminal Code Inspector */}
        <div className="rounded-2xl bg-slate-950 text-slate-100 p-5 space-y-3 font-mono text-xs border border-slate-800 shadow-soft-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="text-slate-400 text-[11px] ml-2 font-sans font-bold">
                {pipelineSteps[activeStepIndex].title}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-brand-blue-light font-bold">
              {pipelineSteps[activeStepIndex].techBadge}
            </span>
          </div>

          {/* Code block */}
          <pre className="overflow-x-auto p-3 rounded-xl bg-slate-900/90 text-blue-200 text-[11px] leading-relaxed border border-slate-800">
            {pipelineSteps[activeStepIndex].codeSnippet}
          </pre>

          {/* Execution Output Box */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold text-sm">➜</span>
            <div>
              <p className="text-slate-200 text-xs">
                <strong>Execution Log:</strong> {pipelineSteps[activeStepIndex].outputSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
