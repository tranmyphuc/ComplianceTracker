import { Request, Response } from 'express';
import { storage } from './storage';
import { trainingModules, trainingProgress, users } from '../shared/schema';
import { db, sql } from './db';
import { eq, and } from 'drizzle-orm';
import { aiLiteracyTrainingModule } from './modules/ai-literacy-training';
import { marked } from 'marked';

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimated_time: string;
  topics: string[];
  role_relevance: {
    decision_maker: string;
    developer: string;
    operator: string;
    user: string;
  };
}

export interface ModuleContent {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
  assessments: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface TrainingProgress {
  moduleId: string;
  userId: string;
  completion: number;
  assessmentScore?: number;
  updatedAt: Date;
}

// Training modules data
const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "ai-literacy",
    title: "AI Literacy Training Program",
    description: "A comprehensive training program designed for SGH Group employees to understand AI basics and EU AI Act compliance requirements.",
    estimated_time: "60-90 minutes",
    topics: ["AI Basics", "EU AI Act", "Risk Management", "High-Risk AI", "Documentation"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "High",
      user: "Medium"
    }
  },
  {
    id: "1",
    title: "EU AI Act Introduction",
    description: "Introduction to the EU AI Act, its scope, and key provisions",
    estimated_time: "20-30 minutes",
    topics: ["Overview", "Scope", "Key Definitions", "Risk-Based Approach"],
    role_relevance: {
      decision_maker: "High",
      developer: "Medium",
      operator: "Medium",
      user: "Low"
    }
  },
  {
    id: "2",
    title: "Risk Classification System",
    description: "Understanding the risk categories and how to classify AI systems",
    estimated_time: "25-35 minutes",
    topics: ["Risk Management", "AI Categories", "Assessment Methods"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "Medium",
      user: "Low"
    }
  },
  {
    id: "3",
    title: "Technical Requirements",
    description: "Technical requirements for high-risk AI systems",
    estimated_time: "40-50 minutes",
    topics: ["Technical Compliance", "Data Quality", "Documentation"],
    role_relevance: {
      decision_maker: "Medium",
      developer: "High",
      operator: "High",
      user: "Low"
    }
  },
  {
    id: "4",
    title: "AI Ethics and Responsible Use",
    description: "Essential ethical considerations and responsible AI practices for all employees",
    estimated_time: "30-40 minutes",
    topics: ["Ethical Frameworks", "Bias Detection", "Data Privacy", "Responsible Practices"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "High",
      user: "High"
    }
  },
  {
    id: "5",
    title: "AI for Technical Service Teams",
    description: "Applying AI tools effectively in technical service delivery with appropriate oversight",
    estimated_time: "35-45 minutes",
    topics: ["AI Service Applications", "Human-AI Collaboration", "Quality Control", "Client Communication"],
    role_relevance: {
      decision_maker: "Medium",
      developer: "High",
      operator: "High",
      user: "Low"
    }
  }
];

