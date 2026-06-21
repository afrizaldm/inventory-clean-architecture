/**
 * ============================================================================
 * MAIN APPLICATION ENTRY POINT - COMPOSITION ROOT
 * ============================================================================
 * 
 * File ini adalah COMPOSITION ROOT dari aplikasi.
 * Composition Root adalah tempat di mana semua dependencies di-wire dan
 * aplikasi di-bootstrap.
 * 
 * Dalam arsitektur Modular Monolith dengan Hexagonal/Clean Architecture:
 * 1. Semua modul diregistrasi ke container di sini
 * 2. Cross-module dependencies di-wire di sini
 * 3. Event handlers di-subscribe di sini
 * 4. HTTP server di-start di sini
 * 
 * PENTING: Composition Root adalah SATU-SATUNYA tempat yang "tahu" tentang
 * semua modul dan dependencies. Semua modul lain hanya tahu tentang
 * dependencies mereka sendiri.
 */

import express, { Request, Response } from 'express';
import { Container } from './container';
import { registerSharedDependencies } from '../shared/registration';
import { registerInventoryModule } from '../modules/inventory/registration';
import { registerOrderModule } from '../modules/order/registration';
import { IEventBus } from '../shared/kernel/IEventBus';
import { ILogger } from '../shared/infrastructure/services/Logger';
import { ProductStockReducedHandler } from '../modules/inventory/infrastructure/event-handlers/ProductStockReducedHandler';
import { OrderCreatedHandler } from '../modules/order/infrastructure/event-handlers/OrderCreatedHandler';
import { ProductStockReduced } from '../modules/inventory/domain/events/ProductStockReduced';
import { OrderCreated } from '../modules/order/domain/events/OrderCreated';
import { CreateProductUseCase } from '../modules/inventory/application/use-cases/CreateProductUseCase';
import { CreateOrderUseCase } from '../modules/order/application/use-cases/CreateOrderUseCase';

// ============================================================================
// STEP 1: CREATE CONTAINER
// ============================================================================
// Buat satu instance container untuk seluruh aplikasi
// Container ini akan menyimpan semua bindings dan mengelola lifecycle dependencies
const container = new Container();

// ============================================================================
// STEP 2: REGISTER ALL MODULES
// ============================================================================
// Panggil registration function dari setiap modul
// Urutan penting: shared dependencies harus diregistrasi dulu
console.log('\n' + '='.repeat(60));
console.log('BOOTSTRAPPING APPLICATION - COMPOSITION ROOT');
console.log('='.repeat(60));

// Registrasi shared dependencies (EventBus, Logger) terlebih dahulu
// karena modul lain mungkin membutuhkannya
registerSharedDependencies(container);

// Registrasi Inventory Module
// Ini mendaftarkan: ProductRepository, InventoryCheckerAdapter, Use Cases
registerInventoryModule(container);

// Registrasi Order Module
// Ini mendaftarkan: OrderRepository, CreateOrderUseCase
// Perhatikan bahwa CreateOrderUseCase butuh dependencies dari Inventory Module
registerOrderModule(container);

// ============================================================================
// STEP 3: SUBSCRIBE EVENT HANDLERS
// ============================================================================
// Event handlers harus di-subscribe setelah semua modul diregistrasi
// agar event bus sudah tersedia dan bisa menerima events

console.log('=== Subscribing Event Handlers ===');

// Resolve EventBus dari container (singleton, jadi akan return instance yang sama)
const eventBus = container.resolve<IEventBus>('IEventBus');

// Resolve Logger dari container
const logger = container.resolve<ILogger>('ILogger');

// Buat handler instances dan subscribe ke event bus
// Handler ini akan merespon domain events yang dipublish oleh use cases

// ProductStockReducedHandler: Menangani event stock berkurang
const productStockReducedHandler = new ProductStockReducedHandler(logger);
eventBus.subscribe<ProductStockReduced>('ProductStockReduced', productStockReducedHandler);

// OrderCreatedHandler: Menangani event order dibuat
const orderCreatedHandler = new OrderCreatedHandler(logger);
eventBus.subscribe<OrderCreated>('OrderCreated', orderCreatedHandler);

console.log('=== Event Handlers Subscribed ===\n');

// ============================================================================
// STEP 4: SETUP HTTP SERVER (EXPRESS)
// ============================================================================
// Setup Express sebagai HTTP adapter (Driving Adapter / Primary Port)
// HTTP routes akan resolve use cases dari container dan invoke mereka

const app = express();
app.use(express.json()); // Parse JSON body

