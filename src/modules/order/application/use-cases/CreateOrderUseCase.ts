import { IUseCase } from '../../../../types';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/order';
import { Money } from '../../../../shared/kernel/value-objects';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IInventoryChecker } from '../../contracts/IInventoryChecker';
import { OrderCreated } from '../../domain/events/OrderCreated';
import { IEventBus } from '../../../../shared/kernel/IEventBus';
import { ReduceStockUseCase } from '../../../inventory/application/use-cases/ReduceStockUseCase';

/**
 * Interface untuk input/request CreateOrderUseCase
 */
export interface CreateOrderRequest {
  /** ID unik order */
  id: string;
  /** ID customer yang membuat order */
  customerId: string;
  /** List item yang diorder */
  items: {
    productId: string;
    quantity: number;
  }[];
}

/**
 * Interface untuk output/response CreateOrderUseCase
 */
export interface CreateOrderResponse {
  /** Apakah operasi berhasil */
  success: boolean;
  /** Pesan hasil operasi */
  message: string;
  /** Order entity yang dibuat (jika berhasil) */
  order?: Order;
}

/**
 * Use Case: CreateOrderUseCase
 * 
 * Use case ini adalah contoh KOMPLEKS yang melibatkan:
 * 1. Komunikasi antar modul (Order -> Inventory)
 * 2. Multiple repository operations
 * 3. Domain event publishing
 * 
 * Ini menunjukkan bagaimana Modular Monolith bekerja:
 * - Modul Order TIDAK langsung import dari modul Inventory
 * - Modul Order bergantung pada interface IInventoryChecker
 * - Implementasi IInventoryChecker di-wire di Composition Root
 * 
 * Alur use case ini:
 * 1. Validasi input
 * 2. Cek stock untuk setiap item (via IInventoryChecker)
 * 3. Buat order entity
 * 4. Simpan order
 * 5. Kurangi stock untuk setiap item (via ReduceStockUseCase)
 * 6. Publish event OrderCreated
 */
export class CreateOrderUseCase implements IUseCase<CreateOrderRequest, CreateOrderResponse> {
  /**
   * Constructor dengan dependency injection
   * 
   * @param orderRepository - Repository untuk order (dari modul order)
   * @param inventoryChecker - Interface untuk cek stock (dari modul inventory)
   * @param reduceStockUseCase - Use case untuk kurangi stock (dari modul inventory)
   * @param eventBus - Event bus untuk publish events
   * 
   * Perhatikan bahwa dependencies cross-module (inventoryChecker, reduceStockUseCase)
   * di-inject sebagai interface/abstraction, bukan concrete implementation.
   * Wiring dilakukan di Composition Root.
   */
  constructor(
    private orderRepository: IOrderRepository,
    private inventoryChecker: IInventoryChecker,
    private reduceStockUseCase: ReduceStockUseCase,
    private eventBus: IEventBus
  ) {}

  /**
   * Execute use case ini dengan request yang diberikan
   * 
   * @param request - Data untuk membuat order
   * @returns Response dengan status dan hasil operasi
   */
  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      // ============================================
      // STEP 1: Validasi input
      // ============================================
      
      // Validasi: ID order dan customer ID wajib ada
      if (!request.id || !request.customerId) {
        return {
          success: false,
          message: 'Order ID and Customer ID are required'
        };
      }

      // Validasi: Minimal satu item
      if (!request.items || request.items.length === 0) {
        return {
          success: false,
          message: 'At least one item is required'
        };
      }

      // ============================================
      // STEP 2: Cek ketersediaan stock (Cross-module!)
      // ============================================
      
      // Loop melalui setiap item untuk cek stock
      // Ini adalah contoh komunikasi antar modul:
      // - Modul Order memanggil IInventoryChecker
      // - Implementasi sebenarnya ada di modul Inventory
      // - Tapi modul Order tidak perlu tahu implementasinya
      for (const item of request.items) {
        // Validasi quantity
        if (item.quantity <= 0) {
          return {
            success: false,
            message: `Quantity for product ${item.productId} must be greater than 0`
          };
        }

        // Cek stock melalui interface (bukan langsung ke inventory module)
        const availableStock = await this.inventoryChecker.checkStock(item.productId);
        
        // Business Rule: Stock harus mencukupi
        if (availableStock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for product ${item.productId}. Required: ${item.quantity}, Available: ${availableStock}`
          };
        }
      }

      // ============================================
      // STEP 3: Buat order items dengan harga
      // ============================================
      
      // Dalam implementasi nyata, kita akan mendapatkan harga dari Product Service
      // Untuk demo ini, kita gunakan harga dummy
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      for (const item of request.items) {
        // Harga dummy: 100000 = Rp 1.000,00 (dalam satuan terkecil)
        // Dalam production, ini akan didapat dari Product Service
        const unitPrice = 100000;
        const itemTotal = unitPrice * item.quantity;
        
        orderItems.push({
          productId: item.productId,
          productName: `Product_${item.productId}`,
          quantity: item.quantity,
          unitPrice: new Money(unitPrice, 'IDR'),
          totalPrice: new Money(itemTotal, 'IDR')
        });
        
        totalAmount += itemTotal;
      }

      // ============================================
      // STEP 4: Buat Order entity
      // ============================================
      
      const order = new Order(
        request.id,
        request.customerId,
        orderItems,
        new Money(totalAmount, 'IDR'),
        OrderStatus.PENDING
      );

      // ============================================
      // STEP 5: Simpan order ke repository
      // ============================================
      
      await this.orderRepository.save(order);

      // ============================================
      // STEP 6: Kurangi stock untuk setiap item
      // ============================================
      
      // Loop melalui setiap item dan kurangi stock
      // Ini akan trigger ProductStockReduced event untuk setiap item
      for (const item of request.items) {
        const result = await this.reduceStockUseCase.execute({
          productId: item.productId,
          amount: item.quantity
        });

        // Jika gagal kurangi stock, rollback bisa dilakukan di sini
        // (untuk demo, kita langsung return error)
        if (!result.success) {
          return {
            success: false,
            message: `Failed to reduce stock for product ${item.productId}: ${result.message}`
          };
        }
      }

      // ============================================
      // STEP 7: Publish Domain Event
      // ============================================
      
      // Buat dan publish event bahwa order telah dibuat
      const orderCreatedEvent = new OrderCreated({
        orderId: order.id,
        customerId: order.customerId,
        items: orderItems,
        totalAmount: totalAmount
      });

      this.eventBus.publish(orderCreatedEvent);

      // ============================================
      // STEP 8: Return response sukses
      // ============================================
      
      return {
        success: true,
        message: 'Order created successfully',
        order
      };
    } catch (error: any) {
      // Handle unexpected errors
      return {
        success: false,
        message: `Error creating order: ${error.message}`
      };
    }
  }
}
