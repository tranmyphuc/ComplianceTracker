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

Welcome to the SGH Group AI Literacy Training program. This course is designed to equip all employees with the knowledge and skills necessary to understand, evaluate, and work with AI systems in compliance with the EU AI Act.

## Objectives

By the end of this training, you will:
- Understand fundamental AI concepts and terminology
- Recognize different types of AI systems and their applications
- Comprehend the EU AI Act's risk-based framework and requirements
- Identify high-risk AI systems and necessary compliance measures
- Know your role-specific responsibilities for EU AI Act compliance

![AI Literacy Program Structure](/assets/ai-literacy-structure.svg)
          `
        },
        {
          title: "Module 1: AI Fundamentals",
          content: `
# Module 1: AI Fundamentals

## What is Artificial Intelligence?

Artificial Intelligence (AI) refers to systems designed to interact with the world through capabilities (such as data collection and processing, reasoning, prediction) that appear to resemble human intelligence.

### Key AI Concepts:

- **Machine Learning (ML)**: Systems that improve their performance on a task through experience without being explicitly programmed
- **Neural Networks**: Computing systems inspired by the human brain's structure
- **Natural Language Processing (NLP)**: AI's ability to understand and generate human language
- **Computer Vision**: AI's ability to interpret and understand visual information
- **Predictive Analytics**: Using data, statistical algorithms, and machine learning to identify the likelihood of future outcomes

## AI Systems at SGH Group

As outlined in our inventory, SGH Group uses various AI systems across the organization:

### General Office Productivity AI Tools:
- **ChatGPT**: Used across departments for content generation, customer communications, and administrative tasks
- **Microsoft Copilot**: Integrated into Microsoft 365 applications for document creation, data analysis, and workflow automation
- **Adobe Creative Suite AI**: Tools used for design, marketing materials, and content creation
- **Odoo AI Capabilities**: Business intelligence, CRM automation, and predictive analytics for business operations

### Business-Specific AI Applications:
- **Technical Service Management AI**: Algorithms used for service scheduling, resource allocation, or predictive maintenance
- **Customer Service AI**: Chatbots, automated response systems, or customer interaction analysis tools
- **Business Intelligence Tools**: Data analysis and reporting systems with AI/ML components
- **Project Management AI**: Predictive tools for project timelines, resource allocation, or risk assessment

### Administrative AI Systems:
- **HR Recruitment Tools**: AI used in CV screening or candidate assessment
- **Financial Analysis Tools**: Forecasting, anomaly detection, or automated reporting systems
- **Operational Optimization**: AI systems used to optimize business processes or workflows

## Understanding AI Capabilities and Limitations

When working with AI systems, it's important to understand:

1. **Capabilities**:
   - Processing vast amounts of data quickly
   - Identifying patterns humans might miss
   - Automating repetitive tasks
   - Providing predictions based on historical data

2. **Limitations**:
   - Limited understanding of context or nuance
   - Potential to reflect or amplify biases in training data
   - Lack of causal reasoning
   - Difficulty with novel situations not represented in training data
   - Challenges with ethical decision-making

3. **Recognizing AI-Generated Content**:
   - Understand markers of AI-generated text, images, or recommendations
   - Develop critical evaluation skills for AI outputs
   - Know when human review is necessary

Understanding these fundamentals will help you better comprehend how AI systems are regulated under the EU AI Act and your responsibilities when working with these technologies.
          `
        },
        {
          title: "Module 2: SGH AI Tools & EU AI Act Overview",
          content: `
# Module 2: SGH AI Tools & EU AI Act Overview

The EU AI Act is the world's first comprehensive legal framework for artificial intelligence. It establishes a risk-based approach to regulating AI systems, with different requirements based on an AI system's risk level.

## Understanding the EU AI Act Framework

- **Risk-Based Approach**: Different requirements based on risk level
- **Prohibited AI Practices**: Certain AI applications are banned
- **High-Risk AI Systems**: Subject to strict requirements
- **Transparency Obligations**: For certain AI systems
- **Innovation Support**: Measures to support AI innovation
- **Governance Framework**: National authorities and European AI Board

## Risk Classification System

The EU AI Act classifies AI systems into different risk categories:

![Risk Category Pyramid](/assets/risk-category-pyramid.svg)

1. **Unacceptable Risk**: Prohibited AI practices 
   - Social scoring systems
   - Manipulative or exploitative systems targeting vulnerabilities
   - Real-time remote biometric identification in public spaces (with limited exceptions)

2. **High-Risk**: AI systems in critical areas with potential significant harm
   - Products covered by EU harmonization laws listed in Annex II
   - Specific use cases in Annex III (employment, education, law enforcement, etc.)

3. **Limited Risk**: AI systems with specific transparency obligations
   - Chatbots
   - Emotion recognition systems
   - AI-generated or manipulated content (deepfakes)

4. **Minimal Risk**: All other AI systems
   - Light-touch regulatory approach
   - Voluntary codes of conduct

## SGH Group High-Risk AI Assessment

Using the EU AI Act criteria, we've assessed our AI systems at SGH Group:

### Potentially High-Risk Systems at SGH:

| AI System | Risk Classification | Justification |
|-----------|---------------------|---------------|
| HR Recruitment AI | Potentially High Risk | Falls under Annex III if used for employee evaluation, hiring decisions, or promotions |
| Customer Service AI | Likely Low Risk | Generally not high-risk unless determining access to essential services |
| Technical Service AI | Requires Assessment | Could be high-risk if used for critical infrastructure management |
| Financial Analysis AI | Requires Assessment | Could be high-risk if used for credit scoring or access to essential services |

### Likely Low-Risk Systems at SGH:

- General productivity tools (Copilot, ChatGPT for content drafting)
- Adobe Creative Suite AI features 
- Basic business intelligence reporting
- Standard project management AI features

## High-Risk AI Requirements

High-risk AI systems are subject to these key requirements:

1. **Risk Management System**: Ongoing risk assessment and mitigation
2. **Data and Data Governance**: Quality control for all data used
3. **Technical Documentation**: Detailed documentation of system development
4. **Record-Keeping**: Automated logging of system operations
5. **Transparency**: Clear information for users
6. **Human Oversight**: Effective human monitoring and intervention
7. **Accuracy, Robustness, Cybersecurity**: Performance and security measures

## Implementation Timeline

Key deadlines for EU AI Act compliance:

- **February 2, 2025**: Prohibited AI practices provisions come into effect
- **August 2, 2025**: Requirements for general-purpose AI models begin
- **August 2, 2026**: Complete compliance required for high-risk AI systems
- **August 2, 2027**: Final deadline for high-risk AI embedded in products

The Executive Intelligence Dashboard will track our compliance progress against these deadlines, with visual indicators showing compliance status.
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