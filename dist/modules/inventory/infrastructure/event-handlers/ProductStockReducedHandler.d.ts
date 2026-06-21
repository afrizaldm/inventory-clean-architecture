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
import { IEventHandler } from '../../../../types';
import { ProductStockReduced } from '../../domain/events/ProductStockReduced';
import { ILogger } from '../../../../shared/infrastructure/services/Logger';
/**
 * ProductStockReducedHandler Class
 * Menangani event ProductStockReduced
 */
export declare class ProductStockReducedHandler implements IEventHandler<ProductStockReduced> {
    private logger;
    /**
     * Constructor dengan dependency injection
     * @param logger - Logger untuk mencatat event
     */
    constructor(logger: ILogger);
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
    handle(event: ProductStockReduced): void;
}
//# sourceMappingURL=ProductStockReducedHandler.d.ts.map