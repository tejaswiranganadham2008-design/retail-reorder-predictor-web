import { CalculatedSKU, AVLNodeData, RotationEvent } from '../types';

/**
 * Internal AVL Tree Node representation.
 */
export class AVLNode {
  public id: string;
  public name: string;
  public stock: number;
  public sku: CalculatedSKU;
  public height: number;
  public left: AVLNode | null = null;
  public right: AVLNode | null = null;

  constructor(sku: CalculatedSKU) {
    this.id = sku.id;
    this.name = sku.name;
    this.stock = sku.currentStock;
    this.sku = sku;
    this.height = 1; // 1-indexed height: leaf node has height 1
  }

  /**
   * Helper to convert node and subtrees into plain serializable object for React state.
   */
  public toData(): AVLNodeData {
    return {
      id: this.id,
      name: this.name,
      stock: this.stock,
      sku: this.sku,
      height: this.height,
      balanceFactor: this.getBalanceFactor(),
      left: this.left ? this.left.toData() : null,
      right: this.right ? this.right.toData() : null,
    };
  }

  /**
   * Balance Factor = Height(Left) - Height(Right)
   * AVL property requires Balance Factor to be in {-1, 0, 1}.
   */
  public getBalanceFactor(): number {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    return leftHeight - rightHeight;
  }

  /**
   * Recomputes height based on left and right child heights.
   */
  public updateHeight(): void {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    this.height = Math.max(leftHeight, rightHeight) + 1;
  }
}

/**
 * Full AVL Tree implementation with self-balancing rotations.
 * Key: stock level (Number).
 * Tie-breaker: SKU ID (String lexicographical comparison).
 */
export class AVLTree {
  public root: AVLNode | null = null;
  public rotationLogs: RotationEvent[] = [];

  constructor() {
    this.root = null;
    this.rotationLogs = [];
  }

  /**
   * Clear tree and logs.
   */
  public clear(): void {
    this.root = null;
    this.rotationLogs = [];
  }

  /**
   * Comparator: Returns negative if a < b, positive if a > b, 0 if identical.
   */
  public compare(stockA: number, idA: string, stockB: number, idB: string): number {
    if (stockA !== stockB) {
      return stockA - stockB;
    }
    return idA.localeCompare(idB);
  }

  /**
   * Gets the overall height of the tree. Empty tree = 0.
   */
  public getHeight(): number {
    return this.root ? this.root.height : 0;
  }

  /**
   * Right Rotation (LL Case):
   * Used when left child is heavy and insertion was in left subtree of left child.
   *
   *       y (node)                 x
   *      / \                     /   \
   *     x   T3    ------>       T1    y
   *    / \                           / \
   *   T1  T2                        T2  T3
   */
  private rotateRight(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights (y first because it became child of x)
    y.updateHeight();
    x.updateHeight();

    this.rotationLogs.push({
      type: 'LL',
      nodeName: y.name,
      nodeStock: y.stock,
      reason: `LL Imbalance at node "${y.name}" (Stock: ${y.stock}, BF: +2). Performed Right Rotation with pivot "${x.name}".`,
      timestamp: new Date().toLocaleTimeString(),
    });

    return x;
  }

  /**
   * Left Rotation (RR Case):
   * Used when right child is heavy and insertion was in right subtree of right child.
   *
   *     y (node)                      x
   *    / \                          /   \
   *   T1  x        ------>         y     T3
   *      / \                      / \
   *     T2  T3                   T1  T2
   */
  private rotateLeft(y: AVLNode): AVLNode {
    const x = y.right!;
    const T2 = x.left;

    // Perform rotation
    x.left = y;
    y.right = T2;

    // Update heights
    y.updateHeight();
    x.updateHeight();

    this.rotationLogs.push({
      type: 'RR',
      nodeName: y.name,
      nodeStock: y.stock,
      reason: `RR Imbalance at node "${y.name}" (Stock: ${y.stock}, BF: -2). Performed Left Rotation with pivot "${x.name}".`,
      timestamp: new Date().toLocaleTimeString(),
    });

    return x;
  }

