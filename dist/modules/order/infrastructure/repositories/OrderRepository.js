"use strict";
/**
 * ============================================================================
 * ORDER MODULE - OrderRepository Implementation
 * ============================================================================
 * Implementasi in-memory dari IOrderRepository.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
/**
 * In-memory storage untuk orders
 */
const ordersStorage = new Map();
/**
 * OrderRepository Class
 * Implementasi konkret dari IOrderRepository
 */
class OrderRepository {
    /**
     * Cari order berdasarkan ID
     */
    async findById(id) {
        return ordersStorage.get(id) || null;
    }
    /**
     * Simpan order baru
     */
    async save(order) {
        ordersStorage.set(order.id, order);
        console.log(`[OrderRepository] Saved order: ${order.id} for customer ${order.customerId}`);
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=OrderRepository.js.map