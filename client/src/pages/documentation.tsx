import { DocumentCreator } from "@/components/documentation/document-creator";

export default function Documentation() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Documentation</h1>
        <p className="text-neutral-500 mt-1">Create and manage required EU AI Act documentation with AI assistance</p>
      </div>
      
      <DocumentCreator />
    </div>
  );
}