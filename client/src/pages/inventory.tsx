import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SystemsTable } from "@/components/inventory/systems-table";

export default function Inventory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className={sidebarOpen ? "" : "hidden"} />
        
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-neutral-800">AI Systems Inventory</h1>
              <p className="text-neutral-500 mt-1">Manage and track all your AI systems</p>
            </div>
            
            <SystemsTable />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
