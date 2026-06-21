"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStockReduced = void 0;
/**
 * ProductStockReduced Event Class
 * Dipublish setiap kali stock produk berhasil dikurangi
 */
class ProductStockReduced {
    /**
     * Constructor event
     * @param data - Data event yang diperlukan
     *
     * CATATAN: occurredAt otomatis di-set ke waktu sekarang
     * Ini penting untuk audit trail dan debugging
     */
    constructor(data) {
        this.productId = data.productId;
        this.oldQuantity = data.oldQuantity;
        this.newQuantity = data.newQuantity;
        this.reducedBy = data.reducedBy;
        this.occurredAt = new Date(); // Set timestamp saat event dibuat
    }
}
exports.ProductStockReduced = ProductStockReduced;
//# sourceMappingURL=ProductStockReduced.js.map