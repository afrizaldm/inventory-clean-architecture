/**
 * CREATE ORDER USE CASE
 * 
 * Application layer use case untuk membuat order baru.
 * Use case ini adalah contoh komunikasi antar modul:
 * - Order module perlu mengecek stok ke Inventory module
 * - Komunikasi dilakukan melalui interface IInventoryChecker
 * - Order module TIDAK tahu implementasi Inventory module
 */

import { UseCase } from '../../../../shared/kernel';
import { EventBus } from '../../../../shared/kernel';
import { Order, OrderId, OrderStatus, OrderItem } from '../../domain';
import { IOrderRepository } from '../../domain/repositories/i-order-repository';
import { IInventoryChecker } from '../../../inventory/contracts/i-inventory-checker';
import { Money } from '../../../../shared/kernel/value-objects';
import { OrderCreated } from '../../domain/events/order-created';

/**
 * Command object untuk CreateOrder
 */
export interface CreateOrderCommand {
  readonly id: OrderId;
  readonly items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

/**
 * Result object dari CreateOrder use case
 */
export interface CreateOrderResult {
  readonly success: boolean;
  readonly orderId?: OrderId;
  readonly message: string;
}

/**
 * CreateOrderUseCase
 * 
 * Handles the creation of a new order.
 * Demonstrates cross-module communication via IInventoryChecker.
 */
export class CreateOrderUseCase implements UseCase<CreateOrderCommand, CreateOrderResult> {
  constructor(
    private orderRepository: IOrderRepository,
    private inventoryChecker: IInventoryChecker, // Interface dari Inventory module contracts
    private eventBus: EventBus
  ) {}

  /**
   * Execute the use case
   * 
   * Flow:
   * 1. Validate each item's stock availability via IInventoryChecker
   * 2. If all items available, reduce stock (via inventory module)
   * 3. Create order entity
   * 4. Save order
   * 5. Publish OrderCreated event
   */
  async execute(command: CreateOrderCommand): Promise<CreateOrderResult> {
    try {
      // Step 1: Check stock availability for all items
      // Ini adalah cross-module communication!
      // Order module hanya bergantung pada interface IInventoryChecker
      for (const item of command.items) {
        const stockCheck = await this.inventoryChecker.checkStock(
          item.productId,
          item.quantity
        );

        if (!stockCheck.available) {
          return {
            success: false,
            message: `Stok tidak cukup untuk produk "${stockCheck.productName}". ` +
              `Diminta: ${stockCheck.requestedQuantity}, Tersedia: ${stockCheck.currentStock}`,
          };
        }
      }

      // Step 2: All items available, create order items with Money VO
      const orderItems: OrderItem[] = [];
      let totalAmount = new Money(0, 'IDR');

      for (const item of command.items) {
        const unitPrice = new Money(item.unitPrice, 'IDR');
        const totalPrice = unitPrice.multiply(item.quantity);
        
        // Get product name from inventory
        const productName = await this.inventoryChecker.getProductName(item.productId) || 'Unknown';

        orderItems.push({
          productId: item.productId,
          productName,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });

        totalAmount = totalAmount.add(totalPrice);
      }

      // Step 3: Create Order entity
      const order = new Order(command.id, orderItems, totalAmount, OrderStatus.PENDING);

      // Step 4: Confirm the order (business logic)
      order.confirm();

      // Step 5: Persist order
      await this.orderRepository.save(order);

      // Step 6: Publish domain event
      const event = new OrderCreated(
        order.id,
        totalAmount.amount,
        orderItems.length
      );
      await this.eventBus.publish(event);

      return {
        success: true,
        orderId: order.id,
        message: `Order created successfully with ${orderItems.length} item(s), total: ${totalAmount.toString()}`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Failed to create order: ${errorMessage}`,
      };
    }
  }
}
