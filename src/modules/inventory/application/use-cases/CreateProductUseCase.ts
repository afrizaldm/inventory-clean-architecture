import { IUseCase } from '../../../../types';
import { Product } from '../../domain/entities/Product';
import { Quantity } from '../../domain/value-objects/Quantity';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

/**
 * Interface untuk input/request CreateProductUseCase
 * 
 * DTO (Data Transfer Object) untuk membawa data dari luar ke use case.
 * Menggunakan interface terpisah agar:
 * - Use case tidak bergantung pada framework HTTP
 * - Input bisa divalidasi sebelum masuk ke domain
 */
export interface CreateProductRequest {
  /** ID unik produk */
  id: string;
  /** Nama produk */
  name: string;
  /** Harga dalam format desimal (misalnya 99.99) */
  price: number;
  /** Stock awal produk */
  initialStock: number;
}

/**
 * Interface untuk output/response CreateProductUseCase
 * 
 * Response pattern yang konsisten memudahkan handling di controller
 */
export interface CreateProductResponse {
  /** Apakah operasi berhasil */
  success: boolean;
  /** Pesan hasil operasi */
  message: string;
  /** Product entity yang dibuat (jika berhasil) */
  product?: Product;
}

/**
 * Use Case: CreateProductUseCase
 * 
 * Use Case adalah implementasi dari Application Service pattern.
 * Setiap use case merepresentasikan satu aksi bisnis yang spesifik.
 * 
 * Karakteristik Use Case:
 * - Hanya bergantung pada Domain interfaces (IProductRepository)
 * - Tidak bergantung pada framework atau infrastructure
 * - Mengandung validasi business rules
 * - Return response object yang konsisten
 * 
 * Use case ini bertanggung jawab untuk:
 * 1. Validasi input
 * 2. Cek business rules (produk belum ada, harga valid, dll)
 * 3. Membuat entity Product
 * 4. Menyimpan melalui repository
 */
export class CreateProductUseCase implements IUseCase<CreateProductRequest, CreateProductResponse> {
  /**
   * Constructor dengan dependency injection
   * 
   * @param productRepository - Repository untuk akses data product
   * 
   * Dependency injection memungkinkan:
   * - Mudah testing (bisa mock repository)
   * - Loose coupling antara use case dan implementation
   */
  constructor(private productRepository: IProductRepository) {}

  /**
   * Execute use case ini dengan request yang diberikan
   * 
   * @param request - Data untuk membuat produk
   * @returns Response dengan status dan hasil operasi
   * 
   * Alur:
   * 1. Validasi input
   * 2. Cek apakah produk sudah ada
   * 3. Buat entity Product baru
   * 4. Simpan ke repository
   */
  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      // ============================================
      // STEP 1: Validasi input
      // ============================================
      
      // Validasi: ID dan nama wajib ada
      if (!request.id || !request.name) {
        return {
          success: false,
          message: 'Product ID and name are required'
        };
      }

      // Validasi: Harga harus lebih dari 0
      if (request.price <= 0) {
        return {
          success: false,
          message: 'Price must be greater than 0'
        };
      }

      // Validasi: Stock tidak boleh negatif
      if (request.initialStock < 0) {
        return {
          success: false,
          message: 'Initial stock cannot be negative'
        };
      }

      // ============================================
      // STEP 2: Cek business rules
      // ============================================
      
      // Business Rule: Produk dengan ID yang sama tidak boleh ada duplikat
      const existingProduct = await this.productRepository.findById(request.id);
      if (existingProduct) {
        return {
          success: false,
          message: `Product with ID ${request.id} already exists`
        };
      }

      // ============================================
      // STEP 3: Buat entity Product
      // ============================================
      
      // Buat entity Product dengan Value Objects
      const product = new Product({
        id: request.id,
        name: request.name,
        price: Math.round(request.price * 100), // Konversi ke satuan terkecil (sen)
        quantity: new Quantity(request.initialStock)
      });

      // ============================================
      // STEP 4: Simpan ke repository
      // ============================================
      
      // Simpan entity ke storage melalui repository
      await this.productRepository.save(product);

      // ============================================
      // STEP 5: Return response sukses
      // ============================================
      
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
