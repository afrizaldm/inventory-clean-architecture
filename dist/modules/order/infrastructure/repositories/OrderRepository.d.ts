/**
 * ============================================================================
 * ORDER MODULE - OrderRepository Implementation
 * ============================================================================
 * Implementasi in-memory dari IOrderRepository.
 */
import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { Order } from '../domain/entities/Order';
/**
 * OrderRepository Class
 * Implementasi konkret dari IOrderRepository
 */
export declare class OrderRepository implements IOrderRepository {
    /**
     * Cari order berdasarkan ID
     */
    findById(id: string): Promise<Order | null>;
    /**
     * Simpan order baru
     */
    save(order: Order): Promise<void>;
}
//# sourceMappingURL=OrderRepository.d.ts.map