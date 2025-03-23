import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { AlertCircle } from "lucide-react";

interface TechnicalDetailsStepProps {
  formData: {
    aiCapabilities: string;
    trainingDatasets: string;
    usageContext: string;
    humansInLoop: boolean;
    dataSources: string;
    dataProtection: string;
    usesPersonalData: boolean;
    usesSensitiveData: boolean;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors?: Record<string, string>;
}

export const TechnicalDetailsStep: React.FC<TechnicalDetailsStepProps> = ({
  formData,
  setFormData,
  errors = {}
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="aiCapabilities">AI Capabilities <span className="text-red-500">*</span></Label>
          <Textarea
            id="aiCapabilities"
            name="aiCapabilities"
            placeholder="What are the main AI capabilities of this system?"
            value={formData.aiCapabilities}
            onChange={handleInputChange}
            className={errors.aiCapabilities ? "border-red-500" : ""}
            rows={3}
            required
          />
          {errors.aiCapabilities ? (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.aiCapabilities}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              E.g., Natural Language Processing, Computer Vision, Predictive Analytics, etc.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainingDatasets">Training Datasets <span className="text-red-500">*</span></Label>
          <Textarea
            id="trainingDatasets"
            name="trainingDatasets"
            placeholder="Describe the datasets used to train this AI system"
            value={formData.trainingDatasets}
            onChange={handleInputChange}
            className={errors.trainingDatasets ? "border-red-500" : ""}
            rows={3}
            required
          />
          {errors.trainingDatasets ? (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.trainingDatasets}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Include information about data sources, types, and any pre-processing methods
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="usageContext">Usage Context <span className="text-red-500">*</span></Label>
          <Textarea
            id="usageContext"
            name="usageContext"
            placeholder="In what context will this AI system be used?"
            value={formData.usageContext}
            onChange={handleInputChange}
            className={errors.usageContext ? "border-red-500" : ""}
            rows={3}
            required
          />
          {errors.usageContext ? (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.usageContext}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Describe the environment, users, and situations where this system will be deployed
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="humansInLoop">Human Oversight</Label>
            <Switch
              id="humansInLoop"
              checked={formData.humansInLoop || false}
              onCheckedChange={(checked) => handleSwitchChange('humansInLoop', checked)}
            />
          </div>
          <p className="text-sm text-gray-500">
            Does this system include human review/oversight of AI decisions?
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataSources">Data Sources</Label>
          <Textarea
            id="dataSources"
            name="dataSources"
            placeholder="What are the sources of data used by this system?"
            value={formData.dataSources}
            onChange={handleInputChange}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataProtection">Data Protection Measures</Label>
          <Textarea
            id="dataProtection"
            name="dataProtection"
            placeholder="What measures are in place to protect data?"
            value={formData.dataProtection}
            onChange={handleInputChange}
            rows={2}
          />
        </div>

        <div className="space-y-3 pt-3">
          <Label>Data Processing</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="usesPersonalData" 
                checked={formData.usesPersonalData || false}
                onCheckedChange={(checked) => handleCheckboxChange('usesPersonalData', checked === true)}
              />
              <label
                htmlFor="usesPersonalData"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Processes personal data
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="usesSensitiveData" 
                checked={formData.usesSensitiveData || false}
                onCheckedChange={(checked) => handleCheckboxChange('usesSensitiveData', checked === true)}
              />
              <label
                htmlFor="usesSensitiveData"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Processes sensitive data (health, biometric, etc.)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};