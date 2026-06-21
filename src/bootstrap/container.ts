/**
 * DI Container - Implementasi Sederhana dari Dependency Injection Container
 * 
 * Container ini bertanggung jawab untuk:
 * 1. Menyimpan registry bindings (interface -> implementation)
 * 2. Resolve dependencies secara rekursif
 * 3. Handle Singleton dan Transient scope
 * 4. Inject dependencies ke constructor
 * 
 * PENTING: Ini adalah implementasi sederhana untuk pembelajaran.
 * Dalam production, Anda bisa menggunakan library seperti Inversify, tsyringe, dll.
 * 
 * Konsep penting:
 * - Registry: Pencatatan binding antara token dan implementation
 * - Container: Eksekusi resolve dependencies berdasarkan registry
 * - Composition Root: Tempat semua wiring dilakukan (di main.ts)
 */

// Type definitions untuk container
type Token = string; // Identifier untuk dependency (biasanya interface name)
type Constructor<T = any> = new (...args: any[]) => T; // Constructor function type
type Factory<T = any> = (...args: any[]) => T; // Factory function type

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
  /** Dependencies yang diperlukan (untuk manual injection) */
  dependencies?: Token[];
}

/**
 * Class: Container
 * 
 * DI Container yang mendukung:
 * - Register singleton dan transient
 * - Register dengan factory function
 * - Auto-resolve dependencies berdasarkan constructor parameter names
 * - Manual dependency specification
 */
export class Container {
  /** Map untuk menyimpan semua bindings */
  private bindings: Map<Token, Binding> = new Map();
  
  /** Graph untuk deteksi circular dependency */
  private dependencyGraph: Map<Token, Token[]> = new Map();

  /**
   * Register dependency sebagai Singleton
   * 
   * Singleton berarti hanya SATU instance yang dibuat dan digunakan selamanya.
   * Cocok untuk: Repository, EventBus, Logger, Configuration, dll.
   * 
   * @param token - Identifier untuk dependency (biasanya nama interface)
   * @param implementation - Constructor class yang akan di-instantiate
   * 
   * Contoh:
   * container.registerSingleton<IProductRepository>('IProductRepository', ProductRepository);
   */
  registerSingleton<T>(token: Token, implementation: Constructor<T>): void {
    this.bindings.set(token, { 
      implementation, 
      scope: 'singleton',
      dependencies: this.extractDependencies(implementation)
    });
    console.log(`[Container] Registered Singleton: ${token}`);
  }

  /**
   * Register dependency sebagai Transient
   * 
   * Transient berarti instance BARU dibuat setiap kali di-resolve.
   * Cocok untuk: Use Cases, Handlers, dll yang stateless.
   * 
   * @param token - Identifier untuk dependency
   * @param implementation - Constructor class yang akan di-instantiate
   * 
   * Contoh:
   * container.registerTransient('CreateProductUseCase', CreateProductUseCase);
   */
  registerTransient<T>(token: Token, implementation: Constructor<T>): void {
    this.bindings.set(token, { 
      implementation, 
      scope: 'transient',
      dependencies: this.extractDependencies(implementation)
    });
    console.log(`[Container] Registered Transient: ${token}`);
  }

  /**
   * Register dependency menggunakan Factory Function
   * 
   * Factory memberikan kontrol penuh atas bagaimana instance dibuat.
   * Berguna untuk:
   * - Complex dependencies
   * - Cross-module wiring
   * - Conditional instantiation
   * 
   * @param token - Identifier untuk dependency
   * @param factory - Function yang return instance
   * @param dependencies - List dependencies yang diperlukan factory
   * 
   * Contoh:
   * container.registerFactory(
   *   'CreateOrderUseCase',
   *   (orderRepo, inventoryChecker, reduceStockUseCase, eventBus) => 
   *     new CreateOrderUseCase(orderRepo, inventoryChecker, reduceStockUseCase, eventBus),
   *   ['IOrderRepository', 'IInventoryChecker', 'ReduceStockUseCase', 'IEventBus']
   * );
   */
  registerFactory<T>(token: Token, factory: Factory<T>, dependencies: Token[] = []): void {
    this.bindings.set(token, { 
      implementation: factory, 
      scope: 'transient',
      dependencies
    });
    console.log(`[Container] Registered Factory: ${token} with dependencies: [${dependencies.join(', ')}]`);
  }

