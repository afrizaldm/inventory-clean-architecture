import { IEventHandler } from '../../../../types';
import { OrderCreated } from '../../domain/events/OrderCreated';
import { ILogger } from '../../../../shared/infrastructure/services/Logger';

/**
 * Event Handler: OrderCreatedHandler
 * 
 * Handler ini merespon event OrderCreated.
 * Bisa digunakan untuk:
 * - Mengirim email konfirmasi ke customer
 * - Notifikasi ke tim fulfillment
 * - Update analytics
 * - Trigger workflow lain
 */
export class OrderCreatedHandler implements IEventHandler<OrderCreated> {
  /**
   * Constructor dengan dependency injection
   * @param logger - Logger untuk logging event
   */
  constructor(private logger: ILogger) {}

  /**
   * Handle event OrderCreated
   * 
   * @param event - Event object yang mengandung informasi tentang order yang dibuat
   */
  handle(event: OrderCreated): void {
    // Log informasi lengkap tentang order
    this.logger.info(
      `Order created: ${event.orderId} for customer ${event.customerId}`,
      { 
        orderId: event.orderId,
        customerId: event.customerId,
        totalAmount: event.totalAmount / 100, // Konversi ke format desimal
        itemCount: event.items.length,
        items: event.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        timestamp: event.occurredAt.toISOString()
      }
    );

    // Di sini Anda bisa menambahkan logic lain seperti:
    // - Kirim email konfirmasi
    // - Notifikasi ke warehouse
    // - Update dashboard sales
    // - Trigger fraud detection
  }
}
