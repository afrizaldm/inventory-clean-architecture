import { IEventHandler } from '@/types';

/**
 * Interface untuk Event Bus (Pub/Sub pattern)
 * 
 * Event Bus memungkinkan komunikasi async antar komponen tanpa coupling langsung.
 * Komponen yang publish event tidak perlu tahu siapa yang subscribe.
 * Ini adalah implementasi dari Dependency Inversion Principle.
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
