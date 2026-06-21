/**
 * INVENTORY APPLICATION - Index file
 * 
 * Export semua application layer objects dari modul Inventory.
 */

// Use Cases
export { 
  CreateProductUseCase, 
  type CreateProductRequest, 
  type CreateProductResponse 
} from './use-cases/CreateProductUseCase';

export { 
  ReduceStockUseCase, 
  type ReduceStockRequest, 
  type ReduceStockResponse 
} from './use-cases/ReduceStockUseCase';

// Services (Facades)
// TODO: export { InventoryApplicationService } from './services/inventory-application.service';
