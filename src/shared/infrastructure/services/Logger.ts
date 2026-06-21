/**
 * Interface untuk Logger
 * 
 * Logger digunakan untuk logging di seluruh aplikasi.
 * Dengan menggunakan interface, kita bisa dengan mudah mengganti implementasi
 * (misalnya dari ConsoleLogger ke FileLogger atau CloudLogger) tanpa mengubah kode lain.
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
 * Implementasi Logger sederhana menggunakan console
 * 
 * Dalam production, Anda bisa mengganti ini dengan Winston, Pino, atau logger lainnya
 */
export class ConsoleLogger implements ILogger {
  /**
   * Log informasi dengan prefix [INFO]
   */
  public info(message: string, meta?: any): void {
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    console.log(`[INFO] ${new Date().toISOString()} - ${message}${metaString}`);
  }

  /**
   * Log error dengan prefix [ERROR] dan warna merah (jika terminal support)
   */
  public error(message: string, meta?: any): void {
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}${metaString}`);
  }

  /**
   * Log warning dengan prefix [WARN]
   */
  public warn(message: string, meta?: any): void {
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}${metaString}`);
  }
}
