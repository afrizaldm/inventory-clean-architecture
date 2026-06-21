# 📚 Panduan Belajar Hexagonal/Clean Architecture + Modular Monolith

Implementasi lengkap **Hexagonal Architecture** (Ports & Adapters) dengan pendekatan **Modular Monolith** menggunakan TypeScript.

---

## 🎯 Tujuan Pembelajaran

Proyek ini dirancang untuk memahami:

1. **Dependency Inversion Principle (DIP)** - Bagaimana bergantung pada abstraksi, bukan implementasi
2. **Pemisahan Registry dan Container** - Bagaimana DI Container bekerja dari scratch
3. **Komunikasi Antar Modul** - Bagaimana modul berkomunikasi tanpa coupling langsung
4. **Driving & Driven Adapters** - Bagaimana HTTP request dan Event diintegrasikan
5. **Composition Root Pattern** - Bagaimana mengorkestrasi seluruh aplikasi

---

## 📁 Struktur Proyek

```
src/
├── bootstrap/                    # COMPOSITION ROOT - Entry Point Aplikasi
│   ├── main.ts                   # Aplikasi entry point & HTTP server setup
│   └── container.ts              # DI Container implementation (dari scratch!)
│
├── modules/                      # MODULAR MONOLITH - Business Modules
│   │
│   ├── inventory/                # Modul Inventory (Manajemen Produk & Stock)
│   │   ├── domain/               # DOMAIN LAYER - Business Logic Murni
│   │   │   ├── entities/         # Product Entity
│   │   │   ├── value-objects/    # Quantity, Money (immutable objects)
│   │   │   ├── events/           # ProductStockReduced Domain Event
│   │   │   └── repositories/     # IProductRepository (INTERFACE/PORT)
│   │   │
│   │   ├── application/          # APPLICATION LAYER - Use Cases
│   │   │   └── use-cases/        # CreateProductUseCase, ReduceStockUseCase
│   │   │
│   │   ├── infrastructure/       # INFRASTRUCTURE LAYER - Implementations
│   │   │   ├── repositories/     # ProductRepository (implementasi in-memory)
│   │   │   ├── adapters/         # InventoryCheckerAdapter (cross-module!)
│   │   │   └── event-handlers/   # ProductStockReducedHandler
│   │   │
│   │   ├── contracts/            # Public interfaces untuk modul lain
│   │   └── registration.ts       # Dependency registration untuk modul ini
│   │
│   └── order/                    # Modul Order (Manajemen Pesanan)
│       ├── domain/
│       │   ├── entities/         # Order Entity
│       │   ├── events/           # OrderCreated Domain Event
│       │   └── repositories/     # IOrderRepository (INTERFACE/PORT)
│       │
│       ├── application/
│       │   └── use-cases/        # CreateOrderUseCase
│       │
│       ├── infrastructure/
│       │   ├── repositories/     # OrderRepository (implementasi in-memory)
│       │   └── event-handlers/   # OrderCreatedHandler
│       │
│       ├── contracts/            # IInventoryChecker (interface untuk inventory)
│       └── registration.ts       # Dependency registration untuk modul ini
│
├── shared/                       # SHARED KERNEL - Common Infrastructure
│   ├── kernel/                   # Shared interfaces
│   │   ├── IRepository.ts        # Generic repository interface
│   │   └── IEventBus.ts          # Event bus interface
│   │
│   ├── infrastructure/           # Shared implementations
│   │   └── services/
│   │       ├── EventBus.ts       # Pub/sub event bus
│   │       └── Logger.ts         # Logging service
│   │
│   └── registration.ts           # Shared dependencies registration
│
└── types/                        # Global type definitions
    └── index.ts                  # IUseCase, IEventHandler, IDomainEvent
```

---

## 🔑 Konsep Inti yang Harus Dipahami

### 1. Dependency Rule (Clean Architecture)

