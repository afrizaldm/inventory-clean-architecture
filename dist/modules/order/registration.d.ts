/**
 * ============================================================================
 * ORDER MODULE - Registration
 * ============================================================================
 * Mendaftarkan semua dependencies dari Order Module ke DI Container.
 */
import { Container } from '../../bootstrap/container';
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
export declare function registerOrderModule(container: Container): void;
//# sourceMappingURL=registration.d.ts.map