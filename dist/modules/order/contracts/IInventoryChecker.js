"use strict";
/**
 * ============================================================================
 * ORDER MODULE - IInventoryChecker Contract
 * ============================================================================
 * Interface untuk mengecek stock dari modul Inventory.
 *
 * PENTING: File ini ada di modul ORDER, tapi interface-nya akan diimplementasi
 * oleh modul INVENTORY. Ini adalah contoh Dependency Inversion Principle.
 *
 * CARA KERJA KOMUNIKASI ANTAR MODUL:
 * 1. Order module mendefinisikan KEBUTUHAN (interface ini)
 * 2. Inventory module menyediakan IMPLEMENTASI (InventoryCheckerAdapter)
 * 3. Composition Root melakukan WIRING (binding interface ke implementasi)
 *
 * HASIL: Order module TIDAK langsung bergantung pada Inventory module!
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=IInventoryChecker.js.map