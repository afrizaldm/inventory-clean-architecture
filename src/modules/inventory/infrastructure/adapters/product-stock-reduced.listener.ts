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

import { EventHandler } from '../../../../shared/kernel';
import { ProductStockReduced } from '../../domain/events/product-stock-reduced';
import { Logger } from '../../../../shared/kernel';

/**
 * ProductStockReducedListener
 * 
 * Listener yang menangani ProductStockReduced events.
 * Dipasang ke Event Bus di Composition Root.
 */
export class ProductStockReducedListener implements EventHandler<ProductStockReduced> {
  constructor(private logger: Logger) {}

  /**
   * Handle the ProductStockReduced event
   * 
   * Method ini dipanggil otomatis oleh Event Bus ketika event dipublish.
   */
  async handle(event: ProductStockReduced): Promise<void> {
    this.logger.info(
      `📦 STOCK REDUCED EVENT: "${event.productName}" stock reduced from ${event.oldStock} to ${event.newStock} (-${event.reducedQuantity})`,
      {
        eventId: event.eventId,
        productId: event.productId,
        occurredOn: event.occurredOn,
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
