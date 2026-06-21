/**
 * ORDER CREATED - Domain Event
 * 
 * Event ini terjadi ketika order berhasil dibuat.
 * Dipublish setelah operasi create order berhasil.
 */

import { DomainEvent } from '../../../../shared/kernel';

/**
 * OrderCreated Event
 * 
 * Dibuat ketika order baru berhasil dibuat dan confirmed.
 * Event ini bisa digunakan untuk:
 * - Send confirmation email
 * - Update analytics
 * - Trigger fulfillment process
 */
export class OrderCreated implements DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;

  constructor(
    public readonly orderId: string,
    public readonly totalAmount: number,
    public readonly itemCount: number
  ) {
    this.occurredOn = new Date();
    this.eventId = `order-created-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
