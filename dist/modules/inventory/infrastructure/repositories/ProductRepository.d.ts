/**
 * ============================================================================
 * INVENTORY MODULE - ProductRepository Implementation
 * ============================================================================
 * Implementasi in-memory dari IProductRepository.
 *
 * INI ADALAH DRIVEN ADAPTER dalam Hexagonal Architecture:
 * - Driven Adapter = Implementasi konkret dari Port (interface)
 * - Di-trigger oleh domain/application layer
 * - Bisa diganti dengan implementasi lain (TypeORM, Prisma, MongoDB, dll)
 *
 * UNTUK DEMO: Menggunakan Map sebagai in-memory storage
 * PRODUCTION: Ganti dengan database repository yang sebenarnya
 */
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
/**
 * ProductRepository Class
 * Implementasi konkret dari IProductRepository
 */
export declare class ProductRepository implements IProductRepository {
    /**
     * Cari product berdasarkan ID
     * @param id - ID unik product
     * @returns Product jika ditemukan, null jika tidak
     *
     * KOMPLEKSITAS: O(1) - Map lookup
     */
    findById(id: string): Promise<Product | null>;
    /**
     * Simpan product baru
     * @param product - Product entity yang akan disimpan
     *
     * CATATAN:
     * - Jika product dengan ID sama sudah ada, akan di-overwrite
     * - Untuk production, mungkin perlu validasi dan throw error jika duplicate
     */
    save(product: Product): Promise<void>;
    /**
     * Update product yang sudah ada
     * @param product - Product entity dengan data yang diupdate
     *
     * CATATAN:
     * - Sama seperti save(), menggunakan Map.set()
     * - Untuk production, mungkin perlu cek apakah product sudah ada sebelum update
     */
    update(product: Product): Promise<void>;
    /**
     * UTILITY METHOD (tidak ada di interface)
     * Clear semua data - berguna untuk testing
     */
    clear(): Promise<void>;
    /**
     * UTILITY METHOD (tidak ada di interface)
     * Get semua products - berguna untuk debugging
     */
    findAll(): Promise<Product[]>;
}
//# sourceMappingURL=ProductRepository.d.ts.map