/**
 * PRODUCT REPOSITORY INTERFACE
 * 
 * Interface repository untuk Product entity.
 * Didefinisikan di domain layer sebagai abstraction.
 * 
 * Implementation sebenarnya ada di infrastructure layer.
 * Ini adalah contoh Dependency Inversion Principle:
 * - Domain TIDAK bergantung pada Infrastructure
 * - Infrastructure bergantung pada Domain (implement interface ini)
 */

import { Repository } from '../../../../shared/kernel';
import { Product, ProductId } from '../entities/product';

/**
 * IProductRepository
 * 
 * Contract untuk operasi persistence Product.
 * Interface ini TIDAK tahu tentang database atau storage mechanism.
 */
export interface IProductRepository extends Repository<Product, ProductId> {
  /**
   * Find product by name
   */
  findByName(name: string): Promise<Product | null>;

  /**
   * Check if product exists by ID
   */
  existsById(id: ProductId): Promise<boolean>;
}
