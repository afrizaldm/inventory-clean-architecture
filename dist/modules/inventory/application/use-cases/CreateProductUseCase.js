"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductUseCase = void 0;
const Product_1 = require("../../domain/entities/Product");
const Quantity_1 = require("../../domain/value-objects/Quantity");
/**
 * CreateProductUseCase Class
 * Responsible untuk orchestrasi pembuatan product baru
 */
class CreateProductUseCase {
    /**
     * Constructor dengan dependency injection
     * @param productRepository - Repository untuk persist product
     *
     * CATATAN: Hanya bergantung pada INTERFACE, bukan implementation
     * Ini memungkinkan kita mengganti implementasi repository tanpa mengubah use case
     */
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
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
    async execute(request) {
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
            const product = new Product_1.Product({
                id: request.id,
                name: request.name,
                price: Math.round(request.price * 100),
                quantity: new Quantity_1.Quantity(request.initialStock)
            });
            // ========== STEP 4: Persist ke Repository ==========
            await this.productRepository.save(product);
            // ========== STEP 5: Return Success Response ==========
            return {
                success: true,
                message: 'Product created successfully',
                product
            };
        }
        catch (error) {
            // Handle unexpected errors
            return {
                success: false,
                message: `Error creating product: ${error.message}`
            };
        }
    }
}
exports.CreateProductUseCase = CreateProductUseCase;
//# sourceMappingURL=CreateProductUseCase.js.map