/**
 * AI Literacy Training Module
 * 
 * Based on the SGH Group AI Literacy Training Program for EU AI Act Compliance
 */

export const aiLiteracyTrainingModule = {
  id: "ai-literacy",
  title: "AI Literacy Training Program",
  description: "A comprehensive training program designed for SGH Group employees to understand AI basics and EU AI Act compliance requirements.",
  estimated_time: "60-90 minutes",
  topics: ["AI Basics", "EU AI Act", "Risk Management", "High-Risk AI", "Documentation"],
  role_relevance: {
    decision_maker: "Essential for strategic planning and high-level compliance decisions",
    developer: "Critical for understanding technical compliance requirements",
    operator: "Important for day-to-day AI system management",
    user: "Helpful for understanding AI capabilities and limitations"
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
          title: "Module 1: AI Foundations",
          content: `
# Module 1: AI Foundations

## What is Artificial Intelligence?

Artificial Intelligence (AI) refers to systems designed to interact with the world through capabilities (such as data collection and processing, reasoning, prediction) that appear to resemble human intelligence.

### Key AI Concepts:

- **Machine Learning (ML)**: Systems that improve their performance on a task through experience without being explicitly programmed
- **Neural Networks**: Computing systems inspired by the human brain's structure
- **Natural Language Processing (NLP)**: AI's ability to understand and generate human language
- **Computer Vision**: AI's ability to interpret and understand visual information
- **Predictive Analytics**: Using data, statistical algorithms, and machine learning to identify the likelihood of future outcomes

## Types of AI Systems

AI systems can be categorized in various ways:

1. **By Capability**:
   - **Narrow AI** (or Weak AI): Designed for specific tasks (e.g., voice assistants, recommendation systems)
   - **General AI** (or Strong AI): Hypothetical AI with human-like intelligence across multiple domains

2. **By Learning Method**:
   - **Supervised Learning**: Trained on labeled data
   - **Unsupervised Learning**: Identifies patterns in unlabeled data
   - **Reinforcement Learning**: Learns through trial and error and rewards

3. **By Function**:
   - **Analytical AI**: Analysis and prediction (e.g., fraud detection)
   - **Interactive AI**: User interaction (e.g., chatbots)
   - **Text/Visual/Audio AI**: Processing specific data types
   - **Autonomous Systems**: Operating with minimal human supervision

Understanding these foundations will help you better comprehend how AI systems are regulated under the EU AI Act.
          `
        },
        {
          title: "Module 2: EU AI Act Overview",
          content: `
# Module 2: EU AI Act Overview

The EU AI Act is the world's first comprehensive legal framework for artificial intelligence. It establishes a risk-based approach to regulating AI systems.

## Key Features of the EU AI Act

- **Risk-Based Framework**: Different requirements based on risk level
- **Prohibited AI Practices**: Certain AI applications are banned
- **High-Risk AI Systems**: Subject to strict requirements
- **Transparency Obligations**: For certain AI systems
- **Innovation Support**: Measures to support AI innovation
- **Governance Framework**: National authorities and European AI Board

## Risk Classification System

The EU AI Act classifies AI systems into different risk categories:

![Risk Category Pyramid](/assets/risk-category-pyramid.svg)

1. **Unacceptable Risk**: Prohibited AI practices that pose a clear threat to people's safety, livelihoods, or rights
   - Social scoring systems
   - Manipulative or exploitative systems targeting vulnerabilities
   - Real-time remote biometric identification in public spaces (with limited exceptions)

2. **High-Risk**: AI systems used in critical areas with potential significant harm
   - See the detailed list of high-risk categories in the next section

3. **Limited Risk**: AI systems with specific transparency obligations
   - Chatbots
   - Emotion recognition systems
   - AI-generated or manipulated content (deepfakes)

4. **Minimal Risk**: All other AI systems
   - Light-touch regulatory approach
   - Voluntary codes of conduct

## High-Risk AI Categories

The EU AI Act specifically identifies these areas where AI is considered high-risk:

![High-Risk AI Categories](/assets/high-risk-ai-categories.svg)

## Timeline for Implementation

The EU AI Act follows this implementation timeline:

![Implementation Timeline](/assets/implementation-timeline.svg)
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
          title: "Module 5: Role-Specific Responsibilities",
          content: `
# Module 5: Role-Specific Responsibilities

Different roles within the organization have specific responsibilities for ensuring AI compliance.

## Decision Makers

**Responsibilities:**
- Setting organizational AI governance policies
- Allocating resources for compliance activities
- Approving high-risk AI system deployments
- Establishing oversight mechanisms
- Promoting a compliance culture

**Key Actions:**
- Stay informed about regulatory requirements
- Include compliance considerations in strategic planning
- Ensure adequate staffing for compliance activities
- Review and approve risk assessments
- Monitor organizational compliance status

## Technical Teams

**Responsibilities:**
- Designing and developing compliant AI systems
- Implementing technical requirements (data quality, accuracy, etc.)
- Creating and maintaining technical documentation
- Conducting testing and validation
- Implementing monitoring capabilities

**Key Actions:**
- Apply compliance by design principles
- Document system architecture and data flows
- Implement robust data governance
- Design effective human oversight mechanisms
- Conduct regular technical testing

## System Operators

**Responsibilities:**
- Day-to-day operation of AI systems
- Monitoring system performance
- Identifying and reporting issues
- Implementing human oversight procedures
- Maintaining operational records

**Key Actions:**
- Follow established operating procedures
- Document system behavior and issues
- Exercise appropriate human oversight
- Participate in regular training
- Escalate compliance concerns

## Compliance Officers

**Responsibilities:**
- Overseeing compliance with the EU AI Act
- Conducting or reviewing risk assessments
- Maintaining compliance documentation
- Liaising with regulatory authorities
- Coordinating internal compliance activities

**Key Actions:**
- Stay current on regulatory developments
- Conduct regular compliance checks
- Maintain compliance documentation
- Coordinate cross-functional compliance efforts
- Develop and deliver training programs
          `
        },
        {
          title: "Module 6: Implementation Process",
          content: `
# Module 6: Implementation Process

Implementing EU AI Act compliance is an ongoing process that requires a structured approach.

## Implementation Framework

1. **Inventory and Classification**
   - Identify all AI systems in use or development
   - Classify systems according to risk levels
   - Prioritize high-risk systems for compliance efforts

2. **Gap Analysis**
   - Assess current systems against requirements
   - Identify compliance gaps
   - Document findings and recommendations

3. **Compliance Roadmap**
   - Develop detailed implementation plans
   - Set milestones and deadlines
   - Assign resources and responsibilities

4. **Compliance Implementation**
   - Update technical systems
   - Develop required documentation
   - Implement governance procedures
   - Train relevant personnel

5. **Monitoring and Continuous Improvement**
   - Establish monitoring mechanisms
   - Conduct regular reviews
   - Update systems as needed
   - Stay current with regulatory changes

## Documentation Framework

The EU AI Act requires extensive documentation for high-risk AI systems:

1. **General Information**
   - System description and purpose
   - Provider identification information
   - Version and release information

2. **Technical Documentation**
   - System architecture and components
   - Data specifications
   - Development methodologies
   - Performance metrics and benchmarks

3. **Risk Management Documentation**
   - Risk assessment reports
   - Mitigation measures
   - Ongoing monitoring procedures

4. **Compliance Documentation**
   - Conformity assessment results
   - EU Declaration of Conformity (when applicable)
   - Post-market monitoring plans

## Maintaining Compliance

Compliance is not a one-time effort but requires:

- Regular system reviews and updates
- Ongoing staff training
- Monitoring of regulatory changes
- Documentation updates
- Regular testing and validation
- Incident reporting and management
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