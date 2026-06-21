/**
 * Interface untuk data yang diperlukan saat membuat event ProductStockReduced
 */
export interface IProductStockReducedData {
  /** ID produk yang stock-nya berkurang */
  productId: string;
  /** Quantity sebelum dikurangi */
  oldQuantity: number;
  /** Quantity setelah dikurangi */
  newQuantity: number;
  /** Jumlah yang dikurangi */
  reducedBy: number;
}

/**
 * Domain Event: ProductStockReduced
 * 
 * Domain Event adalah event yang terjadi di domain layer dan memiliki arti bisnis.
 * Event ini dipublish ketika stock produk berkurang.
 * 
 * Karakteristik Domain Event:
 * - Immutable (tidak bisa diubah setelah dibuat)
 * - Mengandung informasi lengkap tentang apa yang terjadi
 * - Menggunakan past tense (telah terjadi)
 * - TIDAK bergantung pada framework atau infrastructure
 * 
 * Event ini akan di-publish oleh Use Case dan di-handle oleh Event Handler
 * untuk melakukan aksi tambahan seperti logging, notification, dll.
 */
export class ProductStockReduced {
  /** ID produk yang stock-nya berkurang */
  public readonly productId: string;
  
  /** Quantity sebelum dikurangi */
  public readonly oldQuantity: number;
  
  /** Quantity setelah dikurangi */
  public readonly newQuantity: number;
  
  /** Jumlah yang dikurangi */
  public readonly reducedBy: number;
  
  /** Timestamp kapan event terjadi */
  public readonly occurredAt: Date;

  /**
   * Constructor Domain Event
   * Semua property di-set saat constructor dan readonly (immutable)
   * 
   * @param data - Data untuk membuat event
   */
  constructor(data: IProductStockReducedData) {
    this.productId = data.productId;
    this.oldQuantity = data.oldQuantity;
    this.newQuantity = data.newQuantity;
    this.reducedBy = data.reducedBy;
    this.occurredAt = new Date(); // Set timestamp saat event dibuat
  }
}
