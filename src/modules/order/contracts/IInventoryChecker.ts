/**
 * ============================================================================
 * ORDER MODULE - IInventoryChecker Contract
 * ============================================================================
 * Interface untuk mengecek stock dari modul Inventory.
 * 
 * PENTING: File ini ada di modul ORDER, tapi interface-nya akan diimplementasi
 * oleh modul INVENTORY. Ini adalah contoh Dependency Inversion Principle.
 * 
 * CARA KERJA KOMUNIKASI ANTAR MODUL:
 * 1. Order module mendefinisikan KEBUTUHAN (interface ini)
 * 2. Inventory module menyediakan IMPLEMENTASI (InventoryCheckerAdapter)
 * 3. Composition Root melakukan WIRING (binding interface ke implementasi)
 * 
 * HASIL: Order module TIDAK langsung bergantung pada Inventory module!
 */

/**
 * IInventoryChecker Interface
 * Kontrak untuk mengecek ketersediaan stock
 */
export interface IInventoryChecker {
  /**
   * Cek stock produk tertentu
   * @param productId - ID produk yang dicek
   * @returns Jumlah stock yang tersedia (0 jika produk tidak ditemukan)
   * 
   * CATATAN:
   * - Return 0 jika produk tidak ditemukan (bukan throw error)
   * - Ini adalah query operation (tidak mengubah state)
   */
  checkStock(productId: string): Promise<number>;
}
