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
import { IProductRepository } from './domain/repositories/IProductRepository';
import { ProductRepository } from './infrastructure/repositories/ProductRepository';
import { CreateProductUseCase } from './application/use-cases/CreateProductUseCase';
import { ReduceStockUseCase } from './application/use-cases/ReduceStockUseCase';
import { IInventoryChecker } from '../order/contracts/IInventoryChecker';
import { InventoryCheckerAdapter } from './infrastructure/adapters/InventoryCheckerAdapter';

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
export function registerInventoryModule(container: Container): void {
  console.log('[Registration] Registering Inventory module dependencies...');

  // ========== REPOSITORIES ==========
  // Singleton karena stateful (in-memory storage)
  container.registerSingleton<IProductRepository>('IProductRepository', ProductRepository);

  // ========== ADAPTERS (Cross-module) ==========
  // InventoryCheckerAdapter untuk komunikasi dengan Order module
  // Singleton karena tidak punya state internal
  container.registerSingleton<IInventoryChecker>('IInventoryChecker', InventoryCheckerAdapter);

  // ========== USE CASES ==========
  // Transient karena setiap request harus instance baru
  // Use case bisa punya state temporary selama eksekusi
  
  // CreateProductUseCase hanya butuh IProductRepository
  container.registerFactory(
    'CreateProductUseCase',
    (productRepo: IProductRepository) => new CreateProductUseCase(productRepo)
  );

  // ReduceStockUseCase butuh IProductRepository dan IEventBus
  container.registerFactory(
    'ReduceStockUseCase',
    (productRepo: IProductRepository, eventBus: any) => 
      new ReduceStockUseCase(productRepo, eventBus)
  );

  console.log('[Registration] Inventory module dependencies registered successfully');
}
