import { describe, it, expect } from 'vitest';
import { SupplierGraph } from '../lib/graph';
import { SUPPLIER_NODES, SUPPLIER_EDGES } from '../data/supplierNetwork';

describe('Supplier Network Routing (BFS vs DFS)', () => {
  const graph = new SupplierGraph(SUPPLIER_NODES, SUPPLIER_EDGES);

  it('BFS finds the shortest path with fewest hops (WH -> S2 -> Store = 2 hops)', () => {
    const { result, steps } = graph.runBFS('WH', 'Store');

    expect(result.found).toBe(true);
    expect(result.path).toEqual(['WH', 'S2', 'Store']);
    expect(result.hopCount).toBe(2);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.action === 'FOUND')).toBe(true);
  });

  it('DFS finds the first discovered path (WH -> S1 -> S3 -> Store = 3 hops)', () => {
    const { result, steps } = graph.runDFS('WH', 'Store');

    expect(result.found).toBe(true);
    expect(result.path).toEqual(['WH', 'S1', 'S3', 'Store']);
    expect(result.hopCount).toBe(3);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('BFS hop count (2 hops) is fewer than DFS exploration path (3 hops)', () => {
    const bfs = graph.runBFS('WH', 'Store').result;
    const dfs = graph.runDFS('WH', 'Store').result;

    expect(bfs.hopCount).toBeLessThan(dfs.hopCount);
  });

  it('correctly reports when no path exists between disconnected nodes', () => {
    // Store cannot route backward to WH in directed graph
    const { result } = graph.runBFS('Store', 'WH');
    expect(result.found).toBe(false);
    expect(result.path).toEqual([]);
    expect(result.hopCount).toBe(0);
  });
});
