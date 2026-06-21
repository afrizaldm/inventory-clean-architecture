/**
 * ============================================================================
 * ORDER MODULE - Order Entity
 * ============================================================================
 * Entity untuk merepresentasikan order/pesanan.
 * 
 * ENTITY KARAKTERISTIK:
 * 1. Memiliki identity (ID) unik
 * 2. Memiliki lifecycle (pending -> confirmed -> shipped -> delivered)
 * 3. Mengandung business logic terkait order
 * 
 * DOMAIN LAYER - TIDAK BOLEH IMPORT DARI LUAR DOMAIN!
 */

import { Money } from '../../inventory/domain/value-objects/Money';

/**
 * Interface untuk item dalam order
 */
export interface IOrderItem {
  /** ID produk yang dipesan */
  productId: string;
  /** Nama produk (snapshot saat order dibuat) */
  productName: string;
  /** Jumlah yang dipesan */
  quantity: number;
  /** Harga per unit saat order dibuat */
  unitPrice: Money;
}

/**
 * Interface untuk props constructor Order
 */
export interface IOrderProps {
  /** ID unik order */
  id: string;
  /** ID customer yang membuat order */
  customerId: string;
  /** Item-item yang dipesan */
  items: IOrderItem[];
  /** Total harga semua item */
  totalAmount: Money;
  /** Status order */
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  /** Waktu order dibuat */
  createdAt: Date;
}

/**
 * Order Entity Class
 * Merepresentasikan pesanan dari customer
 */
export class Order {
  /** ID unik order (immutable) */
  public readonly id: string;
  
  /** ID customer (immutable) */
  public readonly customerId: string;
  
  /** List items yang dipesan (immutable copy) */
  public readonly items: IOrderItem[];
  
  /** Total amount (immutable) */
  public readonly totalAmount: Money;
  
  /** Waktu order dibuat (immutable) */
  public readonly createdAt: Date;
  
  /** Status order - private karena bisa berubah */
  private _status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  /**
   * Constructor Order
   * @param props - Properties untuk initialize order
   */
  constructor(props: IOrderProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    // Buat copy array untuk prevent external mutation
    this.items = [...props.items];
    this.totalAmount = props.totalAmount;
    this.createdAt = props.createdAt;
    this._status = props.status;
  }

  /**
   * Getter untuk status
   */
  get status(): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' {
    return this._status;
  }

  /**
   * Confirm order
   * BUSINESS RULE: Hanya order dengan status 'pending' yang bisa di-confirm
   * 
   * @throws Error jika status tidak valid untuk confirm
   */
  confirm(): void {
    if (this._status !== 'pending') {
      throw new Error(`Cannot confirm order in ${this._status} status`);
    }
    this._status = 'confirmed';
  }

  /**
   * Ship order
   * BUSINESS RULE: Hanya order dengan status 'confirmed' yang bisa di-ship
   * 
   * @throws Error jika status tidak valid untuk ship
   */
  ship(): void {
    if (this._status !== 'confirmed') {
      throw new Error(`Cannot ship order in ${this._status} status`);
    }
    this._status = 'shipped';
  }

  /**
   * Deliver order
   * BUSINESS RULE: Hanya order dengan status 'shipped' yang bisa di-deliver
   * 
   * @throws Error jika status tidak valid untuk deliver
   */
  deliver(): void {
    if (this._status !== 'shipped') {
      throw new Error(`Cannot deliver order in ${this._status} status`);
    }
    this._status = 'delivered';
  }

  /**
   * Cancel order
   * BUSINESS RULE: Order yang sudah delivered tidak bisa di-cancel
   * 
   * @throws Error jika order sudah delivered
   */
  cancel(): void {
    if (this._status === 'delivered') {
      throw new Error('Cannot cancel delivered order');
    }
    this._status = 'cancelled';
  }

  /**
   * Cek apakah order bisa di-cancel
   * @returns true jika order bisa di-cancel
   */
  canBeCancelled(): boolean {
    return this._status !== 'delivered';
  }
}
