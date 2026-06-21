"use strict";
/**
 * ============================================================================
 * SHARED INFRASTRUCTURE - Logger Interface & Implementation
 * ============================================================================
 * Interface dan implementasi logger untuk logging di seluruh aplikasi.
 * Menggunakan interface agar bisa diganti dengan library logging lain (Winston, Pino, dll).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
/**
 * ConsoleLogger - Implementasi logger menggunakan console
 * Ini adalah implementasi sederhana untuk demo/development
 */
class ConsoleLogger {
    /**
     * Log informasi dengan prefix [INFO]
     */
    info(message, meta) {
        const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
        console.log(`[INFO] ${new Date().toISOString()} - ${message}${metaString}`);
    }
    /**
     * Log error dengan prefix [ERROR] ke stderr
     */
    error(message, meta) {
        const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}${metaString}`);
    }
    /**
     * Log warning dengan prefix [WARN]
     */
    warn(message, meta) {
        const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}${metaString}`);
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=Logger.js.map