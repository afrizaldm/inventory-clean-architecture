/**
 * ============================================================================
 * INVENTORY MODULE - CreateProductUseCase
 * ============================================================================
 * Use Case untuk membuat product baru.
 *
 * USE CASE / APPLICATION SERVICE:
 * - Mengenkapsulasi satu unit of work bisnis
 * - Orkestrasi antara entities, value objects, dan repositories
 * - TIDAK mengandung business logic (itu tugas domain entities)
 * - Hanya bergantung pada interfaces dari domain layer
 *
 * COMMAND PATTERN:
 * - Request = Command (CreateProductRequest)
 * - Response = Result (CreateProductResponse)
 */
import { IUseCase } from '../../../../types';
import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
/**
 * Input DTO untuk CreateProductUseCase
 * Data yang dibutuhkan untuk membuat product baru
 */
export interface CreateProductRequest {
    /** ID unik product (harus unique) */
    id: string;
    /** Nama product */
    name: string;
    /** Harga dalam format desimal (Rupiah), contoh: 10000.50 */
    price: number;
    /** Stock awal */
    initialStock: number;
}
/**
 * Output DTO untuk CreateProductUseCase
 * Result dari operasi create product
 */
export interface CreateProductResponse {
    /** Apakah operasi berhasil */
    success: boolean;
    /** Pesan hasil operasi */
    message: string;
    /** Product yang dibuat (jika berhasil) */
    product?: Product;
}
/**
 * CreateProductUseCase Class
 * Responsible untuk orchestrasi pembuatan product baru
 */
export declare class CreateProductUseCase implements IUseCase<CreateProductRequest, CreateProductResponse> {
    private productRepository;
    /**
     * Constructor dengan dependency injection
     * @param productRepository - Repository untuk persist product
     *
     * CATATAN: Hanya bergantung pada INTERFACE, bukan implementation
     * Ini memungkinkan kita mengganti implementasi repository tanpa mengubah use case
     */
    constructor(productRepository: IProductRepository);
    /**
     * Eksekusi use case
     * @param request - Input data untuk create product
     * @returns Response dengan status dan result
     *
     * FLOW:
     * 1. Validasi input data
     * 2. Cek apakah product sudah ada
     * 3. Buat entity Product baru
     * 4. Simpan ke repository
     * 5. Return response
     */
    execute(request: CreateProductRequest): Promise<CreateProductResponse>;
}
//# sourceMappingURL=CreateProductUseCase.d.ts.map