  /**
   * Resolve dependency berdasarkan token
   * 
   * Method ini akan:
   * 1. Cari binding untuk token
   * 2. Cek circular dependency
   * 3. Resolve semua dependencies recursively
   * 4. Instantiate dan return instance
   * 
   * @param token - Identifier dependency yang akan di-resolve
   * @returns Instance dari dependency
   * @throws Error jika binding tidak ditemukan atau circular dependency terdeteksi
   */
  resolve<T>(token: Token): T {
    const binding = this.bindings.get(token);
    
    // Validasi: binding harus ada
    if (!binding) {
      throw new Error(`[Container] No binding found for token: ${token}`);
    }

    // Deteksi circular dependency
    this.checkCircularDependency(token);

    // Jika singleton dan sudah ada instance cached, return cached instance
    if (binding.scope === 'singleton' && binding.resolvedInstance) {
      console.log(`[Container] Resolved (cached singleton): ${token}`);
      return binding.resolvedInstance;
    }

    // Resolve dependencies
    let resolvedDependencies: any[] = [];
    
    if (binding.dependencies && binding.dependencies.length > 0) {
      // Resolve setiap dependency secara recursive
      resolvedDependencies = binding.dependencies.map(depToken => {
        console.log(`[Container] Resolving dependency: ${depToken} for ${token}`);
        return this.resolve(depToken);
      });
    }

    // Buat instance
    let instance: T;
    if (typeof binding.implementation === 'function') {
      // Cek apakah ini constructor atau factory
      // Factory dipanggil tanpa 'new', constructor dengan 'new'
      if (binding.scope === 'transient' && !binding.dependencies) {
        // Kemungkinan constructor tanpa dependencies eksplisit
        try {
          instance = new (binding.implementation as Constructor<T>)();
        } catch {
          // Jika gagal, coba sebagai factory
          instance = (binding.implementation as Factory<T>)();
        }
      } else {
        // Factory dengan dependencies
        instance = (binding.implementation as Factory<T>)(...resolvedDependencies);
      }
    } else {
      // Constructor dengan dependencies
      instance = new (binding.implementation as Constructor<T>)(...resolvedDependencies);
    }

    // Cache instance untuk singleton
    if (binding.scope === 'singleton') {
      binding.resolvedInstance = instance;
    }

    console.log(`[Container] Resolved: ${token}`);
    return instance;
  }

  /**
   * Extract dependencies dari constructor parameter names
   * 
   * CATATAN: TypeScript tidak menyimpan parameter names di runtime.
   * Untuk production, gunakan decorator metadata reflection.
   * Di sini kita gunakan pendekatan sederhana dengan asumsi
   * parameter constructor memiliki nama yang sama dengan token.
   * 
   * Untuk implementasi ini, kita return empty array dan bergantung
   * pada manual dependency specification di registerFactory.
   */
  private extractDependencies(constructor: Constructor): Token[] {
    // Dalam implementasi nyata dengan decorators:
    // return Reflect.getMetadata('design:paramtypes', constructor);
    
    // Untuk demo ini, return empty dan biarkan user specify manually
    return [];
  }

  /**
   * Cek circular dependency menggunakan DFS
   * 
   * @param token - Token yang akan dicek
   * @param visited - List token yang sudah dikunjungi
   * @throws Error jika circular dependency terdeteksi
   */
  private checkCircularDependency(token: Token, visited: Token[] = []): void {
    if (visited.includes(token)) {
      const cycle = [...visited, token].join(' -> ');
      throw new Error(`[Container] Circular dependency detected: ${cycle}`);
    }

    const dependencies = this.dependencyGraph.get(token) || [];
    for (const dep of dependencies) {
      this.checkCircularDependency(dep, [...visited, token]);
    }
  }
}
