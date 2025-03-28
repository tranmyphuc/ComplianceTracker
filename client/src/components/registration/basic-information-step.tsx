import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle, ZapIcon } from "lucide-react";

interface BasicInformationStepProps {
  formData: {
    name: string;
    description: string;
    purpose: string;
    version: string;
    department: string;
    vendor: string;
    internalOwner: string;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  departments?: { id: number; name: string }[];
  errors?: Record<string, string>;
  smartCompletionActive?: boolean;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  formData,
  setFormData,
  departments = [],
  errors = {},
  smartCompletionActive = false
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {smartCompletionActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center mb-4">
          <ZapIcon className="h-5 w-5 text-blue-500 mr-2 animate-pulse" />
          <div>
            <p className="text-sm font-medium text-blue-800">Smart Completion Active</p>
            <p className="text-xs text-blue-600">AI is analyzing your input to automatically suggest values for empty fields</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">AI System Name <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                placeholder="Enter the system name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${errors.name ? "border-red-500" : ""} ${smartCompletionActive && !formData.name ? "border-blue-300 bg-blue-50/30" : ""}`}
                required
              />
              {smartCompletionActive && !formData.name && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI is analyzing your input to suggest a value for this field</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {errors.name ? (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Provide a clear descriptive name for the AI system</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">System Description <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Textarea
              id="description"
              name="description"
              placeholder="Provide a detailed description of the AI system"
              value={formData.description}
              onChange={handleInputChange}
              className={`${errors.description ? "border-red-500" : ""} ${smartCompletionActive && !formData.description ? "border-blue-300 bg-blue-50/30" : ""}`}
              rows={4}
              required
            />
            {smartCompletionActive && !formData.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute right-3 top-3">
                      <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI is analyzing your input to suggest a value for this field</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {errors.description ? (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Describe what the system does, its main functions, and intended outputs
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="What is the intended purpose of this AI system?"
              value={formData.purpose}
              onChange={handleInputChange}
              className={`${errors.purpose ? "border-red-500" : ""} ${smartCompletionActive && !formData.purpose ? "border-blue-300 bg-blue-50/30" : ""}`}
              rows={3}
              required
            />
            {smartCompletionActive && !formData.purpose && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute right-3 top-3">
                      <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI is analyzing your input to suggest a value for this field</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {errors.purpose ? (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.purpose}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Clearly state the business objectives this system is designed to achieve
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="version">Version <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="version"
                name="version"
                placeholder="e.g., 1.0, 2.3.1"
                value={formData.version}
                onChange={handleInputChange}
                className={`${errors.version ? "border-red-500" : ""} ${smartCompletionActive && !formData.version ? "border-blue-300 bg-blue-50/30" : ""}`}
                required
              />
              {smartCompletionActive && !formData.version && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI is analyzing your input to suggest a value for this field</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {errors.version && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.version}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger 
                  id="department" 
                  className={`${errors.department ? "border-red-500" : ""} ${smartCompletionActive && !formData.department ? "border-blue-300 bg-blue-50/30" : ""}`}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="IT">IT Department</SelectItem>
                      <SelectItem value="R&D">R&D</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {smartCompletionActive && !formData.department && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
                        <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI is analyzing your input to suggest a value for this field</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {errors.department && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.department}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor/Provider</Label>
            <div className="relative">
              <Input
                id="vendor"
                name="vendor"
                placeholder="Who developed this system?"
                value={formData.vendor}
                onChange={handleInputChange}
                className={`${errors.vendor ? "border-red-500" : ""} ${smartCompletionActive && !formData.vendor ? "border-blue-300 bg-blue-50/30" : ""}`}
              />
              {smartCompletionActive && !formData.vendor && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI is analyzing your input to suggest a value for this field</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {errors.vendor ? (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.vendor}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                For internal systems, specify the team or division
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalOwner">Internal Owner <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="internalOwner"
                name="internalOwner"
                placeholder="Who is responsible for this system?"
                value={formData.internalOwner}
                onChange={handleInputChange}
                className={`${errors.internalOwner ? "border-red-500" : ""} ${smartCompletionActive && !formData.internalOwner ? "border-blue-300 bg-blue-50/30" : ""}`}
                required
              />
              {smartCompletionActive && !formData.internalOwner && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ZapIcon className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI is analyzing your input to suggest a value for this field</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {errors.internalOwner ? (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.internalOwner}
              </p>
            ) : (
              <p className="text-sm text-gray-500">The person accountable for this system</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};