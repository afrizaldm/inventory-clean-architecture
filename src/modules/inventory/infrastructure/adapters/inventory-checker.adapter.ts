/**
 * INVENTORY CHECKER ADAPTER
 * 
 * Implementasi dari IInventoryChecker interface.
 * Adapter ini menghubungkan modul Order dengan Inventory module.
 * 
 * Ini adalah contoh dari Hexagonal Architecture:
 * - Modul Order membutuhkan cara untuk cek stok
 * - Inventory module menyediakan adapter yang implement interface
 * - Wiring dilakukan di Composition Root, bukan di dalam modul
 */

import { IInventoryChecker, StockCheckResult } from '../../contracts/i-inventory-checker';
import { IProductRepository } from '../../domain/repositories/i-product-repository';

/**
 * InventoryCheckerAdapter
 * 
 * Adapter yang mengimplementasikan IInventoryChecker.
 * Menggunakan internal repository dari Inventory module.
 */
export class InventoryCheckerAdapter implements IInventoryChecker {
  constructor(private productRepository: IProductRepository) {}

  /**
   * Check stock availability for a product
   * 
   * @param productId - ID produk yang dicek
   * @param quantity - Jumlah yang dibutuhkan
   * @returns StockCheckResult dengan info ketersediaan
   */
  async checkStock(productId: string, quantity: number): Promise<StockCheckResult> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return {
        productId,
        productName: 'Unknown',
        available: false,
        currentStock: 0,
        requestedQuantity: quantity,
      };
    }

    const isAvailable = product.stock.toNumber() >= quantity;

    return {
      productId,
      productName: product.name,
      available: isAvailable,
      currentStock: product.stock.toNumber(),
      requestedQuantity: quantity,
    };
  }

  /**
   * Get product name by ID
   */
  async getProductName(productId: string): Promise<string | null> {
    const product = await this.productRepository.findById(productId);
    return product ? product.name : null;
  }
}
