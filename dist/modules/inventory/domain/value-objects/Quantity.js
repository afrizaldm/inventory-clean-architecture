"use strict";
/**
 * ============================================================================
 * INVENTORY MODULE - Quantity Value Object
 * ============================================================================
 * Value Object untuk merepresentasikan quantity/jumlah produk.
 *
 * KARAKTERISTIK VALUE OBJECT:
 * 1. Immutable - tidak bisa diubah setelah dibuat
 * 2. Diidentifikasi oleh nilai/atributnya, bukan ID
 * 3. Bisa memiliki validasi internal
 *
 * DOMAIN LAYER - TIDAK BOLEH IMPORT DARI LUAR DOMAIN!
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quantity = void 0;
class Quantity {
    /**
     * Constructor dengan validasi
     * @param value - Nilai quantity
     * @throws Error jika nilai negatif
     */
    constructor(value) {
        // Validasi business rule: quantity tidak boleh negatif
        if (value < 0) {
            throw new Error('Quantity cannot be negative');
        }
        this._value = value;
    }
    /**
     * Getter untuk mengakses nilai quantity
     * Return readonly untuk maintain immutability
     */
    get value() {
        return this._value;
    }
    /**
     * Bandingkan dengan Quantity lain
     * @param other - Quantity yang dibandingkan
     * @returns true jika nilai sama
     */
    equals(other) {
        return this._value === other.value;
    }
    /**
     * Cek apakah quantity ini lebih besar dari other
     * @param other - Quantity pembanding
     * @returns true jika this > other
     */
    isGreaterThan(other) {
        return this._value > other.value;
    }
    /**
     * Cek apakah quantity ini cukup untuk memenuhi request
     * @param required - Jumlah yang dibutuhkan
     * @returns true jika quantity >= required
     */
    isSufficient(required) {
        return this._value >= required;
    }
}
exports.Quantity = Quantity;
//# sourceMappingURL=Quantity.js.map