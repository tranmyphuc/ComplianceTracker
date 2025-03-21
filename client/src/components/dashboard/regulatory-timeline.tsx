import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RegulatoryTimeline() {
  // Set up milestone dates
  const now = new Date();
  const aug2025 = new Date(2025, 7, 1);
  const feb2026 = new Date(2026, 1, 1);
  const aug2026 = new Date(2026, 7, 1);
  
  // Calculate months remaining
  const monthsUntilAug2025 = Math.round((aug2025.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const monthsUntilFeb2026 = Math.round((feb2026.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const monthsUntilAug2026 = Math.round((aug2026.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  // Determine current position in timeline (for this example, just setting fixed progress)
  const currentProgress = 16; // px from top, adjust as needed
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium text-neutral-800">Regulatory Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-0 left-4 w-0.5 h-full bg-neutral-200"></div>
          
          {/* Current Progress Marker */}
          <div className="absolute top-16 left-4 w-12 h-0.5 bg-primary"></div>
          
          {/* Timeline Items */}
          <div className="space-y-6 pl-12 relative">
            {/* Aug 2025 */}
            <div className="relative">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-white"></div>
              <div className="bg-neutral-100 p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-neutral-800">Aug 2025</span>
                  <span className="text-xs text-neutral-500">In {monthsUntilAug2025} months</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Initial compliance deadline for high-risk AI systems
                </p>
              </div>
            </div>
            
            {/* Feb 2026 */}
            <div className="relative">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-neutral-300 bg-white"></div>
              <div className="bg-neutral-100 p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-neutral-800">Feb 2026</span>
                  <span className="text-xs text-neutral-500">In {monthsUntilFeb2026} months</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Extended compliance for providers with limited risk systems
                </p>
              </div>
            </div>
            
            {/* Aug 2026 */}
            <div className="relative">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-neutral-300 bg-white"></div>
              <div className="bg-neutral-100 p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-neutral-800">Aug 2026</span>
                  <span className="text-xs text-neutral-500">In {monthsUntilAug2026} months</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Full enforcement of the AI Act across all categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
