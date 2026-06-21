import { Container } from '@/bootstrap/container';
import { IProductRepository } from '@/modules/inventory/domain/repositories/IProductRepository';
import { ProductRepository } from '@/modules/inventory/infrastructure/repositories/ProductRepository';
import { CreateProductUseCase } from '@/modules/inventory/application/use-cases/CreateProductUseCase';
import { ReduceStockUseCase } from '@/modules/inventory/application/use-cases/ReduceStockUseCase';
import { InventoryCheckerAdapter } from '@/modules/inventory/infrastructure/adapters/InventoryCheckerAdapter';
import { IInventoryChecker } from '@/modules/order/contracts/IInventoryChecker';

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
  
  // ============================================
  // Register Cross-Module Adapter (Singleton)
  // ============================================
  // InventoryCheckerAdapter adalah adapter yang memungkinkan modul Order
  // untuk mengecek stock tanpa bergantung langsung pada modul Inventory
  // 
  // Ini di-bind ke interface IInventoryChecker yang didefinisikan di modul Order
  // Wiring ini adalah kunci dari Dependency Inversion Principle
  container.registerSingleton<IInventoryChecker>('IInventoryChecker', InventoryCheckerAdapter, ['IProductRepository']);
  
  // ============================================
  // Register Use Cases (Transient)
  // ============================================
  // Use cases di-register sebagai transient karena:
  // - Mereka stateless (tidak menyimpan state antar request)
  // - Setiap request bisa punya context berbeda
  // - Factory registration digunakan untuk specify dependencies
  
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
