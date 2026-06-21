import { IInventoryChecker } from '@/modules/order/contracts/IInventoryChecker';
import { IProductRepository } from '@/modules/inventory/domain/repositories/IProductRepository';

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
   * @param productRepository - Repository untuk akses data produk
   */
  constructor(private productRepository: IProductRepository) {}

  /**
   * Cek stock produk
   * @param productId - ID produk yang dicek
   * @returns Jumlah stock tersedia (0 jika produk tidak ditemukan)
   * 
   * CATATAN:
   * - Return 0 jika produk tidak ditemukan (bukan throw error)
   * - Ini adalah query operation (read-only)
   */
  async checkStock(productId: string): Promise<number> {
    const product = await this.productRepository.findById(productId);
    
    // Jika produk tidak ada, return 0
    if (!product) {
      return 0;
    }
    
    // Kembalikan quantity saat ini
    return product.stock.toNumber();
  }
}
