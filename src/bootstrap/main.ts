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
import { IProductRepository } from '../modules/inventory/domain/repositories/IProductRepository';
import { IInventoryChecker } from '../modules/order/contracts/IInventoryChecker';
import { ReduceStockUseCase } from '../modules/inventory/application/use-cases/ReduceStockUseCase';
import { IOrderRepository } from '../modules/order/domain/repositories/IOrderRepository';

// ============================================================================
// STEP 1: CREATE CONTAINER
// ============================================================================
// Buat satu instance container untuk seluruh aplikasi
// Ini adalah "Service Locator" pattern
const container = new Container();

console.log('\n========================================');
console.log('🚀 Starting Hexagonal Modular Monolith');
console.log('========================================\n');

// ============================================================================
// STEP 2: REGISTER ALL MODULES
// ============================================================================
// Panggil registration functions dari setiap modul
// Urutan: Shared -> Inventory -> Order

registerSharedDependencies(container);
registerInventoryModule(container);
registerOrderModule(container);

// ============================================================================
// STEP 3: WIRE CROSS-MODULE DEPENDENCIES
// ============================================================================
// Di sinilah magic terjadi! Kita wire dependencies yang melibatkan multiple modules.
// 
// CreateOrderUseCase butuh 4 dependencies:
// 1. IOrderRepository (dari Order module)
// 2. IInventoryChecker (dari Inventory module - cross-module!)
// 3. ReduceStockUseCase (dari Inventory module - cross-module!)
// 4. IEventBus (dari Shared module)
//
// Karena kompleksitas ini, kita gunakan factory function

container.registerFactory(
  'CreateOrderUseCase',
  (): CreateOrderUseCase => {
    const orderRepo = container.resolve<IOrderRepository>('IOrderRepository');
    const inventoryChecker = container.resolve<IInventoryChecker>('IInventoryChecker');
    const reduceStockUseCase = container.resolve<ReduceStockUseCase>('ReduceStockUseCase');
    const eventBus = container.resolve<IEventBus>('IEventBus');
    
    return new CreateOrderUseCase(orderRepo, inventoryChecker, reduceStockUseCase, eventBus);
  }
);

console.log('[Bootstrap] Cross-module dependencies wired successfully\n');

// ============================================================================
// STEP 4: SUBSCRIBE EVENT HANDLERS
// ============================================================================
// Resolve shared services
const eventBus = container.resolve<IEventBus>('IEventBus');
const logger = container.resolve<ILogger>('ILogger');

// Create event handler instances
const productStockReducedHandler = new ProductStockReducedHandler(logger);
const orderCreatedHandler = new OrderCreatedHandler(logger);

// Subscribe handlers ke event bus
// CATATAN: Event type harus sama dengan constructor name class event
eventBus.subscribe<ProductStockReduced>('ProductStockReduced', productStockReducedHandler);
eventBus.subscribe<OrderCreated>('OrderCreated', orderCreatedHandler);

console.log('[Bootstrap] Event handlers subscribed\n');

// ============================================================================
// STEP 5: SETUP HTTP SERVER (DRIVING ADAPTER)
// ============================================================================
// Express.js sebagai Driving Adapter
// HTTP requests akan trigger use cases

const app = express();
app.use(express.json());

// ========== INVENTORY ROUTES ==========

/**
 * POST /products
 * Create product baru
 * 
 * FLOW:
 * HTTP Request -> Route -> Use Case -> Domain Entity -> Repository -> Database
 */