// ----------------------------------------------------------------------------
// HTTP Route: POST /products
// Endpoint untuk membuat produk baru
// ----------------------------------------------------------------------------
app.post('/products', async (req: Request, res: Response) => {
  console.log('\n[HTTP] POST /products received');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Resolve use case dari container
    const useCase = container.resolve<CreateProductUseCase>('CreateProductUseCase');
    
    // Execute use case dengan data dari request
    const result = await useCase.execute({
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      initialStock: req.body.initialStock
    });
    
    // Return response berdasarkan hasil use case
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error('[HTTP] Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------------------------------
// HTTP Route: POST /orders
// Endpoint untuk membuat order baru
// ----------------------------------------------------------------------------
app.post('/orders', async (req: Request, res: Response) => {
  console.log('\n[HTTP] POST /orders received');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Resolve use case dari container
    const useCase = container.resolve<CreateOrderUseCase>('CreateOrderUseCase');
    
    // Execute use case dengan data dari request
    const result = await useCase.execute({
      id: req.body.id,
      customerId: req.body.customerId,
      items: req.body.items
    });
    
    // Return response berdasarkan hasil use case
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error('[HTTP] Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------------------------------
// HTTP Route: GET /products/:id
// Endpoint untuk mendapatkan detail produk
// ----------------------------------------------------------------------------
app.get('/products/:id', async (req: Request, res: Response) => {
  console.log(`\n[HTTP] GET /products/${req.params.id} received`);
  
  try {
    // Resolve repository dari container
    const productRepo = container.resolve('IProductRepository');
    
    // Cari produk by ID
    const product = await productRepo.findById(req.params.id);
    
    if (product) {
      res.json({
        id: product.id,
        name: product.name,
        price: product.price / 100, // Konversi dari satuan terkecil ke desimal
        stock: product.quantity.value
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error('[HTTP] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================================
// STEP 5: START SERVER & RUN DEMO
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
  console.log('='.repeat(60));
  console.log('\nAvailable endpoints:');
  console.log('  POST /products   - Create a new product');
  console.log('  POST /orders     - Create a new order');
  console.log('  GET  /products/:id - Get product details');
  console.log('\nRunning demo flow in 2 seconds...\n');
  
  // Jalankan demo flow setelah server siap
  setTimeout(runDemoFlow, 2000);
});

// ============================================================================
// DEMO FLOW
// ============================================================================
// Function ini menjalankan flow lengkap untuk mendemonstrasikan:
// 1. Create product dengan stock tertentu
// 2. Create order yang berhasil (stock cukup)
// 3. Create order yang gagal (stock tidak cukup)
// 
// Flow ini menunjukkan:
// - Komunikasi antar modul (Order -> Inventory)
// - Domain events dan handlers
// - Business rules validation
// ============================================================================

async function runDemoFlow(): Promise<void> {
  console.log('\n' + '🚀 '.repeat(30));
  console.log('STARTING DEMO FLOW');
  console.log('🚀 '.repeat(30) + '\n');
  
  try {
    // ------------------------------------------------------------------------
    // DEMO STEP 1: Create product "Laptop" dengan stock 10
    // ------------------------------------------------------------------------
    console.log('📦 STEP 1: Creating product "Gaming Laptop" with stock 10...');
    console.log('-'.repeat(60));
    
    const createProductUseCase = container.resolve<CreateProductUseCase>('CreateProductUseCase');
    const productResult = await createProductUseCase.execute({
      id: 'prod-laptop-001',
      name: 'Gaming Laptop',
      price: 15000000, // Rp 15.000.000
      initialStock: 10
    });
    
    console.log('✅ Product created:', productResult);
    console.log('');
    
    // ------------------------------------------------------------------------
    // DEMO STEP 2: Create order untuk 2 Laptop (should succeed)
    // ------------------------------------------------------------------------
    console.log('🛒 STEP 2: Creating order for 2 "Gaming Laptop"...');
    console.log('-'.repeat(60));
    console.log('   This will:');
    console.log('   1. Check stock via IInventoryChecker (cross-module)');
    console.log('   2. Create order entity');
    console.log('   3. Reduce stock (trigger ProductStockReduced event)');
    console.log('   4. Publish OrderCreated event');
    console.log('');
    
    const createOrderUseCase = container.resolve<CreateOrderUseCase>('CreateOrderUseCase');
    const orderResult1 = await createOrderUseCase.execute({
      id: 'order-001',
      customerId: 'customer-john',
      items: [
        { productId: 'prod-laptop-001', quantity: 2 }
      ]
    });
    
    console.log('✅ Order created:', orderResult1);
    console.log('');
    
    // ------------------------------------------------------------------------
    // DEMO STEP 3: Create order lagi untuk 8 Laptop (should succeed, stock = 8)
    // ------------------------------------------------------------------------
    console.log('🛒 STEP 3: Creating another order for 8 "Gaming Laptop"...');
    console.log('-'.repeat(60));
    
    const orderResult2 = await createOrderUseCase.execute({
      id: 'order-002',
      customerId: 'customer-jane',
      items: [
        { productId: 'prod-laptop-001', quantity: 8 }
      ]
    });
    
    console.log('✅ Order created:', orderResult2);
    console.log('');
    
    // ------------------------------------------------------------------------
    // DEMO STEP 4: Create order untuk 5 Laptop (should FAIL, stock = 0)
    // ------------------------------------------------------------------------
    console.log('❌ STEP 4: Trying to create order for 5 "Gaming Laptop"...');
    console.log('-'.repeat(60));
    console.log('   Expected: FAILURE (insufficient stock)');
    console.log('');
    
    const orderResult3 = await createOrderUseCase.execute({
      id: 'order-003',
      customerId: 'customer-bob',
      items: [
        { productId: 'prod-laptop-001', quantity: 5 }
      ]
    });
    
    console.log('🚫 Order failed as expected:', orderResult3);
    console.log('');
    
    // ------------------------------------------------------------------------
    // DEMO COMPLETE
    // ------------------------------------------------------------------------
    console.log('\n' + '✨ '.repeat(30));
    console.log('DEMO FLOW COMPLETED SUCCESSFULLY!');
    console.log('✨ '.repeat(30));
    console.log('\nKey learnings from this demo:');
    console.log('1. ✅ Modules communicate via interfaces (IInventoryChecker)');
    console.log('2. ✅ Domain events are published and handled automatically');
    console.log('3. ✅ Business rules prevent overselling (stock validation)');
    console.log('4. ✅ Dependency Injection enables loose coupling');
    console.log('5. ✅ Composition Root wires all dependencies together\n');
    
  } catch (error: any) {
    console.error('❌ Demo flow error:', error.message);
    console.error(error.stack);
  }
}
