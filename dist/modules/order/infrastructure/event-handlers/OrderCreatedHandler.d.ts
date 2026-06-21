/**
 * ============================================================================
 * ORDER MODULE - OrderCreatedHandler
 * ============================================================================
 * Event Handler untuk OrderCreated domain event.
 */
import { IEventHandler } from '../../../../types';
import { OrderCreated } from '../domain/events/OrderCreated';
import { ILogger } from '../../../../shared/infrastructure/services/Logger';
/**
 * OrderCreatedHandler Class
 * Menangani event OrderCreated
 */
export declare class OrderCreatedHandler implements IEventHandler<OrderCreated> {
    private logger;
    /**
     * Constructor dengan dependency injection
     * @param logger - Logger untuk mencatat event
     */
    constructor(logger: ILogger);
    /**
     * Handle event OrderCreated
     * @param event - Event yang diterima
     */
    handle(event: OrderCreated): void;
}
//# sourceMappingURL=OrderCreatedHandler.d.ts.map