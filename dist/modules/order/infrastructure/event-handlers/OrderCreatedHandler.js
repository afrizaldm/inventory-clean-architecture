"use strict";
/**
 * ============================================================================
 * ORDER MODULE - OrderCreatedHandler
 * ============================================================================
 * Event Handler untuk OrderCreated domain event.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedHandler = void 0;
/**
 * OrderCreatedHandler Class
 * Menangani event OrderCreated
 */
class OrderCreatedHandler {
    /**
     * Constructor dengan dependency injection
     * @param logger - Logger untuk mencatat event
     */
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Handle event OrderCreated
     * @param event - Event yang diterima
     */
    handle(event) {
        this.logger.info(`Order created: ${event.orderId} for customer ${event.customerId}`, {
            orderId: event.orderId,
            customerId: event.customerId,
            totalAmount: event.totalAmount / 100, // Convert dari sen ke Rupiah
            itemCount: event.items.length,
            items: event.items.map(item => `${item.productName} x${item.quantity}`),
            timestamp: event.occurredAt.toISOString()
        });
        // Contoh: Di sini bisa ditambahkan logic lain
        // - Kirim email konfirmasi
        // - Update analytics
        // - Trigger fulfillment process
    }
}
exports.OrderCreatedHandler = OrderCreatedHandler;
//# sourceMappingURL=OrderCreatedHandler.js.map