/**
 * ============================================================================
 * INVENTORY MODULE - Product Entity
 * ============================================================================
 * Entity untuk merepresentasikan produk dalam inventory.
 * 
 * KARAKTERISTIK ENTITY:
 * 1. Memiliki identity (ID) yang unik
 * 2. Dapat berubah state sepanjang lifecycle-nya
 * 3. Mengandung business logic terkait produk
 * 
 * DOMAIN LAYER - TIDAK BOLEH IMPORT DARI LUAR DOMAIN!
 */

import { Quantity } from '../value-objects/Quantity';

/**
 * Interface untuk props constructor Product
 * Digunakan untuk validasi type saat membuat instance baru
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
 * Product Entity Class
 * Merepresentasikan produk dalam domain inventory
 */
export class Product {
  /** ID unik produk (immutable) */
  public readonly id: string;
  
  /** Nama produk (immutable) */
  public readonly name: string;
  
  /** Harga dalam sen (immutable) */
  public readonly price: number;
  
  /** Quantity/stock - private karena bisa berubah */
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
   * Return readonly copy untuk prevent external mutation
   */
  get quantity(): Quantity {
    return this._quantity;
  }

  /**
   * Kurangi stock produk
   * BUSINESS RULE: Stock tidak boleh negatif
   * 
   * @param amount - Jumlah yang dikurangi
   * @returns true jika berhasil, false jika stock tidak cukup
   * 
   * CATATAN: Method ini TIDAK langsung save ke repository
   * Repository di-update oleh use case setelah method ini dipanggil
   */
  reduceStock(amount: number): boolean {
    // Cek apakah stock cukup
    if (this._quantity.value < amount) {
      return false; // Stock tidak mencukupi
    }

    // Buat Quantity baru (immutable) dengan nilai berkurang
    this._quantity = new Quantity(this._quantity.value - amount);
    return true;
  }

  /**
   * Tambah stock produk
   * Digunakan untuk restock atau return
   * 
   * @param amount - Jumlah yang ditambahkan
   */
  increaseStock(amount: number): void {
    // Buat Quantity baru (immutable) dengan nilai bertambah
    this._quantity = new Quantity(this._quantity.value + amount);
  }

  /**
   * Cek apakah stock cukup untuk jumlah tertentu
   * @param required - Jumlah yang dibutuhkan
   * @returns true jika stock cukup
   */
  hasStock(required: number): boolean {
    return this._quantity.isSufficient(required);
  }
}
