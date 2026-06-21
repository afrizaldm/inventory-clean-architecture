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
export class ConsoleLogger implements ILogger {
  /**
   * Log informasi dengan prefix [INFO]
   */
  public info(message: string, meta?: any): void {
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    console.log(`[INFO] ${new Date().toISOString()} - ${message}${metaString}`);
  }

  /**
   * Log error dengan prefix [ERROR] ke stderr
   */
  public error(message: string, meta?: any): void {
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}${metaString}`);
  }

  /**
   * Log warning dengan prefix [WARN]
   */
  public warn(message: string, meta?: any): void {
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}${metaString}`);
  }
}
