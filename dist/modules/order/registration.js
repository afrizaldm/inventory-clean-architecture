"use strict";
/**
 * ============================================================================
 * ORDER MODULE - Registration
 * ============================================================================
 * Mendaftarkan semua dependencies dari Order Module ke DI Container.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrderModule = registerOrderModule;
const OrderRepository_1 = require("./infrastructure/repositories/OrderRepository");
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
function registerOrderModule(container) {
    console.log('[Registration] Registering Order module dependencies...');
    // ========== REPOSITORIES ==========
    container.registerSingleton('IOrderRepository', OrderRepository_1.OrderRepository);
    // ========== USE CASES ==========
    // CreateOrderUseCase akan di-register dengan factory di main.ts
    // karena butuh cross-module dependencies yang kompleks
    console.log('[Registration] Order module base dependencies registered successfully');
}
//# sourceMappingURL=registration.js.map