import { IEventHandler } from '../../../types';

/**
 * Interface untuk Event Bus (Pub/Sub pattern)
 * 
 * Event Bus memungkinkan komunikasi async antar komponen tanpa coupling langsung.
 * Komponen yang publish event tidak perlu tahu siapa yang subscribe.
 * Ini adalah implementasi dari Dependency Inversion Principle.
 */
export interface IEventBus {
  /**
   * Publish/mengirim event ke semua handler yang subscribe
   * @param event - Event object yang akan dipublish
   */
  publish<T>(event: T): void;
  
  /**
   * Subscribe/register handler untuk tipe event tertentu
   * @param eventType - Nama tipe event (biasanya constructor name)
   * @param handler - Handler yang akan dipanggil saat event dipublish
   */
  subscribe<T>(eventType: string, handler: IEventHandler<T>): void;
}
