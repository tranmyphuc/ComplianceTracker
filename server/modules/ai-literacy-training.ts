/**
 * AI Literacy Training Module
 * 
 * Based on the SGH Group AI Literacy Training Program for EU AI Act Compliance
 * Created from the comprehensive EU AI Act Compliance Implementation Plan
 */

export const aiLiteracyTrainingModule = {
  id: "ai-literacy",
  title: "AI Literacy Training Program",
  description: "A comprehensive training program designed for SGH Group employees to understand AI basics and EU AI Act compliance requirements, including role-specific training for technical service teams, IT, management, and administration.",
  estimated_time: "60-90 minutes",
  topics: ["AI Fundamentals", "EU AI Act", "SGH AI Tools", "Risk Management", "Role-Based Requirements", "Documentation"],
  role_relevance: {
    decision_maker: "Essential for strategic planning, governance structures, and resource allocation for compliance activities",
    developer: "Critical for understanding technical compliance requirements, documentation, and risk management frameworks",
    operator: "Important for understanding AI limitations, human oversight, and quality control for AI-assisted decisions",
    user: "Helpful for understanding AI capabilities, limitations, and compliance responsibilities"
  },
  content: {
    default: {
      title: "AI Literacy and EU AI Act Compliance",
      sections: [
        {
          title: "Introduction to AI Literacy Training",
          content: `
# AI Literacy Training Program

![SGH Group EU AI Act Compliance](/assets/training/eu-ai-act-header.png)

Welcome to the SGH Group AI Literacy Training program. This comprehensive course is designed to equip all employees with the knowledge and skills necessary to understand, evaluate, and work with AI systems in compliance with the EU AI Act.

## Why This Training Matters

The EU AI Act represents the world's first comprehensive AI regulatory framework, with significant implications for SGH Group:

![EU AI Act Impact](/assets/training/eu-ai-act-impact.png)

- **Legal Compliance**: Mandatory requirements for all high-risk AI systems
- **Business Continuity**: Non-compliant systems may be prohibited from the EU market
- **Reputation Management**: Demonstrates SGH Group's commitment to responsible AI
- **Competitive Advantage**: Positions SGH Group as a leader in responsible AI innovation
- **Risk Mitigation**: Prevents potential fines of up to €35 million or 7% of global revenue

## The SGH Group Approach

At SGH Group, we're implementing a structured approach to EU AI Act compliance:

![SGH Compliance Approach](/assets/training/compliance-approach.png)

1. **AI Inventory**: Comprehensive documentation of all AI systems
2. **Risk Classification**: Identifying high-risk systems requiring focused attention
3. **Technical Compliance**: Implementing technical safeguards and controls
4. **Documentation**: Creating comprehensive documentation for all systems
5. **Training**: Ensuring all employees understand their responsibilities
6. **Monitoring**: Ongoing compliance verification through the Executive Intelligence Dashboard

## Learning Objectives

By the end of this training, you will:

![Learning Objectives](/assets/training/learning-objectives.png)

- Understand fundamental AI concepts and terminology
- Recognize different types of AI systems used at SGH Group
- Comprehend the EU AI Act's risk-based framework and requirements
- Identify your role-specific responsibilities for AI compliance
- Know how to use the Executive Intelligence Dashboard for compliance monitoring
- Apply compliance principles to your everyday work with AI systems

## Program Structure

This training program consists of the following eight comprehensive modules:

![AI Literacy Program Structure](/assets/training/ai-literacy-modules.png)

1. **AI Fundamentals**: Core concepts and SGH Group AI systems
2. **EU AI Act Overview**: Regulatory framework and SGH Group impact assessment
3. **Compliance Requirements**: Technical and organizational requirements
4. **Risk Assessment**: Structured methodology and documentation
5. **Role-Based Responsibilities**: Department-specific compliance actions
6. **Implementation Roadmap**: SGH Group's phased compliance approach
7. **Practical Application**: Real-world case studies and examples
8. **Assessment and Certification**: Knowledge verification and documentation

Your progress will be tracked through the Executive Intelligence Dashboard, with completion contributing to your department's compliance metrics.
          `
        },
        {
          title: "Module 1: AI Fundamentals",
          content: `
# Module 1: AI Fundamentals

![AI Fundamentals Header](/assets/training/ai-fundamentals-header.png)

## What is Artificial Intelligence?

Artificial Intelligence (AI) refers to systems designed to interact with the world through capabilities (such as data collection and processing, reasoning, prediction) that appear to resemble human intelligence.

![AI Definition](/assets/training/ai-definition.png)

At its core, AI is about creating computer systems that can perform tasks that typically require human intelligence:
- Learning from experience
- Recognizing patterns
- Making decisions based on data
- Adapting to new inputs
- Solving complex problems

### Key AI Concepts and Technologies:

![AI Key Concepts](/assets/training/ai-key-concepts.png)

- **Machine Learning (ML)**: Systems that improve their performance on a task through experience without being explicitly programmed
  - *Example at SGH Group*: Customer churn prediction models that improve over time

- **Neural Networks**: Computing systems inspired by the human brain's structure
  - *Example at SGH Group*: Image recognition in quality control processes

- **Natural Language Processing (NLP)**: AI's ability to understand and generate human language
  - *Example at SGH Group*: Customer service chatbots and automated email response systems

- **Computer Vision**: AI's ability to interpret and understand visual information
  - *Example at SGH Group*: Visual inspection systems in technical service operations

- **Predictive Analytics**: Using data, statistical algorithms, and machine learning to identify future outcomes
  - *Example at SGH Group*: Maintenance scheduling and resource forecasting

## SGH Group AI Ecosystem

SGH Group utilizes a diverse range of AI systems across our organization. Understanding which systems you interact with is critical for compliance:

![SGH Group AI Ecosystem](/assets/training/sgh-ai-ecosystem.png)

### General Office Productivity AI Tools:
- **ChatGPT**: Used across departments for content generation, customer communications, and administrative tasks
  - *Compliance Note*: Content requires human review before external sharing

- **Microsoft Copilot**: Integrated into Microsoft 365 applications for document creation, data analysis, and workflow automation
  - *Compliance Note*: Sensitive data handling policies must be followed

- **Adobe Creative Suite AI**: Tools used for design, marketing materials, and content creation
  - *Compliance Note*: Generated images must be labeled as AI-created

- **Odoo AI Capabilities**: Business intelligence, CRM automation, and predictive analytics for business operations
  - *Compliance Note*: Customer data usage subject to privacy policies

### Business-Specific AI Applications:
- **Technical Service Management AI**: Scheduling algorithms and resource allocation optimizers
  - *Compliance Note*: Final decisions require human approval

- **Customer Service AI**: Chatbots, sentiment analysis, and automated response systems
  - *Compliance Note*: Clear disclosure to customers about AI interaction

- **Business Intelligence Tools**: Data visualization, trend analysis, and forecasting systems
  - *Compliance Note*: Methodology transparency required for high-impact decisions

- **Project Management AI**: Predictive tools for project timelines and resource allocation
  - *Compliance Note*: AI suggestions must be documented as such

### Administrative AI Systems:
- **HR Recruitment Tools**: Resume screening and candidate matching systems
  - *Compliance Note*: High-risk usage requiring stringent oversight controls

- **Financial Analysis Tools**: Anomaly detection and automated reporting systems
  - *Compliance Note*: Human verification required for all financial decisions

- **Operational Optimization**: Process efficiency and workflow optimization systems
  - *Compliance Note*: Impact assessments required before implementation

## Understanding AI Capabilities and Limitations

When working with AI systems, all SGH employees must understand both capabilities and limitations:

![AI Capabilities and Limitations](/assets/training/ai-capabilities-limitations.png)

### Key Capabilities:

1. **Data Processing**: AI can analyze vast datasets that would be impractical for humans
   - *SGH Example*: Analyzing millions of customer interactions to identify service patterns

2. **Pattern Recognition**: AI excels at identifying patterns that humans might miss
   - *SGH Example*: Detecting subtle indicators of equipment failure before visible issues appear

3. **Automation**: AI can perform repetitive tasks consistently and without fatigue
   - *SGH Example*: Automated document processing and data extraction

4. **Prediction**: AI can forecast trends based on historical data
   - *SGH Example*: Resource demand forecasting for project planning

### Important Limitations:

1. **Context Understanding**: AI lacks deep contextual understanding and common sense
   - *SGH Impact*: Customer service AI may misinterpret complex requests

2. **Bias Reflection**: AI systems can amplify biases present in training data
   - *SGH Impact*: HR systems must be regularly audited for fairness

3. **Causal Reasoning**: AI correlates data but doesn't truly understand cause and effect
   - *SGH Impact*: Business intelligence insights require human interpretation

4. **Adaptability**: AI struggles with situations not represented in training data
   - *SGH Impact*: Service management AI may fail with unusual cases

5. **Ethical Decision-Making**: AI lacks moral reasoning and ethical judgment
   - *SGH Impact*: Human oversight required for all consequential decisions

## Responsible AI Usage at SGH Group

![Responsible AI Usage](/assets/training/responsible-ai-usage.png)

When working with AI systems at SGH Group, always follow these principles:

1. **Maintain Human Oversight**: Never delegate critical decisions entirely to AI
2. **Verify AI Outputs**: Cross-check important AI-generated information
3. **Document AI Usage**: Record when AI assisted with significant decisions
4. **Report Unusual Behavior**: Flag unexpected or concerning AI outputs
5. **Respect Transparency Rules**: Disclose AI use to customers when required
6. **Follow Data Protection Policies**: Only use approved data sources for AI training

Understanding these AI fundamentals is the foundation for effectively implementing EU AI Act compliance at SGH Group.
          `
        },
        {
          title: "Module 2: SGH AI Tools & EU AI Act Overview",
          content: `
# Module 2: SGH AI Tools & EU AI Act Overview

![EU AI Act Overview Header](/assets/training/eu-ai-act-header.png)

The EU AI Act is the world's first comprehensive legal framework for artificial intelligence, adopted in March 2024. It represents a significant milestone in the global regulation of AI technology, with far-reaching implications for all organizations developing or using AI systems in the European Union.

## Understanding the EU AI Act Framework

![EU AI Act Key Features](/assets/training/eu-ai-act-key-features.png)

The EU AI Act establishes a comprehensive regulatory framework with several key components:

- **Risk-Based Approach**: Regulatory requirements are proportionate to the level of risk posed by different AI systems
- **Prohibited AI Practices**: Explicitly bans certain AI applications deemed to pose unacceptable risks
- **High-Risk AI Systems**: Creates stringent requirements for systems with significant potential for harm
- **Transparency Obligations**: Mandates disclosure requirements for certain AI interactions
- **Innovation Support**: Includes regulatory sandboxes and measures to support innovation
- **Governance Framework**: Establishes national authorities and a European AI Board for oversight

## Risk Classification System: The Pyramid Approach

The EU AI Act uses a four-tier risk-based approach to regulate AI systems according to their potential impact:

![Risk Category Pyramid](/assets/training/risk-pyramid-detailed.png)

### 1. Unacceptable Risk: Banned AI Applications

AI systems posing unacceptable risks to people's safety, livelihoods, or rights are prohibited entirely:

- **Social Scoring Systems**: AI that evaluates or classifies individuals based on social behavior or personal characteristics
- **Manipulative Systems**: AI designed to exploit vulnerabilities of specific groups or individuals
- **Real-time Biometric Identification**: Remote identification in public spaces (with limited exceptions for law enforcement)
- **Predictive Policing**: AI that predicts crimes based solely on profiling or personality traits
- **Emotion Recognition**: In workplace or educational settings for decision-making

### 2. High-Risk: Strictly Regulated AI Systems

AI systems in critical areas or with significant potential for harm require compliance with extensive requirements:

**Category A: AI Systems in Products Covered by EU Safety Legislation (Annex II)**
- Medical devices
- Machinery
- Toys
- Elevators
- Personal protective equipment
- Aviation equipment

**Category B: Standalone High-Risk AI Systems (Annex III)**
- Critical infrastructure management
- Educational and vocational training
- Employment and worker management
- Access to essential services
- Law enforcement applications
- Migration and border control
- Administration of justice

### 3. Limited Risk: Transparency Requirements

AI systems that interact with humans, manipulate content, or use emotion recognition must meet transparency requirements:

- **Chatbots and Virtual Assistants**: Must disclose that users are interacting with AI
- **Emotion Recognition Systems**: Must inform users when emotions are being analyzed
- **AI-Generated Content**: Must be labeled as artificially generated or manipulated
- **Deep Fakes**: Must be clearly identified as synthetically generated content

### 4. Minimal Risk: Voluntary Measures

The vast majority of AI systems fall under this category, with light regulatory requirements:

- Voluntary codes of conduct encouraged
- Adherence to standards and best practices
- Basic responsibility principles apply
- Examples: Basic spam filters, AI-enabled video games, industrial robotics

## SGH Group AI System Classification

Using the EU AI Act risk framework, we've conducted an initial assessment of AI systems at SGH Group:

![SGH AI Assessment](/assets/training/sgh-ai-assessment.png)

### Potentially High-Risk Systems at SGH:

| AI System | Risk Classification | Justification | Required Actions |
|-----------|---------------------|---------------|------------------|
| HR Recruitment AI | High Risk | Falls under Annex III (employment) when used for hiring decisions | Complete full compliance assessment by Q3 2025 |
| Technical Service AI for Critical Clients | Potentially High Risk | May qualify as critical infrastructure if used for essential services | Detailed assessment of usage contexts by Q4 2025 |
| Financial Analysis AI for Credit Decisions | High Risk | Falls under Annex III if used for access to essential services | Begin compliance documentation in Q2 2025 |
| Customer Profiling Systems | Requires Assessment | Could be high-risk depending on usage for essential services | Conduct usage audit by Q3 2025 |

### Systems with Transparency Requirements:

| AI System | Requirements | Compliance Date |
|-----------|--------------|----------------|
| Customer Service Chatbot | Must disclose AI nature to users | February 2025 |
| Virtual Assistant Tools | Must clearly identify as AI | February 2025 |
| AI-Generated Marketing Materials | Must be labeled as AI-generated | February 2025 |
| Emotion Analysis in Customer Feedback | Must inform users of analysis | February 2025 |

### Likely Minimal-Risk Systems at SGH:

- General productivity tools (Microsoft Copilot, ChatGPT for drafting)
- Adobe Creative Suite AI features (when properly labeled)
- Basic business intelligence reporting tools
- Standard project management AI features
- Internal process optimization systems

## High-Risk AI Compliance Requirements

High-risk AI systems at SGH Group must meet comprehensive requirements:

![High-Risk Requirements](/assets/training/high-risk-requirements.png)

1. **Risk Management System** (Article 9)
   - Establish continuous risk identification and mitigation process
   - Document all risks and controls throughout the AI lifecycle
   - Implement testing to verify effectiveness of controls
   - Continuously monitor for new or changing risks

2. **Data and Data Governance** (Article 10)
   - Ensure high-quality training, validation, and testing data
   - Implement processes to identify and address biases
   - Document data characteristics, selection choices, and limitations
   - Establish data security and governance protocols

3. **Technical Documentation** (Article 11)
   - Create and maintain detailed system documentation
   - Document design specifications, development methodologies
   - Include performance metrics and validation approaches
   - Ensure traceability of development decisions

4. **Record-Keeping and Logging** (Article 12)
   - Implement automated logging capabilities
   - Ensure appropriate level of traceability
   - Maintain detailed operational records
   - Establish audit trail mechanisms

5. **Transparency for Users** (Article 13)
   - Provide clear information about capabilities and limitations
   - Ensure users understand when they are interacting with AI
   - Document intended purpose and appropriate use cases
   - Communicate potential risks and limitations

6. **Human Oversight** (Article 14)
   - Design systems with appropriate oversight mechanisms
   - Implement effective intervention capabilities
   - Train human operators on oversight responsibilities
   - Document oversight procedures and protocols

7. **Accuracy, Robustness & Cybersecurity** (Article 15)
   - Achieve and maintain appropriate performance levels
   - Implement resilience against errors and inconsistencies
   - Establish cybersecurity controls and protections
   - Regularly test and validate system performance

## SGH Group Implementation Roadmap

The Executive Intelligence Dashboard tracks our compliance progress against these key deadlines:

![Implementation Timeline](/assets/training/implementation-timeline-detailed.png)

### February 2, 2025: Initial Compliance Date
- All transparency requirements take effect
- Prohibited AI practices regulations apply
- All SGH employees must complete this training

### August 2, 2025: GPAI Requirements Begin
- Requirements for general-purpose AI models start
- Foundation model inventory must be completed
- Third-party AI provider compliance verification begins

### August 2, 2026: Full High-Risk Compliance
- Complete compliance required for high-risk AI systems
- All documentation must be finalized
- Registration in EU database must be completed
- Conformity assessment must be completed

### August 2, 2027: Final Deadlines
- Final deadline for high-risk AI embedded in products
- Complete integration into business processes
- Full compliance monitoring operational

The Executive Intelligence Dashboard provides real-time tracking of our compliance status with visual indicators for each deadline and system. Compliance progress metrics are visible to all department heads and the AI Governance Committee.
          `
        },
        {
          title: "Module 3: Compliance Requirements for High-Risk AI",
          content: `
# Module 3: Compliance Requirements for High-Risk AI

High-risk AI systems are subject to specific requirements before they can be placed on the market.

## Technical Requirements

High-risk AI systems must meet these technical requirements:

![Technical Requirements Overview](/assets/technical-requirements-overview.svg)

### Risk Management System (Article 9)
- Identify and analyze known and foreseeable risks
- Adopt risk mitigation measures
- Perform testing to ensure effectiveness
- Maintain risk management documentation

### Data Governance (Article 10)
- Use high-quality training, validation, and testing data
- Examine data for biases
- Identify data gaps or shortcomings
- Establish data governance measures

### Technical Documentation (Article 11)
- Maintain comprehensive documentation of the system
- Enable assessment of compliance with requirements
- Provide authorities with information to evaluate the system

### Record-Keeping (Article 12)
- Implement logging capabilities to enable monitoring
- Ensure appropriate level of traceability
- Maintain logs of system operation

### Transparency (Article 13)
- Design systems to be transparent to users
- Provide clear information about capabilities and limitations
- Ensure users understand when they are interacting with AI

### Human Oversight (Article 14)
- Design systems for effective human oversight
- Allow for human intervention or oversight
- Implement human-in-the-loop, human-on-the-loop, or human-over-the-loop oversight

![Human Oversight Framework](/assets/human-oversight-framework/oversight-levels.svg)

### Accuracy, Robustness & Cybersecurity (Article 15)
- Achieve appropriate levels of accuracy
- Be resilient to errors and inconsistencies
- Withstand attempts at data manipulation
- Maintain appropriate cybersecurity measures
          `
        },
        {
          title: "Module 4: Risk Assessment Process",
          content: `
# Module 4: Risk Assessment Process

## Risk Assessment Methodology

A structured risk assessment for AI systems should follow these steps:

1. **System Identification and Classification**
   - Determine if your AI system falls under high-risk categories
   - Assess the purpose, functionality, and application area

2. **Risk Identification**
   - Identify potential risks to fundamental rights and safety
   - Consider risks related to:
     - Privacy and data protection
     - Non-discrimination
     - Child rights and vulnerable groups
     - Environmental impacts
     - Democratic processes
     - Physical safety

3. **Risk Analysis**
   - Assess the likelihood and severity of identified risks
   - Consider both intended and reasonably foreseeable misuse
   - Evaluate risks throughout the AI lifecycle

4. **Risk Evaluation**
   - Compare risk levels against defined criteria
   - Prioritize risks based on impact and probability
   - Document risk evaluation findings

5. **Risk Treatment**
   - Develop mitigation measures for identified risks
   - Implement technical and organizational safeguards
   - Establish monitoring processes

## Documentation Requirements

Risk assessment documentation must include:

- Description of the AI system and its intended purpose
- Identification of relevant stakeholders
- Detailed risk assessment methodology
- Risk register with identified risks and mitigation measures
- Monitoring and review procedures
- Roles and responsibilities for risk management

## Practical Example: Risk Assessment for a Recruitment AI System

A recruitment AI system used to screen job applicants would be considered high-risk under the EU AI Act because it relates to employment and worker management.

**Key Risk Areas:**
- Bias and discrimination in candidate selection
- Privacy concerns with candidate data
- Lack of transparency in decision-making
- Over-reliance on automated assessments

**Mitigation Measures:**
- Regular bias testing and monitoring
- Human oversight of all AI decisions
- Clear documentation of AI functionality
- Regular system audits and updates
- Transparent communication with candidates
          `
        },
        {
          title: "Module 5: Role-Based Responsibilities at SGH Group",
          content: `
# Module 5: Role-Based Responsibilities at SGH Group

Different roles within SGH Group have specific responsibilities for ensuring EU AI Act compliance. This module outlines role-specific training requirements and responsibilities.

## Technical Service Teams

**Key Responsibilities:**
- Understanding AI limitations in technical applications
- Implementing human oversight for AI-assisted decisions
- Ensuring quality control for AI-generated recommendations
- Maintaining technical documentation
- Reporting AI performance issues

**Compliance Actions:**
- Review technical specifications of AI systems used in service delivery
- Implement oversight protocols for AI-assisted technical decisions
- Document instances where AI recommendations required correction
- Validate AI outputs against established quality standards
- Participate in regular compliance reviews

## IT and Development Teams

**Key Responsibilities:**
- Implementing technical compliance requirements
- Creating and maintaining comprehensive documentation
- Establishing risk management frameworks
- Developing testing and validation methodologies
- Configuring logging and monitoring capabilities

**Compliance Actions:**
- Design systems with compliance-by-default features
- Document system architecture, data flows, and algorithms
- Implement robust data governance procedures
- Develop testing protocols for bias detection
- Configure human oversight mechanisms

## Management and Leadership

**Key Responsibilities:**
- Understanding strategic implications of the EU AI Act
- Establishing governance structures and oversight
- Managing risk and liability considerations
- Allocating resources for compliance activities
- Using Executive Intelligence Dashboard for compliance oversight

**Compliance Actions:**
- Approve AI governance policies and procedures
- Allocate appropriate resources for compliance implementation
- Review high-risk AI system assessments
- Monitor organizational compliance status via dashboard
- Foster a compliance-focused organizational culture

## HR and Administration

**Key Responsibilities:**
- Ensuring compliant use of AI in recruitment and talent management
- Implementing appropriate employee monitoring practices
- Maintaining documentation for AI-assisted HR decisions
- Managing training program completion
- Tracking compliance certification

**Compliance Actions:**
- Implement human oversight of AI-based HR decisions
- Ensure transparency in AI-assisted performance evaluations
- Document justifications for AI-influenced personnel decisions
- Track training completion via Executive Intelligence Dashboard
- Coordinate role-specific advanced training

## Common Responsibilities for All Staff

- Recognize AI systems they interact with
- Understand capabilities and limitations of AI tools
- Know when human judgment should override AI recommendations
- Report potential compliance issues or concerns
- Complete required AI literacy training
- Stay informed about AI policy updates

## Collaboration Framework

Effective compliance requires cross-functional collaboration:

1. **AI Governance Committee**
   - Cross-functional representation
   - Regular review of compliance status
   - Decision-making on high-risk systems
   - Resource allocation recommendations

2. **Department Champions**
   - Local point of contact for AI questions
   - First-level support for compliance questions
   - Training coordination for department members
   - Feedback collection on AI system performance
          `
        },
        {
          title: "Module 6: SGH Group Implementation Roadmap",
          content: `
# Module 6: SGH Group Implementation Roadmap

SGH Group has established a comprehensive roadmap for implementing EU AI Act compliance across the organization. This phased approach ensures we meet all regulatory deadlines while maintaining operational continuity.

## Phase 1: Foundation (April-July 2025)

### Governance Establishment
- Appoint AI Governance Committee with cross-functional representation
- Define roles and responsibilities for compliance oversight
- Establish reporting mechanisms and escalation procedures
- Create AI policy framework and usage guidelines
- Configure Executive Intelligence Dashboard for compliance monitoring

### Complete System Inventory
- Document all AI systems using standardized assessment template
- Gather technical documentation from vendors
- Interview system owners to understand implementation details
- Create centralized AI system registry within the Executive Intelligence Dashboard
- Configure dashboard metrics to track compliance progress

### Initial Risk Assessments
- Apply EU AI Act classification framework to all identified systems
- Prioritize potential high-risk systems for detailed assessment
- Document initial classification justifications
- Review results with legal counsel
- Configure dashboard risk indicators for operational visibility

### Baseline Training Development
- Design core AI literacy curriculum for all staff
- Develop role-specific training modules
- Create training tracking and documentation system within platform
- Pilot training with representative user groups
- Establish training metrics in dashboard

## Phase 2: High-Risk System Compliance (August 2025-February 2026)

### Technical Documentation Enhancement
- Develop comprehensive technical documentation for high-risk systems
- Implement logging capabilities for system outputs and decisions
- Create risk management documentation per Article 9 requirements
- Establish testing and validation procedures
- Store all documentation in centralized dashboard repository

### Vendor Management
- Assess vendor compliance capabilities and plans
- Negotiate updated contracts with compliance obligations
- Document shared responsibilities
- Establish ongoing compliance monitoring
- Track vendor compliance through platform

### Human Oversight Implementation
- Design and document human oversight mechanisms
- Implement override capabilities for high-risk systems
- Create standard operating procedures for human review
- Train staff on oversight responsibilities
- Configure oversight monitoring in dashboard

### Data Governance Implementation
- Establish data quality standards for AI training data
- Implement bias detection and mitigation processes
- Create data documentation procedures
- Develop testing protocols for data representativeness
- Monitor data governance compliance through platform

## Phase 3: Organization-Wide Implementation (March-December 2026)

### Full Training Rollout
- Deploy core AI literacy training to all staff
- Conduct role-specific advanced training
- Implement training verification and documentation
- Establish ongoing training requirements
- Track training completion through Executive Intelligence Dashboard

### Conformity Assessments
- Conduct internal conformity assessments for high-risk systems
- Address any identified compliance gaps
- Prepare for external assessments where required
- Document assessment results
- Monitor assessment status through dashboard

### Transparency Implementation
- Deploy system explanations and user instructions
- Implement AI disclosure requirements for customer-facing systems
- Create transparency documentation
- Train staff on communicating about AI systems
- Track transparency documentation through platform

## Phase 4: Ongoing Compliance (January 2027 onward)

### Monitoring System
- Implement post-market monitoring for all high-risk systems
- Create incident detection mechanisms
- Develop response protocols for compliance issues
- Establish periodic compliance reviews
- Utilize Executive Intelligence Dashboard for real-time compliance monitoring

### Continuous Improvement
- Regular reassessment of AI systems against evolving regulations
- Update training based on implementation lessons
- Refine governance processes
- Incorporate industry best practices
- Leverage "Strategic Opportunities" dashboard feature to identify efficiency improvements

## Critical Implementation Deadlines

### February 2, 2025
- Complete AI literacy training for staff working with AI systems
- Ensure compliance with prohibited AI practices
- Configure Executive Intelligence Dashboard to show training completion rates

### August 2, 2025
- Implement requirements for general-purpose AI models
- Establish governance structures for ongoing compliance
- Ensure dashboard indicators reflect compliance impact on business performance

### August 2, 2026
- Complete full compliance for high-risk AI systems
- Finalize all technical documentation
- Register systems in EU database
- Complete training for all staff
- EU AI Act Compliance metric should reach maximum in dashboard

### August 2, 2027
- Ensure compliance for any remaining high-risk AI systems embedded in products
- Complete full integration of compliance into operational processes
- Maintain dashboard metrics with focus on operational efficiency
          `
        },
        {
          title: "Module 7: Practical Application",
          content: `
# Module 7: Practical Application

Let's apply what we've learned through practical examples and case studies.

## Case Study: Human Resources AI System

**Scenario:**
SGH Group is using an AI system that analyzes employee performance data, predicts future performance, and recommends promotion candidates.

**Classification:**
This is a high-risk AI system under the EU AI Act as it relates to employment and worker management.

**Compliance Requirements:**
1. Risk assessment and management
2. High-quality data governance
3. Technical documentation
4. Human oversight
5. Accuracy and robustness measures
6. Transparency for affected employees

**Implementation Steps:**
1. Document system purpose, functionality, and data sources
2. Assess for potential bias in training data and algorithms
3. Implement human review of all AI recommendations
4. Establish clear criteria for promotion decisions
5. Create a feedback mechanism for employees
6. Regularly audit system for bias and effectiveness

## Case Study: Customer Behavior Prediction

**Scenario:**
A marketing AI system that predicts customer behavior and personalizes content.

**Classification:**
Limited risk AI system with transparency requirements.

**Compliance Requirements:**
1. Disclosure to users that they are interacting with an AI system
2. Clear information about the nature and limitations of the system
3. Basic documentation of system functionality

**Implementation Steps:**
1. Add clear notices about AI-driven personalization
2. Allow users to opt-out of personalization
3. Document data sources and prediction mechanisms
4. Regularly review for potential discriminatory impacts

## Compliance Workflow

The SGH Group AI Act Compliance Platform provides tools to help you manage the compliance process:

1. **AI System Registration**
   - Document all AI systems in the organization
   - Classify systems according to risk level
   - Maintain system inventory

2. **Risk Assessment**
   - Conduct structured risk assessments
   - Document findings and mitigation measures
   - Schedule regular reassessments

3. **Documentation Generation**
   - Create required technical documentation
   - Generate compliance reports
   - Maintain version control

4. **Compliance Monitoring**
   - Track compliance status
   - Monitor regulatory changes
   - Implement updates as needed
          `
        },
        {
          title: "Module 8: Assessment and Certification",
          content: `
# Module 8: Assessment and Certification

## Knowledge Assessment

To complete this training, you'll need to demonstrate your understanding of the key concepts through a brief assessment.

The assessment will cover:
- Basic AI concepts
- EU AI Act risk classification
- Requirements for high-risk AI systems
- Role-specific responsibilities
- Compliance processes

You'll need to achieve a score of 80% or higher to receive your certification.

## Certification Process

Upon successful completion of the assessment:
1. You'll receive a personalized certificate
2. Your training record will be updated in the system
3. You'll gain access to additional compliance resources

## Continuing Education

AI regulation is evolving, and ongoing education is important:
- Quarterly update sessions on regulatory changes
- Annual refresher training
- Access to the Knowledge Center for the latest guidance
- Role-specific advanced training modules

## Support Resources

For ongoing support with EU AI Act compliance:
- AI Compliance Team: compliance@sghasia.com
- AI Act Knowledge Center
- Compliance helpdesk: ext. 5555
- Monthly compliance office hours

Thank you for completing the AI Literacy Training Program!
          `
        }
      ],
      assessments: [
        {
          question: "Which of the following AI systems would be classified as high-risk under the EU AI Act?",
          options: [
            "A customer service chatbot",
            "A recruitment AI system used to screen job applicants",
            "A music recommendation system",
            "A simple rule-based automation tool"
          ],
          correctAnswer: "A recruitment AI system used to screen job applicants"
        },
        {
          question: "What is the primary approach to AI regulation in the EU AI Act?",
          options: [
            "One-size-fits-all regulation for all AI systems",
            "Regulation based on company size",
            "Risk-based approach with different requirements based on risk level",
            "Self-regulation through industry codes"
          ],
          correctAnswer: "Risk-based approach with different requirements based on risk level"
        },
        {
          question: "Which of the following is NOT a technical requirement for high-risk AI systems?",
          options: [
            "Risk management system",
            "Data governance",
            "Emotional intelligence capabilities",
            "Human oversight"
          ],
          correctAnswer: "Emotional intelligence capabilities"
        },
        {
          question: "What does 'human-in-the-loop' oversight refer to?",
          options: [
            "AI systems that can function without human involvement",
            "Humans approving each AI decision before implementation",
            "Periodic review of AI system performance by humans",
            "AI systems that learn from human behavior"
          ],
          correctAnswer: "Humans approving each AI decision before implementation"
        },
        {
          question: "Which of the following is a responsibility of decision makers in AI compliance?",
          options: [
            "Coding compliant AI algorithms",
            "Daily monitoring of AI system outputs",
            "Setting organizational AI governance policies",
            "Conducting technical validation tests"
          ],
          correctAnswer: "Setting organizational AI governance policies"
        },
        {
          question: "What is the first step in implementing EU AI Act compliance?",
          options: [
            "Purchasing compliance software",
            "Hiring a dedicated compliance team",
            "Identifying and classifying AI systems in use",
            "Applying for EU certification"
          ],
          correctAnswer: "Identifying and classifying AI systems in use"
        },
        {
          question: "Which EU AI Act article requires high-risk AI systems to have appropriate data governance measures?",
          options: [
            "Article 9",
            "Article 10",
            "Article 13",
            "Article 15"
          ],
          correctAnswer: "Article 10"
        },
        {
          question: "What is required in the technical documentation for high-risk AI systems?",
          options: [
            "Financial costs of development",
            "Personal data of the development team",
            "System architecture and components",
            "Marketing materials for the system"
          ],
          correctAnswer: "System architecture and components"
        },
        {
          question: "Which of these AI practices is prohibited under the EU AI Act?",
          options: [
            "Customer behavior prediction",
            "Social scoring systems used by public authorities",
            "Medical diagnosis support",
            "Financial risk assessment"
          ],
          correctAnswer: "Social scoring systems used by public authorities"
        },
        {
          question: "What is the purpose of the risk assessment process for AI systems?",
          options: [
            "To determine the financial value of the AI system",
            "To identify and mitigate potential risks to fundamental rights and safety",
            "To evaluate the technical sophistication of the AI system",
            "To compare different vendor solutions"
          ],
          correctAnswer: "To identify and mitigate potential risks to fundamental rights and safety"
        }
      ]
    }
  }
};