import { Order } from '../entities/Order';

/**
 * Interface: IOrderRepository
 * 
 * Repository interface untuk Order entity.
 * Sama seperti IProductRepository, interface ini berada di Domain Layer
 * dan implementasinya ada di Infrastructure Layer.
 */
export interface IOrderRepository {
  /**
   * Mencari Order berdasarkan ID
   * @param id - ID unik order
   * @returns Order jika ditemukan, null jika tidak
   */
  findById(id: string): Promise<Order | null>;
  
  /**
   * Menyimpan Order baru ke storage
   * @param order - Order entity yang akan disimpan
   */
  save(order: Order): Promise<void>;
}
