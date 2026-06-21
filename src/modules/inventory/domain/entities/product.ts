/**
 * PRODUCT ENTITY
 * 
 * Entity utama di modul Inventory.
 * Product memiliki identitas unik (ID) dan state yang bisa berubah.
 * 
 * Domain Layer - TIDAK boleh import dari luar domain (no framework, no database)
 */

import { Entity } from '../../../../shared/kernel';
import { Money } from '../../../../shared/kernel/value-objects';
import { Quantity } from '../../../../shared/kernel/value-objects';

/**
 * Product ID Value Object (wrapped primitive)
 */
export type ProductId = string;

/**
 * Product Entity
 * 
 * Merepresentasikan produk dalam inventory dengan:
 * - Identitas unik (id)
 * - Nama produk
 * - Harga (Money VO)
 * - Stok (Quantity VO)
 * 
 * Business logic terkait product ada di sini
 */
export class Product extends Entity<ProductId> {
  private _name: string;
  private _price: Money;
  private _stock: Quantity;

  constructor(
    id: ProductId,
    name: string,
    price: Money,
    stock: Quantity
  ) {
    super(id);
    this._name = name;
    this._price = price;
    this._stock = stock;
  }

  // Getters (immutable access)
  get name(): string {
    return this._name;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): Quantity {
    return this._stock;
  }

  /**
   * Reduce stock - Business logic untuk mengurangi stok
   * 
   * Method ini:
   * 1. Validasi apakah stok cukup
   * 2. Kurangi stok
   * 3. Return info untuk trigger domain event (event di-create di application layer)
   * 
   * @param quantity - Jumlah yang akan dikurangi
   * @throws Error jika stok tidak cukup
   */
  reduceStock(quantity: Quantity): void {
    // Validasi business rule: stok harus cukup
    if (!this._stock.isSufficientFor(quantity)) {
      throw new Error(
        `Stok tidak cukup! Produk "${this._name}" hanya memiliki ${this._stock} unit, diminta ${quantity} unit`
      );
    }

    // Kurangi stok
    this._stock = this._stock.subtract(quantity);
  }

  /**
   * Add stock - Restock produk
   * Hanya untuk internal inventory management
   */
  addStock(quantity: Quantity): void {
    this._stock = this._stock.add(quantity);
  }

  /**
   * Update price - Update harga produk
   */
  updatePrice(newPrice: Money): void {
    this._price = newPrice;
  }

  /**
   * Check availability - Cek apakah produk tersedia untuk quantity tertentu
   */
  isAvailable(quantity: Quantity): boolean {
    return this._stock.isSufficientFor(quantity);
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): any {
    return {
      id: this.id,
      name: this._name,
      price: this._price.toString(),
      stock: this._stock.toNumber(),
    };
  }
}
