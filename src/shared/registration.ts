import { Container } from '@/bootstrap/container';
import { EventBus } from '@/shared/infrastructure/services/EventBus';
import { IEventBus } from '@/shared/kernel/IEventBus';
import { ConsoleLogger, ILogger } from '@/shared/infrastructure/services/Logger';

/**
 * Registrasi Shared Dependencies
 * 
 * Function ini mendaftarkan dependencies yang digunakan bersama
 * oleh semua modul di aplikasi.
 * 
 * Shared dependencies termasuk:
 * - EventBus: Untuk komunikasi via domain events
 * - Logger: Untuk logging di seluruh aplikasi
 * 
 * Dependencies ini di-register sebagai Singleton karena:
 * - EventBus: Harus satu instance agar semua handlers subscribe ke event bus yang sama
 * - Logger: Statelesss dan bisa digunakan bersama
 */
export function registerSharedDependencies(container: Container): void {
  console.log('\n=== Registering Shared Dependencies ===');
  
  // ============================================
  // Register EventBus sebagai Singleton
  // ============================================
  // EventBus harus singleton agar semua module subscribe ke instance yang sama
  // Jika transient, setiap module akan punya event bus terpisah dan events tidak akan sampai
  container.registerSingleton<IEventBus>('IEventBus', EventBus);
  
  // ============================================
  // Register Logger sebagai Singleton
  // ============================================
  // Logger adalah stateless service yang bisa digunakan bersama
  container.registerSingleton<ILogger>('ILogger', ConsoleLogger);
  
  console.log('=== Shared Dependencies Registered ===\n');
}