// Module content with real EU AI Act information and German translations
const MODULE_CONTENTS: Record<string, Record<string, ModuleContent>> = {
  "ai-literacy": {
    "default": aiLiteracyTrainingModule.content.default
  },
  "1": {
    "default": {
      title: "EU AI Act Introduction",
      sections: [
        {
          title: "What is the EU AI Act?",
          content: `<div class="mb-4">
            <p class="mb-2">The EU AI Act, officially known as Regulation (EU) 2024/1689, is the world's first comprehensive legal framework specifically regulating artificial intelligence. It was formally adopted on May 13, 2024, and aims to ensure AI systems in the EU market are safe, respect fundamental rights, and uphold EU values.</p>
            <p class="mb-2">The Act applies to providers placing AI systems on the EU market regardless of their establishment location, as well as to users of AI systems located within the EU.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Die EU-KI-Verordnung, offiziell als Verordnung (EU) 2024/1689 bekannt, ist der weltweit erste umfassende Rechtsrahmen speziell zur Regulierung künstlicher Intelligenz. Sie wurde am 13. Mai 2024 formell verabschiedet und zielt darauf ab, sicherzustellen, dass KI-Systeme auf dem EU-Markt sicher sind, die Grundrechte respektieren und die EU-Werte wahren.</p>
          </div>`
        },
        {
          title: "Key Objectives",
          content: `<div class="mb-4">
            <p class="mb-2">The EU AI Act has several key objectives:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Ensuring AI systems placed on the EU market are safe and respect existing law and EU values</li>
              <li>Ensuring legal certainty to facilitate investment and innovation in AI</li>
              <li>Enhancing governance and effective enforcement of existing laws applicable to AI systems</li>
              <li>Facilitating the development of a single market for lawful, safe and trustworthy AI applications</li>
            </ul>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Die EU-KI-Verordnung hat mehrere Hauptziele: Sicherstellung, dass KI-Systeme auf dem EU-Markt sicher sind und bestehende Gesetze und EU-Werte respektieren; Gewährleistung von Rechtssicherheit zur Erleichterung von Investitionen und Innovationen im KI-Bereich; Verbesserung der Governance und wirksame Durchsetzung bestehender Gesetze für KI-Systeme; Erleichterung der Entwicklung eines Binnenmarkts für rechtmäßige, sichere und vertrauenswürdige KI-Anwendungen.</p>
          </div>`
        },
        {
          title: "Risk-Based Approach",
          content: `<div class="mb-4">
            <p class="mb-2">The EU AI Act takes a risk-based approach, categorizing AI systems into four distinct risk levels:</p>
            <ol class="list-decimal pl-6 mb-2">
              <li><strong>Unacceptable Risk</strong>: AI systems that pose a clear threat to people's safety, livelihoods, or rights are prohibited. Examples include social scoring by governments and manipulation of human behavior.</li>
              <li><strong>High Risk</strong>: AI systems that could harm people's health, safety, fundamental rights, or the environment. These systems must comply with strict requirements before they can be placed on the market.</li>
              <li><strong>Limited Risk</strong>: Systems with specific transparency obligations, such as chatbots and emotion recognition systems, where users must be informed they are interacting with AI.</li>
              <li><strong>Minimal Risk</strong>: The vast majority of AI systems fall into this category and are subject to light regulation.</li>
            </ol>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Die EU-KI-Verordnung verfolgt einen risikobasierten Ansatz und kategorisiert KI-Systeme in vier verschiedene Risikostufen: Unannehmbares Risiko (verbotene Systeme), Hohes Risiko (strenge Anforderungen vor Markteintritt), Begrenztes Risiko (Transparenzpflichten) und Minimales Risiko (geringe Regulierung für die meisten KI-Systeme).</p>
          </div>`
        },
        {
          title: "Implementation Timeline",
          content: `<div class="mb-4">
            <p class="mb-2">The EU AI Act will be implemented gradually:</p>
            <ul class="list-disc pl-6 mb-2">
              <li><strong>Immediate after publication</strong>: Prohibited AI practices (Article 5)</li>
              <li><strong>6 months after entry into force</strong>: Governance provisions (Articles 56-59, 69, 84-85)</li>
              <li><strong>12 months after entry into force</strong>: GPAI rules (General Purpose AI, Articles 55 and parts of 28)</li>
              <li><strong>24 months after entry into force</strong>: All remaining provisions</li>
            </ul>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Die EU-KI-Verordnung wird schrittweise umgesetzt: Sofort nach Veröffentlichung die verbotenen KI-Praktiken, 6 Monate nach Inkrafttreten die Governance-Bestimmungen, 12 Monate nach Inkrafttreten die GPAI-Regeln und 24 Monate nach Inkrafttreten alle übrigen Bestimmungen.</p>
          </div>`
        }
      ],
      assessments: [
        {
          question: "How many risk categories does the EU AI Act establish?",
          options: ["Two", "Three", "Four", "Five"],
          correctAnswer: "Four"
        },
        {
          question: "Which of the following AI systems would be classified as prohibited under the EU AI Act?",
          options: [
            "A recommendation system for online shopping",
            "A facial recognition system used for law enforcement",
            "Social scoring systems used by governments to evaluate citizens",
            "An AI system for medical diagnosis in hospitals"
          ],
          correctAnswer: "Social scoring systems used by governments to evaluate citizens"
        },
        {
          question: "When will most provisions of the EU AI Act come into full effect?",
          options: [
            "Immediately after publication",
            "6 months after entry into force",
            "12 months after entry into force",
            "24 months after entry into force"
          ],
          correctAnswer: "24 months after entry into force"
        }
      ]
    }
  },
  "2": {
    "default": {
      title: "Risk Classification System",
      sections: [
        {
          title: "Understanding AI Risk Categories",
          content: `<div class="mb-4">
            <p class="mb-2">The EU AI Act classifies AI systems into four distinct risk categories based on their potential impact on fundamental rights, health, safety, and the environment. Understanding these categories is essential for determining compliance requirements for any AI system.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Die EU-KI-Verordnung klassifiziert KI-Systeme in vier verschiedene Risikokategorien basierend auf ihren potenziellen Auswirkungen auf Grundrechte, Gesundheit, Sicherheit und Umwelt. Das Verständnis dieser Kategorien ist wesentlich für die Bestimmung der Compliance-Anforderungen für jedes KI-System.</p>
          </div>`
        },
        {
          title: "Unacceptable Risk - Prohibited AI Practices",
          content: `<div class="mb-4">
            <p class="mb-2">Article 5 of the EU AI Act prohibits AI systems that pose an unacceptable level of risk. These include:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Subliminal manipulation techniques designed to distort behavior in harmful ways</li>
              <li>Systems exploiting vulnerabilities of specific groups (age, disability, social/economic situation) to materially distort behavior</li>
              <li>Social scoring systems by public authorities that lead to unfair treatment</li>
              <li>Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)</li>
              <li>Emotion recognition in workplaces and educational institutions</li>
              <li>AI systems categorizing people based on biometric data to deduce their race, political opinions, religious beliefs, etc.</li>
              <li>Predictive policing systems based solely on profiling or assessment of personality traits</li>
            </ul>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 5 der EU-KI-Verordnung verbietet KI-Systeme, die ein unannehmbares Risikoniveau darstellen. Dazu gehören: Manipulationstechniken, Ausnutzung von Schwachstellen bestimmter Gruppen, Social-Scoring-Systeme durch Behörden, biometrische Fernidentifikation in Echtzeit, Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen, KI-Systeme zur Kategorisierung von Personen auf Basis biometrischer Daten und prädiktive Polizeiarbeit basierend auf Persönlichkeitsmerkmalen.</p>
          </div>`
        },
        {
          title: "High-Risk AI Systems",
          content: `<div class="mb-4">
            <p class="mb-2">Article 6 and Annex III identify high-risk AI systems, which must meet strict requirements before market placement. These include:</p>
            <ol class="list-decimal pl-6 mb-2">
              <li><strong>AI systems as safety components of products</strong> under EU harmonization legislation listed in Annex II</li>
              <li><strong>Standalone AI systems</strong> in areas listed in Annex III:
                <ul class="list-disc pl-6 mt-2">
                  <li>Biometric identification and categorization</li>
                  <li>Critical infrastructure management</li>
                  <li>Education and vocational training</li>
                  <li>Employment, worker management, and access to self-employment</li>
                  <li>Access to essential services (credit scoring, social benefits, emergency services)</li>
                  <li>Law enforcement</li>
                  <li>Migration, asylum, and border control</li>
                  <li>Administration of justice and democratic processes</li>
                </ul>
              </li>
            </ol>
            <p class="mb-2">High-risk AI systems must comply with requirements including:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Risk management systems</li>
              <li>Data governance practices</li>
              <li>Technical documentation</li>
              <li>Record-keeping and logging</li>
              <li>Transparency for users</li>
              <li>Human oversight</li>
              <li>Accuracy, robustness, and cybersecurity</li>
            </ul>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 6 und Anhang III identifizieren Hochrisiko-KI-Systeme, die strenge Anforderungen erfüllen müssen. Dazu gehören KI-Systeme als Sicherheitskomponenten von Produkten und eigenständige KI-Systeme in Bereichen wie biometrische Identifizierung, kritische Infrastruktur, Bildung, Beschäftigung, Zugang zu wesentlichen Diensten, Strafverfolgung, Migration und Justizverwaltung. Diese Systeme müssen Anforderungen wie Risikomanagement, Daten-Governance, technische Dokumentation, Aufzeichnungen, Transparenz, menschliche Aufsicht sowie Genauigkeit und Cybersicherheit erfüllen.</p>
          </div>`
        },
        {
          title: "Limited Risk AI Systems",
          content: `<div class="mb-4">
            <p class="mb-2">Limited risk AI systems have specific transparency obligations under Article 52. These include:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>AI systems that interact with humans must inform users they are interacting with AI</li>
              <li>Emotion recognition systems must inform subjects they are being subjected to such systems</li>
              <li>AI-generated or manipulated image, audio, or video content ("deepfakes") must be disclosed as artificially generated</li>
            </ul>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">KI-Systeme mit begrenztem Risiko haben spezifische Transparenzpflichten gemäß Artikel 52. Dazu gehören: KI-Systeme, die mit Menschen interagieren, müssen Benutzer informieren; Emotionserkennungssysteme müssen betroffene Personen informieren; und KI-generierte oder manipulierte Inhalte müssen als künstlich erzeugt gekennzeichnet werden.</p>
          </div>`
        },
        {
          title: "Minimal Risk AI Systems",
          content: `<div class="mb-4">
            <p class="mb-2">The vast majority of AI systems fall into the minimal risk category. Examples include:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>AI-enabled video games</li>
              <li>Spam filters</li>
              <li>Inventory management systems</li>
              <li>AI-powered productivity tools</li>
            </ul>
            <p class="mb-2">The EU AI Act encourages providers of minimal risk AI systems to voluntarily apply requirements for high-risk systems and adhere to codes of conduct.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Die große Mehrheit der KI-Systeme fällt in die Kategorie mit minimalem Risiko, wie KI-gestützte Videospiele, Spam-Filter, Bestandsverwaltungssysteme und KI-gestützte Produktivitätstools. Die EU-KI-Verordnung ermutigt Anbieter von KI-Systemen mit minimalem Risiko, freiwillig Anforderungen für Hochrisiko-Systeme anzuwenden und sich an Verhaltenskodizes zu halten.</p>
          </div>`
        },
        {
          title: "Risk Assessment Methodology",
          content: `<div class="mb-4">
            <p class="mb-2">To determine the risk level of an AI system, you should follow this assessment process:</p>
            <ol class="list-decimal pl-6 mb-2">
              <li>Check if the AI system falls under prohibited practices (Article 5)</li>
              <li>Determine if the AI system is a safety component of a product covered in Annex II</li>
              <li>Check if the AI system's purpose is listed in Annex III</li>
              <li>Assess if the system has transparency obligations (limited risk)</li>
              <li>If none of the above apply, classify as minimal risk</li>
            </ol>
            <p class="mb-2">Documentation of this assessment process is recommended for compliance purposes, even for minimal risk systems.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Um die Risikostufe eines KI-Systems zu bestimmen, sollten Sie diesen Bewertungsprozess befolgen: Prüfen Sie, ob das KI-System unter verbotene Praktiken (Artikel 5) fällt; bestimmen Sie, ob das KI-System eine Sicherheitskomponente eines in Anhang II aufgeführten Produkts ist; prüfen Sie, ob der Zweck des KI-Systems in Anhang III aufgeführt ist; bewerten Sie, ob das System Transparenzpflichten hat; wenn nichts davon zutrifft, klassifizieren Sie es als minimales Risiko.</p>
          </div>`
        }
      ],
      assessments: [
        {
          question: "Which of the following AI systems would most likely be classified as high-risk under the EU AI Act?",
          options: [
            "A video game recommendation system",
            "An AI system used for recruitment and candidate selection",
            "A smart home control system",
            "A music creation AI application"
          ],
          correctAnswer: "An AI system used for recruitment and candidate selection"
        },
        {
          question: "Which of the following is a prohibited AI practice under Article 5?",
          options: [
            "Using AI to analyze consumer behavior for marketing purposes",
            "Using AI in medical devices for diagnostic assistance",
            "Using AI for social scoring by public authorities",
            "Using AI for climate change prediction models"
          ],
          correctAnswer: "Using AI for social scoring by public authorities"
        },
        {
          question: "What transparency requirement applies to AI-generated or manipulated content (deepfakes)?",
          options: [
            "They must be reviewed by humans before publishing",
            "They must be disclosed as artificially generated or manipulated",
            "They must be registered in a central EU database",
            "They must be approved by a regulatory authority"
          ],
          correctAnswer: "They must be disclosed as artificially generated or manipulated"
        },
        {
          question: "Which category of AI systems has the most comprehensive compliance requirements?",
          options: [
            "Unacceptable risk",
            "High-risk",
            "Limited risk",
            "Minimal risk"
          ],
          correctAnswer: "High-risk"
        }
      ]
    }
  },
  "3": {
    "default": {
      title: "Technical Requirements",
      sections: [
        {
          title: "Overview of Technical Requirements",
          content: `<div class="mb-4">
            <p class="mb-2">Articles 8-15 of the EU AI Act define the technical requirements that must be met by high-risk AI systems before they can be placed on the market. These requirements ensure safety, transparency, and accountability.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 8-15 der EU-KI-Verordnung definieren die technischen Anforderungen, die von Hochrisiko-KI-Systemen erfüllt werden müssen, bevor sie auf den Markt gebracht werden können. Diese Anforderungen gewährleisten Sicherheit, Transparenz und Verantwortlichkeit.</p>
          </div>`
        },
        {
          title: "Risk Management Systems",
          content: `<div class="mb-4">
            <p class="mb-2">Article 9 requires high-risk AI systems to have a robust risk management system in place throughout the entire lifecycle of the AI system. This includes:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Systematic identification and analysis of known and foreseeable risks</li>
              <li>Estimation and evaluation of risks that may emerge during use</li>
              <li>Adoption of appropriate risk management measures</li>
              <li>Testing to ensure the AI system performs consistently throughout its lifecycle</li>
            </ul>
            <p class="mb-2">The risk management process must be iterative and continuously updated throughout the system's lifecycle.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 9 verlangt, dass Hochrisiko-KI-Systeme über ein robustes Risikomanagementsystem verfügen müssen, das den gesamten Lebenszyklus des KI-Systems umfasst. Dies beinhaltet: systematische Identifizierung und Analyse bekannter und vorhersehbarer Risiken, Abschätzung und Bewertung von Risiken, die während der Nutzung auftreten können, Ergreifung geeigneter Risikomanagementmaßnahmen, und Tests, um sicherzustellen, dass das KI-System während seines gesamten Lebenszyklus konsistent funktioniert.</p>
          </div>`
        },
        {
          title: "Data Governance",
          content: `<div class="mb-4">
            <p class="mb-2">Article 10 mandates rigorous data governance practices for training, validation, and testing datasets. Key requirements include:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Relevant data quality criteria for datasets (accuracy, completeness, representativeness)</li>
              <li>Examination for possible biases that could lead to discrimination</li>
              <li>Identification of data gaps or shortcomings</li>
              <li>Appropriate data governance and management practices</li>
            </ul>
            <p class="mb-2">Special categories of personal data can only be used with adequate safeguards and when demonstrably necessary to ensure bias monitoring, detection, and correction.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 10 schreibt strenge Daten-Governance-Praktiken für Trainings-, Validierungs- und Testdatensätze vor. Zu den wichtigsten Anforderungen gehören: relevante Datenqualitätskriterien für Datensätze (Genauigkeit, Vollständigkeit, Repräsentativität), Untersuchung auf mögliche Verzerrungen, die zu Diskriminierung führen könnten, Identifizierung von Datenlücken oder Mängeln und angemessene Daten-Governance- und Managementpraktiken.</p>
          </div>`
        },
        {
          title: "Technical Documentation",
          content: `<div class="mb-4">
            <p class="mb-2">Article 11 requires providers to create and maintain comprehensive technical documentation before placing a high-risk AI system on the market. This documentation must demonstrate compliance with requirements and provide authorities with necessary information to evaluate compliance.</p>
            <p class="mb-2">The documentation must include:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>General description of the AI system</li>
              <li>Detailed description of system elements and development process</li>
              <li>Information about monitoring, functioning, and control</li>
              <li>Detailed description of the risk management system</li>
              <li>Description of validation and testing procedures</li>
            </ul>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 11 verlangt von den Anbietern, vor dem Inverkehrbringen eines Hochrisiko-KI-Systems eine umfassende technische Dokumentation zu erstellen und zu pflegen. Diese Dokumentation muss die Einhaltung der Anforderungen nachweisen und den Behörden die notwendigen Informationen zur Bewertung der Konformität liefern. Die Dokumentation muss enthalten: allgemeine Beschreibung des KI-Systems, detaillierte Beschreibung der Systemelemente und des Entwicklungsprozesses, Informationen über Überwachung, Funktionsweise und Kontrolle, detaillierte Beschreibung des Risikomanagementsystems und Beschreibung der Validierungs- und Testverfahren.</p>
          </div>`
        },
        {
          title: "Record-Keeping and Logging",
          content: `<div class="mb-4">
            <p class="mb-2">Article 12 requires high-risk AI systems to maintain automatic logs of events while operating. These logging capabilities must ensure:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Traceability of system functioning throughout its lifecycle</li>
              <li>Appropriate level of traceability given the intended purpose</li>
              <li>Recording of each use or instance of the system (date, time of use)</li>
              <li>Recording of input data that influenced system outputs</li>
            </ul>
            <p class="mb-2">Logs must be kept for a minimum period based on the AI system's expected lifetime and legal obligations, with a default minimum of six months.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 12 verlangt, dass Hochrisiko-KI-Systeme während des Betriebs automatische Protokolle der Ereignisse führen. Diese Protokollierungsfunktionen müssen sicherstellen: Rückverfolgbarkeit der Systemfunktion während des gesamten Lebenszyklus, angemessenes Maß an Rückverfolgbarkeit angesichts des beabsichtigten Zwecks, Aufzeichnung jeder Verwendung oder Instanz des Systems (Datum, Nutzungszeit) und Aufzeichnung von Eingabedaten, die die Systemausgaben beeinflussten.</p>
          </div>`
        },
        {
          title: "Transparency and User Information",
          content: `<div class="mb-4">
            <p class="mb-2">Article 13 mandates that high-risk AI systems be designed and developed to ensure appropriate transparency, enabling users to interpret the system's output and use it properly. The following must be provided to users:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Clear and concise instructions for use</li>
              <li>Information about the AI system's capabilities and limitations</li>
              <li>Information about intended purpose and conditions of use</li>
              <li>Specification of human oversight measures</li>
              <li>Expected lifetime and maintenance measures</li>
            </ul>
            <p class="mb-2">Instructions must be provided before the AI system is put into service and be digital or physically accessible.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 13 schreibt vor, dass Hochrisiko-KI-Systeme so konzipiert und entwickelt werden müssen, dass eine angemessene Transparenz gewährleistet ist, die es den Benutzern ermöglicht, die Ausgabe des Systems zu interpretieren und es ordnungsgemäß zu verwenden. Folgendes muss den Benutzern zur Verfügung gestellt werden: klare und präzise Gebrauchsanweisungen, Informationen über die Fähigkeiten und Einschränkungen des KI-Systems, Informationen über den beabsichtigten Zweck und die Nutzungsbedingungen, Angabe der Maßnahmen für die menschliche Aufsicht und erwartete Lebensdauer und Wartungsmaßnahmen.</p>
          </div>`
        },
        {
          title: "Human Oversight",
          content: `<div class="mb-4">
            <p class="mb-2">Article 14 requires high-risk AI systems to be designed and developed to enable effective human oversight during use. Human oversight measures must enable individuals to:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>Fully understand the AI system's capabilities, limitations, and potential risks</li>
              <li>Monitor the AI system's operation to detect anomalies, dysfunctions, and unexpected performance</li>
              <li>Intervene or interrupt the system through a "stop" button or similar procedure</li>
              <li>Interpret the system's output and make decisions based on it</li>
            </ul>
            <p class="mb-2">Human oversight must be ensured either through measures built into the AI system or through obligations placed on the user.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 14 verlangt, dass Hochrisiko-KI-Systeme so konzipiert und entwickelt werden, dass während der Nutzung eine wirksame menschliche Aufsicht möglich ist. Maßnahmen zur menschlichen Aufsicht müssen es Personen ermöglichen: die Fähigkeiten, Einschränkungen und potenziellen Risiken des KI-Systems vollständig zu verstehen, den Betrieb des KI-Systems zu überwachen, um Anomalien, Funktionsstörungen und unerwartete Leistungen zu erkennen, in das System einzugreifen oder es zu unterbrechen, und die Ausgabe des Systems zu interpretieren und darauf basierend Entscheidungen zu treffen.</p>
          </div>`
        },
        {
          title: "Accuracy, Robustness, and Cybersecurity",
          content: `<div class="mb-4">
            <p class="mb-2">Article 15 requires high-risk AI systems to be designed and developed to achieve appropriate levels of accuracy, robustness, and cybersecurity. This includes:</p>
            <ul class="list-disc pl-6 mb-2">
              <li>System performs consistently throughout its lifecycle according to its intended purpose</li>
              <li>Appropriate level of accuracy as claimed in the technical documentation</li>
              <li>Resilience against errors, inconsistencies, or attempts at manipulation</li>
              <li>Technical redundancy measures to address system failures</li>
              <li>Protection against unauthorized access and modifications</li>
            </ul>
            <p class="mb-2">The technical solutions must take into account the system's intended purpose and the level of risk posed.</p>
            <p class="text-sm text-muted-foreground bg-blue-50 p-2 border-l-2 border-blue-300 my-2">Artikel 15 verlangt, dass Hochrisiko-KI-Systeme so konzipiert und entwickelt werden, dass sie ein angemessenes Maß an Genauigkeit, Robustheit und Cybersicherheit erreichen. Dies umfasst: Das System funktioniert während seines gesamten Lebenszyklus gemäß seinem beabsichtigten Zweck konstant, angemessenes Maß an Genauigkeit, wie in der technischen Dokumentation angegeben, Widerstandsfähigkeit gegen Fehler, Inkonsistenzen oder Manipulationsversuche, technische Redundanzmaßnahmen zur Behebung von Systemausfällen und Schutz vor unbefugtem Zugriff und Änderungen.</p>
          </div>`
        }
      ],
      assessments: [
        {
          question: "According to Article 10 of the EU AI Act, what should be examined in training datasets for high-risk AI systems?",
          options: [
            "Only the size of the dataset",
            "Only the number of data categories",
            "Possible biases that could lead to discrimination",
            "Only the geographic origin of the data"
          ],
          correctAnswer: "Possible biases that could lead to discrimination"
        },
        {
          question: "What is required by Article 12 regarding record-keeping for high-risk AI systems?",
          options: [
            "Manual logs maintained by users only",
            "Automatic logs of system events throughout operation",
            "Annual audits by external auditors only",
            "Physical copies of all data processed"
          ],
          correctAnswer: "Automatic logs of system events throughout operation"
        },
        {
          question: "What must human oversight measures enable according to Article 14?",
          options: [
            "Complete replacement of the AI system with human decisions",
            "Training of new AI models without technical expertise",
            "The ability to monitor, detect anomalies, intervene, and interpret the AI system",
            "Remote control of all AI systems from a central authority"
          ],
          correctAnswer: "The ability to monitor, detect anomalies, intervene, and interpret the AI system"
        },
        {
          question: "What is the minimum default period for keeping logs according to Article 12?",
          options: [
            "One month",
            "Three months",
            "Six months",
            "Two years"
          ],
          correctAnswer: "Six months"
        }
      ]
    }
  }
};

