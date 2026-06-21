/**
 * ORDER APPLICATION - Index file
 */

// Use Cases
export { 
  CreateOrderUseCase, 
  type CreateOrderCommand, 
  type CreateOrderResult 
} from './use-cases/create-order.use-case';

// Services (Facades)
export { OrderApplicationService } from './services/order-application.service';
