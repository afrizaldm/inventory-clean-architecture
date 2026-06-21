/**
 * ============================================================================
 * ORDER MODULE - CreateOrderUseCase
 * ============================================================================
 * Use Case untuk membuat order baru.
 * 
 * INI ADALAH CONTOH KOMUNIKASI ANTAR MODUL:
 * 1. Order module butuh cek stock dari Inventory module
 * 2. Order module TIDAK import langsung dari Inventory module
 * 3. Order module menggunakan interface IInventoryChecker
 * 4. Implementation IInventoryChecker disediakan oleh Inventory module
 * 5. Wiring dilakukan di Composition Root (main.ts)
 * 
 * FLOW:
 * 1. Validasi input
 * 2. Cek stock via IInventoryChecker (cross-module call)
 * 3. Buat order entity
 * 4. Simpan order
 * 5. Kurangi stock via ReduceStockUseCase (cross-module call)
 * 6. Publish OrderCreated event
 */

import { IUseCase } from '../../../../types';
import { Order, IOrderItem } from '../../domain/entities/Order';
import { Money } from '../../../inventory/domain/value-objects/Money';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IInventoryChecker } from '../../contracts/IInventoryChecker';
import { OrderCreated } from '../../domain/events/OrderCreated';
import { IEventBus } from '../../../../shared/kernel/IEventBus';
import { ReduceStockUseCase } from '../../../inventory/application/use-cases/ReduceStockUseCase';

/**
 * Input DTO untuk CreateOrderUseCase
 */
export interface CreateOrderRequest {
  /** ID unik order */
  id: string;
  /** ID customer yang membuat order */
  customerId: string;
  /** Item-item yang dipesan */
  items: {
    /** ID produk */
    productId: string;
    /** Jumlah yang dipesan */
    quantity: number;
  }[];
}

/**
 * Output DTO untuk CreateOrderUseCase
 */
export interface CreateOrderResponse {
  /** Apakah operasi berhasil */
  success: boolean;
  /** Pesan hasil operasi */
  message: string;
  /** Order yang dibuat (jika berhasil) */
  order?: Order;
}

/**
 * CreateOrderUseCase Class
 * Responsible untuk orchestrasi pembuatan order
 * 
 * DEPENDENCIES:
 * 1. IOrderRepository - dari Order module (internal)
 * 2. IInventoryChecker - dari Inventory module (cross-module!)
 * 3. ReduceStockUseCase - dari Inventory module (cross-module!)
 * 4. IEventBus - dari Shared module (shared service)
 */
export class CreateOrderUseCase implements IUseCase<CreateOrderRequest, CreateOrderResponse> {
  /**
   * Constructor dengan dependency injection
   * @param orderRepository - Repository untuk persist order
   * @param inventoryChecker - Interface untuk cek stock (dari Inventory module)
   * @param reduceStockUseCase - Use case untuk kurangi stock (dari Inventory module)
   * @param eventBus - Event bus untuk publish events
   */
  constructor(
    private orderRepository: IOrderRepository,
    private inventoryChecker: IInventoryChecker,
    private reduceStockUseCase: ReduceStockUseCase,
    private eventBus: IEventBus
  ) {}

  /**
   * Eksekusi use case
   * @param request - Input data untuk create order
   * @returns Response dengan status dan result
   * 
   * FLOW DETAIL:
   * 1. Validasi input data
   * 2. Cek ketersediaan stock untuk setiap item (via IInventoryChecker)
   * 3. Hitung total amount
   * 4. Buat Order entity
   * 5. Simpan order ke repository
   * 6. Kurangi stock untuk setiap item (via ReduceStockUseCase)
   * 7. Publish OrderCreated event
   */
  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      // ========== STEP 1: Validasi Input ==========
      if (!request.id || !request.customerId) {
        return {
          success: false,
          message: 'Order ID and Customer ID are required'
        };
      }

      if (!request.items || request.items.length === 0) {
        return {
          success: false,
          message: 'At least one item is required'
        };
      }

      // ========== STEP 2: Cek Stock Availability (CROSS-MODULE!) ==========
      // Loop setiap item dan cek stock via IInventoryChecker
      // Ini adalah contoh komunikasi antar modul tanpa direct dependency!
      for (const item of request.items) {
        if (item.quantity <= 0) {
          return {
            success: false,
            message: `Quantity for product ${item.productId} must be greater than 0`
          };
        }

        // Cek stock - IInventoryChecker diimplementasi oleh Inventory module
        const availableStock = await this.inventoryChecker.checkStock(item.productId);
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
        // HARDCODED PRICE UNTUK DEMO
        // Dalam implementasi nyata, kita akan fetch price dari Product service
        const unitPrice = 100000; // Rp 1.000,00 dalam sen
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

      // ========== STEP 5: Simpan Order ==========
      await this.orderRepository.save(order);

      // ========== STEP 6: Kurangi Stock (CROSS-MODULE!) ==========
      // Panggil ReduceStockUseCase dari Inventory module
      // Event ProductStockReduced akan dipublish otomatis
      for (const item of request.items) {
        const result = await this.reduceStockUseCase.execute({
          productId: item.productId,
          amount: item.quantity
        });

        if (!result.success) {
          // Rollback: Dalam production, kita perlu rollback order yang sudah dibuat
          return {
            success: false,
            message: `Failed to reduce stock for product ${item.productId}: ${result.message}`
          };
        }
      }

      // ========== STEP 7: Publish Domain Event ==========
      const orderCreatedEvent = new OrderCreated({
        orderId: order.id,
        customerId: order.customerId,
        items: orderItems,
        totalAmount: totalAmount
      });

      this.eventBus.publish(orderCreatedEvent);

      // ========== STEP 8: Return Success Response ==========
      return {
        success: true,
        message: 'Order created successfully',
        order
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error creating order: ${error.message}`
      };
    }
  }
}
