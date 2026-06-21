/**
 * ============================================================================
 * BOOTSTRAP - Main Application Entry Point (Composition Root)
 * ============================================================================
 * File ini adalah COMPOSITION ROOT dari aplikasi.
 *
 * COMPOSITION ROOT ADALAH:
 * - Satu tempat di mana semua dependencies di-wiring
 * - Dipanggil sekali saat aplikasi start
 * - Bertanggung jawab untuk initialize seluruh aplikasi
 *
 * POLA YANG DIGUNAKAN:
 * 1. Buat DI Container instance
 * 2. Register semua modul dependencies
 * 3. Wire cross-module dependencies
 * 4. Subscribe event handlers
 * 5. Setup HTTP server (Driving Adapter)
 * 6. Jalankan demo flow
 */
export {};
//# sourceMappingURL=main.d.ts.map