  /**
   * Left-Right Rotation (LR Case):
   * Used when left child is heavy and insertion was in right subtree of left child.
   * Double rotation: Left rotation on left child, then Right rotation on current node.
   */
  private rotateLeftRight(node: AVLNode): AVLNode {
    this.rotationLogs.push({
      type: 'LR',
      nodeName: node.name,
      nodeStock: node.stock,
      reason: `LR Imbalance at node "${node.name}" (Stock: ${node.stock}). Executing Double Rotation: Left rotation on left child "${node.left?.name}", then Right rotation on "${node.name}".`,
      timestamp: new Date().toLocaleTimeString(),
    });

    node.left = this.rotateLeft(node.left!);
    return this.rotateRight(node);
  }

  /**
   * Right-Left Rotation (RL Case):
   * Used when right child is heavy and insertion was in left subtree of right child.
   * Double rotation: Right rotation on right child, then Left rotation on current node.
   */
  private rotateRightLeft(node: AVLNode): AVLNode {
    this.rotationLogs.push({
      type: 'RL',
      nodeName: node.name,
      nodeStock: node.stock,
      reason: `RL Imbalance at node "${node.name}" (Stock: ${node.stock}). Executing Double Rotation: Right rotation on right child "${node.right?.name}", then Left rotation on "${node.name}".`,
      timestamp: new Date().toLocaleTimeString(),
    });

    node.right = this.rotateRight(node.right!);
    return this.rotateLeft(node);
  }

  /**
   * Public insert method.
   */
  public insert(sku: CalculatedSKU): void {
    this.root = this.insertNode(this.root, sku);
  }

  /**
   * Recursive insert with AVL balancing.
   */
  private insertNode(node: AVLNode | null, sku: CalculatedSKU): AVLNode {
    // 1. Standard BST insertion
    if (node === null) {
      return new AVLNode(sku);
    }

    const cmp = this.compare(sku.currentStock, sku.id, node.stock, node.id);

    if (cmp < 0) {
      node.left = this.insertNode(node.left, sku);
    } else if (cmp > 0) {
      node.right = this.insertNode(node.right, sku);
    } else {
      // Duplicate key and id: update sku details in-place
      node.sku = sku;
      node.name = sku.name;
      return node;
    }

    // 2. Update height of ancestor node
    node.updateHeight();

    // 3. Get balance factor to check for imbalance
    const balance = node.getBalanceFactor();

    // 4. Rebalance if needed (4 Cases)

    // Left Heavy Cases (balance > 1)
    if (balance > 1 && node.left) {
      const leftCmp = this.compare(sku.currentStock, sku.id, node.left.stock, node.left.id);
      // LL Case
      if (leftCmp < 0) {
        return this.rotateRight(node);
      }
      // LR Case
      if (leftCmp > 0) {
        return this.rotateLeftRight(node);
      }
    }

    // Right Heavy Cases (balance < -1)
    if (balance < -1 && node.right) {
      const rightCmp = this.compare(sku.currentStock, sku.id, node.right.stock, node.right.id);
      // RR Case
      if (rightCmp > 0) {
        return this.rotateLeft(node);
      }
      // RL Case
      if (rightCmp < 0) {
        return this.rotateRightLeft(node);
      }
    }

    return node;
  }

  /**
   * In-Order Traversal (Left -> Root -> Right).
   * Yields all nodes strictly sorted by stock ascending (with tiebreak by ID).
   */
  public inOrderTraversal(node: AVLNode | null = this.root): AVLNodeData[] {
    const result: AVLNodeData[] = [];

    const traverse = (current: AVLNode | null) => {
      if (!current) return;
      traverse(current.left);
      result.push(current.toData());
      traverse(current.right);
    };

    traverse(node);
    return result;
  }

