import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIJack } from "@/components/onboarding/ai-jack";
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactInformationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    country: ""
  });

  // Load any existing contact info on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userOnboardingProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        // Only update state with values that exist
        setContactInfo(prev => ({
          companyName: profile.companyName || prev.companyName,
          contactName: profile.contactName || prev.contactName, 
          contactEmail: profile.contactEmail || prev.contactEmail,
          contactPhone: profile.contactPhone || prev.contactPhone,
          country: profile.country || prev.country
        }));
      } catch (e) {
        console.error("Error parsing saved contact info:", e);
      }
    }
  }, []);

  // Update form field
  const updateField = (field: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save contact information
  const saveContactInfo = async () => {
    setIsSubmitting(true);
    
    try {
      // Get existing profile data
      const savedProfile = localStorage.getItem("userOnboardingProfile") || "{}";
      const existingProfile = JSON.parse(savedProfile);
      
      // Update with new contact info
      const updatedProfile = {
        ...existingProfile,
        ...contactInfo
      };
      
      // Save back to localStorage
      localStorage.setItem("userOnboardingProfile", JSON.stringify(updatedProfile));
      
      // Show success message
      toast({
        title: "Contact Information Saved",
        description: "Your contact details have been securely saved.",
        variant: "default"
      });
      
      // Update state to show success UI
      setFormSubmitted(true);
      
      // Simulate API call delay (would be replaced with actual backend save)
      setTimeout(() => {
        setIsSubmitting(false);
      }, 800);
    } catch (error) {
      console.error("Error saving contact information:", error);
      toast({
        title: "Error",
        description: "There was an error saving your contact information. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Navigate to dashboard after successful save
  const continueToApp = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <PageHeader
        title="Your Contact Information"
        description="Help us personalize your compliance experience by providing your contact details"
        icon={<User className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Organization Contact Details</span>
              </CardTitle>
              <CardDescription>
                This information helps us provide personalized compliance guidance and updates.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Company Name */}
              <div className="grid gap-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter your organization's name"
                  value={contactInfo.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  className="bg-background"
                  disabled={isSubmitting || formSubmitted}
                />
              </div>
              
              {/* Contact Person */}
              <div className="grid gap-2">
                <Label htmlFor="contactName" className="text-sm font-medium">
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="Your full name"
                  value={contactInfo.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className="bg-background"
                  disabled={isSubmitting || formSubmitted}
                />
              </div>
              
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="contactEmail" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your.email@company.com"
                  value={contactInfo.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  className="bg-background"
                  disabled={isSubmitting || formSubmitted}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This email will be used for compliance notifications and important updates.
                </p>
              </div>
              
              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="contactPhone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="+123 456 7890"
                  value={contactInfo.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="bg-background"
                  disabled={isSubmitting || formSubmitted}
                />
              </div>
              
              {/* Country */}
              <div className="grid gap-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={contactInfo.country}
                  onValueChange={(value) => updateField("country", value)}
                  disabled={isSubmitting || formSubmitted}
                >
                  <SelectTrigger id="country" className="bg-background">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>European Union</SelectLabel>
                      {[
                        "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus",
                        "Czech Republic", "Denmark", "Estonia", "Finland", "France",
                        "Germany", "Greece", "Hungary", "Ireland", "Italy",
                        "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
                        "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
                        "Spain", "Sweden"
                      ].map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Other European Countries</SelectLabel>
                      {[
                        "United Kingdom", "Switzerland", "Norway", "Iceland",
                        "Liechtenstein", "Monaco", "Ukraine", "Serbia",
                        "North Macedonia", "Albania", "Montenegro", "Bosnia and Herzegovina"
                      ].map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Rest of World</SelectLabel>
                      {[
                        "United States", "Canada", "China", "Japan", "South Korea",
                        "Australia", "New Zealand", "Brazil", "India", "Singapore",
                        "United Arab Emirates", "South Africa"
                      ].map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 mt-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-start">
                  <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    Your information is securely stored and will only be used to provide
                    personalized compliance guidance. We never share your data with third parties.
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t p-6">
              {!formSubmitted ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/onboarding")}
                    disabled={isSubmitting}
                  >
                    Back to Onboarding
                  </Button>
                  
                  <Button
                    onClick={saveContactInfo}
                    disabled={isSubmitting || !contactInfo.companyName || !contactInfo.contactName || !contactInfo.contactEmail || !contactInfo.country}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Information</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Information Saved Successfully</span>
                    </div>
                    
                    <Button onClick={continueToApp} className="gap-2">
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Your AI Compliance Guide</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <AIJack
                mood="explaining"
                message="Providing your contact information helps us tailor your compliance experience. This allows us to send you relevant EU AI Act updates and customize guidance to your organization's specific needs."
                size="md"
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-md mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span>Why We Need Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Personalized compliance recommendations based on your industry and location</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Relevant regulatory updates specific to your jurisdiction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Targeted guidance for EU AI Act implementation in your sector</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Customized compliance reports and documentation templates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}