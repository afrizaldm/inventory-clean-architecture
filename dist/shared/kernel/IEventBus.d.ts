/**
 * ============================================================================
 * SHARED KERNEL - IEventBus
 * ============================================================================
 * Interface untuk Event Bus yang menggunakan pola Publisher-Subscriber.
 * Event Bus memungkinkan komunikasi loose-coupling antar komponen melalui events.
 *
 * PRINSIP: Mediator Pattern & Observer Pattern
 * - Komponen tidak berkomunikasi langsung, tapi melalui event bus
 * - Handler subscribe ke event tertentu dan dipanggil saat event dipublish
 */
import { IEventHandler } from '../../types';
/**
 * Event Bus Interface
 * Bertanggung jawab untuk publish events dan manage subscribers
 */
export interface IEventBus {
    /**
     * Publish event ke semua handler yang subscribed
     * @param event - Event yang akan dipublish
     * @template T - Tipe event yang dipublish
     */
    publish<T>(event: T): void;
    /**
     * Subscribe handler ke event type tertentu
     * @param eventType - Nama tipe event (biasanya constructor name)
     * @param handler - Handler yang akan menangani event
     * @template T - Tipe event yang disubscribe
     */
    subscribe<T>(eventType: string, handler: IEventHandler<T>): void;
}
//# sourceMappingURL=IEventBus.d.ts.map