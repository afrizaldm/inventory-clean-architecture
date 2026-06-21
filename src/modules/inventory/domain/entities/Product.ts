import { Quantity } from '../value-objects/Quantity';

/**
 * Interface untuk properties Product
 * Digunakan sebagai DTO untuk constructor
 */
export interface IProductProps {
  /** ID unik produk */
  id: string;
  /** Nama produk */
  name: string;
  /** Harga dalam satuan terkecil (sen) */
  price: number;
  /** Quantity/stock produk */
  quantity: Quantity;
}

/**
 * Entity: Product
 * 
 * Entity adalah objek domain yang memiliki identity (ID unik).
 * Berbeda dengan Value Object yang didefinisikan oleh atribut,
 * Entity didefinisikan oleh ID-nya.
 * 
 * Product berada di Domain Layer, jadi:
 * - TIDAK boleh import dari luar domain (no framework, no database)
 * - Hanya bergantung pada Value Objects dan logic bisnis murni
 * - Mengandung business logic untuk manipulasi stock
 */
export class Product {
  /** ID unik produk - readonly karena tidak boleh berubah */
  public readonly id: string;
  
  /** Nama produk - readonly karena tidak boleh berubah */
  public readonly name: string;
  
  /** Harga produk - readonly karena tidak boleh berubah */
  public readonly price: number;
  
  /**
   * Quantity/stock produk
   * Private karena hanya bisa diubah melalui method yang terkontrol
   */
  private _quantity: Quantity;

  /**
   * Constructor Product
   * @param props - Properties untuk initialize product
   */
  constructor(props: IProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this._quantity = props.quantity;
  }

  /**
   * Getter untuk quantity
   * @returns Current quantity
   */
  get quantity(): Quantity {
    return this._quantity;
  }

  /**
   * Mengurangi stock produk
   * Method ini mengandung business logic untuk validasi stock
   * 
   * @param amount - Jumlah yang akan dikurangi
   * @returns true jika berhasil, false jika stock tidak cukup
   * 
   * Business Rule:
   * - Stock tidak boleh menjadi negatif
   * - Jika stock tidak cukup, operasi gagal
   */
  reduceStock(amount: number): boolean {
    // Validasi: cek apakah stock mencukupi
    if (this._quantity.value < amount) {
      return false; // Stock tidak mencukupi
    }

    // Kurangi stock dengan membuat instance Quantity baru (immutable)
    this._quantity = new Quantity(this._quantity.value - amount);
    return true;
  }

  /**
   * Menambah stock produk
   * Digunakan misalnya saat ada retur produk atau restock
   * 
   * @param amount - Jumlah yang akan ditambahkan
   */
  increaseStock(amount: number): void {
    // Tambah stock dengan membuat instance Quantity baru
    this._quantity = new Quantity(this._quantity.value + amount);
  }
}
