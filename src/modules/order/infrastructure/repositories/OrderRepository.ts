import { IOrderRepository } from '@/modules/order/domain/repositories/IOrderRepository';
import { Order } from '@/modules/order/domain/entities/order';

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
