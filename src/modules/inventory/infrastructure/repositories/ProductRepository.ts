import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

/**
 * In-memory storage untuk Product
 * 
 * Menggunakan Map untuk menyimpan produk dengan ID sebagai key.
 * Ini adalah implementasi sederhana untuk demo/learning purposes.
 * 
 * Dalam production, ini akan diganti dengan implementasi database nyata
 * (PostgreSQL, MongoDB, dll) yang tetap mengimplementasikan interface
 * IProductRepository yang sama.
 */
const productsStorage: Map<string, Product> = new Map();

/**
 * Implementation: ProductRepository
 * 
 * Kelas ini adalah implementasi konkret dari IProductRepository.
 * Berada di Infrastructure Layer karena mengandung detail implementasi storage.
 * 
 * Perhatikan bahwa kelas ini:
 * - Mengimplementasikan interface dari Domain Layer
 * - Tidak mengubah interface domain
 * - Bisa diganti dengan implementasi lain (database) tanpa mengubah domain
 */
export class ProductRepository implements IProductRepository {
  /**
   * Mencari Product berdasarkan ID dari in-memory storage
   * 
   * @param id - ID unik produk
   * @returns Product jika ditemukan, null jika tidak
   * 
   * Catatan: Dalam implementasi database nyata, ini akan menjadi query SQL/NoSQL
   */
  async findById(id: string): Promise<Product | null> {
    // Ambil dari Map, kembalikan null jika tidak ada
    return productsStorage.get(id) || null;
  }

  /**
   * Menyimpan Product baru ke in-memory storage
   * 
   * @param product - Product entity yang akan disimpan
   * 
   * Catatan: Dalam implementasi database nyata, ini akan menjadi INSERT query
   */
  async save(product: Product): Promise<void> {
    // Simpan ke Map dengan ID sebagai key
    productsStorage.set(product.id, product);
  }

  /**
   * Mengupdate Product yang sudah ada di in-memory storage
   * 
   * @param product - Product entity yang akan diupdate
   * 
   * Catatan: Dalam implementasi database nyata, ini akan menjadi UPDATE query
   */
  async update(product: Product): Promise<void> {
    // Update di Map (set ulang dengan key yang sama)
    productsStorage.set(product.id, product);
  }
}
