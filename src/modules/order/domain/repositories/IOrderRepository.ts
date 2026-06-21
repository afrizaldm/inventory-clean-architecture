/**
 * ============================================================================
 * ORDER MODULE - IOrderRepository Interface
 * ============================================================================
 * Repository interface untuk Order entity.
 * 
 * INI ADALAH PORT dalam Hexagonal Architecture:
 * - Domain layer mendefinisikan kontrak
 * - Infrastructure layer menyediakan implementasi
 */

import { Order } from '@/modules/order/domain/entities/order';

/**
 * Order Repository Interface
 * Kontrak untuk semua operasi persistence Order
 */
export interface IOrderRepository {
  /**
   * Cari order berdasarkan ID
   * @param id - ID unik order
   * @returns Order jika ditemukan, null jika tidak ada
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Simpan order baru ke storage
   * @param order - Order entity yang akan disimpan
   */
  save(order: Order): Promise<void>;
}
