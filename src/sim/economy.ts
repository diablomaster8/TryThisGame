import type { Inventory } from './types';

export function addShells(inv: Inventory, amount: number): void {
  inv.shells = Math.max(0, inv.shells + amount);
}

export function canSpend(inv: Inventory, amount: number): boolean {
  return inv.shells >= amount;
}

export function spend(inv: Inventory, amount: number): boolean {
  if (!canSpend(inv, amount)) return false;
  inv.shells -= amount;
  return true;
}
