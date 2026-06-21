/**
 * Value Object: Money
 * 
 * Value Object untuk merepresentasikan jumlah uang.
 * Menggunakan integer (bukan float) untuk menghindari masalah presisi floating point.
 * Contoh: Rp 10.000 disimpan sebagai 1000000 (dalam satuan sen/terkecil)
 * 
 * Money juga immutable untuk mencegah side effects
 */
export class Money {
  /**
   * Amount dalam satuan terkecil (sen, bukan rupiah/dollar)
   * readonly untuk memastikan immutability
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
   * Getter untuk mengakses amount
   * @returns Amount dalam satuan terkecil
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
   * Factory method untuk membuat Money dari desimal (rupiah/dollar)
   * Contoh: fromDecimal(99.99) => Money dengan amount 9999 (sen)
   * 
   * @param decimalAmount - Jumlah dalam desimal (misalnya 99.99)
   * @returns Instance Money baru
   */
  static fromDecimal(decimalAmount: number): Money {
    // Konversi ke satuan terkecil (dikalikan 100)
    return new Money(Math.round(decimalAmount * 100));
  }

  /**
   * Mengkonversi amount ke format desimal (untuk display)
   * Contoh: amount 9999 => 99.99
   * 
   * @returns Amount dalam format desimal
   */
  toDecimal(): number {
    return this._amount / 100;
  }

  /**
   * Membandingkan apakah Money ini sama dengan Money lain
   * @param other - Money lain untuk dibandingkan
   * @returns true jika amount sama
   */
  equals(other: Money): boolean {
    return this._amount === other.amount;
  }

  /**
   * Menambahkan Money ini dengan Money lain
   * @param other - Money yang akan ditambahkan
   * @returns Money baru hasil penjumlahan
   */
  add(other: Money): Money {
    return new Money(this._amount + other.amount);
  }

  /**
   * Mengurangi Money ini dengan Money lain
   * @param other - Money yang akan dikurangkan
   * @returns Money baru hasil pengurangan
   */
  subtract(other: Money): Money {
    return new Money(this._amount - other.amount);
  }

  /**
   * Mengalikan Money dengan multiplier
   * @param multiplier - Faktor pengali
   * @returns Money baru hasil perkalian
   */
  multiply(multiplier: number): Money {
    return new Money(Math.round(this._amount * multiplier));
  }
}
