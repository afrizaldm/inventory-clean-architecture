/**
 * ============================================================================
 * INVENTORY MODULE - ProductStockReduced Domain Event
 * ============================================================================
 * Domain Event yang dipublish ketika stock produk berkurang.
 * 
 * DOMAIN EVENT:
 * - Merepresentasikan sesuatu yang SUDAH terjadi di domain
 * - Immutable (tidak bisa diubah setelah dibuat)
 * - Digunakan untuk komunikasi loose-coupling antar komponen
 * 
 * CONTOH PENGGUNAAN:
 * - Log audit trail
 * - Update cache
 * - Trigger notifikasi
 * - Sync ke sistem lain
 */

/**
 * Interface untuk data yang dibutuhkan saat membuat event
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
 * ProductStockReduced Event Class
 * Dipublish setiap kali stock produk berhasil dikurangi
 */
export class ProductStockReduced {
  /** ID produk yang terdampak */
  public readonly productId: string;
  
  /** Quantity sebelum perubahan */
  public readonly oldQuantity: number;
  
  /** Quantity setelah perubahan */
  public readonly newQuantity: number;
  
  /** Besaran pengurangan */
  public readonly reducedBy: number;
  
  /** Timestamp kapan event terjadi */
  public readonly occurredAt: Date;

  /**
   * Constructor event
   * @param data - Data event yang diperlukan
   * 
   * CATATAN: occurredAt otomatis di-set ke waktu sekarang
   * Ini penting untuk audit trail dan debugging
   */
  constructor(data: IProductStockReducedData) {
    this.productId = data.productId;
    this.oldQuantity = data.oldQuantity;
    this.newQuantity = data.newQuantity;
    this.reducedBy = data.reducedBy;
    this.occurredAt = new Date(); // Set timestamp saat event dibuat
  }
}
