/**
 * ============================================================================
 * INVENTORY MODULE - IProductRepository Interface
 * ============================================================================
 * Repository interface untuk Product entity.
 * 
 * PRINSIP: Dependency Inversion Principle (DIP)
 * - Domain layer mendefinisikan CONTRACT (interface ini)
 * - Infrastructure layer menyediakan IMPLEMENTATION
 * - Domain TIDAK TAHU tentang implementasi database
 * 
 * INI ADALAH PORT dalam Hexagonal Architecture
 * - Port = Abstraksi yang mendefinisikan bagaimana domain berinteraksi dengan dunia luar
 */

import { Product } from '../entities/Product';

/**
 * Product Repository Interface
 * Kontrak untuk semua operasi persistence Product
 */
export interface IProductRepository {
  /**
   * Cari product berdasarkan ID
   * @param id - ID unik product
   * @returns Product jika ditemukan, null jika tidak ada
   * 
   * CATATAN: Return type Promise<Product | null>
   * - Promise karena operasi async (database call)
   * - Null jika product tidak ditemukan (bukan throw error)
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Simpan product baru ke storage
   * @param product - Product entity yang akan disimpan
   * 
   * CATATAN: Method ini untuk CREATE operation
   * - Asumsi: product belum ada di storage
   * - Jika sudah ada, bisa throw error atau overwrite (tergantung implementasi)
   */
  save(product: Product): Promise<void>;

  /**
   * Update product yang sudah ada
   * @param product - Product entity dengan data yang diupdate
   * 
   * CATATAN: Method ini untuk UPDATE operation
   * - Asumsi: product sudah ada di storage
   * - Product harus memiliki ID yang valid
   */
  update(product: Product): Promise<void>;
}
