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
export declare class Product {
    /** ID unik produk (immutable) */
    readonly id: string;
    /** Nama produk (immutable) */
    readonly name: string;
    /** Harga dalam sen (immutable) */
    readonly price: number;
    /** Quantity/stock - private karena bisa berubah */
    private _quantity;
    /**
     * Constructor Product
     * @param props - Properties untuk initialize product
     */
    constructor(props: IProductProps);
    /**
     * Getter untuk quantity
     * Return readonly copy untuk prevent external mutation
     */
    get quantity(): Quantity;
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
    reduceStock(amount: number): boolean;
    /**
     * Tambah stock produk
     * Digunakan untuk restock atau return
     *
     * @param amount - Jumlah yang ditambahkan
     */
    increaseStock(amount: number): void;
    /**
     * Cek apakah stock cukup untuk jumlah tertentu
     * @param required - Jumlah yang dibutuhkan
     * @returns true jika stock cukup
     */
    hasStock(required: number): boolean;
}
//# sourceMappingURL=Product.d.ts.map