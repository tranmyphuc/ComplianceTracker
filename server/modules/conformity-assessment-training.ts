/**
 * Conformity Assessment Procedures Training Module
 * 
 * Comprehensive guide to conformity assessment under the EU AI Act
 */

export const conformityAssessmentModule = {
  id: "conformity-assessment",
  title: "Conformity Assessment Procedures",
  description: "Learn about the conformity assessment procedures required for high-risk AI systems under the EU AI Act.",
  estimated_time: "50-65 minutes",
  topics: ["Conformity Assessment", "CE Marking", "Self-Assessment", "Third-Party Assessment", "Notified Bodies"],
  role_relevance: {
    decision_maker: "Essential for strategic compliance planning",
    developer: "Important for implementing technical conformity requirements",
    operator: "Helpful for understanding operational conformity obligations",
    user: "Beneficial for recognizing compliant AI systems"
  },
  content: {
    default: {
      title: "Conformity Assessment Procedures",
      sections: [
        {
          title: "Introduction to Conformity Assessment",
          content: `
# Conformity Assessment Procedures

Conformity assessment is the process of demonstrating that your AI system meets the requirements set out in the EU AI Act. This module explains the various procedures, when they apply, and how to implement them effectively.

## Module Objectives

By the end of this module, you will:
- Understand the conformity assessment framework
- Know when self-assessment is permitted vs. third-party assessment
- Learn about CE marking requirements and processes
- Understand the role of notified bodies
- Be able to implement appropriate conformity assessment procedures

![Conformity Assessment Overview](/assets/conformity-assessment-overview.svg)
          `
        },
        {
          title: "Conformity Assessment Framework",
          content: `
# Conformity Assessment Framework

The EU AI Act establishes a conformity assessment framework based on risk level.

## Risk-Based Conformity Assessment

The type of conformity assessment required depends on the risk classification of the AI system:

1. **Unacceptable Risk**
   - AI systems in this category are prohibited
   - No conformity assessment pathway exists
   - Examples: Social scoring, manipulative systems

2. **High-Risk**
   - Subject to mandatory conformity assessment
   - May require self-assessment or third-party assessment
   - Must meet all requirements in Chapter 2 of the AI Act

3. **Limited Risk**
   - Subject to transparency obligations only
   - Simplified conformity procedures
   - Self-declaration of compliance with transparency requirements

4. **Minimal Risk**
   - Voluntary codes of conduct
   - No mandatory conformity assessment
   - Optional self-assessment for confidence

## Conformity Assessment Pathways

High-risk AI systems may follow different conformity assessment pathways:

1. **Pathway A: Self-Assessment**
   - Available for certain high-risk AI systems
   - Provider conducts internal conformity assessment
   - Provider issues EU Declaration of Conformity

2. **Pathway B: Third-Party Assessment**
   - Required for specific high-risk AI systems
   - Assessment conducted by notified body
   - Notified body issues certificate of conformity

![Conformity Assessment Pathways](/assets/conformity-assessment-pathways.svg)
          `
        },
        {
          title: "Self-Assessment Procedures",
          content: `
# Self-Assessment Procedures

Self-assessment is available for many high-risk AI systems under the EU AI Act.

## When Self-Assessment Applies

Self-assessment is permitted for high-risk AI systems that:

1. Are not covered by EU harmonized legislation listed in Annex II, Section A
2. Have been developed with a quality management system in place
3. Are not used for specific sensitive purposes requiring third-party assessment

## Self-Assessment Process

The self-assessment process involves the following steps:

1. **System Analysis**
   - Identify applicable requirements
   - Analyze system characteristics
   - Determine assessment criteria

2. **Requirements Verification**
   - Check compliance with each applicable requirement
   - Test system functionality and performance
   - Verify data governance measures
   - Assess risk management system

3. **Documentation Compilation**
   - Prepare technical documentation
   - Document testing procedures and results
   - Record risk assessment outcomes
   - Create compliance matrix showing how each requirement is met

4. **Declaration of Conformity**
   - Create EU Declaration of Conformity
   - Include all required information
   - Ensure appropriate signatories
   - Maintain with technical documentation

## Documentation Requirements

Self-assessment requires comprehensive documentation, including:

1. **Technical Documentation**
   - System description and specifications
   - Design details and development processes
   - Training methodologies and data sources
   - Risk management documentation

2. **Testing Documentation**
   - Test plans and procedures
   - Test results and analysis
   - Validation methodologies
   - Performance metrics

3. **Compliance Evidence**
   - Evidence of conformity with each requirement
   - Traceability matrix linking requirements to evidence
   - Gap analysis and mitigation measures
   - Continuous monitoring plans

4. **Self-Assessment Report**
   - Summary of assessment activities
   - Assessment methodology
   - Findings and conclusions
   - Identified nonconformities and resolutions

![Self-Assessment Process](/assets/self-assessment-process.svg)
          `
        },
        {
          title: "Third-Party Assessment",
          content: `
# Third-Party Assessment

Some high-risk AI systems require assessment by independent notified bodies.

## When Third-Party Assessment Is Required

Third-party assessment is mandatory for:

1. High-risk AI systems covered by EU harmonized legislation listed in Annex II, Section A
2. Remote biometric identification systems used in publicly accessible spaces
3. Systems designated as requiring third-party assessment in updated annexes

## Notified Bodies

Notified bodies are organizations designated by EU member states to conduct conformity assessments:

1. **Designation Process**
   - National authorities designate notified bodies
   - Bodies must meet independence and competence requirements
   - Commission publishes list of notified bodies
   - Bodies receive unique identification numbers

2. **Competence Requirements**
   - Technical expertise in AI systems
   - Knowledge of EU AI Act requirements
   - Assessment methodology capabilities
   - Qualified personnel and resources

3. **Independence Requirements**
   - Impartiality from system providers
   - Freedom from conflicts of interest
   - Organizational separation
   - Financial independence

## Assessment Process

The third-party assessment process typically includes:

1. **Application Submission**
   - Provider submits application to chosen notified body
   - Includes technical documentation
   - Describes system purpose and functionality
   - Details conformity assessment pathway requested

2. **Documentation Review**
   - Notified body examines technical documentation
   - Assesses completeness and adequacy
   - Identifies any information gaps
   - Requests additional information if needed

3. **Assessment Activities**
   - Testing of system functionality
   - Verification of compliance with requirements
   - Examination of risk management system
   - Evaluation of data governance measures

4. **Assessment Report**
   - Detailed findings and observations
   - Identification of nonconformities
   - Requirements for corrective actions
   - Recommendation on conformity

5. **Certificate Issuance**
   - EU Technical Documentation Assessment Certificate
   - Quality Management System Approval (if applicable)
   - Validity period and conditions
   - Scope of certification

![Third-Party Assessment Process](/assets/third-party-assessment.svg)
          `
        },
        {
          title: "CE Marking",
          content: `
# CE Marking

High-risk AI systems that meet conformity requirements receive the CE marking.

## CE Marking Overview

The CE marking is a visible declaration that:

1. The AI system meets all applicable EU AI Act requirements
2. The proper conformity assessment procedure has been completed
3. The provider takes responsibility for compliance
4. The system can be freely marketed throughout the EU

## CE Marking Requirements

To apply the CE marking, providers must:

1. **Complete Conformity Assessment**
   - Self-assessment or third-party assessment
   - Document all assessment activities
   - Address any nonconformities

2. **Issue EU Declaration of Conformity**
   - Formal statement of compliance
   - Identification of system and provider
   - Reference to EU AI Act
   - Description of conformity assessment procedure

3. **Apply CE Marking**
   - Visible, legible, and permanent marking
   - Follow standardized format and proportions
   - Minimum height of 5mm
   - Affixed to system, packaging, or documentation

4. **Maintain Documentation**
   - Keep technical documentation current
   - Maintain records of conformity assessment
   - Update as necessary with system changes
   - Keep available for authorities for 10 years

## Declaration of Conformity

The EU Declaration of Conformity must include:

1. **System Information**
   - AI system name and type
   - Version number or identifier
   - Batch or serial number
   - Provider name and address

2. **Compliance Statement**
   - Declaration of responsibility
   - Statement of conformity with EU AI Act
   - Identification of applicable requirements
   - Reference to harmonized standards, if used

3. **Assessment Information**
   - Conformity assessment procedure used
   - Notified body details (if applicable)
   - Certificate references (if applicable)
   - Date and validity of certification

4. **Authorized Signature**
   - Name and function of signatory
   - Place and date of issue
   - Legal signature of authorized person
   - Company stamp (if applicable)

![CE Marking Process](/assets/ce-marking-process.svg)
          `
        },
        {
          title: "Compliance Monitoring and Updates",
          content: `
# Compliance Monitoring and Updates

Conformity assessment is not a one-time activity but requires ongoing monitoring and updates.

## Post-Market Monitoring

After conformity assessment and CE marking, providers must:

1. **Implement Monitoring System**
   - Continuously monitor system performance
   - Track incidents and malfunctions
   - Collect user feedback
   - Monitor for changing risks

2. **Maintain Conformity**
   - Ensure ongoing compliance
   - Address any identified issues
   - Update documentation as needed
   - Implement corrective actions

3. **Report Incidents**
   - Report serious incidents to authorities
   - Document all incidents
   - Analyze root causes
   - Implement preventive measures

4. **Periodic Review**
   - Regularly review conformity status
   - Assess against any regulatory changes
   - Update risk assessments
   - Verify continued compliance

## Substantial Modifications

When substantial modifications are made to the AI system:

1. **Modification Assessment**
   - Determine if changes are substantial
   - Assess impact on performance and risk
   - Evaluate effect on compliance status
   - Document assessment findings

2. **Reassessment Requirements**
   - Substantial modifications require reassessment
   - Update technical documentation
   - Conduct new risk assessment
   - Perform additional testing

3. **Renewed Conformity Assessment**
   - Repeat applicable conformity assessment
   - Update EU Declaration of Conformity
   - Obtain new certification if applicable
   - Maintain records of reassessment

4. **Version Control**
   - Clearly identify new version
   - Document changes from previous version
   - Update all affected documentation
   - Maintain history of modifications

![Substantial Modification Process](/assets/substantial-modification.svg)
          `
        },
        {
          title: "Practical Implementation",
          content: `
# Practical Implementation

Implementing conformity assessment procedures effectively requires a structured approach.

## Implementation Framework

1. **Preparation Phase**
   - Identify applicable requirements
   - Determine assessment pathway
   - Allocate resources and responsibilities
   - Develop assessment timeline

2. **Documentation Phase**
   - Compile technical documentation
   - Prepare assessment protocols
   - Create testing methodologies
   - Develop conformity matrix

3. **Assessment Phase**
   - Conduct systematic evaluation
   - Perform testing and validation
   - Document assessment activities
   - Identify and address gaps

4. **Certification Phase**
   - Prepare Declaration of Conformity
   - Apply for third-party assessment (if required)
   - Implement corrective actions
   - Obtain certification and apply CE marking

5. **Maintenance Phase**
   - Implement monitoring systems
   - Conduct periodic reviews
   - Update documentation
   - Manage modifications

## Common Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Determining applicable requirements | Use requirement mapping tools and regulatory guidance |
| Demonstrating risk management | Implement structured risk management processes with clear documentation |
| Technical documentation complexity | Use standardized templates and progressive documentation approaches |
| Proving compliance with data quality | Implement comprehensive data governance with validation metrics |
| Managing substantial modifications | Establish change control process with modification assessment |
| Maintaining compliance over time | Implement continuous monitoring and periodic review schedule |

## Resources for Implementation

1. **Internal Resources**
   - Cross-functional assessment team
   - Technical expertise in AI systems
   - Quality management resources
   - Documentation specialists

2. **External Resources**
   - Regulatory consultants
   - Notified bodies
   - Industry associations
   - Standardization organizations

![Implementation Resources](/assets/implementation-resources.svg)
          `
        },
        {
          title: "Case Study: Conformity Assessment Example",
          content: `
# Case Study: Conformity Assessment Example

Let's examine a practical example of conformity assessment for a high-risk AI system.

## Medical Diagnostic AI System

A healthcare company has developed an AI system that assists in diagnosing medical conditions based on patient data and imaging.

**System Classification:**
- High-risk AI system under Annex III, point 5(a) - AI intended to be used for health purposes
- Also subject to medical device regulation under Annex II, Section A

**Required Conformity Assessment Pathway:**
- Third-party assessment by a notified body required
- Both EU AI Act and medical device regulation must be addressed
- Coordinated assessment approach needed

**Key Conformity Steps:**

1. **Preparation**
   - Compiled comprehensive technical documentation
   - Mapped applicable requirements from both regulations
   - Identified appropriate notified body with dual competence

2. **Risk Management**
   - Conducted thorough risk assessment covering both AI and medical aspects
   - Implemented risk controls and mitigation measures
   - Documented risk-benefit analysis

3. **Technical Requirements Verification**
   - Validated algorithm performance using diverse patient datasets
   - Implemented robust data governance and bias testing
   - Established human oversight mechanisms for clinical use

4. **Notified Body Assessment**
   - Submitted documentation for review
   - Participated in on-site assessment
   - Addressed identified nonconformities
   - Obtained EU Technical Documentation Assessment Certificate

5. **Post-Certification**
   - Applied CE marking
   - Issued EU Declaration of Conformity
   - Implemented post-market surveillance system
   - Established incident reporting procedures

**Lessons Learned:**
- Early engagement with notified body saved significant rework
- Coordinated approach to dual regulatory requirements reduced redundancy
- Comprehensive technical documentation facilitated efficient assessment
- Clear traceability between requirements and evidence streamlined the process
- Post-market surveillance data provided valuable input for system improvements
          `
        },
        {
          title: "Conformity Assessment Checklist",
          content: `
# Conformity Assessment Checklist

Use this checklist to ensure you've covered all key aspects of conformity assessment.

## Pre-Assessment Checklist

- [ ] Determined AI system risk classification
- [ ] Identified all applicable requirements
- [ ] Determined appropriate conformity assessment pathway
- [ ] Allocated necessary resources and expertise
- [ ] Established assessment timeline and milestones
- [ ] Identified appropriate notified body (if required)
- [ ] Developed assessment methodology

## Technical Documentation Checklist

- [ ] General system description and purpose
- [ ] Design specifications and architecture
- [ ] Algorithm descriptions and key parameters
- [ ] Development methodologies and processes
- [ ] Data requirements and specifications
- [ ] Data collection and preprocessing methods
- [ ] Testing and validation procedures
- [ ] Risk management documentation
- [ ] Human oversight mechanisms
- [ ] Technical performance metrics

## Assessment Activity Checklist

- [ ] Risk management system assessment
- [ ] Data governance evaluation
- [ ] Technical robustness testing
- [ ] Accuracy and performance validation
- [ ] Human oversight verification
- [ ] Transparency requirements check
- [ ] Cybersecurity assessment
- [ ] Record-keeping capabilities verification
- [ ] Quality management system evaluation (if applicable)
- [ ] Compliance with harmonized standards (if applicable)

## Post-Assessment Checklist

- [ ] Nonconformities addressed and resolved
- [ ] EU Declaration of Conformity prepared
- [ ] CE marking applied correctly
- [ ] Technical documentation finalized
- [ ] Post-market monitoring system implemented
- [ ] Incident reporting procedures established
- [ ] Change management process defined
- [ ] Periodic review schedule established
- [ ] Registration with authorities completed (if required)
- [ ] Documentation retention system established

![Conformity Assessment Checklist](/assets/conformity-checklist.svg)
          `
        }
      ],
      assessments: [
        {
          question: "Which AI systems require third-party conformity assessment?",
          options: [
            "All high-risk AI systems",
            "Only minimal risk AI systems",
            "High-risk AI systems covered by EU harmonized legislation listed in Annex II, Section A and remote biometric identification systems",
            "Only AI systems with limited transparency obligations"
          ],
          correctAnswer: "High-risk AI systems covered by EU harmonized legislation listed in Annex II, Section A and remote biometric identification systems"
        },
        {
          question: "What does the CE marking indicate for an AI system?",
          options: [
            "That the system was developed in Europe",
            "That the system meets all applicable EU AI Act requirements and has completed proper conformity assessment",
            "That the system is completely free of all risks",
            "That the system has been developed by a certified AI developer"
          ],
          correctAnswer: "That the system meets all applicable EU AI Act requirements and has completed proper conformity assessment"
        },
        {
          question: "When is self-assessment permitted under the EU AI Act?",
          options: [
            "Only for minimal risk AI systems",
            "For all AI systems regardless of risk level",
            "For many high-risk AI systems not covered by specific harmonized legislation",
            "Self-assessment is never permitted for any AI systems"
          ],
          correctAnswer: "For many high-risk AI systems not covered by specific harmonized legislation"
        },
        {
          question: "What is a 'notified body' in the context of the EU AI Act?",
          options: [
            "Any organization that has been notified about the AI system",
            "The European Commission's AI oversight committee",
            "An organization designated by EU member states to conduct conformity assessments",
            "A special police force that enforces AI regulations"
          ],
          correctAnswer: "An organization designated by EU member states to conduct conformity assessments"
        },
        {
          question: "What happens when a 'substantial modification' is made to a high-risk AI system?",
          options: [
            "No action is needed",
            "Only minor documentation updates are required",
            "A new conformity assessment must be conducted",
            "Only notification to users is required"
          ],
          correctAnswer: "A new conformity assessment must be conducted"
        },
        {
          question: "What must be included in the EU Declaration of Conformity?",
          options: [
            "Only the AI provider's name",
            "System information, compliance statement, assessment information, and authorized signature",
            "A list of customers who have purchased the system",
            "The source code of the AI system"
          ],
          correctAnswer: "System information, compliance statement, assessment information, and authorized signature"
        },
        {
          question: "What is required after a high-risk AI system has received the CE marking?",
          options: [
            "No further action is needed",
            "Continuous monitoring, maintenance of conformity, incident reporting, and periodic reviews",
            "Only annual renewal of the CE marking",
            "Only notification to authorities of system sales"
          ],
          correctAnswer: "Continuous monitoring, maintenance of conformity, incident reporting, and periodic reviews"
        },
        {
          question: "Which of the following is NOT a typical step in the third-party assessment process?",
          options: [
            "Documentation review",
            "Assessment activities and testing",
            "Assessment report creation",
            "Marketing campaign development"
          ],
          correctAnswer: "Marketing campaign development"
        },
        {
          question: "What is the minimum required height for the CE marking?",
          options: [
            "1 mm",
            "3 mm",
            "5 mm",
            "10 mm"
          ],
          correctAnswer: "5 mm"
        },
        {
          question: "How long must providers keep technical documentation and the EU Declaration of Conformity available for authorities?",
          options: [
            "1 year",
            "5 years",
            "10 years",
            "Forever"
          ],
          correctAnswer: "10 years"
        }
      ]
    }
  }
};