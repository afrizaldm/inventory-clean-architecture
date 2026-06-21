/**
 * ============================================================================
 * ORDER MODULE - OrderCreated Domain Event
 * ============================================================================
 * Domain Event yang dipublish ketika order berhasil dibuat.
 * 
 * EVENT INI DIPUBLISH SETELAH:
 * 1. Order entity dibuat dan disimpan
 * 2. Stock produk dikurangi (via ReduceStockUseCase)
 * 
 * PENGGUNAAN EVENT INI:
 * - Log audit trail
 * - Kirim email konfirmasi ke customer
 * - Update analytics dashboard
 * - Trigger fulfillment process
 */

import { IOrderItem } from '../entities/Order';

/**
 * Interface untuk data yang dibutuhkan saat membuat event
 */
export interface IOrderCreatedData {
  /** ID order yang dibuat */
  orderId: string;
  /** ID customer yang membuat order */
  customerId: string;
  /** Item-item dalam order */
  items: IOrderItem[];
  /** Total amount dalam sen */
  totalAmount: number;
}

/**
 * OrderCreated Event Class
 * Dipublish setiap kali order berhasil dibuat
 */
export class OrderCreated {
  /** ID order yang dibuat */
  public readonly orderId: string;
  
  /** ID customer */
  public readonly customerId: string;
  
  /** Item-item dalam order (copy untuk immutability) */
  public readonly items: IOrderItem[];
  
  /** Total amount dalam sen */
  public readonly totalAmount: number;
  
  /** Timestamp kapan event terjadi */
  public readonly occurredAt: Date;

  /**
   * Constructor event
   * @param data - Data event yang diperlukan
   */
  constructor(data: IOrderCreatedData) {
    this.orderId = data.orderId;
    this.customerId = data.customerId;
    // Buat copy array untuk prevent external mutation
    this.items = [...data.items];
    this.totalAmount = data.totalAmount;
    this.occurredAt = new Date();
  }
}
