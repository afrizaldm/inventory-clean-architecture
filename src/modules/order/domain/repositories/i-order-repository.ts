/**
 * ORDER REPOSITORY INTERFACE
 * 
 * Interface repository untuk Order entity.
 * Didefinisikan di domain layer sebagai abstraction.
 */

import { Repository } from '../../../../shared/kernel';
import { Order, OrderId } from '../entities/order';

/**
 * IOrderRepository
 * 
 * Contract untuk operasi persistence Order.
 */
export interface IOrderRepository extends Repository<Order, OrderId> {
  /**
   * Find orders by status
   */
  findByStatus(status: string): Promise<Order[]>;
}