/**
 * Get all training modules
 */
export async function getTrainingModules(req: Request, res: Response): Promise<void> {
  try {
    let moduleData: any[] = [];

    try {
      // Try to get from database first
      const modules = await db.select().from(trainingModules).orderBy(trainingModules.order);

      // If found in database, use that data
      if (modules && modules.length > 0) {
        moduleData = modules.map(module => ({
          id: module.module_id,
          title: module.title,
          description: module.description,
          estimated_time: module.estimated_time,
          topics: module.topics as string[],
          role_relevance: module.role_relevance as {
            decision_maker: string;
            developer: string;
            operator: string;
            user: string;
          }
        }));
      } else {
        // Otherwise use sample data
        moduleData = TRAINING_MODULES;
      }
    } catch (dbError) {
      // If database query fails, fall back to sample data
      console.error('Database error fetching training modules:', dbError);
      moduleData = TRAINING_MODULES;
    }

    res.json(moduleData);
  } catch (error) {
    console.error('Error fetching training modules:', error);
    res.status(500).json({ error: 'Failed to fetch training modules' });
  }
}

/**
 * Get specific module content
 */
export async function getModuleContent(req: Request, res: Response): Promise<Response> {
  try {
    const { moduleId } = req.params;
    const userRole = req.query.role as string || 'user';
    
    // Check if this is the AI literacy module
    if (moduleId === 'ai-literacy' || moduleId === 'ai_literacy') {
      console.log("Serving AI Literacy module content");
      try {
        const roleContent = aiLiteracyTrainingModule.content.default;
        const moduleInfo = {
          title: aiLiteracyTrainingModule.title,
          description: aiLiteracyTrainingModule.description,
          estimated_time: aiLiteracyTrainingModule.estimated_time
        };

        // Format the module sections for HTML display
        const formattedSections = roleContent.sections.map(section => {
          return {
            title: section.title,
            content: `<div class="prose prose-blue max-w-none mb-4">${marked.parse(section.content)}</div>`
          };
        });

        // Format full module content for the enhanced UI
        const enhancedContent = {
          title: moduleInfo.title,
          description: moduleInfo.description,
          estimated_time: moduleInfo.estimated_time,
          content: {
            slides: formattedSections,
            document: roleContent.sections.map(s => `# ${s.title}\n\n${s.content}`).join('\n\n'),
            exercises: buildExercises(roleContent, moduleId),
            assessment: {
              questions: roleContent.assessments || []
            }
          },
          sections: formattedSections,
          assessment: { questions: roleContent.assessments || [] }
        };

        return res.json(enhancedContent);
      } catch (error) {
        console.error("Error preparing AI Literacy module:", error);
        return res.status(500).json({ error: "Failed to prepare AI Literacy module content" });
      }
    }

    // For other modules, try to get from database first
    try {
      // Check for development mode and show mock data if needed
      const isDevelopmentMode = process.env.NODE_ENV === 'development';
      
      // In development mode with admin user, provide demo content
      if (isDevelopmentMode && req.query.demo === 'true') {
        console.log(`Development mode: serving demo content for module ${moduleId}`);
        // Return demo content for presentation
        const demoContent = MODULE_CONTENTS[moduleId] || MODULE_CONTENTS["1"];
        if (demoContent) {
          const roleContent = demoContent[userRole] || demoContent.default;
          const enhancedContent = {
            title: TRAINING_MODULES.find(m => m.id === moduleId)?.title || "Demo Module",
            description: TRAINING_MODULES.find(m => m.id === moduleId)?.description || "Demo content for client presentation",
            estimated_time: TRAINING_MODULES.find(m => m.id === moduleId)?.estimated_time || "30 minutes",
            content: {
              slides: buildSlides({ slides: [
                { title: "Demo Slide 1", content: "This is demo content for the client presentation." },
                { title: "Demo Slide 2", content: "Showing how the training module interface works." }
              ]}),
              document: buildDocument({ content: "# Demo Content\n\nThis is placeholder content for the demo." }, "Demo Module"),
              exercises: [],
              assessment: { questions: [] }
            }
          };
          return res.json(enhancedContent);
        }
      }

      // Use the postgres client with template literals for parameterized queries
      // Handle potential undefined values to prevent SQL errors
      if (!moduleId) {
        console.error("Module ID is undefined or null");
        return res.status(404).json({ error: "Invalid module ID" });
      }
      
      const result = await sql`
        SELECT * FROM training_modules 
        WHERE module_id = ${moduleId}
        LIMIT 1
      `;
      
      if (result && result.length > 0) {
        const moduleData = result[0];
        let content;
        
        try {
          content = typeof moduleData.content === 'string' 
            ? JSON.parse(moduleData.content) 
            : moduleData.content;
        } catch (e) {
          console.error("Error parsing module content:", e);
          content = { default: { slides: [], document: "", exercises: [], quiz: [] } };
        }

        // Get role-specific content if available
        const roleContent = (content && content[userRole]) || (content && content.default) || { slides: [], document: "", exercises: [], quiz: [] };

        // Format full module content for the enhanced UI
        const enhancedContent = {
          title: moduleData.title || "",
          description: moduleData.description || "",
          estimated_time: moduleData.estimated_time || "30 minutes",
          content: {
            slides: buildSlides(roleContent),
            document: buildDocument(roleContent, moduleData.title || "Training Module"),
            exercises: buildExercises(roleContent, moduleId),
            assessment: {
              questions: roleContent.quiz || []
            }
          }
        };

        return res.json(enhancedContent);
      }
    } catch (dbError) {
      console.error("Database error fetching module:", dbError);
      // Continue to the fallback for predefined modules
    }

    // Fall back to sample data if not in database
    if (MODULE_CONTENTS[moduleId]) {
      console.log(`Serving module content for ${moduleId} from MODULE_CONTENTS`);
      const roleContent = MODULE_CONTENTS[moduleId][userRole] || MODULE_CONTENTS[moduleId].default;

      // Get module info
      const moduleInfo = TRAINING_MODULES.find(m => m.id === moduleId) || {
        title: roleContent.title,
        description: "",
        estimated_time: "30-45 minutes"
      };

      // Format full module content for the enhanced UI
      const enhancedContent = {
        title: moduleInfo.title,
        description: moduleInfo.description,
        estimated_time: moduleInfo.estimated_time,
        content: {
          slides: buildSlides(roleContent),
          document: buildDocument(roleContent, moduleInfo.title),
          exercises: buildExercises(roleContent, moduleId),
          assessment: {
            questions: roleContent.assessments || []
          }
        }
      };

      return res.json(enhancedContent);
    }

    return res.status(404).json({ error: 'Module not found' });
  } catch (error) {
    console.error('Error fetching module content:', error);
    return res.status(500).json({ error: 'Failed to fetch module content' });
  }
}

