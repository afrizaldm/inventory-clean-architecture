# 📚 Panduan Belajar Hexagonal/Clean Architecture + Modular Monolith

Panduan lengkap untuk memahami arsitektur perangkat lunak modern dengan pendekatan Hexagonal/Clean Architecture dan Modular Monolith.

---

## 🎯 Daftar Isi

1. [Konsep Dasar](#konsep-dasar)
2. [Step-by-Step Implementation](#step-by-step-implementation)
3. [Hal-Hal Penting yang Harus Dipahami](#hal-hal-penting-yang-harus-dipahami)
4. [Kelebihan Hexagonal/Clean Architecture](#kelebihan-hexagonalclean-architecture)
5. [Kelebihan Modular Monolith](#kelebihan-modular-monolith)
6. [Kapan Menggunakan Arsitektur Ini](#kapan-menggunakan-arsitektur-ini)
7. [Common Pitfalls](#common-pitfalls)
8. [Best Practices](#best-practices)

---

## 🏗️ Konsep Dasar

### Apa itu Hexagonal Architecture?

**Hexagonal Architecture** (atau **Ports and Adapters**) adalah pola arsitektur yang dirancang untuk:
- Memisahkan logika bisnis dari infrastruktur eksternal
- Membuat aplikasi tidak bergantung pada framework, database, atau UI
- Memudahkan testing dan maintenance

```
                    ┌─────────────────┐
                    │   UI / API      │
                    │  (Driving)      │
                    └────────┬────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │           APPLICATION LAYER             │
        │         (Use Cases / Commands)          │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │            DOMAIN LAYER                 │
        │    (Entities, Value Objects, Events)    │
        │         💖 CORE BUSINESS LOGIC 💖       │
        └────────────────────┬────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Infrastructure │
                    │   (Driven)      │
                    │  DB, Email, etc │
                    └─────────────────┘
```

### Apa itu Clean Architecture?

**Clean Architecture** adalah evolusi dari Hexagonal Architecture yang diperkenalkan oleh Robert C. Martin (Uncle Bob). Prinsip utamanya:

```
Dependencies point INWARD →
    
┌─────────────────────────────────────────────────┐
│                    Entities                     │
│         (Enterprise Business Rules)             │
├─────────────────────────────────────────────────┤
│                Use Cases                        │
│         (Application Business Rules)            │
├─────────────────────────────────────────────────┤
│         Interface Adapters                      │
│    (Controllers, Presenters, Gateways)          │
├─────────────────────────────────────────────────┤
│           Frameworks & Drivers                  │
│      (UI, DB, Web, Devices, External APIs)      │
└─────────────────────────────────────────────────┘
```

### Apa itu Modular Monolith?

**Modular Monolith** adalah pendekatan di mana:
- Aplikasi tetap berupa satu deployment unit (monolith)
- Tapi kode diorganisir menjadi modul-modul yang terpisah dengan boundary yang jelas
- Setiap modul memiliki tanggung jawab bisnis tertentu
- Modul berkomunikasi melalui interface, bukan implementasi langsung

```
┌──────────────────────────────────────────────────────────┐
│                   MONOLITH APPLICATION                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Inventory  │  │    Order    │  │   Payment   │       │
│  │   Module    │  │   Module    │  │   Module    │       │
│  │             │  │             │  │             │       │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │       │
│  │ │ Domain  │ │  │ │ Domain  │ │  │ │ Domain  │ │       │
│  │ ├─────────┤ │  │ ├─────────┤ │  │ ├─────────┤ │       │
│  │ │  App    │ │  │ │  App    │ │  │ │  App    │ │       │
│  │ ├─────────┤ │  │ ├─────────┤ │  │ ├─────────┤ │       │
│  │ │ Infra   │ │  │ │ Infra   │ │  │ │ Infra   │ │       │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │               │
│         └────────────────┼────────────────┘               │
│                          │                                │
│              ┌───────────▼───────────┐                    │
│              │   Shared Kernel       │                    │
│              │  (Common Interfaces)  │                    │
│              └───────────────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Pahami Layer Dependency Rule

**ATURAN EMAS:** Dependencies hanya boleh pointing INWARD!

```typescript
// ✅ BENAR - Domain tidak import dari luar
// src/modules/inventory/domain/entities/Product.ts
import { Quantity } from '../value-objects/Quantity'; // Import dari layer yang sama

export class Product {
  // Domain logic murni, tanpa dependency ke framework/database
}

// ❌ SALAH - Domain import dari infrastructure
import { DatabaseConnection } from '../../infrastructure/db'; // DON'T DO THIS!
```

**Mengapa?** 
- Domain adalah inti bisnis Anda
- Jika domain bergantung pada framework/database, sulit untuk:
  - Mengganti database
  - Testing tanpa database
  - Migrasi ke framework lain

### Step 2: Mulai dari Domain Layer

Domain layer adalah **CORE** dari aplikasi Anda. Mulai dari sini!

#### 2.1 Buat Entities

Entity adalah objek yang memiliki identitas unik dan lifecycle.

```typescript
// src/modules/inventory/domain/entities/Product.ts

/**
 * Entity Product mewakili produk dalam inventory
 * 
 * Karakteristik Entity:
 * 1. Memiliki identitas unik (id)
 * 2. Memiliki lifecycle (dibuat, diubah, mungkin dihapus)
 * 3. State dapat berubah sepanjang waktu
 * 4. Mengandung business logic
 */
export interface IProductProps {
  id: string;        // Identity
  name: string;      // Attribute
  price: number;     // Attribute (dalam satuan terkecil, misal sen)
  quantity: Quantity; // Value Object
}

export class Product {
  public readonly id: string;
  public readonly name: string;
  public readonly price: number;
  private _quantity: Quantity; // Private untuk encapsulation

  constructor(props: IProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this._quantity = props.quantity;
    
    // Invariant: Pastikan state selalu valid
    this.validate();
  }

  /**
   * Getter untuk quantity
   * Kita return copy atau immutable value untuk mencegah mutasi dari luar
   */
  get quantity(): Quantity {
    return this._quantity;
  }

  /**
   * Business Logic: Kurangi stok
   * Method ini mengandung rule bisnis penting:
   * - Tidak boleh mengurangi stok lebih dari yang tersedia
   * - Mengembalikan boolean untuk menunjukkan success/failure
   */
  reduceStock(amount: number): boolean {
    if (this._quantity.value < amount) {
      return false; // Stok tidak cukup
    }
    
    // Buat Quantity baru (immutable pattern)
    this._quantity = new Quantity(this._quantity.value - amount);
    return true;
  }

  /**
   * Business Logic: Tambah stok
   */
  increaseStock(amount: number): void {
    this._quantity = new Quantity(this._quantity.value + amount);
  }

  /**
   * Validate invariant - pastikan entity selalu dalam state valid
   */
  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (!this.name || this.name.trim() === '') {
      throw new Error('Product name is required');
    }
    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }
  }
}
```

#### 2.2 Buat Value Objects

Value Object adalah objek yang didefinisikan oleh atributnya, bukan identitas.

```typescript
// src/modules/inventory/domain/value-objects/Quantity.ts

/**
 * Value Object: Quantity
 * 
 * Karakteristik Value Object:
 * 1. Tidak memiliki identitas - dua Quantity dengan nilai sama adalah sama
 * 2. Immutable - sekali dibuat, tidak bisa diubah
 * 3. Self-validating - validasi dilakukan di constructor
 * 4. Dapat digunakan di berbagai tempat
 * 
 * Mengapa menggunakan Value Object?
 * - Mencegah "Primitive Obsession" (terlalu banyak pakai string/number)
 * - Encapsulate validation logic
 * - Make illegal states unrepresentable
 */
export class Quantity {
  private readonly _value: number;

  constructor(value: number) {
    // Validasi di constructor - pastikan selalu valid
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
    this._value = value;
  }

  /**
   * Getter untuk mendapatkan nilai
   * Return primitive value untuk interoperability
   */
  get value(): number {
    return this._value;
  }

  /**
   * Comparison method
   * Dua Quantity dianggap sama jika nilainya sama
   */
  equals(other: Quantity): boolean {
    return this._value === other.value;
  }

  /**
   * Addition - mengembalikan Quantity baru (immutable)
   */
  add(other: Quantity): Quantity {
    return new Quantity(this._value + other.value);
  }

  /**
   * Subtraction - mengembalikan Quantity baru (immutable)
   */
  subtract(other: Quantity): Quantity {
    return new Quantity(this._value - other.value);
  }

  /**
   * Check if greater than other
   */
  isGreaterThan(other: Quantity): boolean {
    return this._value > other.value;
  }

  /**
   * Check if less than or equal
   */
  isLessThanOrEqual(other: Quantity): boolean {
    return this._value <= other.value;
  }
}
```

```typescript
// src/modules/inventory/domain/value-objects/Money.ts

/**
 * Value Object: Money
 * 
 * Best Practice: Selalu simpan money dalam satuan terkecil (integer)
 * Contoh: Rp 100.000 disimpan sebagai 10000000 (dalam sen)
 * 
 * Mengapa?
 * - Menghindari floating point precision errors
 * - 0.1 + 0.2 !== 0.3 dalam floating point!
 */
export class Money {
  private readonly _amount: number; // Amount in smallest currency unit (sen)
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'IDR') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    this._amount = amount;
    this._currency = currency;
  }

  /**
   * Factory method untuk membuat Money dari decimal
   * Contoh: Money.fromDecimal(100000.00) => 10000000 sen
   */
  static fromDecimal(decimalAmount: number, currency: string = 'IDR'): Money {
    return new Money(Math.round(decimalAmount * 100), currency);
  }

  /**
   * Convert ke decimal untuk display
   * Contoh: 10000000 sen => 100000.00
   */
  toDecimal(): number {
    return this._amount / 100;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  /**
   * Addition - harus dalam currency yang sama
   */
  add(other: Money): Money {
    if (this._currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this._amount + other.amount, this._currency);
  }

  /**
   * Multiplication dengan scalar
   */
  multiply(scalar: number): Money {
    return new Money(Math.round(this._amount * scalar), this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other.amount && this._currency === other.currency;
  }
}
```

#### 2.3 Buat Domain Events

Domain Event adalah sesuatu yang terjadi di domain yang penting bagi stakeholder.

```typescript
// src/modules/inventory/domain/events/ProductStockReduced.ts

/**
 * Domain Event: ProductStockReduced
 * 
 * Karakteristik Domain Event:
 * 1. Past tense - menggambarkan sesuatu yang SUDAH terjadi
 * 2. Immutable - tidak bisa diubah setelah dibuat
 * 3. Self-contained - membawa semua data yang diperlukan
 * 4. Named after business occurrence, not technical trigger
 * 
 * Kapan menggunakan Domain Event?
 * - Ketika ada aksi yang memicu reaksi di bagian lain sistem
 * - Untuk decoupling antar modul
 * - Untuk audit trail
 * - Untuk eventual consistency
 */
export interface IProductStockReducedData {
  productId: string;
  oldQuantity: number;
  newQuantity: number;
  reducedBy: number;
  reason?: string; // Optional: alasan pengurangan
}

export class ProductStockReduced {
  public readonly productId: string;
  public readonly oldQuantity: number;
  public readonly newQuantity: number;
  public readonly reducedBy: number;
  public readonly reason?: string;
  public readonly occurredAt: Date;

  constructor(data: IProductStockReducedData) {
    // Validasi data event
    if (data.reducedBy <= 0) {
      throw new Error('reducedBy must be positive');
    }
    if (data.newQuantity >= data.oldQuantity) {
      throw new Error('newQuantity must be less than oldQuantity');
    }

    this.productId = data.productId;
    this.oldQuantity = data.oldQuantity;
    this.newQuantity = data.newQuantity;
    this.reducedBy = data.reducedBy;
    this.reason = data.reason;
    this.occurredAt = new Date(); // Timestamp saat event dibuat
  }

  /**
   * Serialize event untuk storage atau transmission
   */
  toJSON(): object {
    return {
      eventType: this.constructor.name,
      productId: this.productId,
      oldQuantity: this.oldQuantity,
      newQuantity: this.newQuantity,
      reducedBy: this.reducedBy,
      reason: this.reason,
      occurredAt: this.occurredAt.toISOString()
    };
  }
}
```

```typescript
// src/modules/order/domain/events/OrderCreated.ts

/**
 * Domain Event: OrderCreated
 * 
 * Event ini dipublish ketika order berhasil dibuat
 * Subscriber bisa:
 * - Mengirim email konfirmasi
 * - Update analytics
 * - Trigger fulfillment process
 * - dll
 */
import { IOrderItem } from '../entities/Order';

export interface IOrderCreatedData {
  orderId: string;
  customerId: string;
  items: IOrderItem[];
  totalAmount: number;
}

export class OrderCreated {
  public readonly orderId: string;
  public readonly customerId: string;
  public readonly items: IOrderItem[];
  public readonly totalAmount: number;
  public readonly occurredAt: Date;

  constructor(data: IOrderCreatedData) {
    this.orderId = data.orderId;
    this.customerId = data.customerId;
    // Copy array untuk immutability
    this.items = [...data.items];
    this.totalAmount = data.totalAmount;
    this.occurredAt = new Date();
  }

  toJSON(): object {
    return {
      eventType: this.constructor.name,
      orderId: this.orderId,
      customerId: this.customerId,
      itemCount: this.items.length,
      totalAmount: this.totalAmount,
      occurredAt: this.occurredAt.toISOString()
    };
  }
}
```

#### 2.4 Buat Repository Interfaces

Repository interface adalah PORT yang menghubungkan domain dengan dunia luar.

```typescript
// src/modules/inventory/domain/repositories/IProductRepository.ts

/**
 * Repository Interface (PORT)
 * 
 * Ini adalah contoh Dependency Inversion Principle:
 * - Domain mendefinisikan interface yang dibutuhkannya
 * - Infrastructure mengimplementasikan interface tersebut
 * - Domain TIDAK tahu tentang implementasi infrastructure
 * 
 * Mengapa interface di domain layer?
 * Karena domain yang menentukan apa yang dibutuhkannya,
 * bukan infrastructure yang menentukan apa yang disediakannya.
 */
import { Product } from '../entities/Product';

export interface IProductRepository {
  /**
   * Find product by ID
   * Returns null jika tidak ditemukan (bukan throw exception)
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Save new product atau update existing
   * (Upsert pattern)
   */
  save(product: Product): Promise<void>;

  /**
   * Update existing product
   * Throw error jika product tidak ada
   */
  update(product: Product): Promise<void>;

  /**
   * Delete product
   */
  delete(id: string): Promise<void>;

  /**
   * Find all products (optional, tergantung kebutuhan)
   */
  findAll(): Promise<Product[]>;
}
```

---

### Step 3: Application Layer

Application layer mengandung USE CASES - alur kerja spesifik aplikasi Anda.

#### 3.1 Command Pattern untuk Use Cases

```typescript
// src/types/index.ts

/**
 * Generic Use Case Interface
 * 
 * Pattern: Command Pattern
 * Setiap use case adalah command yang executable
 * 
 * Benefits:
 * - Konsistensi struktur
 * - Mudah testing
 * - Mudah composition
 */
export interface IUseCase<Request, Response> {
  execute(request: Request): Promise<Response>;
}

/**
 * Event Handler Interface
 */
export interface IEventHandler<TEvent> {
  handle(event: TEvent): void;
}
```

#### 3.2 Implementasi Use Case

```typescript
// src/modules/inventory/application/use-cases/CreateProductUseCase.ts

/**
 * Use Case: Create Product
 * 
 * Use Case adalah:
 * - Application Service yang mengkoordinir domain objects
 * - Mengandung application-specific business rules
 * - Transaction boundary (satu use case = satu transaction)
 * - Tidak mengandung business logic core (itu di domain)
 * 
 * Struktur Use Case:
 * 1. Input validation
 * 2. Fetch required data from repositories
 * 3. Execute domain logic
 * 4. Persist changes
 * 5. Publish domain events
 * 6. Return result
 */
import { IUseCase } from '../../../../types';
import { Product } from '../../domain/entities/Product';
import { Quantity } from '../../domain/value-objects/Quantity';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

// Request Object - Data yang dibutuhkan untuk use case ini
export interface CreateProductRequest {
  id: string;
  name: string;
  price: number; // Dalam desimal untuk convenience
  initialStock: number;
}

// Response Object - Hasil eksekusi use case
export interface CreateProductResponse {
  success: boolean;
  message: string;
  product?: Product;
  error?: string;
}

export class CreateProductUseCase implements IUseCase<CreateProductRequest, CreateProductResponse> {
  /**
   * Inject dependencies melalui constructor
   * Hanya bergantung pada interfaces, bukan implementations
   */
  constructor(private productRepository: IProductRepository) {}

  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      // Step 1: Input Validation
      const validationResult = this.validateInput(request);
      if (!validationResult.valid) {
        return {
          success: false,
          message: validationResult.error || 'Validation failed'
        };
      }

      // Step 2: Check business rules (product tidak boleh duplicate)
      const existingProduct = await this.productRepository.findById(request.id);
      if (existingProduct) {
        return {
          success: false,
          message: `Product with ID ${request.id} already exists`
        };
      }

      // Step 3: Create domain entity
      // Notice: Kita convert price dari decimal ke integer (sen)
      const product = new Product({
        id: request.id,
        name: request.name,
        price: Math.round(request.price * 100), // Convert to cents
        quantity: new Quantity(request.initialStock)
      });

      // Step 4: Persist
      await this.productRepository.save(product);

      // Step 5: Return success
      return {
        success: true,
        message: 'Product created successfully',
        product
      };

    } catch (error: any) {
      // Step 6: Handle unexpected errors
      return {
        success: false,
        message: `Unexpected error: ${error.message}`,
        error: error.stack
      };
    }
  }

  /**
   * Private helper method untuk validation
   * Memisahkan validation logic dari main flow
   */
  private validateInput(request: CreateProductRequest): { valid: boolean; error?: string } {
    if (!request.id || request.id.trim() === '') {
      return { valid: false, error: 'Product ID is required' };
    }
    if (!request.name || request.name.trim() === '') {
      return { valid: false, error: 'Product name is required' };
    }
    if (request.price <= 0) {
      return { valid: false, error: 'Price must be greater than 0' };
    }
    if (request.initialStock < 0) {
      return { valid: false, error: 'Initial stock cannot be negative' };
    }
    return { valid: true };
  }
}
```

```typescript
// src/modules/inventory/application/use-cases/ReduceStockUseCase.ts

/**
 * Use Case: Reduce Stock
 * 
 * Use case ini menarik karena:
 * 1. Berinteraksi dengan domain entity (Product.reduceStock)
 * 2. Publish domain event setelah sukses
 * 3. Menunjukkan bagaimana event publishing bekerja
 */
import { IUseCase } from '../../../../types';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductStockReduced } from '../../domain/events/ProductStockReduced';
import { IEventBus } from '../../../../shared/kernel/IEventBus';

export interface ReduceStockRequest {
  productId: string;
  amount: number;
  reason?: string; // Optional: alasan pengurangan stok
}

export interface ReduceStockResponse {
  success: boolean;
  message: string;
  previousQuantity?: number;
  newQuantity?: number;
}

export class ReduceStockUseCase implements IUseCase<ReduceStockRequest, ReduceStockResponse> {
  /**
   * Perhatikan: Use case ini butuh 2 dependencies
   * 1. Repository untuk persist
   * 2. EventBus untuk publish events
   * 
   * Keduanya adalah interfaces, bukan concrete implementations
   */
  constructor(
    private productRepository: IProductRepository,
    private eventBus: IEventBus
  ) {}

  async execute(request: ReduceStockRequest): Promise<ReduceStockResponse> {
    try {
      // Validation
      if (request.amount <= 0) {
        return {
          success: false,
          message: 'Reduction amount must be greater than 0'
        };
      }

      // Fetch aggregate
      const product = await this.productRepository.findById(request.productId);
      if (!product) {
        return {
          success: false,
          message: `Product ${request.productId} not found`
        };
      }

      // Capture state sebelum perubahan (untuk event)
      const previousQuantity = product.quantity.value;

      // Execute domain logic
      const success = product.reduceStock(request.amount);
      
      if (!success) {
        return {
          success: false,
          message: `Insufficient stock. Required: ${request.amount}, Available: ${previousQuantity}`
        };
      }

      // Persist changes
      await this.productRepository.update(product);

      // Publish domain event
      // Event berisi informasi lengkap tentang apa yang terjadi
      const event = new ProductStockReduced({
        productId: product.id,
        oldQuantity: previousQuantity,
        newQuantity: product.quantity.value,
        reducedBy: request.amount,
        reason: request.reason
      });

      this.eventBus.publish(event);

      return {
        success: true,
        message: 'Stock reduced successfully',
        previousQuantity,
        newQuantity: product.quantity.value
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }
}
```

---

### Step 4: Infrastructure Layer

Infrastructure layer adalah ADAPTER yang menghubungkan aplikasi dengan dunia luar.

#### 4.1 Repository Implementation

```typescript
// src/modules/inventory/infrastructure/repositories/ProductRepository.ts

/**
 * Repository Implementation
 * 
 * Ini adalah DRIVEN ADAPTER:
 * - Di-drive oleh port (interface) yang didefinisikan di domain
 * - Mengimplementasikan kontrak yang ditentukan domain
 * - Bebas menggunakan teknologi apapun (TypeORM, Prisma, raw SQL, dll)
 * 
 * Dalam demo ini kita pakai in-memory storage,
 * tapi bisa diganti dengan database nyata tanpa mengubah domain/application
 */
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

/**
 * In-memory storage untuk demo
 * Dalam production, ini akan diganti dengan database connection
 */
const productsStorage: Map<string, Product> = new Map();

export class ProductRepository implements IProductRepository {
  /**
   * Implementasi findById
   * Return Promise<Product | null> sesuai interface
   */
  async findById(id: string): Promise<Product | null> {
    // Simulasi async database call
    const product = productsStorage.get(id);
    return product ? Promise.resolve(product) : Promise.resolve(null);
  }

  /**
   * Implementasi save (upsert)
   */
  async save(product: Product): Promise<void> {
    productsStorage.set(product.id, product);
    return Promise.resolve();
  }

  /**
   * Implementasi update
   * Bisa tambah validasi bahwa product harus sudah ada
   */
  async update(product: Product): Promise<void> {
    if (!productsStorage.has(product.id)) {
      throw new Error(`Product ${product.id} not found for update`);
    }
    productsStorage.set(product.id, product);
    return Promise.resolve();
  }

  /**
   * Implementasi delete
   */
  async delete(id: string): Promise<void> {
    productsStorage.delete(id);
    return Promise.resolve();
  }

  /**
   * Implementasi findAll
   */
  async findAll(): Promise<Product[]> {
    return Promise.resolve(Array.from(productsStorage.values()));
  }
}
```

#### 4.2 Event Bus Implementation

```typescript
// src/shared/infrastructure/services/EventBus.ts

/**
 * Event Bus Implementation
 * 
 * Event Bus adalah infrastruktur untuk:
 * - Pub/Sub pattern
 * - Decoupling event producers dari consumers
 * - Async processing
 * 
 * Dalam production, ini bisa diganti dengan:
 * - Redis Pub/Sub
 * - RabbitMQ
 * - Kafka
 * - AWS SNS/SQS
 */
import { IEventBus } from '../../kernel/IEventBus';
import { IEventHandler } from '../../../types';

/**
 * Type untuk mapping event type ke handlers
 * Key: nama class event (string)
 * Value: array of handlers untuk event tersebut
 */
type EventHandlerMap = Map<string, IEventHandler<any>[]>;

export class EventBus implements IEventBus {
  private handlers: EventHandlerMap = new Map();

  /**
   * Publish event ke semua handlers yang subscribe
   * 
   * @param event - Event object yang akan dipublish
   * 
   * Note: Event type ditentukan dari constructor name
   * Ini simple approach, dalam production mungkin perlu registry yang lebih sophisticated
   */
  public publish<T>(event: T): void {
    const eventType = event.constructor.name;
    const handlers = this.handlers.get(eventType);

    if (!handlers || handlers.length === 0) {
      console.log(`⚠️  No handlers registered for event: ${eventType}`);
      return;
    }

    console.log(`📢 Publishing event: ${eventType}`);
    
    // Execute semua handlers
    // Dalam production, mungkin ingin execute secara async
    handlers.forEach(handler => {
      try {
        handler.handle(event);
      } catch (error) {
        console.error(`❌ Error handling event ${eventType}:`, error);
        // Decide: continue到其他 handlers or stop?
        // Dalam demo ini kita continue
      }
    });
  }

  /**
   * Subscribe handler ke event type tertentu
   * 
   * @param eventType - Nama event type (constructor name)
   * @param handler - Handler yang akan dipanggil saat event dipublish
   */
  public subscribe<T>(eventType: string, handler: IEventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler);
    console.log(`✅ Subscribed handler to event: ${eventType}`);
  }

  /**
   * Clear semua handlers (useful untuk testing)
   */
  public clear(): void {
    this.handlers.clear();
  }

  /**
   * Get jumlah handlers untuk event type tertentu (useful untuk debugging)
   */
  public getHandlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.length || 0;
  }
}
```

#### 4.3 HTTP Controller (Driving Adapter)

```typescript
// src/modules/inventory/infrastructure/controllers/ProductController.ts

/**
 * HTTP Controller (Driving Adapter)
 * 
 * Controller adalah DRIVING ADAPTER:
 * - Menerima input dari external world (HTTP requests)
 * - Mentranslate request ke use case commands
 * - Mentranslate response ke HTTP response
 * 
 * Controller TIDAK mengandung business logic!
 * Hanya orchestration dan translation.
 */
import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/CreateProductUseCase';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class ProductController {
  /**
   * Inject use case melalui constructor
   * Controller hanya tahu tentang use case interface
   */
  constructor(private createProductUseCase: CreateProductUseCase) {}

  /**
   * Handle POST /products
   * 
   * Flow:
   * 1. Extract data dari request body
   * 2. Validate basic structure (bukan business validation)
   * 3. Execute use case
   * 4. Return appropriate HTTP response
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      // Extract dan basic validation
      const { id, name, price, initialStock } = req.body;
      
      if (!id || !name) {
        res.status(400).json({
          success: false,
          message: 'ID and name are required'
        });
        return;
      }

      // Execute use case
      const result = await this.createProductUseCase.execute({
        id,
        name,
        price: parseFloat(price),
        initialStock: parseInt(initialStock, 10)
      });

      // Return response berdasarkan result
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }

    } catch (error: any) {
      // Handle unexpected errors
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}
```

---

### Step 5: Dependency Injection Container

#### 5.1 Memahami DI Container

```typescript
// src/bootstrap/container.ts

/**
 * Dependency Injection Container
 * 
 * APA ITU DI CONTAINER?
 * Container adalah "registry" yang menyimpan mapping antara:
 * - Token (biasanya interface name) → Implementation (class/factory)
 * 
 * MENGAPA PERLU CONTAINER?
 * 1. Centralized configuration - semua wiring di satu tempat
 * 2. Automatic dependency resolution - container resolve nested dependencies
 * 3. Lifecycle management - singleton vs transient
 * 4. Testability - mudah mock dependencies
 * 
 * BAGAIMANA CARA KERJANYA?
 * 1. REGISTER: Daftarkan mapping token → implementation
 * 2. RESOLVE: Minta container memberikan instance untuk token tertentu
 * 3. Container otomatis resolve dependencies rekursif
 */

type Token = string;
type Constructor<T = any> = new (...args: any[]) => T;
type Factory<T = any> = (...args: any[]) => T;

interface Binding {
  implementation: Constructor | Factory;
  scope: 'singleton' | 'transient';
  resolvedInstance?: any; // Cache untuk singleton
}

export class Container {
  private bindings: Map<Token, Binding> = new Map();

  /**
   * Register Singleton
   * Instance akan dibuat sekali dan di-cache
   * Digunakan untuk: Database connection, Event Bus, Logger, Config
   */
  registerSingleton<T>(token: Token, implementation: Constructor<T>): void {
    this.bindings.set(token, { 
      implementation, 
      scope: 'singleton' 
    });
    console.log(`📦 Registered Singleton: ${token} → ${implementation.name}`);
  }

  /**
   * Register Transient
   * Instance baru dibuat setiap kali di-resolve
   * Digunakan untuk: Use Cases, Controllers, Services dengan state
   */
  registerTransient<T>(token: Token, implementation: Constructor<T>): void {
    this.bindings.set(token, { 
      implementation, 
      scope: 'transient' 
    });
    console.log(`📦 Registered Transient: ${token} → ${implementation.name}`);
  }

  /**
   * Register Factory
   * Custom factory function untuk complex instantiation
   * Digunakan untuk: Dependencies yang butuh parameter runtime
   */
  registerFactory<T>(token: Token, factory: Factory<T>): void {
    this.bindings.set(token, { 
      implementation: factory, 
      scope: 'transient' 
    });
    console.log(`📦 Registered Factory: ${token}`);
  }

  /**
   * Resolve dependency
   * 
   * ALGORITMA RESOLUTION:
   * 1. Cek binding untuk token
   * 2. Jika singleton dan sudah di-cache, return cached instance
   * 3. Resolve constructor dependencies (rekursif)
   * 4. Instantiate dengan dependencies yang sudah resolved
   * 5. Cache jika singleton
   * 6. Return instance
   */
  resolve<T>(token: Token): T {
    const binding = this.bindings.get(token);
    
    if (!binding) {
      throw new Error(`❌ No binding found for token: ${token}`);
    }

    // Return cached instance jika singleton
    if (binding.scope === 'singleton' && binding.resolvedInstance) {
      console.log(`♻️  Returning cached singleton: ${token}`);
      return binding.resolvedInstance;
    }

    // Resolve dependencies
    // CATATAN: Dalam implementasi lengkap, kita perlu reflection
    // untuk mengetahui dependencies dari constructor
    // Untuk demo ini, kita gunakan manual injection via factory
    
    let instance: T;
    
    if (typeof binding.implementation === 'function') {
      // Cek apakah ini factory atau constructor
      if (binding.implementation.toString().startsWith('function')) {
        // Constructor - instantiate dengan new
        // Dalam implementasi nyata, perlu resolve constructor parameters
        instance = new (binding.implementation as Constructor<T>)();
      } else {
        // Factory - call function
        instance = (binding.implementation as Factory<T>)();
      }
    } else {
      throw new Error(`Invalid binding for ${token}`);
    }

    // Cache jika singleton
    if (binding.scope === 'singleton') {
      binding.resolvedInstance = instance;
    }

    return instance;
  }

  /**
   * Check jika token sudah registered
   */
  isRegistered(token: Token): boolean {
    return this.bindings.has(token);
  }

  /**
   * Clear semua bindings (untuk testing)
   */
  clear(): void {
    this.bindings.clear();
  }
}
```

#### 5.2 Composition Root

```typescript
// src/bootstrap/main.ts

/**
 * COMPOSITION ROOT
 * 
 * APA ITU COMPOSITION ROOT?
 * Composition Root adalah SATU tempat di aplikasi di mana:
 * 1. Semua modules diregistrasi ke container
 * 2. Semua dependencies di-wiring
 * 3. Aplikasi di-bootstrap
 * 
 * MENGAPA PENTING?
 * - Single Responsibility: Hanya satu tempat yang tahu tentang seluruh graph
 * - Maintainability: Mudah melihat dan memahami dependencies
 * - Testability: Mudah swap implementations untuk testing
 * 
 * DI MANA COMPOSITION ROOT?
 * Biasanya di entry point aplikasi (main.ts, app.ts, index.ts)
 */

import express from 'express';
import { Container } from './container';
import { registerSharedDependencies } from '../shared/registration';
import { registerInventoryModule } from '../modules/inventory/registration';
import { registerOrderModule } from '../modules/order/registration';

/**
 * MAIN FUNCTION - Entry Point Aplikasi
 * 
 * FLOW:
 * 1. Create container
 * 2. Register all modules
 * 3. Wire cross-module dependencies
 * 4. Setup HTTP server
 * 5. Start application
 */
async function bootstrap(): Promise<void> {
  console.log('🚀 Starting application bootstrap...\n');

  // Step 1: Create container instance
  const container = new Container();

  // Step 2: Register shared infrastructure
  // Ini harus pertama karena module lain mungkin butuh shared services
  console.log('\n📋 Registering shared dependencies...');
  registerSharedDependencies(container);

  // Step 3: Register modules
  // Setiap module register internal dependencies
  console.log('\n📋 Registering Inventory module...');
  registerInventoryModule(container);

  console.log('\n📋 Registering Order module...');
  registerOrderModule(container);

  // Step 4: Wire cross-module dependencies
  // Ini adalah kunci dari Modular Monolith!
  // Order module butuh akses ke Inventory, tapi tidak boleh import langsung
  // Solusi: Bind interface ke implementation dari module lain
  
  console.log('\n🔗 Wiring cross-module dependencies...');
  // Contoh: IInventoryChecker interface (dari Order) 
  // di-bind ke InventoryCheckerAdapter (dari Inventory)
  // Lihat registration.ts masing-masing module untuk detail

  // Step 5: Setup Express app
  const app = express();
  app.use(express.json());

  // Step 6: Register routes
  // Routes mengambil use cases dari container
  setupRoutes(app, container);

  // Step 7: Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}`);
    console.log(`📖 Open http://localhost:${PORT} in your browser\n`);
    
    // Run demo flow
    runDemoFlow(container);
  });
}

/**
 * Setup HTTP Routes
 * 
 * Route handlers mengambil use cases dari container
 * dan mendelegasikan work ke use cases tersebut
 */
function setupRoutes(app: express.Application, container: Container): void {
  // Inventory routes
  app.post('/products', async (req, res) => {
    const useCase = container.resolve('CreateProductUseCase');
    const result = await useCase.execute(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  app.get('/products/:id', async (req, res) => {
    const repo = container.resolve('IProductRepository');
    const product = await repo.findById(req.params.id);
    
    if (product) {
      res.json({
        id: product.id,
        name: product.name,
        price: product.price / 100,
        stock: product.quantity.value
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });

  // Order routes
  app.post('/orders', async (req, res) => {
    const useCase = container.resolve('CreateOrderUseCase');
    const result = await useCase.execute(req.body);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });
}

/**
 * Demo Flow
 * 
 * Menunjukkan bagaimana sistem bekerja end-to-end
 */
async function runDemoFlow(container: Container): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🎬 STARTING DEMO FLOW');
  console.log('='.repeat(60));

  setTimeout(async () => {
    // Scenario 1: Create product
    console.log('\n📝 Step 1: Creating product "Laptop" with stock 10...');
    const createProduct = container.resolve('CreateProductUseCase');
    const productResult = await createProduct.execute({
      id: 'prod-laptop-001',
      name: 'Gaming Laptop',
      price: 15000000,
      initialStock: 10
    });
    console.log('✅ Result:', productResult.success ? 'SUCCESS' : 'FAILED');
    if (productResult.product) {
      console.log(`   Product: ${productResult.product.name}`);
      console.log(`   Stock: ${productResult.product.quantity.value}`);
    }

    // Scenario 2: Create successful order
    console.log('\n📝 Step 2: Creating order for 2 Laptops...');
    const createOrder = container.resolve('CreateOrderUseCase');
    const orderResult = await createOrder.execute({
      id: 'order-001',
      customerId: 'customer-001',
      items: [{ productId: 'prod-laptop-001', quantity: 2 }]
    });
    console.log('✅ Result:', orderResult.success ? 'SUCCESS' : 'FAILED');
    if (!orderResult.success) {
      console.log('   Error:', orderResult.message);
    }

    // Scenario 3: Create order that should fail (insufficient stock)
    console.log('\n📝 Step 3: Creating order for 15 Laptops (should fail)...');
    const failResult = await createOrder.execute({
      id: 'order-002',
      customerId: 'customer-002',
      items: [{ productId: 'prod-laptop-001', quantity: 15 }]
    });
    console.log('✅ Result:', failResult.success ? 'SUCCESS' : 'FAILED');
    if (!failResult.success) {
      console.log('   Expected error:', failResult.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎬 DEMO FLOW COMPLETED');
    console.log('='.repeat(60) + '\n');
  }, 1000);
}

// Start the application
bootstrap().catch(console.error);
```

---

## 🎓 Hal-Hal Penting yang Harus Dipahami

### 1. Dependency Rule (Aturan Ketergantungan)

```
                    ┌──────────────────┐
                    │   Frameworks     │
                    │   (Express, etc) │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Interface       │
                    │  Adapters        │
                    │  (Controllers)   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Application     │
                    │  (Use Cases)     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Domain         │
                    │   (Entities)     │
                    └──────────────────┘

Dependencies SELALU pointing INWARD!
Outer layers boleh depend pada inner layers.
Inner layers TIDAK BOLEH depend pada outer layers.
```

**Implikasi Praktis:**
- Domain tidak boleh import dari Application, Infrastructure, atau Frameworks
- Application boleh import dari Domain
- Infrastructure boleh import dari Domain dan Application
- Frameworks boleh import dari semua layer

### 2. Dependency Inversion Principle (DIP)

```typescript
// ❌ WRONG - High-level module depends on low-level module
class OrderService {
  private mysqlRepository: MySQLProductRepository;
  
  constructor() {
    this.mysqlRepository = new MySQLProductRepository();
  }
}

// ✅ CORRECT - Both depend on abstraction
class OrderService {
  private repository: IProductRepository;
  
  constructor(repository: IProductRepository) {
    this.repository = repository; // Injection!
  }
}
```

**Key Points:**
- High-level modules (business logic) tidak boleh depend pada low-level modules (database, framework)
- Keduanya harus depend pada abstractions (interfaces)
- Abstractions tidak boleh depend pada details
- Details harus depend pada abstractions

### 3. Ports and Adapters

```
┌─────────────────────────────────────────────────┐
│                  APPLICATION                     │
│                                                  │
│  ┌─────────────┐         ┌─────────────┐        │
│  │   Driving   │         │   Driven    │        │
│  │   Adapter   │         │   Adapter   │        │
│  │  (INPUT)    │         │  (OUTPUT)   │        │
│  │             │         │             │        │
│  │ • HTTP      │         │ • Database  │        │
│  │ • CLI       │    ➡    │ • Email     │        │
│  │ • WebSocket │         │ • Queue     │        │
│  │             │         │ • External  │        │
│  └─────────────┘         └─────────────┘        │
│                                                  │
│              PORTS (Interfaces)                  │
│         ┌──────────────┬──────────────┐         │
│         │  Input Port  │  Output Port │         │
│         │  (Use Case)  │ (Repository) │         │
│         └──────────────┴──────────────┘         │
└─────────────────────────────────────────────────┘
```

**Driving Adapters (Primary):**
- Mendorong request KE DALAM aplikasi
- Contoh: HTTP Controllers, CLI Commands, GraphQL Resolvers
- Disebut juga "Input Adapters"

**Driven Adapters (Secondary):**
- Didorong OLEH aplikasi untuk melakukan sesuatu
- Contoh: Database Repositories, Email Senders, API Clients
- Disebut juga "Output Adapters"

### 4. Domain Events Pattern

```typescript
// Domain Entity memicu event
class Product {
  reduceStock(amount: number): boolean {
    if (this._quantity.value < amount) {
      return false;
    }
    
    const oldQuantity = this._quantity.value;
    this._quantity = new Quantity(this._quantity.value - amount);
    
    // Emit event!
    DomainEvents.raise(new ProductStockReduced({
      productId: this.id,
      oldQuantity,
      newQuantity: this._quantity.value,
      reducedBy: amount
    }));
    
    return true;
  }
}

// Handler di infrastructure layer
class ProductStockReducedHandler implements IEventHandler<ProductStockReduced> {
  handle(event: ProductStockReduced): void {
    // Log untuk audit
    this.logger.info(`Stock reduced: ${event.productId}`);
    
    // Kirim notification
    this.notificationService.send(...);
    
    // Update cache
    this.cache.invalidate(...);
  }
}
```

**Benefits:**
- Loose coupling antara komponen
- Eventual consistency
- Audit trail
- Easy to add new reactions to events

### 5. Modular Boundaries

```
┌─────────────────────────────────────────────────────┐
│                  MODULE A                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Domain  │  │   App   │  │  Infra  │             │
│  └────┬────┘  └────┬────┘  └────┬────┘             │
│       │           │           │                     │
│       └───────────┼───────────┘                     │
│                   │                                 │
│         ┌─────────▼─────────┐                       │
│         │   Contracts       │ ◄── Public API        │
│         │   (Interfaces)    │                       │
│         └─────────┬─────────┘                       │
└───────────────────│─────────────────────────────────┘
                    │
                    │ Module B imports ONLY contracts
                    ▼
┌─────────────────────────────────────────────────────┐
│                  MODULE B                            │
│  ┌─────────┐                                        │
│  │   App   │ ──► Uses IInventoryChecker            │
│  │         │     (from Module A Contracts)          │
│  └─────────┘                                        │
│                                                     │
│  ⚠️  TIDAK BOLEH import dari Module A Domain/App   │
└─────────────────────────────────────────────────────┘
```

**Rules:**
1. Modules tidak boleh saling import implementation
2. Communication hanya melalui contracts (interfaces)
3. Contracts didefinisikan oleh provider module
4. Wiring dilakukan di Composition Root

---

## ✨ Kelebihan Hexagonal/Clean Architecture

### 1. Testability 🧪

```typescript
// Mudah testing karena dependencies injectable
describe('CreateOrderUseCase', () => {
  it('should create order when stock is sufficient', async () => {
    // Mock dependencies
    const mockInventoryChecker = {
      checkStock: jest.fn().mockResolvedValue(10)
    };
    const mockOrderRepo = {
      save: jest.fn()
    };
    
    // Inject mocks
    const useCase = new CreateOrderUseCase(
      mockOrderRepo,
      mockInventoryChecker,
      // ... other mocks
    );
    
    // Test!
    const result = await useCase.execute({...});
    expect(result.success).toBe(true);
  });
});
```

**Benefits:**
- Unit test tanpa database
- Mock external services dengan mudah
- Test business logic secara isolated
- Faster tests (no I/O)

### 2. Maintainability 🔧

```typescript
// Ganti database? Tinggal ganti adapter!
// Sebelum:
class ProductRepository implements IProductRepository {
  // MySQL implementation
}

// Sesudah:
class ProductRepository implements IProductRepository {
  // PostgreSQL implementation
  // ATAU
  // MongoDB implementation
  // ATAU
  // DynamoDB implementation
}

// Domain dan Application code TIDAK PERLU UBAH!
```

**Benefits:**
- Easy technology migration
- Upgrade framework tanpa rewrite business logic
- Swap implementations untuk different environments
- Clear separation of concerns

### 3. Flexibility 🔄

```typescript
// Add new channel without changing core logic
// Existing: HTTP Controller
app.post('/products', productController.create);

// Add: GraphQL Resolver
resolvers.Mutation.createProduct = (_, args) => {
  return productController.create(args.input);
};

// Add: gRPC Service
grpcServer.addCreateProductHandler((req) => {
  return productController.create(req.body);
});

// Add: CLI Command
program.command('create-product')
  .action((options) => productController.create(options));

// Semua menggunakan USE CASE yang sama!
```

**Benefits:**
- Multi-channel support (Web, Mobile, API, CLI)
- Easy integration dengan new platforms
- Reuse business logic across channels

### 4. Business Focus 🎯

```typescript
// Code mencerminkan business language
// Bukan technical implementation details

// ✅ Good - Business readable
await reduceStockUseCase.execute({
  productId: 'laptop-001',
  amount: 2,
  reason: 'ORDER_FULFILLMENT'
});

// ❌ Bad - Technical focused
await db.products.update(
  { where: { id: 'laptop-001' } },
  { decrement: { stock: 2 } }
);
```

**Benefits:**
- Code understandable by non-developers
- Easier collaboration with business stakeholders
- Business rules explicit dan documented in code
- Reduced cognitive load

### 5. Long-term Sustainability 📈

```
Technical Debt Over Time:

Traditional Architecture:
│
│         ╱
│       ╱
│     ╱
│   ╱
│ ╱
└──────────────────► Time

Hexagonal/Clean Architecture:
│
│
│ ──────────────────
│
│
└──────────────────► Time

Initial cost higher, but sustainable long-term
```

---

## 🏗️ Kelebihan Modular Monolith

### 1. Simplicity Deployment 🚀

```yaml
# Microservices: Multiple deployments
services:
  - inventory-service (deploy separately)
  - order-service (deploy separately)
  - payment-service (deploy separately)
  - shipping-service (deploy separately)
  
# Network config, service discovery, load balancing needed

# Modular Monolith: Single deployment
application:
  - inventory-module
  - order-module
  - payment-module
  - shipping-module
  
# One deployment, no network overhead
```

**Benefits:**
- Single deployment artifact
- No distributed system complexity
- Easier CI/CD pipeline
- Faster deployment

### 2. Performance ⚡

```
Microservices:
Client → API Gateway → Inventory Service → Database
                         ↓
                    Order Service (network call)
                         ↓
                   Payment Service (network call)

Latency: Network hops × N

Modular Monolith:
Client → Application → Inventory Module → Database
                         ↓
                    Order Module (in-process call)
                         ↓
                   Payment Module (in-process call)

Latency: Function calls (negligible)
```

**Benefits:**
- In-process communication (fast!)
- No network latency
- No serialization overhead
- Better resource utilization

### 3. Data Consistency 💾

```typescript
// Microservices: Distributed transaction complexity
async function createOrder() {
  // Transaction 1: Inventory Service
  await inventoryService.reserveStock(orderItems);
  
  // Transaction 2: Order Service
  const order = await orderService.createOrder(orderData);
  
  // Transaction 3: Payment Service
  await paymentService.processPayment(paymentData);
  
  // What if step 3 fails? Need saga pattern, compensating transactions...
}

// Modular Monolith: Single transaction
async function createOrder() {
  const transaction = await db.beginTransaction();
  try {
    await inventoryRepository.reserveStock(orderItems, transaction);
    await orderRepository.createOrder(orderData, transaction);
    await paymentRepository.processPayment(paymentData, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

**Benefits:**
- ACID transactions
- No eventual consistency complexity
- Simpler error handling
- Data integrity guaranteed

### 4. Development Experience 👨‍💻

```bash
# Microservices development
- Run 5+ services locally
- Manage multiple databases
- Configure inter-service communication
- Debug across service boundaries
- Version compatibility issues

# Modular Monolith development
- Run 1 application
- 1 database
- In-process communication
- Standard debugging tools
- Single codebase version
```

**Benefits:**
- Easier local development
- Simpler debugging
- Refactoring across modules
- Shared types and utilities
- Faster iteration

### 5. Evolutionary Path 🛤️

```
Start: Modular Monolith
│
├── Clear module boundaries
├── Well-defined interfaces
├── Independent module testing
│
│ When scaling requires:
│
▼
Extract specific module to microservice
│
├── Module already has clean interface
├── Business logic already isolated
├── Minimal refactoring needed
│
▼
Hybrid: Monolith + Some Microservices
```

**Benefits:**
- Start simple, scale when needed
- No premature optimization
- Natural evolution path
- Option to extract modules later

### 6. Cost Efficiency 💰

```
Microservices Cost:
- Multiple servers/containers
- Service mesh infrastructure
- API Gateway
- Monitoring per service
- Increased DevOps complexity

Modular Monolith Cost:
- Single server/container
- Standard monitoring
- Simple infrastructure
- Lower operational cost
```

---

## 🎯 Kapan Menggunakan Arsitektur Ini

### ✅ Gunakan Ketika:

1. **Complex Business Logic**
   - Banyak business rules yang kompleks
   - Domain yang rich (bukan CRUD sederhana)
   - Perlu maintainability jangka panjang

2. **Multiple Channels**
   - Web application
   - Mobile API
   - Third-party integrations
   - Batch processing

3. **Frequent Changes**
   - Requirements sering berubah
   - Technology stack mungkin berubah
   - Team berganti-ganti

4. **Team Scaling**
   - Multiple teams working on same codebase
   - Need clear ownership boundaries
   - Parallel development

5. **Long-term Project**
   - Project akan maintained bertahun-tahun
   - Akan evolve dan grow
   - Investment untuk sustainability

### ❌ Jangan Gunakan Ketika:

1. **Simple CRUD Application**
   - Basic data entry system
   - No complex business logic
   - Over-engineering untuk kebutuhan

2. **Prototype / MVP**
   - Need to validate idea quickly
   - Might pivot or discard
   - Speed more important than structure

3. **Small Team, Short Timeline**
   - 1-2 developers
   - Timeline < 3 months
   - Limited scope

4. **Learning Project**
   - Just learning a framework
   - Personal project
   - No maintenance expected

---

## ⚠️ Common Pitfalls

### 1. Anemic Domain Model

```typescript
// ❌ BAD - Anemic model (just data, no behavior)
class Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  // No methods! Just getters/setters
}

// Business logic ends up in services
class ProductService {
  reduceStock(product: Product, amount: number) {
    if (product.stock < amount) {
      throw new Error('Insufficient stock');
    }
    product.stock -= amount;
  }
}

// ✅ GOOD - Rich domain model
class Product {
  constructor(private _stock: number) {}
  
  reduceStock(amount: number): boolean {
    if (this._stock < amount) {
      return false;
    }
    this._stock -= amount;
    return true;
  }
}
```

### 2. Leaky Abstractions

```typescript
// ❌ BAD - Domain knows about infrastructure
class Order {
  async save() {
    await database.orders.insert(this); // Leak!
  }
}

// ✅ GOOD - Pure domain
class Order {
  // No infrastructure knowledge
  // Repository handles persistence
}
```

### 3. Over-Engineering

```typescript
// ❌ BAD - Too many layers for simple operation
interface ICreateProductCommand {}
class CreateProductCommand implements ICreateProductCommand {}
interface ICreateProductCommandHandler {}
class CreateProductCommandHandler implements ICreateProductCommandHandler {}
interface ICreateProductCommandHandlerFactory {}
// ... unnecessary complexity

// ✅ GOOD - Appropriate complexity
class CreateProductUseCase {
  execute(request: CreateProductRequest) {
    // Simple and clear
  }
}
```

### 4. Circular Dependencies

```
Module A ─────► Module B
    ▲              │
    │              ▼
    └────────── Module C

// ❌ Creates circular dependency nightmare

// ✅ Solution: Depend on contracts only
Module A ──► IModuleBContract (interface)
Module B ──► IModuleCContract (interface)
Module C ──► IModuleAContract (interface)

// Wiring done in Composition Root
```

### 5. God Classes

```typescript
// ❌ BAD - Class doing too much
class OrderService {
  createOrder() {}
  cancelOrder() {}
  shipOrder() {}
  sendEmail() {}
  processPayment() {}
  updateInventory() {}
  generateInvoice() {}
  // ... 50 more methods
}

// ✅ GOOD - Separated use cases
class CreateOrderUseCase {}
class CancelOrderUseCase {}
class ShipOrderUseCase {}
// Each with single responsibility
```

---

## 📋 Best Practices

### 1. Naming Conventions

```typescript
// Entities: Noun, business concept
class Product, Order, Customer

// Value Objects: Noun, descriptive
class Money, Quantity, Email, Address

// Use Cases: Verb + Noun
class CreateProductUseCase, ReduceStockUseCase

// Events: Past tense
class ProductCreated, OrderShipped

// Repositories: Entity + Repository
class ProductRepository, OrderRepository

// DTOs: Purpose + Request/Response
class CreateProductRequest, ProductResponse
```

### 2. Error Handling

```typescript
// Use Result pattern for business errors
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Exceptions for unexpected errors
try {
  // Business logic
} catch (error) {
  // Log and handle unexpected
}

// Domain exceptions for business rules
class InsufficientStockError extends DomainError {}
class InvalidOrderStateError extends DomainError {}
```

### 3. Testing Strategy

```
Testing Pyramid:

        /\
       /  \
      / E2E \      Few end-to-end tests
     /────────\
    /          \
   / Integration \  Some integration tests
  /──────────────\
 /                \
/     Unit Tests    \ Many unit tests (fast, isolated)
──────────────────────
```

```typescript
// Unit Test Domain (fast, no dependencies)
describe('Product', () => {
  it('should not allow negative stock', () => {
    expect(() => new Product(-1)).toThrow();
  });
});

// Unit Test Use Cases (mock dependencies)
describe('CreateOrderUseCase', () => {
  it('should fail when stock insufficient', async () => {
    const mockChecker = { checkStock: () => Promise.resolve(0) };
    // ...
  });
});

// Integration Test (real database)
describe('Order Flow', () => {
  it('should complete full order flow', async () => {
    // Real database, real event bus
    // ...
  });
});
```

### 4. Documentation

```typescript
/**
 * Use Case: Create Order
 * 
 * Business Rules:
 * 1. Customer must exist
 * 2. All items must have sufficient stock
 * 3. Total amount must be calculated correctly
 * 4. Stock must be reserved atomically
 * 
 * Side Effects:
 * - Reduces product stock
 * - Publishes OrderCreated event
 * - Sends confirmation email (via event handler)
 * 
 * @throws InsufficientStockError
 * @throws CustomerNotFoundError
 */
class CreateOrderUseCase {
  // ...
}
```

### 5. Continuous Refactoring

```
Regularly ask:
1. Are module boundaries still clear?
2. Is domain logic leaking to other layers?
3. Are dependencies pointing inward?
4. Can we extract common functionality?
5. Are tests still fast and reliable?

Refactor when:
- Adding feature becomes difficult
- Bug in one area breaks unrelated areas
- New team members struggle to understand
- Tests become slow or brittle
```

---

## 📚 Resources untuk Belajar Lebih Lanjut

### Books:
1. **"Clean Architecture"** - Robert C. Martin
2. **"Domain-Driven Design"** - Eric Evans
3. **"Implementing Domain-Driven Design"** - Vaughn Vernon
4. **"Patterns, Principles, and Practices of Domain-Driven Design"** - Scott Millett

### Online:
1. [Martin Fowler - Hexagonal Architecture](https://martinfowler.com/articles/hexagonal-architecture.html)
2. [Jeffrey Palermo - Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
3. [DDD Starter Modeling](https://github.com/ddd-crew/ddd-starter-modeling)

### Videos:
1. Uncle Bob - Clean Architecture and Design
2. Domain-Driven Design Fundamentals (Pluralsight)
3. Modular Monoliths (various conference talks)

---

## 🎓 Kesimpulan

Hexagonal/Clean Architecture dengan Modular Monolith adalah:

✅ **Powerful** untuk aplikasi kompleks dengan business logic yang rich
✅ **Sustainable** untuk long-term maintenance dan evolution  
✅ **Testable** dengan isolated unit tests
✅ **Flexible** untuk adaptasi perubahan requirements
✅ **Practical** balance antara structure dan simplicity

Tapi ingat:
⚠️ **Not silver bullet** - pilih arsitektur sesuai kebutuhan
⚠️ **Learning curve** - butuh waktu untuk master
⚠️ **Initial overhead** - lebih lambat di awal, lebih cepat long-term
⚠️ **Discipline required** - harus konsisten apply principles

**Start simple, evolve gradually, and always keep business logic at the center!** 🎯
