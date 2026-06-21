import { Product } from "../entities/product";

/**
 * Interface: IProductRepository
 * 
 * Repository interface mendefinisikan kontrak untuk akses data Product.
 * Interface ini berada di Domain Layer, sehingga:
 * - TIDAK mengandung implementasi database
 * - TIDAK bergantung pada framework ORM
 * - Hanya mendefinisikan method yang diperlukan domain
 * 
 * Implementasi konkret (dengan database) akan ada di Infrastructure Layer
 * dan mengimplementasikan interface ini.
 * 
 * Ini adalah penerapan Dependency Inversion Principle:
 * - High-level module (Domain) tidak bergantung pada low-level module (Database)
 * - Keduanya bergantung pada abstraction (Interface ini)
 */
export interface IProductRepository {
  /**
   * Mencari Product berdasarkan ID
   * @param id - ID unik produk
   * @returns Product jika ditemukan, null jika tidak
   */
  findById(id: string): Promise<Product | null>;
  
  /**
   * Menyimpan Product baru ke storage
   * @param product - Product entity yang akan disimpan
   */
  save(product: Product): Promise<void>;
  
  /**
   * Meng-update Product yang sudah ada di storage
   * @param product - Product entity yang akan di update
   */
  update(product: Product): Promise<void>;
}
