"use strict";
/**
 * ============================================================================
 * INVENTORY MODULE - InventoryCheckerAdapter
 * ============================================================================
 * Adapter yang mengimplementasi IInventoryChecker untuk modul Order.
 *
 * INI ADALAH CONTOH KOMUNIKASI ANTAR MODUL:
 * 1. File ini ada di modul INVENTORY
 * 2. Mengimplementasi interface IInventoryChecker dari modul ORDER
 * 3. Menggunakan IProductRepository dari modul INVENTORY
 * 4. Wiring dilakukan di Composition Root
 *
 * POLA: Dependency Inversion Principle
 * - Order module bergantung pada abstraksi (IInventoryChecker)
 * - Inventory module menyediakan implementasi (InventoryCheckerAdapter)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryCheckerAdapter = void 0;
/**
 * InventoryCheckerAdapter Class
 * Implementasi IInventoryChecker menggunakan ProductRepository
 */
class InventoryCheckerAdapter {
    /**
     * Constructor dengan dependency injection
     * @param productRepository - Repository untuk akses data produk
     */
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    /**
     * Cek stock produk
     * @param productId - ID produk yang dicek
     * @returns Jumlah stock tersedia (0 jika produk tidak ditemukan)
     *
     * CATATAN:
     * - Return 0 jika produk tidak ditemukan (bukan throw error)
     * - Ini adalah query operation (read-only)
     */
    async checkStock(productId) {
        const product = await this.productRepository.findById(productId);
        // Jika produk tidak ada, return 0
        if (!product) {
            return 0;
        }
        // Return quantity saat ini
        return product.quantity.value;
    }
}
exports.InventoryCheckerAdapter = InventoryCheckerAdapter;
//# sourceMappingURL=InventoryCheckerAdapter.js.map