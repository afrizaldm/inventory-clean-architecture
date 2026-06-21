export interface StockCheckResult {
  productId: string;
  productName: string;
  available: boolean;
  currentStock: number;
  requestedQuantity: number;
}

export interface IInventoryChecker {
  checkStock(productId: string, quantity: number): Promise<StockCheckResult>;
  getProductName(productId: string): Promise<string | null>;
}
