/**
 * ============================================================================
 * INVENTORY MODULE - ReduceStockUseCase
 * ============================================================================
 * Use Case untuk mengurangi stock produk.
 *
 * PENTING: Use case ini mempublish Domain Event setelah stock berkurang.
 * Ini adalah contoh bagaimana domain events digunakan untuk komunikasi loose-coupling.
 *
 * FLOW:
 * 1. Validasi input
 * 2. Ambil product dari repository
 * 3. Kurangi stock di entity
 * 4. Update repository
 * 5. Publish event ProductStockReduced
 */
import { IUseCase } from '../../../../types';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IEventBus } from '../../../../shared/kernel/IEventBus';
/**
 * Input DTO untuk ReduceStockUseCase
 */
export interface ReduceStockRequest {
    /** ID produk yang stock-nya akan dikurangi */
    productId: string;
    /** Jumlah stock yang dikurangi */
    amount: number;
}
/**
 * Output DTO untuk ReduceStockUseCase
 */
export interface ReduceStockResponse {
    /** Apakah operasi berhasil */
    success: boolean;
    /** Pesan hasil operasi */
    message: string;
    /** Stock sebelum dikurangi (jika ada) */
    previousQuantity?: number;
    /** Stock setelah dikurangi (jika ada) */
    newQuantity?: number;
}
/**
 * ReduceStockUseCase Class
 * Responsible untuk orchestrasi pengurangan stock
 */
export declare class ReduceStockUseCase implements IUseCase<ReduceStockRequest, ReduceStockResponse> {
    private productRepository;
    private eventBus;
    /**
     * Constructor dengan dependency injection
     * @param productRepository - Repository untuk persist product
     * @param eventBus - Event bus untuk publish domain events
     *
     * CATATAN: Use case ini butuh 2 dependencies:
     * 1. IProductRepository - untuk akses data
     * 2. IEventBus - untuk publish events
     */
    constructor(productRepository: IProductRepository, eventBus: IEventBus);
    /**
     * Eksekusi use case
     * @param request - Input data untuk reduce stock
     * @returns Response dengan status dan result
     *
     * FLOW DETAIL:
     * 1. Validasi amount harus positif
     * 2. Fetch product dari repository
     * 3. Panggil method reduceStock() di entity
     * 4. Jika gagal (stock tidak cukup), return error
     * 5. Jika berhasil, update repository
     * 6. Publish domain event
     */
    execute(request: ReduceStockRequest): Promise<ReduceStockResponse>;
}
//# sourceMappingURL=ReduceStockUseCase.d.ts.map