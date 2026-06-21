/**
 * ============================================================================
 * ORDER MODULE - OrderCreatedHandler
 * ============================================================================
 * Event Handler untuk OrderCreated domain event.
 */
import { IEventHandler } from '../../../../types';
import { OrderCreated } from '../../domain/events/OrderCreated';
import { ILogger } from '../../../../shared/infrastructure/services/Logger';

/**
 * OrderCreatedHandler Class
 * Menangani event OrderCreated
 */
export class OrderCreatedHandler implements IEventHandler<OrderCreated> {
  /**
   * Constructor dengan dependency injection
   * @param logger - Logger untuk mencatat event
   */
  constructor(private logger: ILogger) {}

  /**
   * Handle event OrderCreated
   * @param event - Event yang diterima
   */
  handle(event: OrderCreated): void {
    this.logger.info(
      `Order created: ${event.orderId} for customer ${event.customerId}`,
      { 
        orderId: event.orderId,
        customerId: event.customerId,
        totalAmount: event.totalAmount / 100, // Convert dari sen ke Rupiah
        itemCount: event.items.length,
        items: event.items.map(item => `${item.productName} x${item.quantity}`),
        timestamp: event.occurredAt.toISOString()
      }
    );

    // Contoh: Di sini bisa ditambahkan logic lain
    // - Kirim email konfirmasi
    // - Update analytics
    // - Trigger fulfillment process
  }
}
