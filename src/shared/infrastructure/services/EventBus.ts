import { IEventBus } from '../../kernel/IEventBus';
import { IEventHandler } from '../../../types';

/**
 * Map untuk menyimpan list handler per event type
 * Key: nama event, Value: array of handlers
 */
type EventHandlerMap = Map<string, IEventHandler<any>[]>;

/**
 * Implementasi sederhana dari Event Bus menggunakan Pub/Sub pattern
 * 
 * Kelas ini bertanggung jawab untuk:
 * 1. Menyimpan registry handlers untuk setiap tipe event
 * 2. Mendistribusikan event ke semua handler yang subscribe
 * 
 * Dalam production, Anda bisa mengganti ini dengan implementasi yang lebih robust
 * seperti menggunakan message broker (RabbitMQ, Kafka, dll)
 */
export class EventBus implements IEventBus {
  /**
   * Internal storage untuk handlers
   * Struktur: Map<eventName, Array<handlers>>
   */
  private handlers: EventHandlerMap = new Map();

  /**
   * Publish event ke semua handler yang telah subscribe
   * 
   * @param event - Event object yang akan dipublish
   * 
   * Cara kerja:
   * 1. Ambil nama event dari constructor name
   * 2. Cari semua handler yang subscribe ke event ini
   * 3. Panggil handle() pada setiap handler
   */
  public publish<T>(event: T): void {
    // Dapatkan nama event dari constructor function
    const eventType = (event as any).constructor.name;
    
    // Ambil semua handler untuk event ini
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
   * Subscribe handler untuk tipe event tertentu
   * 
   * @param eventType - Nama event yang akan di-subscribe
   * @param handler - Handler function/object yang akan dipanggil
   * 
   * Catatan: Multiple handler bisa subscribe ke event yang sama
   */
  public subscribe<T>(eventType: string, handler: IEventHandler<T>): void {
    // Jika belum ada array untuk event ini, buat baru
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    // Tambahkan handler ke array
    this.handlers.get(eventType)!.push(handler);
    console.log(`[EventBus] Subscribed handler to event: ${eventType}`);
  }
}
