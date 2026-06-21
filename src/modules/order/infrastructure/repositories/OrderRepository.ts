import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order';

/**
 * In-memory storage untuk Order
 * Menggunakan Map dengan ID sebagai key
 */
const ordersStorage: Map<string, Order> = new Map();

/**
 * Implementation: OrderRepository
 * 
 * Implementasi repository untuk Order menggunakan in-memory storage.
 * Sama seperti ProductRepository, ini bisa diganti dengan database implementation
 * tanpa mengubah domain layer.
 */
export class OrderRepository implements IOrderRepository {
  /**
   * Mencari Order berdasarkan ID
   * @param id - ID unik order
   * @returns Order jika ditemukan, null jika tidak
   */
  async findById(id: string): Promise<Order | null> {
    return ordersStorage.get(id) || null;
  }

  /**
   * Menyimpan Order baru ke storage
   * @param order - Order entity yang akan disimpan
   */
  async save(order: Order): Promise<void> {
    ordersStorage.set(order.id, order);
  }
}
