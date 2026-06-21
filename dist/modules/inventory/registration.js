"use strict";
/**
 * ============================================================================
 * INVENTORY MODULE - Registration
 * ============================================================================
 * Mendaftarkan semua dependencies dari Inventory Module ke DI Container.
 *
 * FUNCTION: registerInventoryModule
 * - Dipanggil dari Composition Root (main.ts)
 * - Mendaftarkan repositories, use cases, adapters, dan event handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInventoryModule = registerInventoryModule;
const ProductRepository_1 = require("./infrastructure/repositories/ProductRepository");
const CreateProductUseCase_1 = require("./application/use-cases/CreateProductUseCase");
const ReduceStockUseCase_1 = require("./application/use-cases/ReduceStockUseCase");
const InventoryCheckerAdapter_1 = require("./infrastructure/adapters/InventoryCheckerAdapter");
/**
 * Registrasi semua Inventory module dependencies
 * @param container - DI Container instance
 *
 * DEPENDENCIES YANG DIREGISTRASI:
 * 1. IProductRepository -> ProductRepository (Singleton)
 * 2. IInventoryChecker -> InventoryCheckerAdapter (Singleton)
 * 3. CreateProductUseCase (Transient)
 * 4. ReduceStockUseCase (Transient)
 */
function registerInventoryModule(container) {
    console.log('[Registration] Registering Inventory module dependencies...');
    // ========== REPOSITORIES ==========
    // Singleton karena stateful (in-memory storage)
    container.registerSingleton('IProductRepository', ProductRepository_1.ProductRepository);
    // ========== ADAPTERS (Cross-module) ==========
    // InventoryCheckerAdapter untuk komunikasi dengan Order module
    // Singleton karena tidak punya state internal
    container.registerSingleton('IInventoryChecker', InventoryCheckerAdapter_1.InventoryCheckerAdapter);
    // ========== USE CASES ==========
    // Transient karena setiap request harus instance baru
    // Use case bisa punya state temporary selama eksekusi
    // CreateProductUseCase hanya butuh IProductRepository
    container.registerFactory('CreateProductUseCase', (productRepo) => new CreateProductUseCase_1.CreateProductUseCase(productRepo));
    // ReduceStockUseCase butuh IProductRepository dan IEventBus
    container.registerFactory('ReduceStockUseCase', (productRepo, eventBus) => new ReduceStockUseCase_1.ReduceStockUseCase(productRepo, eventBus));
    console.log('[Registration] Inventory module dependencies registered successfully');
}
//# sourceMappingURL=registration.js.map