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

// Type definitions untuk container
type Token = string;
type Constructor<T = any> = new (...args: any[]) => T;
type Factory<T = any> = (...args: any[]) => T;

/**
 * Interface untuk Binding configuration
 */
interface Binding {
  /** Implementation (constructor atau factory function) */
  implementation: Constructor | Factory;
  /** Scope: singleton (satu instance) atau transient (instance baru setiap resolve) */
  scope: 'singleton' | 'transient';
  /** Cached instance untuk singleton */
  resolvedInstance?: any;
}

/**
 * DI Container Class
 * Responsible untuk manage dependency registrations dan resolutions
 */
export class Container {
  /** Map untuk menyimpan semua bindings */
  private bindings: Map<Token, Binding> = new Map();

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
  registerSingleton<T>(token: Token, implementation: Constructor<T>): void {
    this.bindings.set(token, { 
      implementation, 
      scope: 'singleton' 
    });
    console.log(`[Container] Registered singleton: ${token}`);
  }

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
  registerTransient<T>(token: Token, implementation: Constructor<T>): void {
    this.bindings.set(token, { 
      implementation, 
      scope: 'transient' 
    });
    console.log(`[Container] Registered transient: ${token}`);
  }

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
  registerFactory<T>(token: Token, factory: Factory<T>): void {
    this.bindings.set(token, { 
      implementation: factory, 
      scope: 'transient' // Factory selalu transient
    });
    console.log(`[Container] Registered factory: ${token}`);
  }

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
  resolve<T>(token: Token): T {
    // Cari binding
    const binding = this.bindings.get(token);
    if (!binding) {
      throw new Error(`[Container] No binding found for token: ${token}`);
    }

    // Jika singleton dan sudah ada cached instance, return langsung
    if (binding.scope === 'singleton' && binding.resolvedInstance) {
      console.log(`[Container] Resolved (cached) singleton: ${token}`);
      return binding.resolvedInstance;
    }

    // Buat instance berdasarkan type implementation
    let instance: T;
    
    if (typeof binding.implementation === 'function') {
      // Cek apakah ini constructor atau factory
      // Factory dipanggil langsung, constructor di-instantiate dengan new
      
      // Untuk simplicity, kita asumsikan factory sudah di-register dengan registerFactory
      // dan constructor dengan registerSingleton/registerTransient
      
      // Instantiate constructor dengan dependencies
      // CATATAN: Ini simplified version - tidak ada automatic dependency resolution
      // Dependencies harus di-pass manual via factory
      instance = new (binding.implementation as Constructor<T>)();
    } else {
      // Panggil factory function
      // Factory bertanggung jawab untuk resolve dependencies sendiri
      instance = (binding.implementation as Factory<T>)();
    }

    // Cache instance jika singleton
    if (binding.scope === 'singleton') {
      binding.resolvedInstance = instance;
    }

    console.log(`[Container] Resolved: ${token} (${binding.scope})`);
    return instance;
  }

  /**
   * Resolve dengan explicit dependencies
   * Versi resolve yang menerima dependencies sebagai arguments
   * 
   * @param token - Identifier dependency
   * @param deps - Dependencies yang akan di-pass ke constructor/factory
   * @returns Instance yang sudah di-create dengan dependencies
   */
  resolveWithDeps<T>(token: Token, ...deps: any[]): T {
    const binding = this.bindings.get(token);
    if (!binding) {
      throw new Error(`[Container] No binding found for token: ${token}`);
    }

    let instance: T;

    if (typeof binding.implementation === 'function' && binding.scope !== 'singleton') {
      // Factory function
      instance = (binding.implementation as Factory<T>)(...deps);
    } else {
      // Constructor - note: simplified, doesn't auto-resolve
      instance = new (binding.implementation as Constructor<T>)(...deps);
    }

    if (binding.scope === 'singleton') {
      binding.resolvedInstance = instance;
    }

    return instance;
  }
}
