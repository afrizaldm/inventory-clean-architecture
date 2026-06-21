/**
 * ORDER ENTITY
 * 
 * Entity utama di modul Order.
 * Order memiliki identitas unik (ID) dan merepresentasikan pesanan customer.
 * 
 * Domain Layer - TIDAK boleh import dari luar domain (no framework, no database)
 */

import { Entity } from '../../../../shared/kernel';
import { Money } from '../../../../shared/kernel/value-objects';

/**
 * Order ID Value Object (wrapped primitive)
 */
export type OrderId = string;

/**
 * Order Status Enum
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

/**
 * Order Item - Line item dalam order
 */
export interface OrderItem {
  readonly productId: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  readonly totalPrice: Money;
}

/**
 * Order Entity
 * 
 * Merepresentasikan pesanan customer dengan:
 * - Identitas unik (id)
 * - List items yang dipesan
 * - Total harga
 * - Status order
 * 
 * Business logic terkait order ada di sini
 */
export class Order extends Entity<OrderId> {
  private _customerId: string;
  private _items: OrderItem[];
  private _totalAmount: Money;
  private _status: OrderStatus;
  private _createdAt: Date;

  constructor(
    id: OrderId,
    customerId: string,
    items: OrderItem[],
    totalAmount: Money,
    status: OrderStatus = OrderStatus.PENDING
  ) {
    super(id);
    this._customerId = customerId;
    this._items = items;
    this._totalAmount = totalAmount;
    this._status = status;
    this._createdAt = new Date();
  }

  // Getters (immutable access)
  get customerId(): string {
    return this._customerId;
  }

  get items(): readonly OrderItem[] {
    return [...this._items];
  }

  get totalAmount(): Money {
    return this._totalAmount;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Confirm order - Change status to confirmed
   * Hanya bisa dilakukan jika status masih PENDING
   */
  confirm(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error(`Order tidak bisa di-confirm. Status saat ini: ${this._status}`);
    }
    this._status = OrderStatus.CONFIRMED;
  }

  /**
   * Cancel order - Change status to cancelled
   * Bisa dilakukan kapan saja kecuali sudah shipped
   */
  cancel(): void {
    if (this._status === OrderStatus.CANCELLED) {
      throw new Error('Order sudah dibatalkan');
    }
    this._status = OrderStatus.CANCELLED;
  }

  /**
   * Add item to order (hanya untuk internal use saat create)
   */
  addItem(item: OrderItem): void {
    this._items.push(item);
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): any {
    return {
      id: this.id,
      items: this._items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
      })),
      totalAmount: this._totalAmount.toString(),
      status: this._status,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
