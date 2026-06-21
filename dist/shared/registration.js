"use strict";
/**
 * ============================================================================
 * SHARED - Registration Module
 * ============================================================================
 * Mendaftarkan shared dependencies yang digunakan oleh semua modul.
 * Ini adalah bagian dari Composition Root pattern.
 *
 * FUNCTION: registerSharedDependencies
 * - Dipanggil sekali di main.ts saat aplikasi start
 * - Mendaftarkan layanan bersama seperti EventBus dan Logger
 * - Semua modul bisa menggunakan layanan ini melalui DI Container
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSharedDependencies = registerSharedDependencies;
const EventBus_1 = require("./infrastructure/services/EventBus");
const Logger_1 = require("./infrastructure/services/Logger");
/**
 * Registrasi semua shared dependencies ke container
 * @param container - DI Container instance
 *
 * DEPENDENCIES YANG DIREGISTRASI:
 * 1. IEventBus -> EventBus (Singleton)
 *    - Event bus untuk komunikasi via domain events
 *    - Singleton agar semua modul menggunakan event bus yang sama
 *
 * 2. ILogger -> ConsoleLogger (Singleton)
 *    - Logger untuk logging di seluruh aplikasi
 *    - Singleton agar konsisten dan bisa di-mock untuk testing
 */
function registerSharedDependencies(container) {
    console.log('[Registration] Registering shared dependencies...');
    // Register EventBus sebagai singleton
    // Singleton dipilih karena kita ingin semua modul menggunakan event bus yang sama
    container.registerSingleton('IEventBus', EventBus_1.EventBus);
    // Register Logger sebagai singleton
    // Singleton dipilih untuk konsistensi logging di seluruh aplikasi
    container.registerSingleton('ILogger', Logger_1.ConsoleLogger);
    console.log('[Registration] Shared dependencies registered successfully');
}
//# sourceMappingURL=registration.js.map