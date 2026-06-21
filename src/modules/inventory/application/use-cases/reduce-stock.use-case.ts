/**
 * REDUCE STOCK USE CASE
 * 
 * Application layer use case untuk mengurangi stok produk.
 * Use case ini juga mem-publish domain event setelah stok berhasil dikurangi.
 */

import { UseCase } from '../../../../shared/kernel';
import { EventBus } from '../../../../shared/kernel';
import { Product, ProductId } from '../../domain';
import { IProductRepository } from '../../domain/repositories/i-product-repository';
import { ProductStockReduced } from '../../domain/events/product-stock-reduced';
import { Quantity } from '../../../../shared/kernel/value-objects';

/**
 * Command object untuk ReduceStock
 */
export interface ReduceStockCommand {
  readonly productId: ProductId;
  readonly quantity: number;
}

/**
 * Result object dari ReduceStock use case
 */
export interface ReduceStockResult {
  readonly success: boolean;
  readonly message: string;
  readonly event?: ProductStockReduced;
}

/**
 * ReduceStockUseCase
 * 
 * Handles reducing stock for a product.
 * Publishes ProductStockReduced event on success.
 */
export class ReduceStockUseCase implements UseCase<ReduceStockCommand, ReduceStockResult> {
  constructor(
    private productRepository: IProductRepository,
    private eventBus: EventBus
  ) {}

  /**
   * Execute the use case
   * 
   * @param command - Command containing product ID and quantity to reduce
   * @returns Result indicating success or failure
   */
  async execute(command: ReduceStockCommand): Promise<ReduceStockResult> {
    try {
      // Find the product
      const product = await this.productRepository.findById(command.productId);
      
      if (!product) {
        return {
          success: false,
          message: `Product with ID ${command.productId} not found`,
        };
      }

      // Create Value Object for quantity
      const quantity = new Quantity(command.quantity);

      // Reduce stock (this may throw if insufficient stock)
      product.reduceStock(quantity);

      // Persist changes
      await this.productRepository.save(product);

      // Create and publish domain event
      const event = new ProductStockReduced(
        product.id,
        product.name,
        product.stock.toNumber() + command.quantity, // old stock
        product.stock.toNumber(), // new stock
        command.quantity
      );

      await this.eventBus.publish(event);

      return {
        success: true,
        message: `Successfully reduced ${command.quantity} units from "${product.name}"`,
        event,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Failed to reduce stock: ${errorMessage}`,
      };
    }
  }
}
