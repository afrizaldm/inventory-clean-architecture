# 🏗️ Hexagonal/Clean Architecture + Modular Monolith

Implementasi lengkap **Hexagonal Architecture** (Ports & Adapters) dengan pendekatan **Modular Monolith** menggunakan TypeScript. Project ini dirancang untuk **pembelajaran** konsep arsitektur tingkat lanjut.

## 📋 Daftar Isi

- [Konsep Utama](#-konsep-utama)
- [Struktur Project](#-struktur-project)
- [Penjelasan Arsitektur](#-penjelasan-arsitektur)
- [Cara Menjalankan](#-cara-menjalankan)
- [Demo Flow](#-demo-flow)
- [Key Learnings](#-key-learnings)

---

## 🎯 Konsep Utama

### 1. Hexagonal Architecture (Ports & Adapters)

```
                    ┌─────────────────┐
                    │   HTTP Request  │ ← Driving Adapter (Primary)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Use Cases     │ ← Application Layer
                    │  (Application   │
                    │    Services)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│   Domain      │   │   Domain      │   │   Domain      │
│   Entities    │   │   Value Obj   │   │   Events      │
│               │   │               │   │               │
└───────┬───────┘   └───────────────┘   └───────────────┘
        │
        │         Domain Layer (Business Logic)
        │         TIDAK bergantung pada framework/database
        │
┌───────▼───────┐
│  Repository   │ ← Port (Interface)
│  Interface    │
└───────┬───────┘
        │
┌───────▼───────┐
│  Repository   │ ← Driven Adapter (Secondary)
│  Implementation│  (In-memory / Database)
└───────────────┘
```

**Karakteristik:**
- **Domain Layer** di tengah, tidak bergantung pada apapun
- **Driving Adapters** (HTTP, CLI) memanggil Use Cases
- **Driven Adapters** (Database, External APIs) diimplementasikan di Infrastructure

### 2. Modular Monolith

```
src/
├── modules/
│   ├── inventory/     # Modul Inventory (bounded context)
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── contracts/
│   └── order/         # Modul Order (bounded context)
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       ├── contracts/
│       └── registration.ts
└── shared/            # Shared kernel (infrastructure bersama)
```

**Prinsip:**
- Setiap modul **mandiri** dan punya domain sendiri
- Modul **tidak boleh** import langsung dari modul lain
- Komunikasi antar modul via **interface** (contracts)
- Wiring dilakukan di **Composition Root**

### 3. Dependency Inversion Principle (SOLID-D)

```typescript
// ❌ SALAH: Modul Order bergantung langsung pada Inventory Module
import { ProductRepository } from '../inventory/...';

// ✅ BENAR: Modul Order bergantung pada interface
import { IInventoryChecker } from './contracts/IInventoryChecker';
// Implementasi di-wire di Composition Root
```

---

## 📁 Struktur Project

```
src/
├── bootstrap/                    # 🎼 COMPOSITION ROOT
│   ├── main.ts                   # Entry point, wiring semua dependencies
│   └── container.ts              # DI Container implementation
│
├── modules/
│   ├── inventory/                # 📦 MODUL INVENTORY
│   │   ├── domain/               #   Domain Layer (business logic murni)
│   │   │   ├── entities/         #     Product entity
│   │   │   ├── value-objects/    #     Quantity, Money
│   │   │   ├── events/           #     ProductStockReduced event
│   │   │   └── repositories/     #     IProductRepository (interface)
│   │   ├── application/          #   Application Layer (use cases)
│   │   │   └── use-cases/        #     CreateProduct, ReduceStock
│   │   ├── infrastructure/       #   Infrastructure Layer (adapters)
│   │   │   ├── repositories/     #     ProductRepository (implementation)
│   │   │   ├── adapters/         #     InventoryCheckerAdapter
│   │   │   └── event-handlers/   #     ProductStockReducedHandler
│   │   └── registration.ts       #   Module dependency registration
│   │
│   └── order/                    # 🛒 MODUL ORDER
│       ├── domain/
│       │   ├── entities/         #   Order entity
│       │   ├── events/           #   OrderCreated event
│       │   └── repositories/     #   IOrderRepository (interface)
│       ├── application/
│       │   └── use-cases/        #   CreateOrderUseCase
│       ├── infrastructure/
│       │   ├── repositories/     #   OrderRepository
│       │   └── event-handlers/   #   OrderCreatedHandler
│       ├── contracts/            #   📜 Interfaces untuk modul lain
│       │   └── IInventoryChecker.ts
│       └── registration.ts
│
├── shared/                       # 🔧 SHARED INFRASTRUCTURE
│   ├── kernel/                   #   Shared interfaces
│   │   ├── IRepository.ts
│   │   └── IEventBus.ts
│   ├── infrastructure/
│   │   └── services/
│   │       ├── EventBus.ts
│   │       └── Logger.ts
│   └── registration.ts
│
└── types/                        # 📝 Global type definitions
    └── index.ts
```

---

## 🔍 Penjelasan Arsitektur

### 1. Bagaimana Registry dan Container Bekerja

#### Registry (Pencatatan)
Setiap modul memiliki file `registration.ts` yang **mendaftarkan** dependencies:

```typescript
// src/modules/inventory/registration.ts
export function registerInventoryModule(container: Container): void {
  // Daftarkan Repository sebagai Singleton
  container.registerSingleton<IProductRepository>(
    'IProductRepository', 
    ProductRepository
  );
  
  // Daftarkan Use Case dengan Factory
  container.registerFactory(
    'CreateProductUseCase',
    (productRepo) => new CreateProductUseCase(productRepo),
    ['IProductRepository']
  );
}
```

#### Container (Eksekusi)
Container menyimpan bindings dan **resolve** dependencies saat dibutuhkan:

```typescript
// src/bootstrap/container.ts
class Container {
  private bindings: Map<Token, Binding> = new Map();
  
  resolve<T>(token: Token): T {
    // 1. Cari binding
    // 2. Resolve dependencies recursively
    // 3. Instantiate dan return
  }
}
```

**Flow:**
```
1. registerSingleton('IProductRepository', ProductRepository)
   → Simpan di Map: { 'IProductRepository': { impl: ProductRepository, scope: 'singleton' } }

2. container.resolve('IProductRepository')
   → Cek Map → Buat instance (atau return cached jika singleton)
   → Return instance
```

### 2. Komunikasi Antar Modul Tanpa Coupling

**Problem:** Modul Order perlu cek stock dari modul Inventory.

**Solusi:** Gunakan interface di contracts + adapter pattern.

```
┌─────────────────┐         ┌─────────────────┐
│  Order Module   │         │ Inventory Module│
│                 │         │                 │
│  CreateOrder    │ ──────► │  IInventory     │
│  UseCase        │ depends │  Checker        │
│                 │   on    │  (interface)    │
└─────────────────┘         └────────┬────────┘
                                     │
                              implemented by
                                     │
                              ┌──────▼────────┐
                              │ Inventory     │
                              │ CheckerAdapter│
                              │ (uses Product │
                              │  Repository)  │
                              └───────────────┘
```

**Code:**
```typescript
// Di modul Order (contracts/IInventoryChecker.ts)
export interface IInventoryChecker {
  checkStock(productId: string): Promise<number>;
}

// Di modul Order (use-cases/CreateOrderUseCase.ts)
constructor(private inventoryChecker: IInventoryChecker) {}

// Di Composition Root (main.ts)
// Wire interface ke implementasi dari modul Inventory
container.registerSingleton<IInventoryChecker>(
  'IInventoryChecker', 
  InventoryCheckerAdapter  // Dari modul Inventory!
);
```

**Hasil:** 
- ✅ Modul Order **tidak import** dari modul Inventory
- ✅ Modul Order hanya tahu tentang **interface**
- ✅ Implementasi di-wire di **Composition Root**

### 3. Alur HTTP Request ke Use Case

```
HTTP POST /orders
       │
       ▼
┌──────────────────┐
│ Express Route    │  (Driving Adapter)
│ - Parse JSON     │
│ - Validate input │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Container        │
│ .resolve()       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ CreateOrderUseCase│
│ - Check stock    │
│ - Create Order   │
│ - Reduce stock   │
│ - Publish event  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Response JSON    │
└──────────────────┘
```

**Code di main.ts:**
```typescript
app.post('/orders', async (req, res) => {
  // 1. Resolve use case dari container
  const useCase = container.resolve<CreateOrderUseCase>('CreateOrderUseCase');
  
  // 2. Execute dengan data dari request
  const result = await useCase.execute({
    id: req.body.id,
    customerId: req.body.customerId,
    items: req.body.items
  });
  
  // 3. Return response
  res.json(result);
});
```

### 4. Domain Event Dispatch & Handle

```
┌─────────────────┐
│ ReduceStockUseCase│
│                 │
│ 1. Kurangi stock│
│ 2. Publish event│
└────────┬────────┘
         │ publish()
         ▼
┌─────────────────┐
│ EventBus        │
│ (Pub/Sub)       │
└────────┬────────┘
         │ notify all subscribers
         ├──────────────────┐
         ▼                  ▼
┌─────────────────┐ ┌─────────────────┐
│ StockReduced    │ │ (Handler lain   │
│ Handler         │ │  bisa subscribe)│
│ - Log event     │ │                 │
│ - Low stock     │ │                 │
│   alert         │ │                 │
└─────────────────┘ └─────────────────┘
```

**Code:**
```typescript
// Publisher (di ReduceStockUseCase)
const event = new ProductStockReduced({...});
this.eventBus.publish(event);

// Subscriber (di main.ts - Composition Root)
const handler = new ProductStockReducedHandler(logger);
eventBus.subscribe('ProductStockReduced', handler);

// Handler
class ProductStockReducedHandler implements IEventHandler<ProductStockReduced> {
  handle(event: ProductStockReduced): void {
    logger.info(`Stock reduced: ${event.productId}`);
  }
}
```

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` dan **demo flow otomatis dijalankan**.

### 3. Testing Manual dengan cURL

**Terminal 1:** Jalankan server
```bash
npm run dev
```

**Terminal 2:** Test endpoints

```bash
# 1. Create Product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "prod-001",
    "name": "Test Product",
    "price": 50000,
    "initialStock": 20
  }'

# 2. Get Product
curl http://localhost:3000/products/prod-001

# 3. Create Order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "order-001",
    "customerId": "cust-john",
    "items": [
      { "productId": "prod-001", "quantity": 3 }
    ]
  }'

# 4. Try to over-order (should fail)
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "order-002",
    "customerId": "cust-jane",
    "items": [
      { "productId": "prod-001", "quantity": 50 }
    ]
  }'
```

---

## 🎬 Demo Flow

Saat aplikasi dijalankan, demo flow otomatis berjalan:

```
🚀 STARTING DEMO FLOW

📦 STEP 1: Creating product "Gaming Laptop" with stock 10...
✅ Product created: { success: true, ... }

🛒 STEP 2: Creating order for 2 "Gaming Laptop"...
   This will:
   1. Check stock via IInventoryChecker (cross-module)
   2. Create order entity
   3. Reduce stock (trigger ProductStockReduced event)
   4. Publish OrderCreated event
✅ Order created: { success: true, ... }

🛒 STEP 3: Creating another order for 8 "Gaming Laptop"...
✅ Order created: { success: true, ... }

❌ STEP 4: Trying to create order for 5 "Gaming Laptop"...
   Expected: FAILURE (insufficient stock)
🚫 Order failed as expected: { success: false, message: "Insufficient stock..." }

✨ DEMO FLOW COMPLETED SUCCESSFULLY!

Key learnings:
1. ✅ Modules communicate via interfaces
2. ✅ Domain events published and handled automatically
3. ✅ Business rules prevent overselling
4. ✅ Dependency Injection enables loose coupling
5. ✅ Composition Root wires all dependencies
```

---

## 💡 Key Learnings

### 1. Dependency Inversion Principle
- **High-level modules** (Use Cases) tidak bergantung pada **low-level modules** (Database)
- Keduanya bergantung pada **abstractions** (Interfaces)
- Memudahkan testing dan pergantian implementation

### 2. Registry vs Container
| Registry | Container |
|----------|-----------|
| Pencatatan bindings | Eksekusi resolve |
| `registerSingleton()` | `resolve()` |
| Di `registration.ts` | Dipanggil di runtime |

### 3. Cross-Module Communication
- **TIDAK** direct import antar modul
- Gunakan **interface** di folder `contracts/`
- **Adapter** mengimplementasikan interface
- **Wiring** di Composition Root

### 4. Driving vs Driven Adapters
| Driving (Primary) | Driven (Secondary) |
|-------------------|-------------------|
| HTTP Controllers | Repository Implementation |
| CLI Commands | Event Handlers |
| GraphQL Resolvers | External API Clients |

### 5. Composition Root Pattern
- **SATU tempat** untuk wiring semua dependencies
- Memisahkan konfigurasi dari business logic
- Memudahkan understanding seluruh aplikasi

---

## 📚 Resources Lanjutan

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

## ⚠️ Catatan Penting

Project ini adalah **educational purpose**:
- ✅ Menggunakan in-memory storage (bukan database nyata)
- ✅ Implementasi DI Container sederhana (bukan library production)
- ✅ Error handling minimal
- ✅ Fokus pada kejelasan arsitektur

Untuk production, pertimbangkan:
- Database persistence (PostgreSQL, MongoDB)
- Proper error handling & logging
- Validation libraries (class-validator, zod)
- DI Container library (Inversify, tsyringe)
- Testing suite (Jest, Mocha)

---

Happy Learning! 🎓
