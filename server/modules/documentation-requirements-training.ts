/**
 * Documentation Requirements Training Module
 * 
 * Comprehensive guide to documentation requirements under the EU AI Act
 */

export const documentationRequirementsModule = {
  id: "documentation-requirements",
  title: "Documentation Requirements Under the EU AI Act",
  description: "Learn about the comprehensive documentation requirements for high-risk AI systems under the EU AI Act.",
  estimated_time: "45-60 minutes",
  topics: ["Technical Documentation", "Record Keeping", "Compliance Documentation", "Documentation Best Practices"],
  role_relevance: {
    decision_maker: "Important for understanding organizational responsibilities",
    developer: "Critical for implementing technical documentation requirements",
    operator: "Important for maintaining operational documentation",
    user: "Helpful for understanding documentation you may need to review"
  },
  content: {
    default: {
      title: "Documentation Requirements Under the EU AI Act",
      sections: [
        {
          title: "Introduction to Documentation Requirements",
          content: `
# Documentation Requirements Under the EU AI Act

Comprehensive documentation is a cornerstone of EU AI Act compliance, particularly for high-risk AI systems. This module covers what documentation you need to create, maintain, and make available to authorities.

## Module Objectives

By the end of this module, you will:
- Understand the documentation requirements for high-risk AI systems
- Know how to create compliant technical documentation
- Learn about record-keeping requirements
- Understand documentation practices for different stakeholders
- Be able to implement documentation best practices

![Documentation Framework](/assets/documentation-framework.svg)
          `
        },
        {
          title: "Key Documentation Requirements",
          content: `
# Key Documentation Requirements

The EU AI Act establishes specific documentation requirements primarily in Articles 11, 12, 18, and 50.

## Article 11: Technical Documentation

Technical documentation must demonstrate that your high-risk AI system complies with requirements. It must be kept up-to-date and include:

1. **General System Description**
   - Overall description of the AI system
   - Purpose and intended use
   - Version control information
   - Links to previous versions, if applicable

2. **Design Specifications**
   - System architecture and design choices
   - Design specifications and assumptions
   - General logic, algorithms, and key parameters
   - Design trade-offs and decisions made

3. **Development Processes**
   - Development methodologies
   - Training methodologies and techniques
   - System development procedures
   - Quality control measures

4. **Data Governance**
   - Data requirements and specifications
   - Data collection methods
   - Data preprocessing techniques
   - Data validation procedures
   - Bias testing and monitoring
   - Data quality measures

## Article 12: Record-Keeping

High-risk systems must maintain automatic logs of events, including:

1. **System Operation Records**
   - Start/stop periods of operation
   - Input data reference or record
   - Output results and decisions
   - User interactions with the system

2. **System Monitoring Data**
   - Performance metrics
   - Error rates and handling
   - Deviation patterns
   - Anomaly detection results

Record-keeping obligations extend throughout the lifecycle of the AI system and must support appropriate levels of traceability.

![Record-keeping Requirements](/assets/record-keeping-requirements.svg)
          `
        },
        {
          title: "Conformity Assessment Documentation",
          content: `
# Conformity Assessment Documentation

High-risk AI systems require specific documentation for the conformity assessment process.

## Required Documentation for Conformity

1. **EU Declaration of Conformity**
   - A mandatory document declaring compliance
   - Requires system identification information
   - Contains compliance assertion statement
   - Identifies standards and specifications followed

2. **Conformity Assessment Report**
   - Results of conformity assessment activities
   - Testing methodologies and protocols
   - Evidence of compliance with requirements
   - Areas of improvement identified

3. **CE Marking Documentation**
   - Technical file supporting CE marking
   - Label and marking information
   - Placement of marking on products/documentation
   - Supporting evidence for CE eligibility

## Self-Assessment Documentation

For high-risk AI systems that qualify for self-assessment:

1. **Internal Testing Records**
   - Testing protocols followed
   - Test results and analysis
   - Deficiencies identified and corrections made
   - Verification of conformity with standards

2. **Verification Procedures**
   - Procedures for checking ongoing compliance
   - Validation methodologies
   - Consistency checks and quality assurance
   - Monitoring systems for continued conformity

3. **Management System Information**
   - Quality management system details
   - Risk management procedures
   - Organizational responsibilities
   - Post-market monitoring plans
          `
        },
        {
          title: "Stakeholder-Specific Documentation",
          content: `
# Stakeholder-Specific Documentation

Different stakeholders have different documentation needs and responsibilities.

## Provider Documentation

AI providers must maintain:

1. **Development Documentation**
   - Development methodologies and processes
   - Model specifications and architecture
   - Training and testing data specifications
   - Validation procedures and results

2. **Compliance Documentation**
   - Evidence of conformity with requirements
   - Risk management records
   - Quality management system documentation
   - Post-market monitoring plan

3. **Customer Documentation**
   - User manuals and instructions
   - Installation requirements
   - Maintenance procedures
   - System limitations and constraints

## Deployer Documentation

Organizations deploying high-risk AI systems must maintain:

1. **Operational Documentation**
   - System configuration settings
   - Integration specifications
   - Customization details
   - Operational procedures

2. **Monitoring Records**
   - Performance monitoring data
   - Incident logs and resolution reports
   - Oversight activity documentation
   - Security monitoring records

3. **User Training Documentation**
   - Training materials for system operators
   - Competency assessment records
   - Refresher training schedules
   - Role-specific guidance

![Documentation Responsibilities](/assets/documentation-responsibilities.svg)
          `
        },
        {
          title: "Post-Market Documentation",
          content: `
# Post-Market Documentation

Ongoing documentation is required after system deployment.

## Post-Market Monitoring Documentation

1. **Performance Monitoring**
   - Real-world performance metrics
   - Comparison with expected performance
   - Trends and patterns analysis
   - Performance degradation indicators

2. **Incident Reports**
   - Detailed incident descriptions
   - Root cause analysis
   - Remedial actions taken
   - Preventive measures implemented

3. **System Updates**
   - Update documentation and logs
   - Change management records
   - Regression testing results
   - Impact assessments for changes

## Regulatory Communications

Documentation required for regulatory interactions:

1. **Authority Information Requests**
   - Documentation of authority requests
   - Responses provided
   - Supporting evidence shared
   - Follow-up communications

2. **Serious Incident Reports**
   - Reports of serious incidents to authorities
   - Mandatory notification documentation
   - Investigation records
   - Corrective action plans

3. **Documentation of Corrective Actions**
   - Detailed plan of actions
   - Implementation evidence
   - Verification of effectiveness
   - Preventive measures for future incidents
          `
        },
        {
          title: "Documentation Best Practices",
          content: `
# Documentation Best Practices

Implementing these best practices will help ensure your documentation is effective and compliant.

## Documentation Organization

1. **Structured Documentation Framework**
   - Create a clear documentation hierarchy
   - Implement consistent naming conventions
   - Use standardized templates
   - Establish documentation numbering system

2. **Document Management System**
   - Implement version control
   - Establish approval workflows
   - Set up access controls
   - Create documentation audit trails

3. **Responsibility Assignment**
   - Clearly define documentation owners
   - Establish review and approval authorities
   - Define update responsibilities
   - Create documentation maintenance schedules

## Documentation Quality

1. **Clarity and Completeness**
   - Use clear, precise language
   - Avoid ambiguity and jargon
   - Ensure documentation is comprehensive
   - Include all required elements

2. **Traceability**
   - Establish clear links between documents
   - Create traceability matrices
   - Reference related documentation
   - Maintain consistent cross-references

3. **Documentation Testing**
   - Verify documentation accuracy
   - Test documentation usability
   - Conduct documentation reviews
   - Update based on feedback

![Documentation Best Practices](/assets/documentation-best-practices.svg)
          `
        },
        {
          title: "Documentation Gap Analysis",
          content: `
# Documentation Gap Analysis

Regular gap analysis helps ensure your documentation remains compliant.

## Conducting a Documentation Audit

1. **Audit Preparation**
   - Define audit scope and objectives
   - Select appropriate audit team
   - Gather relevant documentation
   - Prepare audit checklists

2. **Documentation Review**
   - Check for completeness against requirements
   - Verify accuracy and currency
   - Assess documentation quality
   - Identify missing or outdated elements

3. **Gap Identification**
   - Document identified gaps
   - Categorize gaps by severity
   - Determine root causes
   - Assess compliance impact

## Gap Remediation

1. **Remediation Planning**
   - Prioritize gaps for remediation
   - Assign responsibilities
   - Set timelines for completion
   - Allocate necessary resources

2. **Documentation Development**
   - Create missing documentation
   - Update outdated materials
   - Enhance inadequate documentation
   - Standardize inconsistent documentation

3. **Verification and Validation**
   - Review updated documentation
   - Verify compliance with requirements
   - Validate effectiveness
   - Obtain necessary approvals
          `
        },
        {
          title: "Practical Documentation Example",
          content: `
# Practical Documentation Example

Let's examine a practical example of documentation for a high-risk AI system.

## Case Study: AI-Based Recruitment System

A company has developed an AI system that screens job applications and ranks candidates. This is considered a high-risk AI system under the EU AI Act.

**Key Documentation Components:**

1. **Technical Documentation**
   - System architecture diagram showing the ML model, data flows, and interfaces
   - Algorithm description detailing the candidate ranking methodology
   - Data specifications for training datasets, including demographic representation
   - Bias testing results showing evaluation across protected characteristics

2. **Risk Management Documentation**
   - Risk assessment identifying potential discrimination risks
   - Mitigation measures including human oversight procedures
   - Ongoing monitoring protocols for bias detection
   - Incident response procedures for addressing potential discrimination

3. **User Documentation**
   - Clear instructions for HR staff on how to use the system
   - Guidelines for interpreting AI recommendations
   - Procedures for overriding AI decisions
   - Training materials for system operators

4. **Conformity Documentation**
   - Self-assessment report against Article 10 (data governance)
   - Compliance evidence for Article 14 (human oversight)
   - Declaration of Conformity signed by management
   - CE marking placement documentation

**Documentation Challenges and Solutions:**

|Challenge|Solution|
|---------|--------|
|Explaining complex algorithms|Created simplified technical explanations with visualizations|
|Demonstrating bias testing|Developed comprehensive bias testing protocols with clear metrics|
|Maintaining up-to-date records|Implemented automated documentation update triggers|
|Ensuring human oversight is documented|Created detailed decision logs capturing human interventions|
          `
        },
        {
          title: "Documentation Tools and Resources",
          content: `
# Documentation Tools and Resources

Leveraging appropriate tools can streamline documentation processes.

## Documentation Management Tools

1. **Document Management Systems**
   - Version control capabilities
   - Approval workflow automation
   - Document lifecycle management
   - Collaborative editing features

2. **Documentation Templates**
   - Standardized formats for consistent documentation
   - Pre-built structures aligned with EU AI Act requirements
   - Checklist-based templates for completeness
   - Role-specific documentation templates

3. **Documentation Generation Tools**
   - API documentation generators
   - Automated log collection systems
   - Model documentation utilities
   - Code documentation tools

## Documentation Resources

1. **Official Guidance**
   - European Commission guidance documents
   - Regulatory authority interpretations
   - Industry standards organization publications
   - Technical specifications referenced by the EU AI Act

2. **Industry Best Practices**
   - Industry association documentation guidelines
   - Sector-specific documentation approaches
   - Case studies of successful documentation
   - Peer-reviewed documentation methodologies

3. **SGH Group Resources**
   - Internal documentation standards
   - Documentation templates library
   - Documentation process guidelines
   - Documentation review checklists

![Documentation Tools](/assets/documentation-tools.svg)
          `
        }
      ],
      assessments: [
        {
          question: "Which EU AI Act article specifically covers technical documentation requirements?",
          options: [
            "Article 9",
            "Article 10",
            "Article 11",
            "Article 12"
          ],
          correctAnswer: "Article 11"
        },
        {
          question: "What must be included in the technical documentation for a high-risk AI system?",
          options: [
            "Only information about the development process",
            "Only data governance information",
            "Only system performance metrics",
            "General system description, design specifications, development processes, and data governance"
          ],
          correctAnswer: "General system description, design specifications, development processes, and data governance"
        },
        {
          question: "Which of the following is NOT typically included in automatic logs required under Article 12?",
          options: [
            "Start/stop periods of operation",
            "Development team meeting minutes",
            "Input data reference",
            "User interactions with the system"
          ],
          correctAnswer: "Development team meeting minutes"
        },
        {
          question: "Who is primarily responsible for maintaining the EU Declaration of Conformity?",
          options: [
            "The AI system user",
            "The AI system provider",
            "The regulatory authority",
            "Third-party testers"
          ],
          correctAnswer: "The AI system provider"
        },
        {
          question: "What is a key component of post-market documentation?",
          options: [
            "Original design documents only",
            "Marketing materials",
            "Performance monitoring and incident reports",
            "Employee resumes"
          ],
          correctAnswer: "Performance monitoring and incident reports"
        },
        {
          question: "Which documentation best practice helps ensure consistent documentation quality?",
          options: [
            "Limiting access to documentation",
            "Using standardized templates",
            "Changing formats frequently",
            "Keeping documentation confidential"
          ],
          correctAnswer: "Using standardized templates"
        },
        {
          question: "Why is a documentation gap analysis important?",
          options: [
            "To reduce the amount of documentation needed",
            "To identify missing or outdated documentation that could affect compliance",
            "To eliminate the need for technical documentation",
            "To replace human oversight requirements"
          ],
          correctAnswer: "To identify missing or outdated documentation that could affect compliance"
        },
        {
          question: "When should documentation be updated?",
          options: [
            "Only when initially developing the AI system",
            "Only during regulatory inspections",
            "Only after serious incidents",
            "Throughout the system lifecycle as changes occur"
          ],
          correctAnswer: "Throughout the system lifecycle as changes occur"
        },
        {
          question: "What should documentation for human oversight include?",
          options: [
            "Only information about system limitations",
            "Only technical specifications",
            "Procedures for human intervention, interpretation guidelines, and override protocols",
            "Only marketing approval information"
          ],
          correctAnswer: "Procedures for human intervention, interpretation guidelines, and override protocols"
        },
        {
          question: "Which is NOT an effective documentation management practice?",
          options: [
            "Implementing version control",
            "Establishing clear ownership and responsibilities",
            "Storing all documentation in a single file",
            "Creating a consistent documentation structure"
          ],
          correctAnswer: "Storing all documentation in a single file"
        }
      ]
    }
  }
};