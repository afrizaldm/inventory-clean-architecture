/**
 * PRODUCT STOCK REDUCED - Domain Event
 * 
 * Event ini terjadi ketika stok produk berkurang.
 * Dipublish setelah operasi reduceStock berhasil.
 * 
 * Domain Event adalah immutable record of fact - sesuatu yang sudah terjadi.
 */

import { DomainEvent } from '../../../../shared/kernel';

/**
 * ProductStockReduced Event
 * 
 * Dibuat ketika stok produk berhasil dikurangi.
 * Event ini bisa digunakan untuk:
 * - Update read model / cache
 * - Trigger notification
 * - Audit log
 * - Sync ke sistem lain
 */
export class ProductStockReduced implements DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;

  constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly oldStock: number,
    public readonly newStock: number,
    public readonly reducedQuantity: number
  ) {
    this.occurredOn = new Date();
    this.eventId = `product-stock-reduced-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