```
┌─────────────────────────────────────┐
│         INFRASTRUCTURE              │  ← Paling Luar (Framework, DB, UI)
│  ┌───────────────────────────────┐  │
│  │        APPLICATION            │  │  ← Use Cases, Application Services
│  │  ┌─────────────────────────┐  │  │
│  │  │         DOMAIN          │  │  │  ← Entities, Value Objects, Events
│  │  │    (BUSINESS LOGIC)     │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**ATURAN EMAS:** 
- Kode di dalam **HANYA BOLEH** bergantung pada kode di lapisan lebih dalam
- Domain layer **TIDAK BOLEH** import dari application atau infrastructure
- Infrastructure layer **HARUS** implement interfaces dari domain layer

### 2. Ports & Adapters (Hexagonal Architecture)

```
                    ┌──────────────────┐
                    │  DRIVING ADAPTER │  ← Input: HTTP, CLI, GraphQL
                    │  (Express.js)    │
                    └────────┬─────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │                                         │
        │           APPLICATION CORE              │
        │  ┌─────────────────────────────────┐   │
        │  │    Use Cases + Domain Layer     │   │
        │  └─────────────────────────────────┘   │
        │                                         │
        └────────────────────┬────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  DRIVEN ADAPTER  │  ← Output: Repository, Event Handler
                    │  (In-Memory DB)  │
                    └──────────────────┘
```

**PORT** = Interface yang mendefinisikan kontrak  
**ADAPTER** = Implementasi konkret dari interface

### 3. Dependency Injection Container

Container bertanggung jawab untuk:
1. **Registry** - Mencatat mapping antara interface dan implementation
2. **Resolution** - Membuat instance dengan dependencies yang benar
3. **Lifetime Management** - Mengelola singleton vs transient scope

```typescript
// CONTOH: Cara kerja container

// 1. REGISTER - Catat binding
container.registerSingleton<IEventBus>('IEventBus', EventBus);

