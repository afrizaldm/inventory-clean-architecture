/**
 * ============================================================================
 * BOOTSTRAP - DI Container Implementation
 * ============================================================================
 * Implementasi sederhana Dependency Injection Container dari scratch.
 *
 * FITUR CONTAINER INI:
 * 1. Register binding (interface -> implementation)
 * 2. Resolve dependencies secara rekursif
 * 3. Handle Singleton dan Transient scope
 * 4. Factory pattern untuk complex dependencies
 *
 * TIDAK MENGGUNAKAN LIBRARY seperti Inversify/tsyringe
 * Untuk pembelajaran bagaimana DI Container bekerja di balik layar
 */
type Token = string;
type Constructor<T = any> = new (...args: any[]) => T;
type Factory<T = any> = (...args: any[]) => T;
/**
 * DI Container Class
 * Responsible untuk manage dependency registrations dan resolutions
 */
export declare class Container {
    /** Map untuk menyimpan semua bindings */
    private bindings;
    /**
     * Register binding sebagai Singleton
     * Singleton = satu instance untuk seluruh aplikasi lifetime
     *
     * @param token - Identifier untuk dependency (biasanya interface name)
     * @param implementation - Constructor class yang akan diinstantiate
     * @template T - Type dari dependency
     *
     * CONTOH PENGGUNAAN:
     * container.registerSingleton<IEventBus>('IEventBus', EventBus);
     */
    registerSingleton<T>(token: Token, implementation: Constructor<T>): void;
    /**
     * Register binding sebagai Transient
     * Transient = instance baru setiap kali di-resolve
     *
     * @param token - Identifier untuk dependency
     * @param implementation - Constructor class
     * @template T - Type dari dependency
     *
     * CONTOH PENGGUNAAN:
     * container.registerTransient<IUseCase>('CreateProductUseCase', CreateProductUseCase);
     */
    registerTransient<T>(token: Token, implementation: Constructor<T>): void;
    /**
     * Register menggunakan Factory function
     * Factory = custom function untuk create instance
     * Digunakan ketika dependency butuh parameter khusus atau cross-module wiring
     *
     * @param token - Identifier untuk dependency
     * @param factory - Function yang return instance
     * @template T - Type dari dependency
     *
     * CONTOH PENGGUNAAN:
     * container.registerFactory(
     *   'CreateOrderUseCase',
     *   (orderRepo, inventoryChecker, reduceStockUseCase, eventBus) =>
     *     new CreateOrderUseCase(orderRepo, inventoryChecker, reduceStockUseCase, eventBus)
     * );
     */
    registerFactory<T>(token: Token, factory: Factory<T>): void;
    /**
     * Resolve dependency dari container
     * Mencari binding berdasarkan token dan return instance
     *
     * @param token - Identifier dependency yang ingin di-resolve
     * @returns Instance dari dependency
     * @throws Error jika binding tidak ditemukan
     *
     * FLOW RESOLUTION:
     * 1. Cari binding berdasarkan token
     * 2. Jika singleton dan sudah ada cached instance, return cached
     * 3. Jika constructor, resolve dependencies dan instantiate
     * 4. Jika factory, panggil factory function
     * 5. Cache instance jika singleton
     */
    resolve<T>(token: Token): T;
    /**
     * Resolve dengan explicit dependencies
     * Versi resolve yang menerima dependencies sebagai arguments
     *
     * @param token - Identifier dependency
     * @param deps - Dependencies yang akan di-pass ke constructor/factory
     * @returns Instance yang sudah di-create dengan dependencies
     */
    resolveWithDeps<T>(token: Token, ...deps: any[]): T;
}
export {};
//# sourceMappingURL=container.d.ts.map