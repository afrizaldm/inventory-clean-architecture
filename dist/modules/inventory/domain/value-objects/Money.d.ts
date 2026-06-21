/**
 * ============================================================================
 * INVENTORY MODULE - Money Value Object
 * ============================================================================
 * Value Object untuk merepresentasikan nilai uang.
 *
 * PENTING: Menggunakan satuan terkecil (sen/cents) untuk menghindari floating point errors
 * Contoh: Rp 10.000,00 disimpan sebagai 1000000 (sen)
 *
 * DOMAIN LAYER - TIDAK BOLEH IMPORT DARI LUAR DOMAIN!
 */
export declare class Money {
    /**
     * Amount dalam satuan terkecil (sen/cents)
     * Private readonly untuk enforce immutability
     */
    private readonly _amount;
    /**
     * Constructor dengan validasi
     * @param amount - Amount dalam satuan terkecil (sen)
     * @throws Error jika amount negatif
     */
    constructor(amount: number);
    /**
     * Getter untuk amount dalam sen
     */
    get amount(): number;
    /**
     * Convert dari desimal ke satuan terkecil
     * Contoh: fromDecimal(10000.50) => Money dengan amount 1000050 sen
     * @param decimalAmount - Amount dalam format desimal (Rupiah)
     * @returns Money instance
     */
    static fromDecimal(decimalAmount: number): Money;
    /**
     * Convert ke format desimal untuk display
     * Contoh: toDecimal() => 10000.50 (Rupiah)
     * @returns Amount dalam format desimal
     */
    toDecimal(): number;
    /**
     * Bandingkan dengan Money lain
     * @param other - Money yang dibandingkan
     * @returns true jika amount sama
     */
    equals(other: Money): boolean;
    /**
     * Tambah dengan Money lain
     * @param other - Money yang ditambahkan
     * @returns Money baru (immutable)
     */
    add(other: Money): Money;
    /**
     * Kurangi dengan Money lain
     * @param other - Money yang dikurangi
     * @returns Money baru (immutable)
     * @throws Error jika hasil negatif
     */
    subtract(other: Money): Money;
}
//# sourceMappingURL=Money.d.ts.map