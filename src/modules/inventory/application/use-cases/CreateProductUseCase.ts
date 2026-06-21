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
import { Quantity } from '../../domain/value-objects/Quantity';
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
export class CreateProductUseCase implements IUseCase<CreateProductRequest, CreateProductResponse> {
  /**
   * Constructor dengan dependency injection
   * @param productRepository - Repository untuk persist product
   * 
   * CATATAN: Hanya bergantung pada INTERFACE, bukan implementation
   * Ini memungkinkan kita mengganti implementasi repository tanpa mengubah use case
   */
  constructor(private productRepository: IProductRepository) {}

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
  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      // ========== STEP 1: Validasi Input ==========
      // Validasi field required
      if (!request.id || !request.name) {
        return {
          success: false,
          message: 'Product ID and name are required'
        };
      }

      // Validasi harga harus positif
      if (request.price <= 0) {
        return {
          success: false,
          message: 'Price must be greater than 0'
        };
      }

      // Validasi stock tidak boleh negatif
      if (request.initialStock < 0) {
        return {
          success: false,
          message: 'Initial stock cannot be negative'
        };
      }

      // ========== STEP 2: Cek Duplicate ==========
      // Pastikan product dengan ID ini belum ada
      const existingProduct = await this.productRepository.findById(request.id);
      if (existingProduct) {
        return {
          success: false,
          message: `Product with ID ${request.id} already exists`
        };
      }

      // ========== STEP 3: Buat Entity Product ==========
      // Convert price dari desimal ke satuan terkecil (sen)
      // Contoh: Rp 10.000,50 => 1000050 sen
      const product = new Product({
        id: request.id,
        name: request.name,
        price: Math.round(request.price * 100),
        quantity: new Quantity(request.initialStock)
      });

      // ========== STEP 4: Persist ke Repository ==========
      await this.productRepository.save(product);

      // ========== STEP 5: Return Success Response ==========
      return {
        success: true,
        message: 'Product created successfully',
        product
      };
    } catch (error: any) {
      // Handle unexpected errors
      return {
        success: false,
        message: `Error creating product: ${error.message}`
      };
    }
  }
}
