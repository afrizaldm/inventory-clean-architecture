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
export declare class Order {
    /** ID unik order (immutable) */
    readonly id: string;
    /** ID customer (immutable) */
    readonly customerId: string;
    /** List items yang dipesan (immutable copy) */
    readonly items: IOrderItem[];
    /** Total amount (immutable) */
    readonly totalAmount: Money;
    /** Waktu order dibuat (immutable) */
    readonly createdAt: Date;
    /** Status order - private karena bisa berubah */
    private _status;
    /**
     * Constructor Order
     * @param props - Properties untuk initialize order
     */
    constructor(props: IOrderProps);
    /**
     * Getter untuk status
     */
    get status(): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    /**
     * Confirm order
     * BUSINESS RULE: Hanya order dengan status 'pending' yang bisa di-confirm
     *
     * @throws Error jika status tidak valid untuk confirm
     */
    confirm(): void;
    /**
     * Ship order
     * BUSINESS RULE: Hanya order dengan status 'confirmed' yang bisa di-ship
     *
     * @throws Error jika status tidak valid untuk ship
     */
    ship(): void;
    /**
     * Deliver order
     * BUSINESS RULE: Hanya order dengan status 'shipped' yang bisa di-deliver
     *
     * @throws Error jika status tidak valid untuk deliver
     */
    deliver(): void;
    /**
     * Cancel order
     * BUSINESS RULE: Order yang sudah delivered tidak bisa di-cancel
     *
     * @throws Error jika order sudah delivered
     */
    cancel(): void;
    /**
     * Cek apakah order bisa di-cancel
     * @returns true jika order bisa di-cancel
     */
    canBeCancelled(): boolean;
}
//# sourceMappingURL=Order.d.ts.map