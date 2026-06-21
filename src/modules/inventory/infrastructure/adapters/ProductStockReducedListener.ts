/**
 * PRODUCT STOCK REDUCED EVENT LISTENER
 * 
 * Driven Adapter yang mendengarkan domain events.
 * Ketika ProductStockReduced event terjadi, listener ini akan:
 * - Log event untuk audit/monitoring
 * - Bisa ditambahkan logic lain (send notification, update cache, dll)
 * 
 * Ini adalah contoh dari Event-Driven Architecture dalam Hexagonal Architecture.
 */

import { EventHandler } from '@/shared/kernel';
import { ProductStockReduced } from '@/modules/inventory/domain/events/ProductStockReduced';
import { ILogger } from '@/shared/infrastructure/services/Logger';

/**
 * ProductStockReducedListener
 * 
 * Listener yang menangani ProductStockReduced events.
 * Dipasang ke Event Bus di Composition Root.
 */
export class ProductStockReducedListener implements EventHandler<ProductStockReduced> {
  constructor(private logger: ILogger) {}

  /**
   * Handle the ProductStockReduced event
   * 
   * Method ini dipanggil otomatis oleh Event Bus ketika event dipublish.
   */
  async handle(event: ProductStockReduced): Promise<void> {
    this.logger.info(
      `📦 STOCK REDUCED EVENT: "${event.productId}" stock reduced from ${event.oldQuantity} to ${event.newQuantity} (-${event.reducedBy})`,
      {
        productId: event.productId,
        oldQuantity: event.oldQuantity,
        newQuantity: event.newQuantity,
        reducedBy: event.reducedBy,
        occurredAt: event.occurredAt,
      }
    );

    // Di sini bisa ditambahkan logic lain seperti:
    // - Send notification to warehouse team
    // - Update read model / cache
    // - Trigger reorder if stock is low
    // - Audit logging ke database
    // - Sync ke external inventory system
  }
}
