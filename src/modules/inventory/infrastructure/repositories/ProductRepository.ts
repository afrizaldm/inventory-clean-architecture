/**
 * ============================================================================
 * INVENTORY MODULE - ProductRepository Implementation
 * ============================================================================
 * Implementasi in-memory dari IProductRepository.
 * 
 * INI ADALAH DRIVEN ADAPTER dalam Hexagonal Architecture:
 * - Driven Adapter = Implementasi konkret dari Port (interface)
 * - Di-trigger oleh domain/application layer
 * - Bisa diganti dengan implementasi lain (TypeORM, Prisma, MongoDB, dll)
 * 
 * UNTUK DEMO: Menggunakan Map sebagai in-memory storage
 * PRODUCTION: Ganti dengan database repository yang sebenarnya
 */

import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

/**
 * In-memory storage menggunakan Map
 * Key: product ID (string)
 * Value: Product entity
 * 
 * CATATAN: Data akan hilang saat aplikasi restart
 * Ini hanya untuk demo/development
 */
const productsStorage: Map<string, Product> = new Map();

/**
 * ProductRepository Class
 * Implementasi konkret dari IProductRepository
 */
export class ProductRepository implements IProductRepository {
  /**
   * Cari product berdasarkan ID
   * @param id - ID unik product
   * @returns Product jika ditemukan, null jika tidak
   * 
   * KOMPLEKSITAS: O(1) - Map lookup
   */
  async findById(id: string): Promise<Product | null> {
    // Map.get() return undefined jika key tidak ada
    // Kita convert ke null untuk konsistensi dengan interface
    return productsStorage.get(id) || null;
  }

  /**
   * Simpan product baru
   * @param product - Product entity yang akan disimpan
   * 
   * CATATAN:
   * - Jika product dengan ID sama sudah ada, akan di-overwrite
   * - Untuk production, mungkin perlu validasi dan throw error jika duplicate
   */
  async save(product: Product): Promise<void> {
    productsStorage.set(product.id, product);
    console.log(`[ProductRepository] Saved product: ${product.id} (${product.name})`);
  }

  /**
   * Update product yang sudah ada
   * @param product - Product entity dengan data yang diupdate
   * 
   * CATATAN:
   * - Sama seperti save(), menggunakan Map.set()
   * - Untuk production, mungkin perlu cek apakah product sudah ada sebelum update
   */
  async update(product: Product): Promise<void> {
    productsStorage.set(product.id, product);
    console.log(`[ProductRepository] Updated product: ${product.id}`);
  }

  /**
   * UTILITY METHOD (tidak ada di interface)
   * Clear semua data - berguna untuk testing
   */
  async clear(): Promise<void> {
    productsStorage.clear();
    console.log('[ProductRepository] Cleared all products');
  }

  /**
   * UTILITY METHOD (tidak ada di interface)
   * Get semua products - berguna untuk debugging
   */
  async findAll(): Promise<Product[]> {
    return Array.from(productsStorage.values());
  }
}
