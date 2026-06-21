import { IEventHandler } from '@/types';
import { ProductStockReduced } from '@/modules/inventory/domain/events/ProductStockReduced';
import { ILogger } from '@/shared/infrastructure/services/Logger';

/**
 * Event Handler: ProductStockReducedHandler
 * 
 * Handler ini bertanggung jawab untuk merespon event ProductStockReduced.
 * Handler berada di Infrastructure Layer karena melakukan side effects
 * seperti logging, notification, dll.
 * 
 * Handler TIDAK mengubah state domain, hanya merespon event yang sudah terjadi.
 * 
 * Contoh penggunaan handler:
 * - Logging untuk audit trail
 * - Mengirim notifikasi ke warehouse
 * - Update cache
 * - Trigger reordering jika stock rendah
 */
export class ProductStockReducedHandler implements IEventHandler<ProductStockReduced> {
  /**
   * Constructor dengan dependency injection
   * @param logger - Logger untuk logging event
   */
  constructor(private logger: ILogger) {}

  /**
   * Handle event ProductStockReduced
   * 
   * Method ini dipanggil otomatis oleh Event Bus ketika event dipublish.
   * 
   * @param event - Event object yang mengandung informasi tentang stock reduction
   */
  handle(event: ProductStockReduced): void {
    // Log informasi lengkap tentang event
    this.logger.info(
      `Product stock reduced for ${event.productId}: ${event.oldQuantity} -> ${event.newQuantity} (-${event.reducedBy})`,
      { 
        productId: event.productId,
        oldQuantity: event.oldQuantity,
        newQuantity: event.newQuantity,
        reducedBy: event.reducedBy,
        timestamp: event.occurredAt.toISOString()
      }
    );

    // Di sini Anda bisa menambahkan logic lain seperti:
    // - Cek apakah stock mencapai threshold minimum
    // - Trigger auto-reorder
    // - Kirim notifikasi ke supplier
    // - Update analytics dashboard
    
    // Contoh: Log warning jika stock rendah
    if (event.newQuantity < 5) {
      this.logger.warn(`Low stock alert for product ${event.productId}!`);
    }
  }
}
