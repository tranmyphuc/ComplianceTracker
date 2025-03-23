import { SystemRegistration } from "@/components/registration/system-registration";

export default function RegisterSystem() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Register AI System</h1>
        <p className="text-neutral-500 mt-1">Register and classify new AI systems for EU AI Act compliance</p>
      </div>
      
      <SystemRegistration />
    </div>
  );
}