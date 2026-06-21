/**
 * ============================================================================
 * ORDER MODULE - Registration
 * ============================================================================
 * Mendaftarkan semua dependencies dari Order Module ke DI Container.
 */

import { Container } from '@/bootstrap/container';
import { IOrderRepository } from '@/modules/order/domain/repositories/IOrderRepository';
import { OrderRepository } from '@/modules/order/infrastructure/repositories/OrderRepository';
import { CreateOrderUseCase } from '@/modules/order/application/use-cases/CreateOrderUseCase';

/**
 * Registrasi semua Order module dependencies
 * @param container - DI Container instance
 * 
 * DEPENDENCIES YANG DIREGISTRASI:
 * 1. IOrderRepository -> OrderRepository (Singleton)
 * 2. CreateOrderUseCase (Transient via factory)
 * 
 * CATATAN: CreateOrderUseCase butuh cross-module dependencies
 * yang di-wiring secara manual di Composition Root
 */
export function registerOrderModule(container: Container): void {
  console.log('[Registration] Registering Order module dependencies...');

  // ========== REPOSITORIES ==========
  container.registerSingleton<IOrderRepository>('IOrderRepository', OrderRepository);

  // ========== USE CASES ==========
  // CreateOrderUseCase akan di-register dengan factory di main.ts
  // karena butuh cross-module dependencies yang kompleks
  
  console.log('[Registration] Order module base dependencies registered successfully');
}
