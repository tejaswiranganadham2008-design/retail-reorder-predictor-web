import { SUPPLIER_NODES, SUPPLIER_EDGES } from '../data/supplierNetwork';
import { GraphNode, GraphEdge, PathResult } from '../types';

export interface TraversalStep {
  stepNumber: number;
  action: 'VISIT' | 'EXPLORE' | 'ENQUEUE' | 'PUSH' | 'BACKTRACK' | 'FOUND';
  nodeId: string;
  queueOrStack: string[];
  currentPath: string[];
  description: string;
}

export class SupplierGraph {
  public nodes: Map<string, GraphNode>;
  public adjacencyList: Map<string, string[]>;
  public edges: GraphEdge[];

  constructor(nodes: GraphNode[] = SUPPLIER_NODES, edges: GraphEdge[] = SUPPLIER_EDGES) {
    this.nodes = new Map();
    this.adjacencyList = new Map();
    this.edges = [...edges];

    for (const node of nodes) {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    }

    for (const edge of edges) {
      if (this.adjacencyList.has(edge.from)) {
        this.adjacencyList.get(edge.from)!.push(edge.to);
      }
    }
  }

  /**
   * Breadth-First Search (BFS):
   * Explores neighbors level by level using a FIFO Queue.
   * Guarantees the shortest path in an unweighted graph (fewest hops = fastest restock path).
   */
  public runBFS(
    startId: string = 'WH',
    targetId: string = 'Store'
  ): { result: PathResult; steps: TraversalStep[] } {
    const queue: { nodeId: string; path: string[] }[] = [];
    const visited = new Set<string>();
    const traversalOrder: string[] = [];
    const steps: TraversalStep[] = [];
    let stepCount = 0;

    queue.push({ nodeId: startId, path: [startId] });
    visited.add(startId);

    steps.push({
      stepNumber: ++stepCount,
      action: 'ENQUEUE',
      nodeId: startId,
      queueOrStack: [startId],
      currentPath: [startId],
      description: `Initialize BFS: Enqueue source node "${startId}" into FIFO queue and mark visited.`,
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      traversalOrder.push(current.nodeId);

      steps.push({
        stepNumber: ++stepCount,
        action: 'VISIT',
        nodeId: current.nodeId,
        queueOrStack: queue.map((item) => item.nodeId),
        currentPath: current.path,
        description: `Dequeue and inspect "${current.nodeId}". Current branch path: [${current.path.join(' -> ')}].`,
      });

      if (current.nodeId === targetId) {
        steps.push({
          stepNumber: ++stepCount,
          action: 'FOUND',
          nodeId: current.nodeId,
          queueOrStack: queue.map((item) => item.nodeId),
          currentPath: current.path,
          description: `Target destination "${targetId}" reached! Path found with ${current.path.length - 1} hops: ${current.path.join(' -> ')}.`,
        });

        return {
          result: {
            algorithm: 'BFS',
            path: current.path,
            hopCount: current.path.length - 1,
            traversalOrder,
            found: true,
            explanation: `BFS discovered the optimal shortest-hop route (${current.path.length - 1} hops: ${current.path.join(' -> ')}). BFS is ideal for supermarket replenishment because fewer intermediary transfer depots minimize handling delays and stock damage risk.`,
          },
          steps,
        };
      }

      const neighbors = this.adjacencyList.get(current.nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          const nextPath = [...current.path, neighbor];
          queue.push({ nodeId: neighbor, path: nextPath });

          steps.push({
            stepNumber: ++stepCount,
            action: 'ENQUEUE',
            nodeId: neighbor,
            queueOrStack: queue.map((item) => item.nodeId),
            currentPath: nextPath,
            description: `Discovered unvisited neighbor "${neighbor}". Added to FIFO queue.`,
          });
        }
      }
    }

    return {
      result: {
        algorithm: 'BFS',
        path: [],
        hopCount: 0,
        traversalOrder,
        found: false,
        explanation: `No route exists from ${startId} to ${targetId} using BFS.`,
      },
      steps,
    };
  }

  /**
   * Depth-First Search (DFS):
   * Explores as deep as possible along each branch before backtracking using a LIFO Stack / recursion.
   * Finds the first path reached, which may not be the shortest in hop count.
   */
  public runDFS(
    startId: string = 'WH',
    targetId: string = 'Store'
  ): { result: PathResult; steps: TraversalStep[] } {
    const visited = new Set<string>();
    const traversalOrder: string[] = [];
    const steps: TraversalStep[] = [];
    let stepCount = 0;
    let finalPath: string[] = [];
    let found = false;

    const dfsRecursive = (currentId: string, currentPath: string[]): boolean => {
      visited.add(currentId);
      traversalOrder.push(currentId);

      steps.push({
        stepNumber: ++stepCount,
        action: 'VISIT',
        nodeId: currentId,
        queueOrStack: [...currentPath],
        currentPath,
        description: `Explore node "${currentId}" via DFS call stack. Current branch: [${currentPath.join(' -> ')}].`,
      });

      if (currentId === targetId) {
        finalPath = [...currentPath];
        found = true;
        steps.push({
          stepNumber: ++stepCount,
          action: 'FOUND',
          nodeId: currentId,
          queueOrStack: [...currentPath],
          currentPath,
          description: `Target destination "${targetId}" reached via DFS! First complete path found: ${currentPath.join(' -> ')}.`,
        });
        return true;
      }

      const neighbors = this.adjacencyList.get(currentId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          steps.push({
            stepNumber: ++stepCount,
            action: 'EXPLORE',
            nodeId: neighbor,
            queueOrStack: [...currentPath, neighbor],
            currentPath: [...currentPath, neighbor],
            description: `Dive deeper into branch neighbor "${neighbor}".`,
          });

          if (dfsRecursive(neighbor, [...currentPath, neighbor])) {
            return true;
          }
        }
      }

      steps.push({
        stepNumber: ++stepCount,
        action: 'BACKTRACK',
        nodeId: currentId,
        queueOrStack: currentPath.slice(0, -1),
        currentPath: currentPath.slice(0, -1),
        description: `No unvisited valid paths from "${currentId}". Backtracking to previous caller.`,
      });

      return false;
    };

    dfsRecursive(startId, [startId]);

    return {
      result: {
        algorithm: 'DFS',
        path: finalPath,
        hopCount: finalPath.length > 0 ? finalPath.length - 1 : 0,
        traversalOrder,
        found,
        explanation: found
          ? `DFS explored the network depth-first and locked into the first discovered full path (${finalPath.length - 1} hops: ${finalPath.join(' -> ')}). Notice that DFS follows the top supplier channel (S1 -> S3) first, yielding more hops than BFS.`
          : `No route exists from ${startId} to ${targetId} using DFS.`,
      },
      steps,
    };
  }

  /**
   * Helper to get edge between two node IDs if exists.
   */
  public getEdge(from: string, to: string): GraphEdge | undefined {
    return this.edges.find((e) => e.from === from && e.to === to);
  }

  /**
   * Checks if an edge is part of a given path.
   */
  public isEdgeInPath(from: string, to: string, path: string[]): boolean {
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === from && path[i + 1] === to) {
        return true;
      }
    }
    return false;
  }
}
