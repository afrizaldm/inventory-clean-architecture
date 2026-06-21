/**
 * IN-MEMORY PRODUCT REPOSITORY
 * 
 * Implementasi repository menggunakan in-memory storage.
 * Ini adalah Infrastructure layer - implementasi konkret dari interface domain.
 * 
 * Untuk demo/development, bisa diganti dengan database repository (TypeORM, Prisma, dll)
 * tanpa mengubah domain atau application layer.
 */

import { IProductRepository } from '../../domain/repositories/i-product-repository';
import { Product, ProductId } from '../../domain/entities/product';

/**
 * InMemoryProductRepository
 * 
 * Simple in-memory implementation untuk demo purposes.
 * Dalam production, ini bisa diganti dengan:
 * - TypeOrmProductRepository
 * - PrismaProductRepository
 * - MongoProductRepository
 * dll tanpa mengubah business logic.
 */
export class InMemoryProductRepository implements IProductRepository {
  private storage: Map<ProductId, Product> = new Map();

  /**
   * Find product by ID
   */
  async findById(id: ProductId): Promise<Product | null> {
    const product = this.storage.get(id);
    return product || null;
  }

  /**
   * Find all products
   */
  async findAll(): Promise<Product[]> {
    return Array.from(this.storage.values());
  }

  /**
   * Find product by name (case insensitive)
   */
  async findByName(name: string): Promise<Product | null> {
    const lowerName = name.toLowerCase();
    for (const product of this.storage.values()) {
      if (product.name.toLowerCase() === lowerName) {
        return product;
      }
    }
    return null;
  }

  /**
   * Save or update product
   */
  async save(product: Product): Promise<void> {
    this.storage.set(product.id, product);
  }

  /**
   * Delete product by ID
   */
  async delete(id: ProductId): Promise<void> {
    this.storage.delete(id);
  }

  /**
   * Check if product exists by ID
   */
  async existsById(id: ProductId): Promise<boolean> {
    return this.storage.has(id);
  }

  /**
   * Clear all products (untuk testing)
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Get count of products (untuk testing/debugging)
   */
  count(): number {
    return this.storage.size;
  }
}
