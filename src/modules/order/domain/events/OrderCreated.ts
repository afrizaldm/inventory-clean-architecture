import { IOrderItem } from '../entities/Order';

/**
 * Interface untuk data yang diperlukan saat membuat event OrderCreated
 */
export interface IOrderCreatedData {
  /** ID order yang dibuat */
  orderId: string;
  /** ID customer yang membuat order */
  customerId: string;
  /** List item yang diorder */
  items: IOrderItem[];
  /** Total amount dalam satuan terkecil (sen) */
  totalAmount: number;
}

/**
 * Domain Event: OrderCreated
 * 
 * Event ini dipublish ketika sebuah order berhasil dibuat.
 * Handler lain bisa subscribe untuk melakukan aksi tambahan seperti:
 * - Mengirim email konfirmasi
 * - Notifikasi ke warehouse
 * - Update analytics
 * 
 * Event ini immutable dan mengandung semua informasi tentang order yang dibuat.
 */
export class OrderCreated {
  /** ID order yang dibuat */
  public readonly orderId: string;
  
  /** ID customer yang membuat order */
  public readonly customerId: string;
  
  /** List item yang diorder */
  public readonly items: IOrderItem[];
  
  /** Total amount dalam satuan terkecil */
  public readonly totalAmount: number;
  
  /** Timestamp kapan event terjadi */
  public readonly occurredAt: Date;

  /**
   * Constructor Domain Event
   * @param data - Data untuk membuat event
   */
  constructor(data: IOrderCreatedData) {
    this.orderId = data.orderId;
    this.customerId = data.customerId;
    // Copy array untuk mencegah external mutation
    this.items = [...data.items];
    this.totalAmount = data.totalAmount;
    this.occurredAt = new Date();
  }
}
