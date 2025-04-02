/**
 * Jack said: Performance monitoring system to track API performance, error rates,
 * and system health metrics to improve reliability and diagnose issues.
 */

import { EventEmitter } from 'events';

export enum MetricType {
  LATENCY = 'latency',
  ERROR_RATE = 'error_rate',
  SUCCESS_RATE = 'success_rate',
  REQUEST_COUNT = 'request_count',
  MEMORY_USAGE = 'memory_usage',
  CPU_USAGE = 'cpu_usage',
}

export enum ServiceName {
  GOOGLE_SEARCH = 'google_search',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  EU_AI_ACT_API = 'eu_ai_act_api',
  RISK_ASSESSMENT = 'risk_assessment',
  APPROVAL_WORKFLOW = 'approval_workflow',
}

interface MetricEntry {
  timestamp: Date;
  value: number;
  tags: Record<string, string>;
}

interface MetricSummary {
  min: number;
  max: number;
  avg: number;
  p95: number; // 95th percentile
  p99: number; // 99th percentile
  count: number;
  errorRate: number;
}

class PerformanceMonitor extends EventEmitter {
  private metrics: Map<string, MetricEntry[]> = new Map();
  private readonly maxHistorySize = 1000; // Maximum number of entries to keep per metric
  private readonly alertThresholds: Map<string, number> = new Map();
  
  constructor() {
    super();
    
    // Set up default alert thresholds
    this.setAlertThreshold(`${ServiceName.DATABASE}.${MetricType.LATENCY}`, 500); // 500ms
    this.setAlertThreshold(`${ServiceName.GOOGLE_SEARCH}.${MetricType.LATENCY}`, 1000); // 1000ms
    this.setAlertThreshold(`${ServiceName.DATABASE}.${MetricType.ERROR_RATE}`, 0.1); // 10%
    this.setAlertThreshold(`${ServiceName.GOOGLE_SEARCH}.${MetricType.ERROR_RATE}`, 0.05); // 5%
    
    // Clean up old metrics periodically (every 15 minutes)
    setInterval(() => this.cleanupOldMetrics(), 15 * 60 * 1000);
    
    // Record system metrics periodically (every 5 minutes)
    setInterval(() => this.recordSystemMetrics(), 5 * 60 * 1000);
  }
  
  /**
   * Jack said: Record a metric value with optional tags
   */
  public recordMetric(
    service: ServiceName, 
    metricType: MetricType, 
    value: number, 
    tags: Record<string, string> = {}
  ): void {
    const metricKey = `${service}.${metricType}`;
    if (!this.metrics.has(metricKey)) {
      this.metrics.set(metricKey, []);
    }
    
    const entry: MetricEntry = {
      timestamp: new Date(),
      value,
      tags,
    };
    
    const metricEntries = this.metrics.get(metricKey)!;
    metricEntries.push(entry);
    
    // Trim if exceeding max size
    if (metricEntries.length > this.maxHistorySize) {
      metricEntries.splice(0, metricEntries.length - this.maxHistorySize);
    }
    
    // Check if this metric should trigger an alert
    this.checkAlertThreshold(service, metricType, value, tags);
  }
  
  /**
   * Jack said: Helper to time function execution and record latency
   */
  public async timeExecution<T>(
    service: ServiceName,
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    let success = false;
    
    try {
      const result = await fn();
      success = true;
      return result;
    } finally {
      const latency = Date.now() - startTime;
      this.recordMetric(service, MetricType.LATENCY, latency, { operation });
      
      // Record success or error
      if (success) {
        this.recordMetric(service, MetricType.SUCCESS_RATE, 1, { operation });
      } else {
        this.recordMetric(service, MetricType.ERROR_RATE, 1, { operation });
      }
      
      // Always increment request count
      this.recordMetric(service, MetricType.REQUEST_COUNT, 1, { operation });
    }
  }
  
  /**
   * Jack said: Set an alert threshold for a specific metric
   */
  public setAlertThreshold(metricKey: string, threshold: number): void {
    this.alertThresholds.set(metricKey, threshold);
  }
  
