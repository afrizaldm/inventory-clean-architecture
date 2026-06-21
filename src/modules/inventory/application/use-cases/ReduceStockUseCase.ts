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
import { ProductStockReduced } from '../../domain/events/ProductStockReduced';
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
export class ReduceStockUseCase implements IUseCase<ReduceStockRequest, ReduceStockResponse> {
  /**
   * Constructor dengan dependency injection
   * @param productRepository - Repository untuk persist product
   * @param eventBus - Event bus untuk publish domain events
   * 
   * CATATAN: Use case ini butuh 2 dependencies:
   * 1. IProductRepository - untuk akses data
   * 2. IEventBus - untuk publish events
   */
  constructor(
    private productRepository: IProductRepository,
    private eventBus: IEventBus
  ) {}

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
  async execute(request: ReduceStockRequest): Promise<ReduceStockResponse> {
    try {
      // ========== STEP 1: Validasi Input ==========
      if (request.amount <= 0) {
        return {
          success: false,
          message: 'Reduction amount must be greater than 0'
        };
      }

      // ========== STEP 2: Fetch Product ==========
      const product = await this.productRepository.findById(request.productId);
      if (!product) {
        return {
          success: false,
          message: `Product with ID ${request.productId} not found`
        };
      }

      // Simpan stock sebelum perubahan untuk event
      const previousQuantity = product.quantity.value;

      // ========== STEP 3: Reduce Stock di Entity ==========
      // Entity yang melakukan validasi business rule
      const success = product.reduceStock(request.amount);
      
      if (!success) {
        // Stock tidak cukup
        return {
          success: false,
          message: `Insufficient stock for product ${request.productId}. Required: ${request.amount}, Available: ${previousQuantity}`
        };
      }

      // ========== STEP 4: Update Repository ==========
      await this.productRepository.update(product);

      // ========== STEP 5: Publish Domain Event ==========
      // Buat event dengan data lengkap untuk audit trail
      const event = new ProductStockReduced({
        productId: product.id,
        oldQuantity: previousQuantity,
        newQuantity: product.quantity.value,
        reducedBy: request.amount
      });

      // Publish ke event bus - semua subscribed handlers akan dipanggil
      this.eventBus.publish(event);

      // ========== STEP 6: Return Success Response ==========
      return {
        success: true,
        message: 'Stock reduced successfully',
        previousQuantity,
        newQuantity: product.quantity.value
      };
    } catch (error: any) {
      // Handle unexpected errors
      return {
        success: false,
        message: `Error reducing stock: ${error.message}`
      };
    }
  }
}