app.post('/products', async (req: Request, res: Response) => {
  try {
    console.log('\n[HTTP] POST /products received');
    console.log('[HTTP] Request body:', JSON.stringify(req.body, null, 2));

    // Resolve use case dari container
    const useCase = container.resolve<CreateProductUseCase>('CreateProductUseCase');
    
    // Execute use case
    const result = await useCase.execute({
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      initialStock: req.body.initialStock
    });
    
    // Return response
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error('[HTTP] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /products/:id
 * Get product by ID
 */
app.get('/products/:id', async (req: Request, res: Response) => {
  try {
    console.log(`\n[HTTP] GET /products/${req.params.id} received`);

    const productRepo = container.resolve<IProductRepository>('IProductRepository');
    const product = await productRepo.findById(req.params.id);
    
    if (product) {
      res.json({
        id: product.id,
        name: product.name,
        price: product.price / 100, // Convert dari sen ke Rupiah
        stock: product.quantity.value
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error('[HTTP] Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ========== ORDER ROUTES ==========

/**
 * POST /orders
 * Create order baru
 * 
 * FLOW:
 * HTTP Request -> Route -> CreateOrderUseCase
 *   -> IInventoryChecker.checkStock() (cross-module!)
 *   -> Create Order Entity
 *   -> Save Order
 *   -> ReduceStockUseCase.execute() (cross-module!)
 *      -> ProductStockReduced Event Published
 *         -> ProductStockReducedHandler.handle()
 *   -> OrderCreated Event Published
 *      -> OrderCreatedHandler.handle()
 */
app.post('/orders', async (req: Request, res: Response) => {
  try {
    console.log('\n[HTTP] POST /orders received');
    console.log('[HTTP] Request body:', JSON.stringify(req.body, null, 2));

    // Resolve use case dari container
    const useCase = container.resolve<CreateOrderUseCase>('CreateOrderUseCase');
    
    // Execute use case
    const result = await useCase.execute({
      id: req.body.id,
      customerId: req.body.customerId,
      items: req.body.items
    });
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    console.error('[HTTP] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== START SERVER ==========

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('\n📍 Available endpoints:');
  console.log('   POST   /products       - Create product');
  console.log('   GET    /products/:id   - Get product');
  console.log('   POST   /orders         - Create order');
  console.log('\n========================================\n');
  
  // Auto-run demo setelah server siap
  setTimeout(runDemo, 500);
});

// ============================================================================
// STEP 6: DEMO FLOW
// ============================================================================
// Demonstrasi complete flow dari Hexagonal Architecture

async function runDemo(): Promise<void> {
  console.log('🎬 ==============================================');
  console.log('🎬 STARTING DEMO FLOW');
  console.log('🎬 ==============================================\n');

  try {
    // ========== SCENARIO 1: Create Product ==========
    console.log('📦 SCENARIO 1: Create product "Gaming Laptop" with stock 10');
    console.log('-----------------------------------------------------------');
    
    const createProductResult = await container.resolve<CreateProductUseCase>('CreateProductUseCase')
      .execute({
        id: 'prod-laptop-001',
        name: 'Gaming Laptop',
        price: 15000000, // Rp 15.000.000
        initialStock: 10
      });
    
    console.log('✅ Result:', JSON.stringify(createProductResult, null, 2));
    console.log('');

    // ========== SCENARIO 2: Create Successful Order ==========
    console.log('🛒 SCENARIO 2: Create order for 2 "Gaming Laptop"');
    console.log('-----------------------------------------------------------');
    console.log('   This will:');
    console.log('   1. Check stock via IInventoryChecker (cross-module)');
    console.log('   2. Create order entity');
    console.log('   3. Reduce stock via ReduceStockUseCase (cross-module)');
    console.log('   4. Publish ProductStockReduced event');
    console.log('   5. Publish OrderCreated event\n');
    
    const createOrderResult = await container.resolve<CreateOrderUseCase>('CreateOrderUseCase')
      .execute({
        id: 'order-001',
        customerId: 'customer-001',
        items: [
          { productId: 'prod-laptop-001', quantity: 2 }
        ]
      });
    
    console.log('✅ Result:', JSON.stringify(createOrderResult, null, 2));
    console.log('');

    // ========== SCENARIO 3: Create Order with Insufficient Stock ==========
    console.log('❌ SCENARIO 3: Try to create order for 15 "Gaming Laptop"');
    console.log('-----------------------------------------------------------');
    console.log('   Current stock is only 8 (10 - 2 from previous order)');
    console.log('   This should FAIL with insufficient stock error\n');
    
    const failedOrderResult = await container.resolve<CreateOrderUseCase>('CreateOrderUseCase')
      .execute({
        id: 'order-002',
        customerId: 'customer-002',
        items: [
          { productId: 'prod-laptop-001', quantity: 15 }
        ]
      });
    
    console.log('✅ Expected failure:', JSON.stringify(failedOrderResult, null, 2));
    console.log('');

    // ========== SUMMARY ==========
    console.log('🎬 ==============================================');
    console.log('🎬 DEMO FLOW COMPLETED SUCCESSFULLY!');
    console.log('🎬 ==============================================\n');
    
    console.log('📚 KEY LEARNING POINTS:');
    console.log('   1. ✅ Domain layer tidak bergantung pada infrastructure');
    console.log('   2. ✅ Modules berkomunikasi via interfaces (IInventoryChecker)');
    console.log('   3. ✅ Cross-module dependencies di-wiring di Composition Root');
    console.log('   4. ✅ Domain Events dipublish dan dihandle secara loose-coupling');
    console.log('   5. ✅ HTTP requests trigger use cases melalui Driving Adapter\n');

  } catch (error: any) {
    console.error('❌ Demo failed:', error);
  }
}
