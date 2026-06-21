/**
 * CREATE PRODUCT USE CASE
 * 
 * Application layer use case untuk membuat produk baru.
 * Use case ini adalah Command Handler yang:
 * 1. Menerima command (CreateProductCommand)
 * 2. Validasi input
 * 3. Berinteraksi dengan repository
 * 4. Return result
 */

import { UseCase } from '../../../../shared/kernel';
import { Product, ProductId } from '../../domain';
import { IProductRepository } from '../../domain/repositories/i-product-repository';
import { Money, Quantity } from '../../../../shared/kernel/value-objects';

/**
 * Command object untuk CreateProduct
 * Immutable data transfer object
 */
export interface CreateProductCommand {
  readonly id: ProductId;
  readonly name: string;
  readonly price: number;
  readonly stock: number;
}

/**
 * Result object dari CreateProduct use case
 */
export interface CreateProductResult {
  readonly success: boolean;
  readonly productId?: ProductId;
  readonly message: string;
}

/**
 * CreateProductUseCase
 * 
 * Handles the creation of a new product in the inventory.
 * This is a pure application service - it orchestrates domain objects
 * but doesn't contain business logic itself.
 */
export class CreateProductUseCase implements UseCase<CreateProductCommand, CreateProductResult> {
  constructor(private productRepository: IProductRepository) {}

  /**
   * Execute the use case
   * 
   * @param command - Command containing product data
   * @returns Result indicating success or failure
   */
  async execute(command: CreateProductCommand): Promise<CreateProductResult> {
    try {
      // Check if product already exists
      const existing = await this.productRepository.existsById(command.id);
      if (existing) {
        return {
          success: false,
          message: `Product with ID ${command.id} already exists`,
        };
      }

      // Create Value Objects
      const price = new Money(command.price, 'IDR');
      const stock = new Quantity(command.stock);

      // Create Domain Entity
      const product = new Product(
        command.id,
        command.name,
        price,
        stock
      );

      // Persist using repository
      await this.productRepository.save(product);

      return {
        success: true,
        productId: product.id,
        message: `Product "${command.name}" created successfully with ${command.stock} units`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Failed to create product: ${errorMessage}`,
      };
    }
  }
}
