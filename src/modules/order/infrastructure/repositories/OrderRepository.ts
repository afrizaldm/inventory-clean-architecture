/**
 * ============================================================================
 * ORDER MODULE - OrderRepository Implementation
 * ============================================================================
 * Implementasi in-memory dari IOrderRepository.
 */

import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { Order } from '../domain/entities/Order';

/**
 * In-memory storage untuk orders
 */
const ordersStorage: Map<string, Order> = new Map();

/**
 * OrderRepository Class
 * Implementasi konkret dari IOrderRepository
 */
export class OrderRepository implements IOrderRepository {
  /**
   * Cari order berdasarkan ID
   */
  async findById(id: string): Promise<Order | null> {
    return ordersStorage.get(id) || null;
  }

  /**
   * Simpan order baru
   */
  async save(order: Order): Promise<void> {
    ordersStorage.set(order.id, order);
    console.log(`[OrderRepository] Saved order: ${order.id} for customer ${order.customerId}`);
  }
}
