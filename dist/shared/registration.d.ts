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
import { Container } from '../bootstrap/container';
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
export declare function registerSharedDependencies(container: Container): void;
//# sourceMappingURL=registration.d.ts.map