  /**
   * Finds the minimum stock node in the tree in O(log N) time.
   * Corresponds to the leftmost node in the BST.
   */
  public findMinimum(): AVLNodeData | null {
    if (!this.root) return null;

    let current = this.root;
    while (current.left !== null) {
      current = current.left;
    }

    return current.toData();
  }

  /**
   * Search for a node by SKU ID or Name.
   */
  public findById(id: string): AVLNodeData | null {
    const search = (node: AVLNode | null): AVLNodeData | null => {
      if (!node) return null;
      if (node.id === id) return node.toData();
      const leftResult = search(node.left);
      if (leftResult) return leftResult;
      return search(node.right);
    };
    return search(this.root);
  }

  /**
   * Converts the tree into serializable tree data.
   */
  public toData(): AVLNodeData | null {
    return this.root ? this.root.toData() : null;
  }
}

/**
 * Builds an AVL tree from a list of calculated SKUs.
 */
export function buildAVLTreeFromSKUs(skus: CalculatedSKU[]): {
  tree: AVLTree;
  rootData: AVLNodeData | null;
  height: number;
  minNode: AVLNodeData | null;
  inOrder: AVLNodeData[];
  rotationLogs: RotationEvent[];
} {
  const tree = new AVLTree();
  for (const sku of skus) {
    tree.insert(sku);
  }

  return {
    tree,
    rootData: tree.toData(),
    height: tree.getHeight(),
    minNode: tree.findMinimum(),
    inOrder: tree.inOrderTraversal(),
    rotationLogs: [...tree.rotationLogs],
  };
}

/**
 * Computes SVG visual coordinates (x, y) for every node in the AVL tree for rendering.
 */
export interface VisualNode extends AVLNodeData {
  x: number;
  y: number;
  level: number;
  isMinNode?: boolean;
}

export interface VisualEdge {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromId: string;
  toId: string;
  direction: 'left' | 'right';
}

export function computeTreeLayout(
  root: AVLNodeData | null,
  minNodeId?: string,
  svgWidth = 1000,
  svgHeight = 520
): {
  nodes: VisualNode[];
  edges: VisualEdge[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
} {
  if (!root) {
    return { nodes: [], edges: [], bounds: { minX: 0, maxX: svgWidth, minY: 0, maxY: svgHeight } };
  }

  const nodes: VisualNode[] = [];
  const edges: VisualEdge[] = [];

  // Level-based spacing calculation
  const totalHeight = root.height;
  const levelHeight = Math.min(90, Math.max(70, (svgHeight - 100) / Math.max(1, totalHeight)));

  const assignPositions = (
    node: AVLNodeData,
    level: number,
    leftBound: number,
    rightBound: number
  ): VisualNode => {
    const x = (leftBound + rightBound) / 2;
    const y = 50 + level * levelHeight;

    const visualNode: VisualNode = {
      ...node,
      x,
      y,
      level,
      isMinNode: minNodeId ? node.id === minNodeId : false,
    };

    nodes.push(visualNode);

    if (node.left) {
      const leftChild = assignPositions(node.left, level + 1, leftBound, x);
      edges.push({
        fromX: x,
        fromY: y,
        toX: leftChild.x,
        toY: leftChild.y,
        fromId: node.id,
        toId: leftChild.id,
        direction: 'left',
      });
    }

    if (node.right) {
      const rightChild = assignPositions(node.right, level + 1, x, rightBound);
      edges.push({
        fromX: x,
        fromY: y,
        toX: rightChild.x,
        toY: rightChild.y,
        fromId: node.id,
        toId: rightChild.id,
        direction: 'right',
      });
    }

    return visualNode;
  };

  assignPositions(root, 0, 40, svgWidth - 40);

  return {
    nodes,
    edges,
    bounds: { minX: 0, maxX: svgWidth, minY: 0, maxY: svgHeight },
  };
}
