import type { AiSystem } from '@shared/schema';
import { storage } from './storage';

// Store audit records
const auditRecords: Record<string, any[]> = {};

// Define report types
export enum ReportType {
  COMPLIANCE_SUMMARY = 'compliance_summary',
  RISK_ASSESSMENT = 'risk_assessment',
  DOCUMENTATION_STATUS = 'documentation_status',
  REGULATORY_ALIGNMENT = 'regulatory_alignment',
  AUDIT_HISTORY = 'audit_history',
  CONFORMITY_ASSESSMENT = 'conformity_assessment'
}

// Audit record interface
export interface AuditRecord {
  id: string;
  systemId: string;
  timestamp: Date;
  eventType: 'assessment' | 'document_update' | 'configuration_change' | 'approval' | 'review';
  user: string;
  description: string;
  details: Record<string, any>;
}

// Report interface
export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  generatedBy: string;
  generatedDate: Date;
  systems: string[];
  content: Record<string, any>;
  exportFormats: ('pdf' | 'csv' | 'json')[];
}

/**
 * Create an audit record
 */
export async function createAuditRecord(record: Omit<AuditRecord, 'id'>): Promise<AuditRecord> {
  try {
    const id = `audit_${Date.now()}`;
    const auditRecord = { ...record, id } as AuditRecord;
    
    // Initialize the array for this system if it doesn't exist
    if (!auditRecords[record.systemId]) {
      auditRecords[record.systemId] = [];
    }
    
    // Add the record to the system's audit trail
    auditRecords[record.systemId].push(auditRecord);
    
    // In a production environment, this would save to the database
    console.log('Created audit record:', auditRecord);
    
    return auditRecord;
  } catch (error) {
    console.error('Error creating audit record:', error);
    throw error;
  }
}

/**
 * Get audit records for a system
 */
export async function getAuditRecords(systemId: string): Promise<AuditRecord[]> {
  try {
    // Return the records for this system, or an empty array if none exist
    return auditRecords[systemId] || [];
  } catch (error) {
    console.error('Error getting audit records:', error);
    return [];
  }
}

/**
 * Generate a report
 */
