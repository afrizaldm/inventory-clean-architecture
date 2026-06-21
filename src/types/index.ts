/**
 * Interface umum untuk Use Case pattern
 * 
 * Use Case adalah salah satu konsep penting dalam Clean Architecture.
 * Setiap use case merepresentasikan satu aksi bisnis yang spesifik.
 * 
 * @template Request - Tipe data input untuk use case ini
 * @template Response - Tipe data output dari use case ini
 */
export interface IUseCase<Request, Response> {
  execute(request: Request): Promise<Response>;
}

/**
 * Interface umum untuk Event Handler pattern
 * 
 * Event Handler digunakan untuk menangani domain events.
 * Ini memungkinkan loose coupling antara komponen yang menghasilkan event
 * dan komponen yang merespon event tersebut.
 * 
 * @template TEvent - Tipe event yang akan dihandle
 */
export interface IEventHandler<TEvent> {
  handle(event: TEvent): void;
}
