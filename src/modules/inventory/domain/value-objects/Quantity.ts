/**
 * Value Object: Quantity
 * 
 * Value Object adalah objek yang didefinisikan oleh atributnya, bukan oleh identity.
 * Quantity mewakili jumlah produk dan memiliki validasi business rule:
 * - Tidak boleh negatif
 * 
 * Value Objects sebaiknya immutable (tidak bisa diubah setelah dibuat)
 */
export class Quantity {
  /**
   * Nilai quantity disimpan sebagai private readonly
   * untuk memastikan immutability
   */
  private readonly _value: number;

  /**
   * Constructor dengan validasi
   * @param value - Nilai quantity
   * @throws Error jika nilai negatif
   */
  constructor(value: number) {
    // Business rule: Quantity tidak boleh negatif
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
    this._value = value;
  }

  /**
   * Getter untuk mengakses nilai quantity
   * @returns Nilai quantity
   */
  get value(): number {
    return this._value;
  }

  /**
   * Membandingkan apakah quantity ini sama dengan quantity lain
   * @param other - Quantity lain untuk dibandingkan
   * @returns true jika nilai sama
   */
  equals(other: Quantity): boolean {
    return this._value === other.value;
  }

  /**
   * Menambahkan quantity ini dengan quantity lain
   * Mengembalikan instance baru (immutable)
   * @param other - Quantity yang akan ditambahkan
   * @returns Quantity baru hasil penjumlahan
   */
  add(other: Quantity): Quantity {
    return new Quantity(this._value + other.value);
  }

  /**
   * Mengurangi quantity ini dengan quantity lain
   * Mengembalikan instance baru (immutable)
   * @param other - Quantity yang akan dikurangkan
   * @returns Quantity baru hasil pengurangan
   */
  subtract(other: Quantity): Quantity {
    return new Quantity(this._value - other.value);
  }
}