  /**
   * Jack said: Check if a metric exceeds its alert threshold
   */
  private checkAlertThreshold(
    service: ServiceName, 
    metricType: MetricType, 
    value: number, 
    tags: Record<string, string>
  ): void {
    const metricKey = `${service}.${metricType}`;
    const threshold = this.alertThresholds.get(metricKey);
    
    if (threshold !== undefined && value > threshold) {
      // Emit an alert event that can be handled by other parts of the system
      this.emit('alert', {
        service,
        metricType,
        value,
        threshold,
        tags,
        timestamp: new Date(),
        message: `${service} ${metricType} exceeded threshold: ${value} > ${threshold}`
      });
      
      // Log the alert
      console.warn(`[PerformanceMonitor] Alert: ${service} ${metricType} exceeded threshold: ${value} > ${threshold}`);
    }
  }
  
  /**
   * Jack said: Get metric summary for a specific service and metric type
   */
  public getMetricSummary(
    service: ServiceName, 
    metricType: MetricType, 
    timeWindowMs: number = 3600000 // Default to last hour
  ): MetricSummary {
    const metricKey = `${service}.${metricType}`;
    const entries = this.metrics.get(metricKey) || [];
    
    // Filter entries within the time window
    const now = new Date();
    const filteredEntries = entries.filter(entry => 
      (now.getTime() - entry.timestamp.getTime()) <= timeWindowMs
    );
    
    if (filteredEntries.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        p95: 0,
        p99: 0,
        count: 0,
        errorRate: 0
      };
    }
    
    // Sort values for percentile calculation
    const values = filteredEntries.map(e => e.value).sort((a, b) => a - b);
    
    // Calculate basic statistics
    const min = values[0];
    const max = values[values.length - 1];
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    
    // Calculate percentiles
    const p95Index = Math.floor(values.length * 0.95);
    const p99Index = Math.floor(values.length * 0.99);
    const p95 = values[p95Index] || max;
    const p99 = values[p99Index] || max;
    
    // For error rate metrics, calculate the actual error rate over the period
    const errorRate = metricType === MetricType.ERROR_RATE 
      ? sum / filteredEntries.length 
      : 0;
    
    return {
      min,
      max,
      avg,
      p95,
      p99,
      count: filteredEntries.length,
      errorRate
    };
  }
  
  /**
   * Jack said: Clean up old metrics to prevent memory leaks
   */
  private cleanupOldMetrics(): void {
    const now = new Date().getTime();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000); // One week retention
    
    for (const [key, entries] of this.metrics.entries()) {
      const newEntries = entries.filter(entry => 
        entry.timestamp.getTime() > oneWeekAgo
      );
      this.metrics.set(key, newEntries);
    }
  }
  
  /**
   * Jack said: Get all metrics for a service within a time window
   */
  public getServiceMetrics(
    service: ServiceName,
    timeWindowMs: number = 3600000 // Default to last hour
  ): Record<string, MetricSummary> {
    const result: Record<string, MetricSummary> = {};
    
    for (const metricType of Object.values(MetricType)) {
      const summary = this.getMetricSummary(service, metricType as MetricType, timeWindowMs);
      result[metricType] = summary;
    }
    
    return result;
  }
  
  /**
   * Jack said: Record system resource usage metrics (memory, CPU)
   */
  public recordSystemMetrics(): void {
    // Record memory usage
    const memoryUsage = process.memoryUsage();
    this.recordMetric(
      ServiceName.DATABASE, // Using DATABASE as a proxy for "system"
      MetricType.MEMORY_USAGE,
      memoryUsage.heapUsed / (1024 * 1024), // Convert to MB
      { type: 'heap_used' }
    );
    
    this.recordMetric(
      ServiceName.DATABASE,
      MetricType.MEMORY_USAGE,
      memoryUsage.rss / (1024 * 1024), // Convert to MB
      { type: 'rss' }
    );
    
    // In a production system, we would also measure CPU usage
    // This would typically require an additional package or native metrics
    // For simplicity, we'll omit actual CPU measurement for now
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Export a singleton instance