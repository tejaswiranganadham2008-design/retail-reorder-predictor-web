import { describe, it, expect } from 'vitest';
import { AVLTree, buildAVLTreeFromSKUs } from '../lib/avlTree';
import { calculateSKUDetails } from '../lib/forecast';
import { SKUItem } from '../types';

function createMockSKU(id: string, name: string, stock: number): any {
  return calculateSKUDetails({
    id,
    name,
    category: 'Dairy',
    currentStock: stock,
    leadTimeDays: 1,
    salesHistory: [10, 10, 10, 10, 10],
  });
}

describe('AVL Tree Data Structure & Rotations', () => {
  it('performs Right Rotation (LL Case) when inserting in descending order', () => {
    const tree = new AVLTree();
    // Inserting 30, then 20, then 10 -> triggers LL rotation
    tree.insert(createMockSKU('SKU-30', 'Item 30', 30));
    tree.insert(createMockSKU('SKU-20', 'Item 20', 20));
    tree.insert(createMockSKU('SKU-10', 'Item 10', 10));

    expect(tree.root).not.toBeNull();
    // After LL rotation, root should be 20 with left child 10 and right child 30
    expect(tree.root!.stock).toBe(20);
    expect(tree.root!.left?.stock).toBe(10);
    expect(tree.root!.right?.stock).toBe(30);
    expect(tree.getHeight()).toBe(2);
    expect(tree.rotationLogs.some((log) => log.type === 'LL')).toBe(true);
  });

  it('performs Left Rotation (RR Case) when inserting in ascending order', () => {
    const tree = new AVLTree();
    // Inserting 10, then 20, then 30 -> triggers RR rotation
    tree.insert(createMockSKU('SKU-10', 'Item 10', 10));
    tree.insert(createMockSKU('SKU-20', 'Item 20', 20));
    tree.insert(createMockSKU('SKU-30', 'Item 30', 30));

    expect(tree.root).not.toBeNull();
    // After RR rotation, root should be 20 with left child 10 and right child 30
    expect(tree.root!.stock).toBe(20);
    expect(tree.root!.left?.stock).toBe(10);
    expect(tree.root!.right?.stock).toBe(30);
    expect(tree.getHeight()).toBe(2);
    expect(tree.rotationLogs.some((log) => log.type === 'RR')).toBe(true);
  });

  it('performs Left-Right Rotation (LR Case)', () => {
    const tree = new AVLTree();
    // Inserting 30, then 10, then 20 -> triggers LR rotation
    tree.insert(createMockSKU('SKU-30', 'Item 30', 30));
    tree.insert(createMockSKU('SKU-10', 'Item 10', 10));
    tree.insert(createMockSKU('SKU-20', 'Item 20', 20));

    expect(tree.root).not.toBeNull();
    expect(tree.root!.stock).toBe(20);
    expect(tree.root!.left?.stock).toBe(10);
    expect(tree.root!.right?.stock).toBe(30);
    expect(tree.rotationLogs.some((log) => log.type === 'LR')).toBe(true);
  });

  it('performs Right-Left Rotation (RL Case)', () => {
    const tree = new AVLTree();
    // Inserting 10, then 30, then 20 -> triggers RL rotation
    tree.insert(createMockSKU('SKU-10', 'Item 10', 10));
    tree.insert(createMockSKU('SKU-30', 'Item 30', 30));
    tree.insert(createMockSKU('SKU-20', 'Item 20', 20));

    expect(tree.root).not.toBeNull();
    expect(tree.root!.stock).toBe(20);
    expect(tree.root!.left?.stock).toBe(10);
    expect(tree.root!.right?.stock).toBe(30);
    expect(tree.rotationLogs.some((log) => log.type === 'RL')).toBe(true);
  });

  it('correctly finds the minimum stock item in O(log N)', () => {
    const items: SKUItem[] = [
      { id: '1', name: 'A', category: 'Dairy', currentStock: 50, leadTimeDays: 1, salesHistory: [5, 5, 5] },
      { id: '2', name: 'B', category: 'Dairy', currentStock: 12, leadTimeDays: 1, salesHistory: [5, 5, 5] },
      { id: '3', name: 'C', category: 'Dairy', currentStock: 85, leadTimeDays: 1, salesHistory: [5, 5, 5] },
      { id: '4', name: 'D', category: 'Dairy', currentStock: 4, leadTimeDays: 1, salesHistory: [5, 5, 5] },
      { id: '5', name: 'E', category: 'Dairy', currentStock: 30, leadTimeDays: 1, salesHistory: [5, 5, 5] },
    ];

    const { tree, minNode } = buildAVLTreeFromSKUs(items.map(calculateSKUDetails));
    expect(minNode).not.toBeNull();
    expect(minNode?.stock).toBe(4);
    expect(minNode?.name).toBe('D');
    expect(tree.findMinimum()?.id).toBe('4');
  });

  it('performs in-order traversal yielding strictly ascending stock order', () => {
    const stocks = [45, 18, 80, 24, 35, 14, 38, 42, 50, 65, 12, 58];
    const tree = new AVLTree();
    stocks.forEach((stk, idx) => {
      tree.insert(createMockSKU(`SKU-${idx}`, `Item-${idx}`, stk));
    });

    const inOrder = tree.inOrderTraversal();
    const extractedStocks = inOrder.map((node) => node.stock);
    const sortedStocks = [...stocks].sort((a, b) => a - b);

    expect(extractedStocks).toEqual(sortedStocks);
  });

  it('breaks ties using SKU ID when stock values are identical', () => {
    const tree = new AVLTree();
    tree.insert(createMockSKU('SKU-B', 'Item B', 25));
    tree.insert(createMockSKU('SKU-A', 'Item A', 25));
    tree.insert(createMockSKU('SKU-C', 'Item C', 25));

    const inOrder = tree.inOrderTraversal();
    expect(inOrder.map((n) => n.id)).toEqual(['SKU-A', 'SKU-B', 'SKU-C']);
  });
});