// Helper function to build slides from content
function buildSlides(content: any) {
  // If content already has slides, use them
  if (content.slides) {
    return content.slides;
  }
  
  // Create slides from sections
  const slides: any[] = [];
  
  if (content.sections && Array.isArray(content.sections)) {
    content.sections.forEach((section: any) => {
      slides.push({
        title: section.title,
        content: section.content
      });
    });
    return slides;
  }
  
  // Fallback to older content format
  if (content.content) {
    // Split content by headers (# or ##)
    const sections = content.content.split(/(?=# |## )/);

    sections.forEach((section: string) => {
      // Extract title from the first line
      const titleMatch = section.match(/^(# |## )(.*)/);
      let title = titleMatch ? titleMatch[2] : "Introduction";
      let sectionContent = section.replace(/^(# |## )(.*)/, ''); // Remove title

      slides.push({
        title: title,
        content: `<div class="markdown-content">${sectionContent}</div>`
      });
    });
  }

  // Add intro slide if no slides were created
  if (slides.length === 0) {
    slides.push({
      title: "Introduction",
      content: "<p>No content available for this module.</p>"
    });
  }

  return slides;
}

// Helper function to build document HTML
function buildDocument(content: any, title: string): string {
  if (content.document) {
    return content.document;
  }

  if (content.content) {
    return `<div class="markdown-content">
      <h1>${title}</h1>
      ${content.content}
    </div>`;
  }

  return "<p>No documentation available for this module.</p>";
}

// Helper function to build exercises
function buildExercises(content: any, moduleId: string): any[] {
  if (content.exercises) {
    return content.exercises;
  }

  // Generate default exercises based on module ID
  const defaultExercises = [
    {
      title: "Apply Knowledge",
      description: "<p>This exercise helps you apply the concepts learned in this module to practical scenarios.</p>",
      tasks: [
        "Review the key concepts presented in the module",
        "Apply these concepts to your organization's context",
        "Document the relevance and potential implementation challenges"
      ]
    },
    {
      title: "Self-Assessment",
      description: "<p>Test your understanding by answering these questions without referring to the module content.</p>",
      tasks: [
        "Explain the main requirements covered in this module in your own words",
        "Identify at least three ways these requirements impact your organization",
        "Outline an implementation approach for your specific context"
      ]
    }
  ];

  // Add module-specific exercises
  if (moduleId === "1") {
    defaultExercises.push({
      title: "EU AI Act Scope Analysis",
      description: "<p>Analyze how the EU AI Act applies to specific AI systems.</p>",
      tasks: [
        "List all AI systems currently in use in your organization",
        "Determine which ones fall under the scope of the EU AI Act",
        "Document your reasoning for each system"
      ]
    });
  } else if (moduleId === "2") {
    defaultExercises.push({
      title: "Risk Classification Exercise",
      description: "<p>Practice classifying AI systems according to the EU AI Act risk framework.</p>",
      tasks: [
        "Select three AI systems from different domains",
        "Apply the risk classification methodology to each system",
        "Document your classification process and results"
      ]
    });
  } else if (moduleId === "3") {
    defaultExercises.push({
      title: "Technical Requirements Checklist",
      description: "<p>Create a compliance checklist for technical requirements.</p>",
      tasks: [
        "Develop a checklist covering all technical requirements for high-risk AI systems",
        "Apply this checklist to an existing or planned AI system",
        "Identify compliance gaps and potential remediation actions"
      ]
    });
  }

  return defaultExercises;
}

/**
 * Track user's training progress
 */
export async function trackTrainingProgress(req: Request, res: Response): Promise<void> {
  try {
    const { userId, moduleId, completion } = req.body;

    if (!userId || !moduleId || typeof completion !== 'number') {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // First, verify the user exists in the database to avoid foreign key constraint error
    const user = await db
      .select()
      .from(users)
      .where(eq(users.uid, userId))
      .limit(1);

    if (!user || user.length === 0) {
      res.status(400).json({ error: 'User does not exist in the database', details: 'Please log in with a registered user account' });
      return;
    }

    // Also verify the module exists
    const module = await db
      .select()
      .from(trainingModules)
      .where(eq(trainingModules.module_id, moduleId))
      .limit(1);

    if (!module || module.length === 0) {
      res.status(400).json({ error: 'Training module does not exist', details: moduleId });
      return;
    }

    // Update progress in database
    try {
      const existingProgress = await db
        .select()
        .from(trainingProgress)
        .where(and(
          eq(trainingProgress.userId, userId),
          eq(trainingProgress.moduleId, moduleId)
        ))
        .limit(1);

      if (existingProgress && existingProgress.length > 0) {
        // Update existing progress if new completion is higher
        if (completion > (existingProgress[0].completion || 0)) {
          await db
            .update(trainingProgress)
            .set({ 
              completion,
              // Using the correct column name from schema
              updatedAt: new Date()
            })
            .where(eq(trainingProgress.id, existingProgress[0].id));
        }
      } else {
        // Create new progress entry
        await db
          .insert(trainingProgress)
          .values({
            userId: userId,
            moduleId: moduleId,
            completion,
            updatedAt: new Date()
          });
      }

      res.json({ status: 'success', moduleId, userId, completion });
    } catch (dbError: any) {
      console.error('Database error in training progress update:', dbError);
      res.status(500).json({ 
        error: 'Database error while tracking progress', 
        details: dbError.message || 'Unknown database error'
      });
    }
  } catch (error: any) {
    console.error('Error tracking training progress:', error);
    res.status(500).json({ error: 'Failed to track progress', details: error.message || 'Unknown error' });
  }
}

/**
 * Get user's training progress
 */
export async function getUserProgress(req: Request, res: Response): Promise<void> {
  try {
    // Express query parameters can be string or string[] or undefined
    const userIdParam = req.query.userId;
    
    // Ensure we have a userId and it's a string
    if (!userIdParam) {
      res.status(400).json({ error: 'Missing user ID' });
      return;
    }
    
    // Get the first value if it's an array, or use the string directly
    const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    
    // Query database with proper sql template literals
    const result = await sql`
      SELECT * FROM training_progress 
      WHERE user_id = ${userId}
    `;

    // Format progress as object with moduleId as key
    const formattedProgress: Record<string, { completion: number }> = {};

    if (result && Array.isArray(result)) {
      result.forEach((item: any) => {
        formattedProgress[item.module_id] = {
          completion: item.completion || 0
        };
      });
    }

    res.json(formattedProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
}

// Helper functions for training presentation mode
const mockTrainingContent: Record<string, {slides: {title: string, content: string}[]}> = {
  technical: {
    slides: [
      { title: 'Slide 1', content: 'Technical content for slide 1' },
      { title: 'Slide 2', content: 'Technical content for slide 2' }
    ]
  },
  decision_maker: {
    slides: [
      { title: 'Slide 1', content: 'Decision maker content for slide 1' },
      { title: 'Slide 2', content: 'Decision maker content for slide 2' }
    ]
  }
};

export const getTrainingModuleContent = async (moduleId: string, role: string = 'technical'): Promise<any> => {
  // In a real implementation, this would fetch from database
  // Here we're using the mock data

  // Find the module
  const modules = await fetchTrainingModulesList();
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return null;
  }

  // Return the content based on the role
  // This would be more sophisticated in a real implementation
  const roleKey = role as keyof typeof mockTrainingContent;
  
  switch (moduleId) {
    case 'eu-ai-act-intro':
      return mockTrainingContent[roleKey] || mockTrainingContent.technical;
    case 'risk-classification':
      // Would have different content per role
      return mockTrainingContent[roleKey] || mockTrainingContent.technical;
    case 'technical-requirements':
      // Would have different content per role
      return mockTrainingContent[roleKey] || mockTrainingContent.technical;
    default:
      return mockTrainingContent.technical;
  }
};

export const getTrainingModuleMetadata = async (moduleId: string): Promise<any> => {
  // In a real implementation, this would fetch from database
  const modules = await fetchTrainingModulesList();
  return modules.find(m => m.id === moduleId) || null;
};

export const recordTrainingCompletion = async (userId: string, moduleId: string): Promise<string> => {
  // In a real implementation, this would record to database
  // For now we just return a mock certificate ID
  const certificateId = `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return certificateId;
};

export const getTrainingCertificate = async (certificateId: string): Promise<any> => {
  // In a real implementation, this would fetch from database
  // For now we return mock data
  const modules = await fetchTrainingModulesList();
  const randomModule = modules[Math.floor(Math.random() * modules.length)];

  return {
    id: certificateId,
    moduleId: randomModule.id,
    moduleTitle: randomModule.title,
    completedAt: new Date().toISOString(),
    userName: 'Demo User',
    userRole: 'IT Manager'
  };
};

export const exportTrainingModule = async (moduleId: string, format: string): Promise<any> => {
  // In a real implementation, this would generate the export files
  // For now we return mock data
  const module = await getTrainingModuleMetadata(moduleId);

  if (!module) {
    throw new Error('Module not found');
  }

  let content = '';
  let filename = '';
  let contentType = '';

  switch (format) {
    case 'markdown':
      content = `# ${module.title}\n\n## Overview\n\n${module.description}\n\n## Module Content\n\nThis would contain the full module content in markdown format.`;
      filename = `${module.id}.md`;
      contentType = 'text/markdown';
      break;
    case 'pptx':
      // This would actually generate a PPTX file
      // For now, just return a placeholder
      content = 'PPTX content placeholder';
      filename = `${module.id}.pptx`;
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'pdf':
      // This would actually generate a PDF file
      // For now, just return a placeholder
      content = 'PDF content placeholder';
      filename = `${module.id}.pdf`;
      contentType = 'application/pdf';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return { content, filename, contentType };
};

export const fetchTrainingModulesList = async (): Promise<any[]> => {
  // In a real implementation, this would fetch from database
  return [
    {
      id: 'eu-ai-act-intro',
      title: 'EU AI Act Introduction',
      description: 'Introduction to the EU AI Act, its scope, and key provisions',
      duration: '20-30 minutes',
      relevance: 'Medium',
      progress: 5,
      categories: ['Regulatory Overview', 'Compliance Basics']
    },
    {
      id: 'risk-classification',
      title: 'Risk Classification System',
      description: 'Understanding the risk categories and how to classify AI systems',
      duration: '25-35 minutes',
      relevance: 'High',
      progress: 0,
      categories: ['Risk Management', 'Compliance']
    },
    {
      id: 'technical-requirements',
      title: 'Technical Requirements',
      description: 'Technical requirements for high-risk AI systems',
      duration: '40-50 minutes',
      relevance: 'High',
      progress: 0,
      categories: ['Technical Compliance', 'AI Development']
    }
  ];
};