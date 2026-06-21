"use strict";
/**
 * ============================================================================
 * INVENTORY MODULE - ProductStockReducedHandler
 * ============================================================================
 * Event Handler untuk ProductStockReduced domain event.
 *
 * EVENT HANDLER:
 * - Subscribe ke event bus untuk event tertentu
 * - Dipanggil otomatis saat event dipublish
 * - Bisa digunakan untuk: logging, audit, notifikasi, cache invalidation, dll
 *
 * INI ADALAH DRIVEN ADAPTER:
 * - Di-trigger oleh domain events
 * - Tidak menginisiasi aksi sendiri
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStockReducedHandler = void 0;
/**
 * ProductStockReducedHandler Class
 * Menangani event ProductStockReduced
 */
class ProductStockReducedHandler {
    /**
     * Constructor dengan dependency injection
     * @param logger - Logger untuk mencatat event
     */
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Handle event ProductStockReduced
     * @param event - Event yang diterima
     *
     * CONTOH PENGGUNAAN LAIN:
     * - Kirim notifikasi ke admin jika stock menipis
     * - Update cache product
     * - Sync ke warehouse management system
     * - Catat audit trail ke database terpisah
     */
    handle(event) {
        // Log informasi lengkap tentang event
        this.logger.info(`Product stock reduced for ${event.productId}: ${event.oldQuantity} -> ${event.newQuantity} (-${event.reducedBy})`, {
            eventId: event.constructor.name,
            productId: event.productId,
            oldQuantity: event.oldQuantity,
            newQuantity: event.newQuantity,
            reducedBy: event.reducedBy,
            timestamp: event.occurredAt.toISOString()
        });
        // Contoh: Tambahkan logic lain di sini
        // Misalnya: cek apakah stock sudah menipis dan kirim alert
        if (event.newQuantity < 5) {
            this.logger.warn(`Low stock alert for product ${event.productId}! Only ${event.newQuantity} left.`);
        }
    }
}
exports.ProductStockReducedHandler = ProductStockReducedHandler;
//# sourceMappingURL=ProductStockReducedHandler.js.map