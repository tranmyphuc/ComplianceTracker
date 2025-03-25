import { SystemRegistration } from "@/components/registration/system-registration";
import { InlineTip, TipButton } from "@/components/compliance-tips";
import { useContextualTips } from "@/hooks/use-contextual-tips";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export default function RegisterSystem() {
  // Use contextual tips for system registration page
  const { triggerTip } = useContextualTips({
    context: 'system-registration',
    showOnMount: true,
    delay: 2000,
    specificTipId: 'registration-1'
  });
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Register AI System</h1>
          <p className="text-neutral-500 mt-1">Register and classify new AI systems for EU AI Act compliance</p>
        </div>
        
        {/* Add a tip button to the header */}
        <TipButton 
          tipId="registration-1" 
          variant="outline"
          size="sm"
        />
      </div>
      
      {/* Add an inline tip above the form */}
      <div className="mb-6">
        <InlineTip 
          tip={{
            title: "System Registration Guide",
            content: "Accurate system registration is the foundation of EU AI Act compliance. Be sure to provide detailed information about your AI system's purpose, capabilities, and intended use cases.",
            category: "governance",
            relevantArticles: ["Article 16", "Article 52"],
            learnMoreLink: "/knowledge-center/system-registration"
          }}
          jackStyle={true}
        />
      </div>
      
      {/* Add an info card with registration requirements */}
      <Card className="mb-6 border-blue-100 bg-blue-50">
        <CardContent className="p-4 flex items-start gap-3">
          <InfoIcon className="text-blue-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Registration Requirements</h3>
            <p className="text-blue-700 text-sm mb-2">
              The EU AI Act requires the registration of high-risk AI systems before they are placed on the market. 
              Proper registration helps demonstrate compliance and facilitates regulatory oversight.
            </p>
            <div className="text-xs text-blue-800 flex flex-col gap-1">
              <p>• Include clear descriptions of the system's capabilities and limitations</p>
              <p>• Specify intended use cases and deployment contexts</p>
              <p>• Document data sources, training methodologies, and performance metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <SystemRegistration onFormChange={() => triggerTip('registration-detail')} />
    </div>
  );
}