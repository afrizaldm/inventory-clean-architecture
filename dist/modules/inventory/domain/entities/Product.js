"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const Quantity_1 = require("../value-objects/Quantity");
/**
 * Product Entity Class
 * Merepresentasikan produk dalam domain inventory
 */
class Product {
    /**
     * Constructor Product
     * @param props - Properties untuk initialize product
     */
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
        this._quantity = props.quantity;
    }
    /**
     * Getter untuk quantity
     * Return readonly copy untuk prevent external mutation
     */
    get quantity() {
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
    reduceStock(amount) {
        // Cek apakah stock cukup
        if (this._quantity.value < amount) {
            return false; // Stock tidak mencukupi
        }
        // Buat Quantity baru (immutable) dengan nilai berkurang
        this._quantity = new Quantity_1.Quantity(this._quantity.value - amount);
        return true;
    }
    /**
     * Tambah stock produk
     * Digunakan untuk restock atau return
     *
     * @param amount - Jumlah yang ditambahkan
     */
    increaseStock(amount) {
        // Buat Quantity baru (immutable) dengan nilai bertambah
        this._quantity = new Quantity_1.Quantity(this._quantity.value + amount);
    }
    /**
     * Cek apakah stock cukup untuk jumlah tertentu
     * @param required - Jumlah yang dibutuhkan
     * @returns true jika stock cukup
     */
    hasStock(required) {
        return this._quantity.isSufficient(required);
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map