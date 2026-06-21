/**
 * ============================================================================
 * SHARED INFRASTRUCTURE - EventBus Implementation
 * ============================================================================
 * Implementasi konkret dari IEventBus menggunakan in-memory storage.
 * Ini adalah DRIVEN ADAPTER - di-trigger oleh domain events.
 * 
 * CATATAN PENTING:
 * - Implementation ini berada di infrastructure layer
 * - Hanya bergantung pada interface IEventBus dan IEventHandler
 * - Bisa diganti dengan implementasi lain (Redis Pub/Sub, RabbitMQ, dll) tanpa mengubah domain
 */

import { IEventBus } from '@/shared/kernel/IEventBus';
import { IEventHandler } from '@/types';

/**
 * Map untuk menyimpan handlers per event type
 * Key: nama event type (string)
 * Value: array of handlers untuk event type tersebut
 */
type EventHandlerMap = Map<string, IEventHandler<any>[]>;

/**
 * EventBus Class - Implementasi sederhana pub/sub pattern
 */
export class EventBus implements IEventBus {
  /** Storage untuk semua event handlers */
  private handlers: EventHandlerMap = new Map();

  /**
   * Publish event ke semua handler yang subscribed
   * @param event - Event yang akan dipublish
   * 
   * FLOW:
   * 1. Ambil event type dari constructor name
   * 2. Cari semua handlers yang subscribed ke event type ini
   * 3. Panggil handle() pada setiap handler
   * 4. Handle error secara individual agar satu handler error tidak mengganggu yang lain
   */
  public publish<T>(event: T): void {
    // Dapatkan nama tipe event dari constructor
    const eventType = event.constructor.name;
    
    // Ambil semua handlers untuk event type ini
    const handlers = this.handlers.get(eventType);

    // Jika tidak ada handler, log dan return
    if (!handlers || handlers.length === 0) {
      console.log(`[EventBus] No handlers registered for event: ${eventType}`);
      return;
    }

    console.log(`[EventBus] Publishing event: ${eventType}`);
    
    // Panggil setiap handler
    handlers.forEach(handler => {
      try {
        handler.handle(event);
      } catch (error) {
        console.error(`[EventBus] Error handling event ${eventType}:`, error);
      }
    });
  }

  /**
   * Subscribe handler ke event type tertentu
   * @param eventType - Nama tipe event (harus sama dengan constructor name)
   * @param handler - Handler instance yang akan menangani event
   * 
   * CATATAN:
   * - Multiple handlers bisa subscribe ke event type yang sama
   * - Handlers akan dipanggil secara synchronous dalam urutan subscription
   */
  public subscribe<T>(eventType: string, handler: IEventHandler<T>): void {
    // Buat array baru jika belum ada handlers untuk event type ini
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    // Tambahkan handler ke array
    this.handlers.get(eventType)!.push(handler);
    console.log(`[EventBus] Subscribed handler to event: ${eventType}`);
  }
}