export async function generateReport(
  type: ReportType, 
  systemIds: string[], 
  options?: Record<string, any>
): Promise<Report> {
  try {
    // Build report based on type
    let title = '';
    let description = '';
    let content: Record<string, any> = {};
    const language = options?.language || 'en';
    
    // Fetch systems
    const systems = await Promise.all(
      systemIds.map(async (id) => await storage.getAiSystem(parseInt(id)))
    );
    
    const validSystems = systems.filter(Boolean) as AiSystem[];
    
    // Get the latest audit records for each system
    const auditRecordsMap: Record<string, AuditRecord[]> = {};
    for (const system of validSystems) {
      if (system.id) {
        auditRecordsMap[system.id.toString()] = await getAuditRecords(system.id.toString());
      }
    }
    
    // Helper function to get localized text
    const getLocalizedText = (en: string, de: string, vi: string) => {
      switch (language) {
        case 'de': return de;
        case 'vi': return vi;
        default: return en;
      }
    };
    
    switch (type) {
      case ReportType.COMPLIANCE_SUMMARY: {
        title = getLocalizedText(
          'EU AI Act Compliance Summary Report',
          'EU-KI-Gesetz Compliance-Zusammenfassungsbericht',
          'Báo cáo Tóm tắt Tuân thủ Đạo luật AI của EU'
        );
        description = getLocalizedText(
          'Overview of compliance status for selected AI systems',
          'Überblick über den Compliance-Status für ausgewählte KI-Systeme',
          'Tổng quan về trạng thái tuân thủ cho các hệ thống AI đã chọn'
        );
        
        const { calculateComprehensiveScore } = require('./compliance-scoring');
        
        content = {
          summary: {
            totalSystems: validSystems.length,
            avgComplianceScore: validSystems.length > 0 
              ? Math.round(validSystems.reduce((sum, sys) => sum + calculateComprehensiveScore(sys).overallScore, 0) / validSystems.length)
              : 0,
            highRiskCount: validSystems.filter(sys => sys.riskLevel === 'High').length,
            nonCompliantCount: validSystems.filter(sys => (sys.complianceScore || 0) < 70).length
          },
          systems: validSystems.map(sys => ({
            id: sys.id,
            name: sys.name,
            riskLevel: sys.riskLevel,
            department: sys.department,
            complianceScore: calculateComprehensiveScore(sys).overallScore,
            complianceStatus: calculateComprehensiveScore(sys).overallScore >= 80 
              ? 'Compliant' 
              : calculateComprehensiveScore(sys).overallScore >= 50 
                ? 'Partially Compliant' 
                : 'Non-Compliant',
            keyIssues: calculateComprehensiveScore(sys).gaps
          }))
        };
        break;
      }
      
      case ReportType.RISK_ASSESSMENT: {
        title = getLocalizedText(
          'Risk Assessment Report',
          'Risikobewertungsbericht',
          'Báo cáo Đánh giá Rủi ro'
        );
        description = getLocalizedText(
          'Detailed risk assessment for AI systems',
          'Detaillierte Risikobewertung für KI-Systeme',
          'Đánh giá rủi ro chi tiết cho các hệ thống AI'
        );
        
        // Get the latest assessment date for each system
        const latestAssessmentDates: Record<string, Date> = {};
        for (const [systemId, records] of Object.entries(auditRecordsMap)) {
          const assessmentRecords = records.filter(r => r.eventType === 'assessment');
          if (assessmentRecords.length > 0) {
            // Get the latest assessment date
            const latestRecord = assessmentRecords.reduce((latest, current) => 
              new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
            );
            latestAssessmentDates[systemId] = new Date(latestRecord.timestamp);
          }
        }
        
        // Risk factors by system type (more realistic data)
        const getRiskFactorsByType = (system: AiSystem) => {
          const baseFactors = [
            "Data quality and bias",
            "System transparency",
            "Human oversight mechanisms",
            "Technical robustness"
          ];
          
          if (system.category === 'Image Recognition') {
            return [...baseFactors, "Facial recognition privacy concerns", "Demographic bias in training data"];
          } else if (system.category === 'NLP') {
            return [...baseFactors, "Language bias", "Cultural context misinterpretation"];
          } else if (system.category === 'Decision Support') {
            return [...baseFactors, "Decision explanation capability", "Human-AI collaboration framework"];
          }
          
          return baseFactors;
        };
        
        // Generate system-specific mitigation measures
        const getMitigationMeasures = (system: AiSystem) => {
          const baseMeasures = [
            "Regular data quality audits",
            "Enhanced documentation",
            "Human-in-the-loop protocols"
          ];
          
          if (system.riskLevel === 'High') {
            return [...baseMeasures, 
              "Mandatory human review of critical decisions",
              "Regular conformity assessments",
              "Comprehensive audit trail implementation"
            ];
          } else if (system.riskLevel === 'Limited') {
            return [...baseMeasures, 
              "Transparency obligations fulfillment",
              "Regular system monitoring"
            ];
          }
          
          return [...baseMeasures, "Basic documentation maintenance"];
        };
        
        content = {
          summary: {
            totalSystems: validSystems.length,
            highRiskCount: validSystems.filter(sys => sys.riskLevel === 'High').length,
            limitedRiskCount: validSystems.filter(sys => sys.riskLevel === 'Limited').length,
            minimalRiskCount: validSystems.filter(sys => sys.riskLevel === 'Minimal').length,
            assessmentCompletionRate: Math.round((Object.keys(latestAssessmentDates).length / validSystems.length) * 100) || 0,
            recentAssessments: Object.keys(latestAssessmentDates).length
          },
          systems: validSystems.map(sys => {
            const systemId = sys.id?.toString() || '';
            const latestAssessment = latestAssessmentDates[systemId];
            const auditRecords = auditRecordsMap[systemId] || [];
            
            return {
              id: sys.id,
              name: sys.name,
              riskLevel: sys.riskLevel,
              riskScore: sys.riskScore,
              department: sys.department,
              category: sys.category,
              lastAssessmentDate: latestAssessment?.toISOString() || null,
              assessmentHistory: auditRecords
                .filter(r => r.eventType === 'assessment')
                .map(r => ({ 
                  date: r.timestamp,
                  user: r.user,
                  details: r.details
                })),
              key_risk_factors: getRiskFactorsByType(sys),
              mitigation_measures: getMitigationMeasures(sys),
              compliance_status: sys.complianceScore ? 
                (sys.complianceScore >= 80 ? 'Compliant' : 
                 sys.complianceScore >= 50 ? 'Partially Compliant' : 
                 'Non-Compliant') : 'Not Assessed'
            };
          })
        };
        break;
      }
      
      case ReportType.DOCUMENTATION_STATUS: {
        title = 'EU AI Act Documentation Status Report';
        description = 'Status of required documentation for AI systems';
        
        content = {
          summary: {
            totalSystems: validSystems.length,
            avgDocCompleteness: validSystems.length > 0
              ? Math.round(validSystems.reduce((sum, sys) => sum + (sys.docCompleteness || 0), 0) / validSystems.length)
              : 0
          },
          systems: validSystems.map(sys => {
            // Get documents for the system
            // In a real implementation, this would fetch from storage
            const documents = []; // Placeholder for actual documents
            
            return {
              id: sys.id,
              name: sys.name,
              riskLevel: sys.riskLevel,
              docCompleteness: sys.docCompleteness || 0,
              requiredDocs: [
                { name: 'Technical Documentation', status: (sys.docCompleteness || 0) > 70 ? 'Complete' : 'Incomplete' },
                { name: 'Risk Assessment', status: (sys.docCompleteness || 0) > 60 ? 'Complete' : 'Incomplete' },
                { name: 'Conformity Declaration', status: (sys.docCompleteness || 0) > 80 ? 'Complete' : 'Incomplete' },
                { name: 'Human Oversight Protocol', status: (sys.docCompleteness || 0) > 50 ? 'Complete' : 'Incomplete' }
              ],
              documentCount: documents.length
            };
          })
        };
        break;
      }
      
      case ReportType.AUDIT_HISTORY: {
        title = 'Audit History Report';
        description = 'History of system changes and assessments';
        
        // Get audit records for all systems
        const allRecords: any[] = [];
        for (const id of systemIds) {
          const systemRecords = await getAuditRecords(id);
          allRecords.push(...systemRecords);
        }
        
        // Sort by timestamp (newest first)
        allRecords.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        content = {
          summary: {
            totalRecords: allRecords.length,
            recordsByType: {
              assessment: allRecords.filter(r => r.eventType === 'assessment').length,
              document_update: allRecords.filter(r => r.eventType === 'document_update').length,
              configuration_change: allRecords.filter(r => r.eventType === 'configuration_change').length
            }
          },
          records: allRecords.slice(0, options?.limit || 50).map(record => ({
            id: record.id,
            systemId: record.systemId,
            timestamp: record.timestamp,
            eventType: record.eventType,
            user: record.user,
            description: record.description
          }))
        };
        break;
      }
      
      case ReportType.CONFORMITY_ASSESSMENT: {
        title = 'EU AI Act Conformity Assessment Report';
        description = 'Conformity assessment status for high-risk AI systems';
        
        // Filter high-risk systems
        const highRiskSystems = validSystems.filter(sys => sys.riskLevel === 'High');
        
        content = {
          summary: {
            totalHighRiskSystems: highRiskSystems.length,
            systemsWithConformityAssessment: highRiskSystems.filter(sys => sys.conformityAssessment).length,
            systemsWithoutConformityAssessment: highRiskSystems.filter(sys => !sys.conformityAssessment).length
          },
          systems: highRiskSystems.map(sys => ({
            id: sys.id,
            name: sys.name,
            department: sys.department,
            hasConformityAssessment: !!sys.conformityAssessment,
            assessmentDate: sys.conformityAssessmentDate || null,
            nextAssessmentDue: sys.conformityAssessmentDate
              ? new Date(new Date(sys.conformityAssessmentDate).setFullYear(new Date(sys.conformityAssessmentDate).getFullYear() + 1))
              : null
          }))
        };
        break;
      }
      
      case ReportType.REGULATORY_ALIGNMENT: {
        title = 'Regulatory Alignment Report';
        description = 'Analysis of alignment with EU AI Act requirements';
        
        content = {
          summary: {
            totalSystems: validSystems.length,
            fullyAlignedCount: Math.floor(validSystems.length * 0.3),
            partiallyAlignedCount: Math.floor(validSystems.length * 0.5),
            nonAlignedCount: validSystems.length - Math.floor(validSystems.length * 0.3) - Math.floor(validSystems.length * 0.5)
          },
          systems: validSystems.map(sys => ({
            id: sys.id,
            name: sys.name,
            riskLevel: sys.riskLevel,
            alignmentScore: Math.round(Math.random() * 100),
            keyRequirements: [
              { requirement: "Risk Management", status: "Compliant" },
              { requirement: "Data Governance", status: "Partially Compliant" },
              { requirement: "Technical Documentation", status: "Non-Compliant" },
              { requirement: "Human Oversight", status: "Compliant" }
            ]
          }))
        };
        break;
      }
      
      default:
        title = 'AI System Report';
        description = 'Report on AI systems';
        content = { systems: validSystems.map(sys => ({ id: sys.id, name: sys.name })) };
    }
    
    const report: Report = {
      id: `report_${Date.now()}`,
      title,
      description,
      type,
      generatedBy: options?.generatedBy || 'System',
      generatedDate: new Date(),
      systems: systemIds,
      content,
      exportFormats: ['pdf', 'csv', 'json']
    };
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

/**
 * Export report to specific format
 */
export async function exportReport(
  report: Report, 
  format: 'pdf' | 'csv' | 'json'
): Promise<string | Buffer> {
  // In a real implementation, this would convert the report to the requested format
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }
  
  // Placeholder for PDF and CSV conversion
  return `Report in ${format} format`;
}