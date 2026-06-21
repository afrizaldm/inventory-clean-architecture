import { IUseCase } from '../../../../types';
import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductStockReduced } from '../../domain/events/ProductStockReduced';
import { IEventBus } from '../../../../shared/kernel/IEventBus';

/**
 * Interface untuk input/request ReduceStockUseCase
 */
export interface ReduceStockRequest {
  /** ID produk yang akan dikurangi stock-nya */
  productId: string;
  /** Jumlah stock yang akan dikurangi */
  amount: number;
}

/**
 * Interface untuk output/response ReduceStockUseCase
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
 * Use Case: ReduceStockUseCase
 * 
 * Use case ini bertanggung jawab untuk mengurangi stock produk.
 * Ini adalah contoh use case yang:
 * 1. Memodifikasi state entity
 * 2. Memicu Domain Event setelah perubahan
 * 
 * Alur:
 * 1. Validasi input
 * 2. Ambil product dari repository
 * 3. Kurangi stock menggunakan business logic di entity
 * 4. Update repository
 * 5. Publish event ProductStockReduced
 * 
 * Event publishing memungkinkan loose coupling:
 * - Use case tidak perlu tahu siapa yang handle event
 * - Handler lain bisa subscribe tanpa mengubah use case
 */
export class ReduceStockUseCase implements IUseCase<ReduceStockRequest, ReduceStockResponse> {
  /**
   * Constructor dengan dependency injection
   * 
   * @param productRepository - Repository untuk akses data product
   * @param eventBus - Event bus untuk publish domain events
   * 
   * EventBus di-inject agar use case bisa publish event tanpa
   * bergantung pada implementasi konkret event bus
   */
  constructor(
    private productRepository: IProductRepository,
    private eventBus: IEventBus
  ) {}

  /**
   * Execute use case ini dengan request yang diberikan
   * 
   * @param request - Data untuk mengurangi stock
   * @returns Response dengan status dan hasil operasi
   */
  async execute(request: ReduceStockRequest): Promise<ReduceStockResponse> {
    try {
      // ============================================
      // STEP 1: Validasi input
      // ============================================
      
      // Validasi: Jumlah pengurangan harus lebih dari 0
      if (request.amount <= 0) {
        return {
          success: false,
          message: 'Reduction amount must be greater than 0'
        };
      }

      // ============================================
      // STEP 2: Ambil entity dari repository
      // ============================================
      
      // Cari produk berdasarkan ID
      const product = await this.productRepository.findById(request.productId);
      if (!product) {
        return {
          success: false,
          message: `Product with ID ${request.productId} not found`
        };
      }

      // Simpan stock sebelumnya untuk event
      const previousQuantity = product.quantity.value;

      // ============================================
      // STEP 3: Eksekusi business logic di entity
      // ============================================
      
      // Panggil method reduceStock di entity Product
      // Entity yang mengandung business logic untuk validasi stock
      const success = product.reduceStock(request.amount);
      if (!success) {
        return {
          success: false,
          message: `Insufficient stock for product ${request.productId}. Required: ${request.amount}, Available: ${previousQuantity}`
        };
      }

      // ============================================
      // STEP 4: Update repository
      // ============================================
      
      // Simpan perubahan ke repository
      await this.productRepository.update(product);

      // ============================================
      // STEP 5: Publish Domain Event
      // ============================================
      
      // Buat event bahwa stock telah berkurang
      const event = new ProductStockReduced({
        productId: product.id,
        oldQuantity: previousQuantity,
        newQuantity: product.quantity.value,
        reducedBy: request.amount
      });

      // Publish event ke event bus
      // Handler yang subscribe akan menerima event ini
      this.eventBus.publish(event);

      // ============================================
      // STEP 6: Return response sukses
      // ============================================
      
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
