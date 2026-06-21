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

export class Money {
  /**
   * Amount dalam satuan terkecil (sen/cents)
   * Private readonly untuk enforce immutability
   */
  private readonly _amount: number;
  private readonly _currency: string;

  /**
   * Constructor dengan validasi
   * @param amount - Jumlah dalam satuan terkecil (misalnya sen)
   * @param currency - Mata uang (default: 'IDR')
   * @throws Error jika amount negatif
   */
  constructor(amount: number, currency: string = 'IDR') {
    // Business rule: Money tidak boleh negatif
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    this._amount = amount;
    this._currency = currency;
  }

  /**
   * Getter untuk amount dalam sen
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Getter untuk mata uang
   */
  get currency(): string {
    return this._currency;
  }

  toString(): string {
    return `${this._currency} ${(this._amount / 100).toFixed(2)}`;
  }

  /**
   * Getter untuk mata uang
   */
  get currency(): string {
    return this._currency;
  }

  toString(): string {
    return `${this._currency} ${(this._amount / 100).toFixed(2)}`;
  }

  /**
   * Convert dari desimal ke satuan terkecil
   * Contoh: fromDecimal(10000.50) => Money dengan amount 1000050 sen
   * @param decimalAmount - Amount dalam format desimal (Rupiah)
   * @returns Money instance
   */
  static fromDecimal(decimalAmount: number): Money {
    // Kalikan 100 dan bulatkan untuk menghindari floating point issues
    return new Money(Math.round(decimalAmount * 100));
  }

  /**
   * Convert ke format desimal untuk display
   * Contoh: toDecimal() => 10000.50 (Rupiah)
   * @returns Amount dalam format desimal
   */
  toDecimal(): number {
    return this._amount / 100;
  }

  /**
   * Bandingkan dengan Money lain
   * @param other - Money yang dibandingkan
   * @returns true jika amount sama
   */
  equals(other: Money): boolean {
    return this._amount === other.amount;
  }

  /**
   * Tambah dengan Money lain
   * @param other - Money yang ditambahkan
   * @returns Money baru (immutable)
   */
  add(other: Money): Money {
    return new Money(this._amount + other.amount);
  }

  /**
   * Kurangi dengan Money lain
   * @param other - Money yang dikurangi
   * @returns Money baru (immutable)
   * @throws Error jika hasil negatif
   */
  subtract(other: Money): Money {
    const result = this._amount - other.amount;
    if (result < 0) {
      throw new Error('Resulting money amount cannot be negative');
    }
    return new Money(result);
  }
}
