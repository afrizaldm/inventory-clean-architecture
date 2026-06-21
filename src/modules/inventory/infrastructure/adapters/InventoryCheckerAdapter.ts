import { IInventoryChecker } from '../../contracts/IInventoryChecker';
import { IProductRepository } from '../../../inventory/domain/repositories/IProductRepository';

/**
 * Adapter: InventoryCheckerAdapter
 * 
 * Kelas ini adalah ADAPTER yang mengimplementasikan interface IInventoryChecker
 * (yang dibutuhkan modul Order) dengan menggunakan ProductRepository dari modul Inventory.
 * 
 * Ini adalah contoh dari:
 * 1. Dependency Inversion Principle - Modul Order bergantung pada interface, bukan implementasi
 * 2. Adapter Pattern - Mengadaptasi ProductRepository untuk memenuhi kontrak IInventoryChecker
 * 3. Cross-module communication tanpa direct coupling
 * 
 * Wiring dilakukan di Composition Root (bootstrap/main.ts):
 * - Container.bind<IInventoryChecker>('IInventoryChecker').to(InventoryCheckerAdapter)
 */
export class InventoryCheckerAdapter implements IInventoryChecker {
  /**
   * Constructor dengan dependency injection
   * 
   * @param productRepository - Repository dari modul inventory
   * 
   * Perhatikan bahwa adapter ini berada di modul inventory, bukan order.
   * Ini karena adapter perlu mengakses implementation detail dari inventory module.
   */
  constructor(private productRepository: IProductRepository) {}

  /**
   * Mengecek stock produk
   * 
   * Implementasi ini menggunakan ProductRepository untuk mendapatkan
   * informasi stock dari produk tertentu.
   * 
   * @param productId - ID produk yang akan dicek
   * @returns Jumlah stock tersedia (0 jika produk tidak ditemukan)
   */
  async checkStock(productId: string): Promise<number> {
    // Ambil produk dari repository
    const product = await this.productRepository.findById(productId);
    
    // Jika produk tidak ditemukan, kembalikan 0
    if (!product) {
      return 0;
    }
    
    // Kembalikan quantity saat ini
    return product.quantity.value;
  }
}
