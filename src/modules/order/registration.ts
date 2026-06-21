import { Container } from '@/bootstrap/container';
import { IOrderRepository } from '@/modules/order/domain/repositories/IOrderRepository';
import { OrderRepository } from '@/modules/order/infrastructure/repositories/OrderRepository';
import { CreateOrderUseCase } from '@/modules/order/application/use-cases/CreateOrderUseCase';

/**
 * Registrasi Order Module Dependencies
 * 
 * Function ini mendaftarkan semua dependencies yang dimiliki oleh modul Order.
 * 
 * Perhatikan bahwa CreateOrderUseCase membutuhkan dependencies dari modul Inventory:
 * - IInventoryChecker (untuk cek stock)
 * - ReduceStockUseCase (untuk kurangi stock)
 * 
 * Dependencies cross-module ini akan di-wire di Composition Root.
 */
export function registerOrderModule(container: Container): void {
  console.log('=== Registering Order Module ===');
  
  // ============================================
  // Register Repositories (Singleton)
  // ============================================
  // OrderRepository harus singleton untuk konsistensi data
  container.registerSingleton<IOrderRepository>('IOrderRepository', OrderRepository);
  
  // ============================================
  // Register Use Cases (Transient)
  // ============================================
  // CreateOrderUseCase memiliki dependencies kompleks termasuk cross-module dependencies
  // Factory registration digunakan untuk specify semua dependencies secara eksplisit
  
  container.registerFactory(
    'CreateOrderUseCase',
    (
      orderRepo: IOrderRepository,
      inventoryChecker: any,
      reduceStockUseCase: any,
      eventBus: any
    ) => new CreateOrderUseCase(orderRepo, inventoryChecker, reduceStockUseCase, eventBus),
    ['IOrderRepository', 'IInventoryChecker', 'ReduceStockUseCase', 'IEventBus']
  );
  
  console.log('=== Order Module Registered ===\n');
}
