import { Money } from '../../../inventory/domain/value-objects/Money';

/**
 * Interface untuk Order Item
 * 
 * Order Item merepresentasikan satu item dalam order.
 * Menggunakan Value Object Money untuk price.
 */
export interface IOrderItem {
  /** ID produk yang diorder */
  productId: string;
  /** Nama produk (snapshot saat order dibuat) */
  productName: string;
  /** Jumlah item yang diorder */
  quantity: number;
  /** Harga per unit */
  unitPrice: Money;
}

/**
 * Interface untuk properties Order
 */
export interface IOrderProps {
  /** ID unik order */
  id: string;
  /** ID customer yang membuat order */
  customerId: string;
  /** List item yang diorder */
  items: IOrderItem[];
  /** Total amount */
  totalAmount: Money;
  /** Status order */
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  /** Waktu order dibuat */
  createdAt: Date;
}

/**
 * Entity: Order
 * 
 * Entity Order merepresentasikan order dari customer.
 * Mengandung business logic untuk state machine order:
 * pending -> confirmed -> shipped -> delivered
 * 
 * Order bisa dibatalkan (cancelled) kecuali sudah delivered.
 */
export class Order {
  /** ID unik order - readonly */
  public readonly id: string;
  
  /** ID customer - readonly */
  public readonly customerId: string;
  
  /** List item - readonly array copy */
  public readonly items: IOrderItem[];
  
  /** Total amount - readonly */
  public readonly totalAmount: Money;
  
  /** Waktu order dibuat - readonly */
  public readonly createdAt: Date;
  
  /**
   * Status order - private karena hanya bisa diubah melalui method
   */
  private _status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  /**
   * Constructor Order
   * @param props - Properties untuk initialize order
   */
  constructor(props: IOrderProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    // Copy array untuk mencegah external mutation
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
   * Business Rule: Hanya order dengan status pending yang bisa di-confirm
   * 
   * @throws Error jika status bukan pending
   */
  confirm(): void {
    if (this._status !== 'pending') {
      throw new Error(`Cannot confirm order in ${this._status} status`);
    }
    this._status = 'confirmed';
  }

  /**
   * Ship order
   * Business Rule: Hanya order dengan status confirmed yang bisa di-ship
   * 
   * @throws Error jika status bukan confirmed
   */
  ship(): void {
    if (this._status !== 'confirmed') {
      throw new Error(`Cannot ship order in ${this._status} status`);
    }
    this._status = 'shipped';
  }

  /**
   * Deliver order
   * Business Rule: Hanya order dengan status shipped yang bisa di-deliver
   * 
   * @throws Error jika status bukan shipped
   */
  deliver(): void {
    if (this._status !== 'shipped') {
      throw new Error(`Cannot deliver order in ${this._status} status`);
    }
    this._status = 'delivered';
  }

  /**
   * Cancel order
   * Business Rule: Order yang sudah delivered tidak bisa dibatalkan
   * 
   * @throws Error jika status sudah delivered
   */
  cancel(): void {
    if (this._status === 'delivered') {
      throw new Error(`Cannot cancel delivered order`);
    }
    this._status = 'cancelled';
  }
}
