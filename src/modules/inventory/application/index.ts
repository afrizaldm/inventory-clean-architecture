/**
 * INVENTORY APPLICATION - Index file
 * 
 * Export semua application layer objects dari modul Inventory.
 */

// Use Cases
export { 
  CreateProductUseCase, 
  type CreateProductCommand, 
  type CreateProductResult 
} from './use-cases/create-product.use-case';

export { 
  ReduceStockUseCase, 
  type ReduceStockCommand, 
  type ReduceStockResult 
} from './use-cases/reduce-stock.use-case';

// Services (Facades)
// TODO: export { InventoryApplicationService } from './services/inventory-application.service';
