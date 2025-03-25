
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Award, 
  CheckCircle, 
  User, 
  ChevronRight, 
  ChevronLeft,
  BarChart,
  FileText,
  Play,
  DownloadCloud
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SlideContent {
  title: {
    en: string;
    de: string;
  };
  content: {
    en: React.ReactNode;
    de: React.ReactNode;
  };
  image?: string;
}

interface QuizQuestion {
  question: {
    en: string;
    de: string;
  };
  options: {
    en: string[];
    de: string[];
  };
  correctAnswer: number;
}

const ComprehensiveTraining: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  const [showQuiz, setShowQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Training content with bilingual support
  const slides: SlideContent[] = [
    {
      title: {
        en: "Welcome to EU AI Act Compliance Training",
        de: "Willkommen zum EU-KI-Gesetz-Compliance-Training"
      },
      content: {
        en: (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img src="/client/public/sgh-asia-logo.png" alt="SGH Asia Logo" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-lg font-medium">Your Coach: Jack from SGH Asia</h3>
                <p className="text-muted-foreground">EU AI Act Compliance Expert</p>
              </div>
            </div>
            <p>Welcome to our comprehensive EU AI Act training program. I'm Jack from SGH Asia, and I'll be your guide through this journey of understanding the European Union's Artificial Intelligence Act.</p>
            <p>This training will cover key aspects of the EU AI Act and help you understand how to ensure compliance in your organization.</p>
            <div className="bg-blue-50 p-4 rounded-md mt-4">
              <h4 className="font-medium text-blue-800">What you'll learn:</h4>
              <ul className="list-disc list-inside text-blue-700 mt-2">
                <li>Core principles of the EU AI Act</li>
                <li>Risk categories and classification</li>
                <li>Compliance requirements by risk level</li>
                <li>Documentation and governance practices</li>
                <li>Human oversight requirements</li>
              </ul>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img src="/client/public/sgh-asia-logo.png" alt="SGH Asia Logo" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-lg font-medium">Ihr Coach: Jack von SGH Asia</h3>
                <p className="text-muted-foreground">Experte für EU-KI-Gesetz-Compliance</p>
              </div>
            </div>
            <p>Willkommen zu unserem umfassenden EU-KI-Gesetz-Trainingsprogramm. Ich bin Jack von SGH Asia und werde Sie auf dieser Reise durch das Verständnis des Künstliche-Intelligenz-Gesetzes der Europäischen Union begleiten.</p>
            <p>Dieses Training wird die wichtigsten Aspekte des EU-KI-Gesetzes abdecken und Ihnen helfen zu verstehen, wie Sie die Einhaltung in Ihrer Organisation sicherstellen können.</p>
            <div className="bg-blue-50 p-4 rounded-md mt-4">
              <h4 className="font-medium text-blue-800">Was Sie lernen werden:</h4>
              <ul className="list-disc list-inside text-blue-700 mt-2">
                <li>Grundprinzipien des EU-KI-Gesetzes</li>
                <li>Risikokategorien und Klassifizierung</li>
                <li>Compliance-Anforderungen nach Risikoniveau</li>
                <li>Dokumentations- und Governance-Praktiken</li>
                <li>Anforderungen an die menschliche Aufsicht</li>
              </ul>
            </div>
          </div>
        )
      },
      image: "/attached_assets/image_1742743429066.png"
    },
    {
      title: {
        en: "Understanding the EU AI Act",
        de: "Verständnis des EU-KI-Gesetzes"
      },
      content: {
        en: (
          <div className="space-y-4">
            <p>The EU AI Act is the world's first comprehensive AI regulation. It establishes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h4 className="font-medium text-slate-800">Purpose</h4>
                <p className="text-slate-600 mt-2">To ensure AI systems in the EU market are safe, transparent, traceable, non-discriminatory and environmentally friendly.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h4 className="font-medium text-slate-800">Scope</h4>
                <p className="text-slate-600 mt-2">Applies to providers placing AI systems on the EU market, users of AI systems located in the EU, and providers/users located outside the EU whose systems' outputs are used in the EU.</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium">Key Timeline:</h4>
              <div className="relative mt-4">
                <div className="absolute top-0 left-8 bottom-0 w-1 bg-blue-200"></div>
                <div className="relative z-10 flex items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">2023</div>
                  <div className="ml-4">
                    <p className="font-medium">June 2023</p>
                    <p className="text-muted-foreground">EU Parliament approved the Act</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">2024</div>
                  <div className="ml-4">
                    <p className="font-medium">February 2024</p>
                    <p className="text-muted-foreground">Final text adopted</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">2026</div>
                  <div className="ml-4">
                    <p className="font-medium">2026</p>
                    <p className="text-muted-foreground">Full implementation expected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4">
            <p>Das EU-KI-Gesetz ist die erste umfassende KI-Regulierung der Welt. Es etabliert:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h4 className="font-medium text-slate-800">Zweck</h4>
                <p className="text-slate-600 mt-2">Sicherzustellen, dass KI-Systeme auf dem EU-Markt sicher, transparent, nachvollziehbar, nicht diskriminierend und umweltfreundlich sind.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h4 className="font-medium text-slate-800">Anwendungsbereich</h4>
                <p className="text-slate-600 mt-2">Gilt für Anbieter, die KI-Systeme auf dem EU-Markt anbieten, Nutzer von KI-Systemen in der EU und Anbieter/Nutzer außerhalb der EU, deren Systeme in der EU genutzt werden.</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium">Wichtiger Zeitplan:</h4>
              <div className="relative mt-4">
                <div className="absolute top-0 left-8 bottom-0 w-1 bg-blue-200"></div>
                <div className="relative z-10 flex items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">2023</div>
                  <div className="ml-4">
                    <p className="font-medium">Juni 2023</p>
                    <p className="text-muted-foreground">EU-Parlament verabschiedet das Gesetz</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">2024</div>
                  <div className="ml-4">
                    <p className="font-medium">Februar 2024</p>
                    <p className="text-muted-foreground">Endgültiger Text angenommen</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">2026</div>
                  <div className="ml-4">
                    <p className="font-medium">2026</p>
                    <p className="text-muted-foreground">Vollständige Umsetzung erwartet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      image: "/attached_assets/image_1742743497917.png"
    },
    {
      title: {
        en: "Risk Classification System",
        de: "Risikoklassifizierungssystem"
      },
      content: {
        en: (
          <div className="space-y-4">
            <p>The EU AI Act categorizes AI systems based on their risk level:</p>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h4 className="font-medium text-red-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center mr-2">1</span>
                  Unacceptable Risk (Prohibited)
                </h4>
                <p className="text-red-700 mt-2 ml-10">Systems that pose a clear threat to safety, livelihoods, or rights of people.</p>
                <div className="ml-10 mt-2">
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside text-red-600 mt-1">
                    <li>Social scoring systems by governments</li>
                    <li>Emotion recognition in workplaces or schools</li>
                    <li>Biometric categorization systems using sensitive characteristics</li>
                    <li>Predictive policing based solely on profiling</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h4 className="font-medium text-amber-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mr-2">2</span>
                  High Risk
                </h4>
                <p className="text-amber-700 mt-2 ml-10">Systems with significant potential impact on health, safety, or fundamental rights.</p>
                <div className="ml-10 mt-2">
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside text-amber-600 mt-1">
                    <li>Critical infrastructure (water, gas, electricity)</li>
                    <li>Educational and vocational training</li>
                    <li>Employment, worker management, access to self-employment</li>
                    <li>Essential private and public services</li>
                    <li>Law enforcement</li>
                    <li>Migration, asylum and border control</li>
                    <li>Administration of justice and democratic processes</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <h4 className="font-medium text-yellow-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center mr-2">3</span>
                  Limited Risk
                </h4>
                <p className="text-yellow-700 mt-2 ml-10">Systems with specific transparency obligations.</p>
                <div className="ml-10 mt-2">
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside text-yellow-600 mt-1">
                    <li>Chatbots</li>
                    <li>AI systems generating or manipulating image, audio or video content</li>
                    <li>Emotion recognition systems</li>
                    <li>Biometric categorization systems</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h4 className="font-medium text-green-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center mr-2">4</span>
                  Minimal Risk
                </h4>
                <p className="text-green-700 mt-2 ml-10">All other AI systems not covered by the categories above.</p>
                <div className="ml-10 mt-2">
                  <strong>Examples:</strong>
                  <ul className="list-disc list-inside text-green-600 mt-1">
                    <li>AI-enabled video games</li>
                    <li>Spam filters</li>
                    <li>Inventory management systems</li>
                    <li>AI used for scientific research</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4">
            <p>Das EU-KI-Gesetz kategorisiert KI-Systeme basierend auf ihrem Risikoniveau:</p>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h4 className="font-medium text-red-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center mr-2">1</span>
                  Inakzeptables Risiko (Verboten)
                </h4>
                <p className="text-red-700 mt-2 ml-10">Systeme, die eine klare Bedrohung für die Sicherheit, den Lebensunterhalt oder die Rechte von Menschen darstellen.</p>
                <div className="ml-10 mt-2">
                  <strong>Beispiele:</strong>
                  <ul className="list-disc list-inside text-red-600 mt-1">
                    <li>Soziale Bewertungssysteme durch Regierungen</li>
                    <li>Emotionserkennung am Arbeitsplatz oder in Schulen</li>
                    <li>Biometrische Kategorisierungssysteme, die sensible Merkmale verwenden</li>
                    <li>Prädiktive Polizeiarbeit, die ausschließlich auf Profiling basiert</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h4 className="font-medium text-amber-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mr-2">2</span>
                  Hohes Risiko
                </h4>
                <p className="text-amber-700 mt-2 ml-10">Systeme mit erheblichen potenziellen Auswirkungen auf Gesundheit, Sicherheit oder Grundrechte.</p>
                <div className="ml-10 mt-2">
                  <strong>Beispiele:</strong>
                  <ul className="list-disc list-inside text-amber-600 mt-1">
                    <li>Kritische Infrastruktur (Wasser, Gas, Elektrizität)</li>
                    <li>Bildung und Berufsbildung</li>
                    <li>Beschäftigung, Arbeitnehmermanagement, Zugang zur Selbstständigkeit</li>
                    <li>Wesentliche private und öffentliche Dienstleistungen</li>
                    <li>Strafverfolgung</li>
                    <li>Migration, Asyl und Grenzkontrolle</li>
                    <li>Justizverwaltung und demokratische Prozesse</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <h4 className="font-medium text-yellow-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center mr-2">3</span>
                  Begrenztes Risiko
                </h4>
                <p className="text-yellow-700 mt-2 ml-10">Systeme mit spezifischen Transparenzverpflichtungen.</p>
                <div className="ml-10 mt-2">
                  <strong>Beispiele:</strong>
                  <ul className="list-disc list-inside text-yellow-600 mt-1">
                    <li>Chatbots</li>
                    <li>KI-Systeme, die Bild-, Audio- oder Videoinhalte generieren oder manipulieren</li>
                    <li>Emotionserkennungssysteme</li>
                    <li>Biometrische Kategorisierungssysteme</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h4 className="font-medium text-green-800 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center mr-2">4</span>
                  Minimales Risiko
                </h4>
                <p className="text-green-700 mt-2 ml-10">Alle anderen KI-Systeme, die nicht von den oben genannten Kategorien abgedeckt werden.</p>
                <div className="ml-10 mt-2">
                  <strong>Beispiele:</strong>
                  <ul className="list-disc list-inside text-green-600 mt-1">
                    <li>KI-gestützte Videospiele</li>
                    <li>Spam-Filter</li>
                    <li>Bestandsverwaltungssysteme</li>
                    <li>KI für wissenschaftliche Forschung</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      },
      image: "/attached_assets/image_1742751265312.png"
    },
    {
      title: {
        en: "High-Risk AI Systems: Compliance Requirements",
        de: "KI-Systeme mit hohem Risiko: Compliance-Anforderungen"
      },
      content: {
        en: (
          <div className="space-y-4">
            <p>High-risk AI systems are subject to the most stringent compliance requirements under the EU AI Act:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Risk Management System</h4>
                </div>
                <p className="text-muted-foreground">Establish an ongoing risk assessment and mitigation process throughout the entire lifecycle of the AI system.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Technical Documentation</h4>
                </div>
                <p className="text-muted-foreground">Comprehensive documentation of system design, development process, and compliance procedures.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Human Oversight</h4>
                </div>
                <p className="text-muted-foreground">Enable effective oversight by humans to prevent or minimize risks to health, safety, or fundamental rights.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <Play className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Record-Keeping</h4>
                </div>
                <p className="text-muted-foreground">Automatic recording of events and human decisions during system operation.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Accuracy & Robustness</h4>
                </div>
                <p className="text-muted-foreground">Systems must achieve appropriate levels of accuracy, robustness, and cybersecurity.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <DownloadCloud className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Data Governance</h4>
                </div>
                <p className="text-muted-foreground">Training, validation, and testing data must meet quality criteria and be relevant, representative, and free of errors.</p>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 p-4 rounded-md">
              <h4 className="font-medium text-amber-800">Conformity Assessment Process:</h4>
              <ol className="mt-2 space-y-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">1</span>
                  <span className="text-amber-700">Internal assessment against requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">2</span>
                  <span className="text-amber-700">Technical documentation preparation</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">3</span>
                  <span className="text-amber-700">Registration in EU database (when operational)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">4</span>
                  <span className="text-amber-700">Declaration of conformity</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">5</span>
                  <span className="text-amber-700">CE marking application</span>
                </li>
              </ol>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4">
            <p>KI-Systeme mit hohem Risiko unterliegen den strengsten Compliance-Anforderungen gemäß dem EU-KI-Gesetz:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Risikomanagementsystem</h4>
                </div>
                <p className="text-muted-foreground">Einrichtung eines kontinuierlichen Risikobewertungs- und Minderungsprozesses während des gesamten Lebenszyklus des KI-Systems.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Technische Dokumentation</h4>
                </div>
                <p className="text-muted-foreground">Umfassende Dokumentation des Systemdesigns, des Entwicklungsprozesses und der Compliance-Verfahren.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Menschliche Aufsicht</h4>
                </div>
                <p className="text-muted-foreground">Ermöglichung einer wirksamen Aufsicht durch Menschen, um Risiken für Gesundheit, Sicherheit oder Grundrechte zu verhindern oder zu minimieren.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <Play className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Aufzeichnungsführung</h4>
                </div>
                <p className="text-muted-foreground">Automatische Aufzeichnung von Ereignissen und menschlichen Entscheidungen während des Systembetriebs.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Genauigkeit & Robustheit</h4>
                </div>
                <p className="text-muted-foreground">Systeme müssen angemessene Genauigkeit, Robustheit und Cybersicherheit erreichen.</p>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <DownloadCloud className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Daten-Governance</h4>
                </div>
                <p className="text-muted-foreground">Trainings-, Validierungs- und Testdaten müssen Qualitätskriterien erfüllen und relevant, repräsentativ und fehlerfrei sein.</p>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50 p-4 rounded-md">
              <h4 className="font-medium text-amber-800">Konformitätsbewertungsverfahren:</h4>
              <ol className="mt-2 space-y-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">1</span>
                  <span className="text-amber-700">Interne Bewertung anhand der Anforderungen</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">2</span>
                  <span className="text-amber-700">Erstellung der technischen Dokumentation</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">3</span>
                  <span className="text-amber-700">Registrierung in der EU-Datenbank (wenn in Betrieb)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">4</span>
                  <span className="text-amber-700">Konformitätserklärung</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 mr-2 mt-0.5 flex-shrink-0">5</span>
                  <span className="text-amber-700">Anbringung der CE-Kennzeichnung</span>
                </li>
              </ol>
            </div>
          </div>
        )
      },
      image: "/attached_assets/image_1742743876462.png"
    },
    {
      title: {
        en: "Practical Implementation Steps",
        de: "Praktische Umsetzungsschritte"
      },
      content: {
        en: (
          <div className="space-y-4">
            <p>Implementing EU AI Act compliance requires a systematic approach:</p>
            
            <div className="relative mt-6">
              <div className="absolute top-0 left-8 bottom-0 w-1 bg-blue-200"></div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Step 1</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">AI System Inventory</h4>
                  <p className="text-muted-foreground mt-1">Create a comprehensive inventory of all AI systems in your organization.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Include:</strong> System name, purpose, risk level, training data sources, development history, deployment scope</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Step 2</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Risk Assessment</h4>
                  <p className="text-muted-foreground mt-1">Conduct risk assessments for each AI system to determine its risk category.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Consider:</strong> Purpose of system, sector of use, potential impact on individuals, vulnerability of affected users</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Step 3</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Gap Analysis</h4>
                  <p className="text-muted-foreground mt-1">Identify compliance gaps for high-risk AI systems by comparing current practices with requirements.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Analysis areas:</strong> Risk management, data governance, technical documentation, human oversight, accuracy & robustness</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Step 4</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Implementation Plan</h4>
                  <p className="text-muted-foreground mt-1">Develop a compliance implementation plan with clear responsibilities and timelines.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Key components:</strong> Technical changes, documentation updates, governance processes, training requirements, testing procedures</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Step 5</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Ongoing Monitoring</h4>
                  <p className="text-muted-foreground mt-1">Establish continuous monitoring and evaluation of AI systems.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Monitoring aspects:</strong> System performance, risk indicators, regulatory changes, incident reporting, audit procedures</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                SGH Asia Implementation Support
              </h4>
              <p className="text-green-700 mt-2">
                Our team at SGH Asia can provide comprehensive support for each implementation step, 
                helping your organization achieve and maintain EU AI Act compliance.
              </p>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4">
            <p>Die Umsetzung der EU-KI-Gesetz-Compliance erfordert einen systematischen Ansatz:</p>
            
            <div className="relative mt-6">
              <div className="absolute top-0 left-8 bottom-0 w-1 bg-blue-200"></div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Schritt 1</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">KI-System-Inventar</h4>
                  <p className="text-muted-foreground mt-1">Erstellen Sie ein umfassendes Inventar aller KI-Systeme in Ihrer Organisation.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Einschließen:</strong> Systemname, Zweck, Risikoniveau, Trainingsdatenquellen, Entwicklungshistorie, Einsatzbereich</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Schritt 2</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Risikobewertung</h4>
                  <p className="text-muted-foreground mt-1">Führen Sie Risikobewertungen für jedes KI-System durch, um seine Risikokategorie zu bestimmen.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Berücksichtigen:</strong> Zweck des Systems, Einsatzbereich, potenzielle Auswirkungen auf Personen, Verwundbarkeit betroffener Nutzer</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Schritt 3</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Lückenanalyse</h4>
                  <p className="text-muted-foreground mt-1">Identifizieren Sie Compliance-Lücken für Hochrisiko-KI-Systeme durch Vergleich aktueller Praktiken mit den Anforderungen.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Analysebereiche:</strong> Risikomanagement, Daten-Governance, technische Dokumentation, menschliche Aufsicht, Genauigkeit & Robustheit</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex mb-8">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Schritt 4</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Umsetzungsplan</h4>
                  <p className="text-muted-foreground mt-1">Entwickeln Sie einen Compliance-Umsetzungsplan mit klaren Verantwortlichkeiten und Zeitplänen.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Schlüsselkomponenten:</strong> Technische Änderungen, Dokumentationsaktualisierungen, Governance-Prozesse, Schulungsanforderungen, Testverfahren</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <span className="text-blue-700 font-medium">Schritt 5</span>
                </div>
                <div className="ml-6">
                  <h4 className="font-medium text-lg">Kontinuierliche Überwachung</h4>
                  <p className="text-muted-foreground mt-1">Etablieren Sie eine kontinuierliche Überwachung und Evaluierung von KI-Systemen.</p>
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700"><strong>Überwachungsaspekte:</strong> Systemleistung, Risikoindikatoren, regulatorische Änderungen, Vorfallsberichterstattung, Prüfungsverfahren</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                SGH Asia Implementierungsunterstützung
              </h4>
              <p className="text-green-700 mt-2">
                Unser Team bei SGH Asia kann umfassende Unterstützung für jeden Implementierungsschritt bieten 
                und Ihrer Organisation helfen, die Einhaltung des EU-KI-Gesetzes zu erreichen und aufrechtzuerhalten.
              </p>
            </div>
          </div>
        )
      },
      image: "/attached_assets/image_1742743525197.png"
    }
  ];
  
  // Quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      question: {
        en: "Which of the following is NOT a risk category under the EU AI Act?",
        de: "Welche der folgenden ist KEINE Risikokategorie gemäß dem EU-KI-Gesetz?"
      },
      options: {
        en: ["Unacceptable Risk", "High Risk", "Medium Risk", "Limited Risk"],
        de: ["Inakzeptables Risiko", "Hohes Risiko", "Mittleres Risiko", "Begrenztes Risiko"]
      },
      correctAnswer: 2
    },
    {
      question: {
        en: "Which of the following AI systems would typically be classified as high-risk under the EU AI Act?",
        de: "Welches der folgenden KI-Systeme würde typischerweise als hochriskant gemäß dem EU-KI-Gesetz eingestuft werden?"
      },
      options: {
        en: [
          "A video game recommendation system",
          "An AI system for recruitment and candidate evaluation",
          "A weather forecasting AI system",
          "A customer service chatbot"
        ],
        de: [
          "Ein Videospiel-Empfehlungssystem",
          "Ein KI-System für Rekrutierung und Kandidatenbewertung",
          "Ein KI-System zur Wettervorhersage",
          "Ein Kundenservice-Chatbot"
        ]
      },
      correctAnswer: 1
    },
    {
      question: {
        en: "Which of the following is a required component for high-risk AI systems?",
        de: "Welche der folgenden ist eine erforderliche Komponente für KI-Systeme mit hohem Risiko?"
      },
      options: {
        en: [
          "Public disclosure of all training data",
          "AI system registration in a national database",
          "Human oversight mechanisms",
          "Annual certification by an independent consultant"
        ],
        de: [
          "Öffentliche Offenlegung aller Trainingsdaten",
          "KI-Systemregistrierung in einer nationalen Datenbank",
          "Mechanismen zur menschlichen Aufsicht",
          "Jährliche Zertifizierung durch einen unabhängigen Berater"
        ]
      },
      correctAnswer: 2
    },
    {
      question: {
        en: "When is the EU AI Act expected to be fully implemented?",
        de: "Wann wird die vollständige Umsetzung des EU-KI-Gesetzes erwartet?"
      },
      options: {
        en: ["2024", "2025", "2026", "2027"],
        de: ["2024", "2025", "2026", "2027"]
      },
      correctAnswer: 2
    },
    {
      question: {
        en: "Which AI system would be PROHIBITED under the EU AI Act?",
        de: "Welches KI-System wäre gemäß dem EU-KI-Gesetz VERBOTEN?"
      },
      options: {
        en: [
          "A facial recognition system used in schools to monitor student attention",
          "A recommendation system for online shopping",
          "A medical diagnosis support system",
          "A traffic management system for smart cities"
        ],
        de: [
          "Ein Gesichtserkennungssystem in Schulen zur Überwachung der Aufmerksamkeit von Schülern",
          "Ein Empfehlungssystem für Online-Shopping",
          "Ein Unterstützungssystem für medizinische Diagnosen",
          "Ein Verkehrsmanagementsystem für Smart Cities"
        ]
      },
      correctAnswer: 0
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const prevSlide = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setCurrentSlide(slides.length - 1);
    } else if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const switchLanguage = (lang: 'en' | 'de') => {
    setLanguage(lang);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const submitQuiz = () => {
    // Check if all questions are answered
    if (userAnswers.length < quizQuestions.length) {
      return; // Don't submit if not all questions answered
    }

    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(Math.round((correctCount / quizQuestions.length) * 100));
    setQuizSubmitted(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-2xl">
                EU AI Act Compliance Training
              </CardTitle>
              <CardDescription>
                {language === 'en' ? 'Comprehensive coaching with Jack from SGH Asia' : 'Umfassendes Coaching mit Jack von SGH Asia'}
              </CardDescription>
            </div>
            <div className="mt-4 sm:mt-0">
              <TabsList>
                <TabsTrigger value="en" onClick={() => switchLanguage('en')} className={language === 'en' ? 'bg-blue-50' : ''}>
                  🇬🇧 English
                </TabsTrigger>
                <TabsTrigger value="de" onClick={() => switchLanguage('de')} className={language === 'de' ? 'bg-blue-50' : ''}>
                  🇩🇪 Deutsch
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          {!showQuiz ? (
            <>
              <div className="relative overflow-hidden rounded-lg bg-slate-50 mb-6" style={{minHeight: '400px'}}>
                {slides[currentSlide].image && (
                  <div className="absolute inset-0 bg-center bg-cover opacity-10" 
                       style={{backgroundImage: `url(${slides[currentSlide].image})`}}></div>
                )}
                <div className="relative z-10 p-6">
                  <h2 className="text-xl font-bold mb-4">{slides[currentSlide].title[language]}</h2>
                  <div className="prose max-w-none">
                    {slides[currentSlide].content[language]}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Previous' : 'Zurück'}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Slide' : 'Folie'} {currentSlide + 1} / {slides.length}
                </div>
                <Button onClick={nextSlide}>
                  {currentSlide < slides.length - 1 
                    ? (language === 'en' ? 'Next' : 'Weiter')
                    : (language === 'en' ? 'Take Assessment' : 'Zur Prüfung')}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <Progress value={(currentSlide + 1) / slides.length * 100} className="h-2" />
            </>
          ) : (
            <div className="space-y-6">
              {!quizSubmitted ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {language === 'en' ? 'Knowledge Assessment' : 'Wissensbewertung'}
                    </h2>
                    <Button variant="outline" size="sm" onClick={prevSlide}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Back to Slides' : 'Zurück zu den Folien'}
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {quizQuestions.map((question, qIndex) => (
                      <div key={qIndex} className="p-4 border rounded-lg bg-slate-50">
                        <h3 className="font-medium mb-3">
                          {qIndex + 1}. {question.question[language]}
                        </h3>
                        <RadioGroup 
                          value={userAnswers[qIndex]?.toString()} 
                          onValueChange={(value) => handleAnswerSelect(qIndex, parseInt(value))}
                        >
                          <div className="space-y-2">
                            {question.options[language].map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                <Label htmlFor={`q${qIndex}-o${oIndex}`} className="cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={submitQuiz}
                    disabled={userAnswers.length < quizQuestions.length}
                    className="w-full"
                  >
                    {language === 'en' ? 'Submit Assessment' : 'Bewertung einreichen'}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold">{score}%</span>
                  </div>
                  
                  <h2 className="text-xl font-bold">
                    {language === 'en' ? 'Assessment Complete!' : 'Bewertung abgeschlossen!'}
                  </h2>
                  
                  <div className="bg-slate-50 p-6 rounded-lg">
                    {score >= 80 ? (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle>
                          {language === 'en' ? 'Excellent work!' : 'Ausgezeichnete Arbeit!'}
                        </AlertTitle>
                        <AlertDescription>
                          {language === 'en' 
                            ? 'You have demonstrated excellent understanding of the EU AI Act regulations.' 
                            : 'Sie haben ein ausgezeichnetes Verständnis der EU-KI-Gesetzgebung gezeigt.'}
                        </AlertDescription>
                      </Alert>
                    ) : score >= 60 ? (
                      <Alert className="bg-amber-50 border-amber-200">
                        <CheckCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle>
                          {language === 'en' ? 'Good progress!' : 'Gute Fortschritte!'}
                        </AlertTitle>
                        <AlertDescription>
                          {language === 'en'
                            ? 'You have a good understanding of the key concepts, but there\'s room for improvement.'
                            : 'Sie haben ein gutes Verständnis der Schlüsselkonzepte, aber es gibt noch Raum für Verbesserungen.'}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-red-50 border-red-200">
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle>
                          {language === 'en' ? 'More review needed' : 'Weitere Überprüfung erforderlich'}
                        </AlertTitle>
                        <AlertDescription>
                          {language === 'en'
                            ? 'We recommend reviewing the training materials again to strengthen your understanding.'
                            : 'Wir empfehlen, die Schulungsmaterialien erneut zu überprüfen, um Ihr Verständnis zu stärken.'}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" onClick={() => {
                        setShowQuiz(false);
                        setCurrentSlide(0);
                        setQuizSubmitted(false);
                        setUserAnswers([]);
                      }}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Restart Training' : 'Training neustarten'}
                      </Button>
                      
                      <Button>
                        <Award className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Download Certificate' : 'Zertifikat herunterladen'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveTraining;
