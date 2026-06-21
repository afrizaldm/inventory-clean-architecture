import { Container } from '../../bootstrap/container';
import { IProductRepository } from './domain/repositories/IProductRepository';
import { ProductRepository } from './infrastructure/repositories/ProductRepository';
import { CreateProductUseCase } from './application/use-cases/CreateProductUseCase';
import { ReduceStockUseCase } from './application/use-cases/ReduceStockUseCase';
import { InventoryCheckerAdapter } from './infrastructure/adapters/InventoryCheckerAdapter';
import { IInventoryChecker } from '../order/contracts/IInventoryChecker';

/**
 * Registrasi Inventory Module Dependencies
 * 
 * Function ini mendaftarkan semua dependencies yang dimiliki oleh modul Inventory.
 * Ini termasuk:
 * - Repositories
 * - Use Cases
 * - Adapters (untuk cross-module communication)
 * 
 * Perhatikan bahwa Event Handlers TIDAK diregistrasi di sini karena
 * mereka akan di-subscribe secara manual di Composition Root.
 */
export function registerInventoryModule(container: Container): void {
  console.log('=== Registering Inventory Module ===');
  
  // ============================================
  // Register Repositories (Singleton)
  // ============================================
  // Repository harus singleton karena mengelola state (in-memory storage)
  // Jika transient, setiap use case akan punya repository terpisah dengan data berbeda
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
    (productRepo: IProductRepository) => new CreateProductUseCase(productRepo),
    ['IProductRepository']
  );
  
  // ReduceStockUseCase butuh IProductRepository dan IEventBus
  container.registerFactory(
    'ReduceStockUseCase',
    (productRepo: IProductRepository, eventBus: any) => 
      new ReduceStockUseCase(productRepo, eventBus),
    ['IProductRepository', 'IEventBus']
  );
  
  console.log('=== Inventory Module Registered ===\n');
}
