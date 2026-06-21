/**
 * Interface umum untuk Repository pattern
 * 
 * Repository adalah abstraction layer antara domain layer dan data layer.
 * Domain layer hanya bergantung pada interface ini, bukan implementasi konkretnya.
 * Ini adalah implementasi dari Dependency Inversion Principle (SOLID-D).
 * 
 * @template T - Tipe entity yang akan direpository
 */
export interface IRepository<T> {
  /**
   * Mencari entity berdasarkan ID
   * @param id - Identifier unik dari entity
   * @returns Entity jika ditemukan, null jika tidak
   */
  findById(id: string): Promise<T | null>;
  
  /**
   * Menyimpan entity baru ke storage
   * @param entity - Entity yang akan disimpan
   */
  save(entity: T): Promise<void>;
  
  /**
   * Mengupdate entity yang sudah ada di storage
   * @param entity - Entity yang akan diupdate
   */
  update(entity: T): Promise<void>;
}
