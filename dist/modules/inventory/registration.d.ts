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
import { Container } from '../../bootstrap/container';
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
export declare function registerInventoryModule(container: Container): void;
//# sourceMappingURL=registration.d.ts.map