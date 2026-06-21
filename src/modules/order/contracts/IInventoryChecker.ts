/**
 * Interface: IInventoryChecker
 * 
 * Interface ini didefinisikan di modul order untuk kebutuhan modul order
 * mengecek stock di modul inventory.
 * 
 * Ini adalah contoh dari Dependency Inversion Principle dalam Modular Monolith:
 * - Modul Order TIDAK langsung bergantung pada modul Inventory
 * - Modul Order hanya bergantung pada interface ini
 * - Implementasi konkret disediakan oleh modul Inventory
 * 
 * Interface ini seharusnya ada di folder contracts/ modul order karena
 * ini adalah "kontrak" yang dibutuhkan modul order dari modul lain.
 */
export interface IInventoryChecker {
  /**
   * Mengecek jumlah stock tersedia untuk produk tertentu
   * 
   * @param productId - ID produk yang akan dicek stock-nya
   * @returns Jumlah stock tersedia (0 jika produk tidak ditemukan)
   * 
   * Catatan: Interface ini tidak menentukan bagaimana cara cek stock,
   * itu adalah tanggung jawab implementasi di modul inventory.
   */
  checkStock(productId: string): Promise<number>;
}
