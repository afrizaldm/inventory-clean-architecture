/**
 * ============================================================================
 * SHARED KERNEL - IRepository
 * ============================================================================
 * Interface repository generic yang digunakan sebagai kontrak untuk semua repository.
 * Ini adalah bagian dari domain layer dan TIDAK boleh bergantung pada infrastruktur.
 * 
 * PRINSIP: Dependency Inversion Principle (DIP)
 * - High-level modules (domain) tidak bergantung pada low-level modules (infrastructure)
 * - Keduanya bergantung pada abstraksi (interface ini)
 */

/**
 * Generic Repository Interface
 * @template T - Tipe entity yang akan direpository
 */
export interface IRepository<T> {
  /**
   * Cari entity berdasarkan ID
   * @param id - Identifier unik dari entity
   * @returns Entity jika ditemukan, null jika tidak
   */
  findById(id: string): Promise<T | null>;

  /**
   * Simpan entity baru ke storage
   * @param entity - Entity yang akan disimpan
   */
  save(entity: T): Promise<void>;

  /**
   * Update entity yang sudah ada
   * @param entity - Entity dengan data yang diupdate
   */
  update(entity: T): Promise<void>;
}
