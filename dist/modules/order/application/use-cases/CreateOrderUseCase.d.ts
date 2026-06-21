/**
 * ============================================================================
 * ORDER MODULE - CreateOrderUseCase
 * ============================================================================
 * Use Case untuk membuat order baru.
 *
 * INI ADALAH CONTOH KOMUNIKASI ANTAR MODUL:
 * 1. Order module butuh cek stock dari Inventory module
 * 2. Order module TIDAK import langsung dari Inventory module
 * 3. Order module menggunakan interface IInventoryChecker
 * 4. Implementation IInventoryChecker disediakan oleh Inventory module
 * 5. Wiring dilakukan di Composition Root (main.ts)
 *
 * FLOW:
 * 1. Validasi input
 * 2. Cek stock via IInventoryChecker (cross-module call)
 * 3. Buat order entity
 * 4. Simpan order
 * 5. Kurangi stock via ReduceStockUseCase (cross-module call)
 * 6. Publish OrderCreated event
 */
import { IUseCase } from '../../../../types';
import { Order } from '../domain/entities/Order';
import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { IInventoryChecker } from '../contracts/IInventoryChecker';
import { IEventBus } from '../../../../shared/kernel/IEventBus';
import { ReduceStockUseCase } from '../../inventory/application/use-cases/ReduceStockUseCase';
/**
 * Input DTO untuk CreateOrderUseCase
 */
export interface CreateOrderRequest {
    /** ID unik order */
    id: string;
    /** ID customer yang membuat order */
    customerId: string;
    /** Item-item yang dipesan */
    items: {
        /** ID produk */
        productId: string;
        /** Jumlah yang dipesan */
        quantity: number;
    }[];
}
/**
 * Output DTO untuk CreateOrderUseCase
 */
export interface CreateOrderResponse {
    /** Apakah operasi berhasil */
    success: boolean;
    /** Pesan hasil operasi */
    message: string;
    /** Order yang dibuat (jika berhasil) */
    order?: Order;
}
/**
 * CreateOrderUseCase Class
 * Responsible untuk orchestrasi pembuatan order
 *
 * DEPENDENCIES:
 * 1. IOrderRepository - dari Order module (internal)
 * 2. IInventoryChecker - dari Inventory module (cross-module!)
 * 3. ReduceStockUseCase - dari Inventory module (cross-module!)
 * 4. IEventBus - dari Shared module (shared service)
 */
export declare class CreateOrderUseCase implements IUseCase<CreateOrderRequest, CreateOrderResponse> {
    private orderRepository;
    private inventoryChecker;
    private reduceStockUseCase;
    private eventBus;
    /**
     * Constructor dengan dependency injection
     * @param orderRepository - Repository untuk persist order
     * @param inventoryChecker - Interface untuk cek stock (dari Inventory module)
     * @param reduceStockUseCase - Use case untuk kurangi stock (dari Inventory module)
     * @param eventBus - Event bus untuk publish events
     */
    constructor(orderRepository: IOrderRepository, inventoryChecker: IInventoryChecker, reduceStockUseCase: ReduceStockUseCase, eventBus: IEventBus);
    /**
     * Eksekusi use case
     * @param request - Input data untuk create order
     * @returns Response dengan status dan result
     *
     * FLOW DETAIL:
     * 1. Validasi input data
     * 2. Cek ketersediaan stock untuk setiap item (via IInventoryChecker)
     * 3. Hitung total amount
     * 4. Buat Order entity
     * 5. Simpan order ke repository
     * 6. Kurangi stock untuk setiap item (via ReduceStockUseCase)
     * 7. Publish OrderCreated event
     */
    execute(request: CreateOrderRequest): Promise<CreateOrderResponse>;
}
//# sourceMappingURL=CreateOrderUseCase.d.ts.map