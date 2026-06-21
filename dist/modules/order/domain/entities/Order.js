"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
/**
 * Order Entity Class
 * Merepresentasikan pesanan dari customer
 */
class Order {
    /**
     * Constructor Order
     * @param props - Properties untuk initialize order
     */
    constructor(props) {
        this.id = props.id;
        this.customerId = props.customerId;
        // Buat copy array untuk prevent external mutation
        this.items = [...props.items];
        this.totalAmount = props.totalAmount;
        this.createdAt = props.createdAt;
        this._status = props.status;
    }
    /**
     * Getter untuk status
     */
    get status() {
        return this._status;
    }
    /**
     * Confirm order
     * BUSINESS RULE: Hanya order dengan status 'pending' yang bisa di-confirm
     *
     * @throws Error jika status tidak valid untuk confirm
     */
    confirm() {
        if (this._status !== 'pending') {
            throw new Error(`Cannot confirm order in ${this._status} status`);
        }
        this._status = 'confirmed';
    }
    /**
     * Ship order
     * BUSINESS RULE: Hanya order dengan status 'confirmed' yang bisa di-ship
     *
     * @throws Error jika status tidak valid untuk ship
     */
    ship() {
        if (this._status !== 'confirmed') {
            throw new Error(`Cannot ship order in ${this._status} status`);
        }
        this._status = 'shipped';
    }
    /**
     * Deliver order
     * BUSINESS RULE: Hanya order dengan status 'shipped' yang bisa di-deliver
     *
     * @throws Error jika status tidak valid untuk deliver
     */
    deliver() {
        if (this._status !== 'shipped') {
            throw new Error(`Cannot deliver order in ${this._status} status`);
        }
        this._status = 'delivered';
    }
    /**
     * Cancel order
     * BUSINESS RULE: Order yang sudah delivered tidak bisa di-cancel
     *
     * @throws Error jika order sudah delivered
     */
    cancel() {
        if (this._status === 'delivered') {
            throw new Error('Cannot cancel delivered order');
        }
        this._status = 'cancelled';
    }
    /**
     * Cek apakah order bisa di-cancel
     * @returns true jika order bisa di-cancel
     */
    canBeCancelled() {
        return this._status !== 'delivered';
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map