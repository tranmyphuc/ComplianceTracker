/**
 * Jack said: Health Check API endpoints provide monitoring capabilities
 * to ensure system components are operating correctly and to assist with
 * diagnostics during troubleshooting.
 */

import { Request, Response } from 'express';
import { db } from '../db.js';
import { isGoogleSearchAvailable } from '../lib/google-search-api.js';
import { ServiceName, MetricType, performanceMonitor } from '../lib/performance-monitor.js';
import { apiKeyManager } from '../lib/api-key-manager.js';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details?: any;
}

interface SystemHealth {
  overall: HealthStatus;
  services: Record<string, HealthStatus>;
  timestamp: string;
  uptime: number;
}

/**
 * Jack said: Check health of database connection
 */
async function checkDatabaseHealth(): Promise<HealthStatus> {
  try {
    // Record measurement start time
    const startTime = Date.now();
    
    // Simple query to verify database connection
    await db.execute('SELECT 1');
    
    // Record latency
    const latency = Date.now() - startTime;
    performanceMonitor.recordMetric(
      ServiceName.DATABASE,
      MetricType.LATENCY,
      latency,
      { operation: 'health_check' }
    );
    
    return {
      status: 'healthy',
      details: {
        latency,
        connectionPool: {
          // You might include more detailed connection pool stats here if available
          status: 'connected'
        }
      }
    };
  } catch (error: any) {
    // Record error
    performanceMonitor.recordMetric(
      ServiceName.DATABASE,
      MetricType.ERROR_RATE,
      1,
      { operation: 'health_check' }
    );
    
    return {
      status: 'unhealthy',
      details: {
        message: error.message,
        code: error.code
      }
    };
  }
}

/**
 * Jack said: Check Google Search API availability
 */
async function checkGoogleSearchApiHealth(): Promise<HealthStatus> {
  try {
    const startTime = Date.now();
    const isAvailable = await isGoogleSearchAvailable();
    const latency = Date.now() - startTime;
    
    // Record metrics
    performanceMonitor.recordMetric(
      ServiceName.GOOGLE_SEARCH,
      MetricType.LATENCY,
      latency,
      { operation: 'health_check' }
    );
    
    if (isAvailable) {
      performanceMonitor.recordMetric(
        ServiceName.GOOGLE_SEARCH,
        MetricType.SUCCESS_RATE,
        1,
        { operation: 'health_check' }
      );
      
      return {
        status: 'healthy',
        details: {
          latency,
          apiKeys: apiKeyManager.getKeyStats('google_search')
        }
      };
    } else {
      performanceMonitor.recordMetric(
        ServiceName.GOOGLE_SEARCH,
        MetricType.ERROR_RATE,
        1,
        { operation: 'health_check' }
      );
      
      return {
        status: 'unhealthy',
        details: {
          message: 'Google Search API is not available'
        }
      };
    }
  } catch (error: any) {
    performanceMonitor.recordMetric(
      ServiceName.GOOGLE_SEARCH,
      MetricType.ERROR_RATE,
      1,
      { operation: 'health_check' }
    );
    
    return {
      status: 'unhealthy',
      details: {
        message: error.message
      }
    };
  }
}

/**
 * Jack said: Check memory and CPU usage of the Node.js process
 */
function checkSystemResources(): HealthStatus {
  const memoryUsage = process.memoryUsage();
  
  // In a real implementation, you might measure CPU usage with a library
  // For demonstration, we're just monitoring memory
  const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
  const heapTotalMB = memoryUsage.heapTotal / (1024 * 1024);
  const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;
  
  // Record metric
  performanceMonitor.recordMetric(
    ServiceName.DATABASE, // Using DATABASE as a proxy for "system"
    MetricType.MEMORY_USAGE,
    heapUsedMB,
    { type: 'health_check' }
  );
  
  // Determine health status based on memory usage
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (heapUsagePercent > 85) {
    status = 'unhealthy';
  } else if (heapUsagePercent > 70) {
    status = 'degraded';
  }
  
  return {
    status,
    details: {
      memory: {
        heapUsedMB: Math.round(heapUsedMB * 100) / 100,
        heapTotalMB: Math.round(heapTotalMB * 100) / 100,
        heapUsagePercent: Math.round(heapUsagePercent * 100) / 100,
        rss: Math.round(memoryUsage.rss / (1024 * 1024) * 100) / 100 + 'MB'
      }
    }
  };
}

/**
 * Jack said: Overall health check endpoint
 */
export async function healthCheck(req: Request, res: Response) {
  // Start timer for overall health check latency
  const startTime = Date.now();
  
  // Perform individual health checks
  const [dbHealth, googleSearchHealth] = await Promise.all([
    checkDatabaseHealth(),
    checkGoogleSearchApiHealth()
  ]);
  
  const systemHealth = checkSystemResources();
  
  // Assemble overall health status
  const serviceStatuses: Record<string, HealthStatus> = {
    database: dbHealth,
    googleSearch: googleSearchHealth,
    system: systemHealth
  };
  
  // Determine overall status (unhealthy if any service is unhealthy)
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  for (const service of Object.values(serviceStatuses)) {
    if (service.status === 'unhealthy') {
      overallStatus = 'unhealthy';
      break;
    } else if (service.status === 'degraded' && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }
  }
  
  // Construct the health response
  const health: SystemHealth = {
    overall: {
      status: overallStatus
    },
    services: serviceStatuses,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
  
  // Record latency for the overall health check
  const latency = Date.now() - startTime;
  performanceMonitor.recordMetric(
    ServiceName.DATABASE, // Using DATABASE as a proxy for "system"
    MetricType.LATENCY,
    latency,
    { operation: 'health_check_overall' }
  );
  
  // Set appropriate status code based on overall health
  const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(health);
}

/**
 * Jack said: Detailed metrics endpoint
 */
export function metricsReport(req: Request, res: Response) {
  const timeWindowMs = req.query.timeWindow ? 
    parseInt(req.query.timeWindow as string) * 60 * 1000 : // Minutes to ms
    3600000; // Default to 1 hour
  
  const metrics: Record<string, any> = {};
  
  // Get metrics for each service
  for (const service of Object.values(ServiceName)) {
    metrics[service] = performanceMonitor.getServiceMetrics(
      service as ServiceName,
      timeWindowMs
    );
  }
  
  res.status(200).json({
    metrics,
    timestamp: new Date().toISOString(),
    timeWindowMs
  });
}