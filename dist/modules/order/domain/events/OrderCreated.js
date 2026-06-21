"use strict";
/**
 * ============================================================================
 * ORDER MODULE - OrderCreated Domain Event
 * ============================================================================
 * Domain Event yang dipublish ketika order berhasil dibuat.
 *
 * EVENT INI DIPUBLISH SETELAH:
 * 1. Order entity dibuat dan disimpan
 * 2. Stock produk dikurangi (via ReduceStockUseCase)
 *
 * PENGGUNAAN EVENT INI:
 * - Log audit trail
 * - Kirim email konfirmasi ke customer
 * - Update analytics dashboard
 * - Trigger fulfillment process
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreated = void 0;
/**
 * OrderCreated Event Class
 * Dipublish setiap kali order berhasil dibuat
 */
class OrderCreated {
    /**
     * Constructor event
     * @param data - Data event yang diperlukan
     */
    constructor(data) {
        this.orderId = data.orderId;
        this.customerId = data.customerId;
        // Buat copy array untuk prevent external mutation
        this.items = [...data.items];
        this.totalAmount = data.totalAmount;
        this.occurredAt = new Date();
    }
}
exports.OrderCreated = OrderCreated;
//# sourceMappingURL=OrderCreated.js.map