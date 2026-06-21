/**
 * ============================================================================
 * SHARED INFRASTRUCTURE - Logger Interface & Implementation
 * ============================================================================
 * Interface dan implementasi logger untuk logging di seluruh aplikasi.
 * Menggunakan interface agar bisa diganti dengan library logging lain (Winston, Pino, dll).
 */
/**
 * Logger Interface
 * Kontrak untuk semua implementasi logger
 */
export interface ILogger {
    /**
     * Log informasi umum
     * @param message - Pesan yang akan dilog
     * @param meta - Metadata tambahan (optional)
     */
    info(message: string, meta?: any): void;
    /**
     * Log error
     * @param message - Pesan error
     * @param meta - Metadata tambahan (optional)
     */
    error(message: string, meta?: any): void;
    /**
     * Log warning
     * @param message - Pesan warning
     * @param meta - Metadata tambahan (optional)
     */
    warn(message: string, meta?: any): void;
}
/**
 * ConsoleLogger - Implementasi logger menggunakan console
 * Ini adalah implementasi sederhana untuk demo/development
 */
export declare class ConsoleLogger implements ILogger {
    /**
     * Log informasi dengan prefix [INFO]
     */
    info(message: string, meta?: any): void;
    /**
     * Log error dengan prefix [ERROR] ke stderr
     */
    error(message: string, meta?: any): void;
    /**
     * Log warning dengan prefix [WARN]
     */
    warn(message: string, meta?: any): void;
}
//# sourceMappingURL=Logger.d.ts.map