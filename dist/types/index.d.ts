/**
 * ============================================================================
 * TYPES - Global Type Definitions
 * ============================================================================
 * File ini berisi type definitions yang digunakan secara global di seluruh aplikasi.
 * Ini adalah bagian dari shared kernel yang bisa diakses oleh semua modul.
 */
/**
 * Interface untuk Use Case
 * Use Case adalah pola untuk mengenkapsulasi logika bisnis spesifik
 * @template TRequest - Tipe data input untuk use case
 * @template TResponse - Tipe data output dari use case
 */
export interface IUseCase<TRequest, TResponse> {
    /**
     * Eksekusi use case dengan request tertentu
     * @param request - Data input untuk use case
     * @returns Promise yang resolve ke response
     */
    execute(request: TRequest): Promise<TResponse>;
}
/**
 * Interface untuk Event Handler
 * Event Handler bertanggung jawab untuk menangani domain events
 * @template TEvent - Tipe event yang akan dihandle
 */
export interface IEventHandler<TEvent> {
    /**
     * Handle event yang diterima
     * @param event - Event yang akan diproses
     */
    handle(event: TEvent): void;
}
/**
 * Base interface untuk semua Domain Events
 * Domain events merepresentasikan sesuatu yang terjadi di domain
 */
export interface IDomainEvent {
    /** Timestamp kapan event terjadi */
    readonly occurredAt: Date;
}
//# sourceMappingURL=index.d.ts.map