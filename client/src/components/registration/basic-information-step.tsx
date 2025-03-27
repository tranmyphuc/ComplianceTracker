import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle } from "lucide-react";

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
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  formData,
  setFormData,
  departments = [],
  errors = {}
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">AI System Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter the system name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
              required
            />
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
          <Textarea
            id="description"
            name="description"
            placeholder="Provide a detailed description of the AI system"
            value={formData.description}
            onChange={handleInputChange}
            className={errors.description ? "border-red-500" : ""}
            rows={4}
            required
          />
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
          <Textarea
            id="purpose"
            name="purpose"
            placeholder="What is the intended purpose of this AI system?"
            value={formData.purpose}
            onChange={handleInputChange}
            className={errors.purpose ? "border-red-500" : ""}
            rows={3}
            required
          />
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
            <Input
              id="version"
              name="version"
              placeholder="e.g., 1.0, 2.3.1"
              value={formData.version}
              onChange={handleInputChange}
              className={errors.version ? "border-red-500" : ""}
              required
            />
            {errors.version && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.version}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange('department', value)}
            >
              <SelectTrigger id="department" className={errors.department ? "border-red-500" : ""}>
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
            <Label htmlFor="vendor">Vendor/Provider <span className="text-red-500">*</span></Label>
            <Select
              value={formData.vendor}
              onValueChange={(value) => handleSelectChange('vendor', value)}
            >
              <SelectTrigger id="vendor" className={errors.vendor ? "border-red-500" : ""}>
                <SelectValue placeholder="Select vendor or enter custom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SGH ASIA">SGH ASIA</SelectItem>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Microsoft">Microsoft</SelectItem>
                <SelectItem value="Anthropic">Anthropic</SelectItem>
                <SelectItem value="In-house">In-house Development</SelectItem>
                <SelectItem value="custom">Custom Vendor (Enter Below)</SelectItem>
              </SelectContent>
            </Select>
            {formData.vendor === "custom" && (
              <Input
                id="customVendor"
                name="customVendor"
                placeholder="Enter vendor name"
                value={formData.customVendor || ""}
                onChange={(e) => {
                  handleInputChange(e);
                  handleSelectChange('vendor', e.target.value);
                }}
                className="mt-2"
              />
            )}
            {errors.vendor ? (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.vendor}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                For internal systems, specify "In-house Development"
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalOwner">Internal Owner <span className="text-red-500">*</span></Label>
            <Input
              id="internalOwner"
              name="internalOwner"
              placeholder="Who is responsible for this system?"
              value={formData.internalOwner}
              onChange={handleInputChange}
              className={errors.internalOwner ? "border-red-500" : ""}
              required
            />
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