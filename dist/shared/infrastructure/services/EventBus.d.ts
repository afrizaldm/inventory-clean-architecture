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
import { IEventBus } from '../kernel/IEventBus';
import { IEventHandler } from '../../types';
/**
 * EventBus Class - Implementasi sederhana pub/sub pattern
 */
export declare class EventBus implements IEventBus {
    /** Storage untuk semua event handlers */
    private handlers;
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
    publish<T>(event: T): void;
    /**
     * Subscribe handler ke event type tertentu
     * @param eventType - Nama tipe event (harus sama dengan constructor name)
     * @param handler - Handler instance yang akan menangani event
     *
     * CATATAN:
     * - Multiple handlers bisa subscribe ke event type yang sama
     * - Handlers akan dipanggil secara synchronous dalam urutan subscription
     */
    subscribe<T>(eventType: string, handler: IEventHandler<T>): void;
}
//# sourceMappingURL=EventBus.d.ts.map