// 2. RESOLVE - Buat instance dengan dependencies
const eventBus = container.resolve<IEventBus>('IEventBus');
// Container akan:
// - Cek apakah sudah ada instance (karena singleton)
// - Jika belum, buat instance baru EventBus
// - Return instance
```

### 4. Komunikasi Antar Modul

```
┌─────────────────┐                    ┌─────────────────┐
│  ORDER MODULE   │                    │ INVENTORY MODULE│
│                 │                    │                 │
│  [IInventory    │◄──── INTERFACE ───►│  [Inventory     │
│   Checker]      │    (Contract)      │   CheckerAdapter│
│                 │                    │                 │
│                 │                    │  [IProduct      │
│  [CreateOrder   │──── DEPENDS ON ───►│   Repository]   │
│   UseCase]      │    [ReduceStock    │                 │
│                 │     UseCase]       │                 │
└─────────────────┘                    └─────────────────┘
         │                                      │
         └──────────────┬───────────────────────┘
                        │
              ┌─────────▼──────────┐
              │  COMPOSITION ROOT  │
              │  (main.ts)         │
              │  - Wire all deps   │
              │  - Cross-module    │
              └────────────────────┘
```

**KUNCI:** Order module TIDAK import langsung dari Inventory module!

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan:
1. Start server di `http://localhost:3000`
2. Otomatis menjalankan demo flow
3. Menampilkan log lengkap di console

### 3. Testing Manual dengan curl

```bash
# Create product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "prod-001",
    "name": "Test Product",
    "price": 50000,
    "initialStock": 20
  }'

# Get product
curl http://localhost:3000/products/prod-001

# Create order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "order-001",
    "customerId": "cust-001",
    "items": [
      { "productId": "prod-001", "quantity": 3 }
    ]
  }'
```

---

## 📖 Penjelasan Detail Setiap Komponen

### Domain Layer (Lapisan Terdalam)

**Entity** - Objek bisnis dengan identity dan lifecycle:
```typescript
// src/modules/inventory/domain/entities/Product.ts
export class Product {
  public readonly id: string;        // Identity
  private _quantity: Quantity;       // State yang bisa berubah
  
  reduceStock(amount: number): boolean {
    // Business logic di sini!
  }
}
```

**Value Object** - Immutable object yang diidentifikasi oleh nilai:
```typescript
// src/modules/inventory/domain/value-objects/Quantity.ts
export class Quantity {
  private readonly _value: number;   // Readonly = immutable
  
  constructor(value: number) {
    if (value < 0) {
      throw new Error('Quantity cannot be negative'); // Validasi internal
    }
  }
}
```

**Domain Event** - Something that happened:
```typescript
// src/modules/inventory/domain/events/ProductStockReduced.ts
export class ProductStockReduced {
  public readonly productId: string;
  public readonly oldQuantity: number;
  public readonly newQuantity: number;
  public readonly occurredAt: Date;  // Timestamp otomatis
}
```

**Repository Interface (Port)** - Contract untuk persistence:
```typescript
// src/modules/inventory/domain/repositories/IProductRepository.ts
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
}
```

### Application Layer

**Use Case** - Encapsulates satu unit of work:
```typescript
// src/modules/inventory/application/use-cases/CreateProductUseCase.ts
export class CreateProductUseCase implements IUseCase<Request, Response> {
  constructor(private productRepository: IProductRepository) {}
  
  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    // 1. Validasi input
    // 2. Cek business rules
    // 3. Orchestrate domain entities
    // 4. Persist via repository
    // 5. Return response
  }
}
```

### Infrastructure Layer (Lapisan Terluar)

**Repository Implementation (Driven Adapter)**:
```typescript
// src/modules/inventory/infrastructure/repositories/ProductRepository.ts
export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    // Implementasi nyata: query ke database
    // Demo ini: in-memory Map
  }
}
```

**HTTP Controller (Driving Adapter)**:
```typescript
// src/bootstrap/main.ts
app.post('/products', async (req, res) => {
  // 1. Terima HTTP request
  // 2. Resolve use case dari container
  // 3. Execute use case
  // 4. Return HTTP response
});
```

**Event Handler (Driven Adapter)**:
```typescript
// src/modules/inventory/infrastructure/event-handlers/ProductStockReducedHandler.ts
export class ProductStockReducedHandler implements IEventHandler<ProductStockReduced> {
  handle(event: ProductStockReduced): void {
    // React to event - logging, notification, etc.
  }
}
```

---

## 🎓 Flow Lengkap: Dari HTTP Request ke Domain

### Scenario: Create Order

```
1. HTTP POST /orders
   │
   ▼
2. Express Route Handler (Driving Adapter)
   │
   ▼
3. Container.resolve('CreateOrderUseCase')
   │
   ▼
4. CreateOrderUseCase.execute()
   │
   ├─► 4a. IInventoryChecker.checkStock()  ← Cross-module call!
   │       │
   │       ▼
   │    InventoryCheckerAdapter
   │       │
   │       ▼
   │    IProductRepository.findById()
   │
   ├─► 4b. new Order()  ← Create domain entity
   │
   ├─► 4c. IOrderRepository.save()
   │
   └─► 4d. ReduceStockUseCase.execute()  ← Cross-module call!
           │
           ▼
        Product.reduceStock()  ← Domain entity method
           │
           ▼
        IProductRepository.update()
           │
           ▼
        EventBus.publish(ProductStockReduced)  ← Domain Event!
           │
           ├─► ProductStockReducedHandler.handle()  ← Event Handler
           │
           ▼
        EventBus.publish(OrderCreated)  ← Another Domain Event!
           │
           └─► OrderCreatedHandler.handle()  ← Another Event Handler
           
5. Return HTTP Response
```

---

## 💡 Kelebihan Arsitektur Ini

### Hexagonal/Clean Architecture

| Kelebihan | Penjelasan |
|-----------|------------|
| **Testabilitas** | Domain bisa di-test tanpa database atau framework |
| **Maintainability** | Ganti teknologi (Express→Fastify, Map→PostgreSQL) tanpa ubah domain |
| **Flexibility** | Mudah tambah channel baru (GraphQL, gRPC, CLI) |
| **Business Focus** | Kode domain mencerminkan aturan bisnis dengan jelas |
| **Separation of Concerns** | Setiap layer punya tanggung jawab spesifik |

### Modular Monolith

| Kelebihan | Penjelasan |
|-----------|------------|
| **Simple Deployment** | Satu deployable unit, tidak kompleks seperti microservices |
| **Performance** | Komunikasi antar modul dalam proses (bukan network call) |
| **Data Consistency** | Bisa gunakan transaksi ACID lintas modul |
| **Easy Debugging** | Trace request dalam satu codebase |
| **Evolution Path** | Bisa dipecah ke microservices nanti jika perlu |
| **Cost Efficient** | Tidak ada overhead infrastruktur distributed system |

---

## ⚠️ Hal-Hal Penting untuk Dipelajari

### 1. Jangan Lakukan Ini ❌

```typescript
// SALAH: Domain import dari infrastructure
import { ProductRepository } from '../infrastructure/repositories/ProductRepository';
export class Product { ... }  // ❌ TIDAK BOLEH!

// SALAH: Use case instantiate repository langsung
const repo = new ProductRepository();  // ❌ TIDAK BOLEH!

// SALAH: Module import langsung dari module lain
import { ProductRepository } from '../../inventory/...';  // ❌ TIDAK BOLEH!
```

### 2. Lakukan Ini ✅

```typescript
// BENAR: Domain hanya import dari domain lain
import { Quantity } from '../value-objects/Quantity';
export class Product { ... }  // ✅ OK!

// BENAR: Use case dapat repository via constructor injection
constructor(private productRepository: IProductRepository) {}  // ✅ OK!

// BENAR: Module bergantung pada interface
constructor(private inventoryChecker: IInventoryChecker) {}  // ✅ OK!
```

### 3. Composition Root adalah SATU-SATUYA tempat untuk:

```typescript
// ✅ OK di main.ts (Composition Root)
const repo = new ProductRepository();
const useCase = new CreateProductUseCase(repo);

// ❌ TIDAK OK di tempat lain!
```

---

## 📝 Checklist Pemahaman

Setelah mempelajari proyek ini, pastikan Anda bisa menjawab:

- [ ] Apa perbedaan Entity dan Value Object?
- [ ] Mengapa Domain layer tidak boleh import dari Infrastructure?
- [ ] Apa fungsi dari Repository Interface?
- [ ] Bagaimana cara kerja Dependency Injection Container?
- [ ] Apa bedanya Singleton dan Transient scope?
- [ ] Bagaimana modul Order berkomunikasi dengan modul Inventory?
- [ ] Apa itu Domain Event dan kapan menggunakannya?
- [ ] Apa perbedaan Driving Adapter dan Driven Adapter?
- [ ] Di mana seharusnya wiring dependencies dilakukan?
- [ ] Mengapa Use Case tidak instantiate repository langsung?

---

## 🔗 Langkah Selanjutnya

Setelah memahami dasar-dasarnya, pelajari:

1. **CQRS Pattern** - Memisahkan read dan write operations
2. **Event Sourcing** - Menyimpan state sebagai sequence of events
3. **Saga Pattern** - Managing distributed transactions
4. **Advanced DI** - Automatic dependency resolution dengan reflection
5. **Testing Strategies** - Unit test, integration test, contract test

---

## 📚 Referensi Tambahan

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/)
- [Domain-Driven Design by Eric Evans](https://domainlanguage.com/)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Happy Learning! 🚀**

Jika ada pertanyaan atau ingin diskusi lebih lanjut, silakan eksplorasi kode dan coba modifikasi untuk memahami lebih dalam!
