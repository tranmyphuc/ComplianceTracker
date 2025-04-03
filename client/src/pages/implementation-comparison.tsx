import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  ArrowLeft
} from "lucide-react";

export default function ImplementationComparisonPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Implementation Approach Comparison</h1>
          <p className="text-muted-foreground mt-2">
            Traditional Development vs. AI Agent Implementation
          </p>
        </div>
        <Link href="/business-plan">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Business Plan</span>
          </Button>
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Implementation Approach Comparison</CardTitle>
          <CardDescription>
            Traditional Development vs. AI Agent Implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Introduction section with visual elements */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-ping"></div>
                  <div className="relative flex items-center justify-center h-full w-full bg-blue-100 rounded-full">
                    <BarChart3 className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Strategic Implementation Analysis</h3>
                <p className="text-sm text-blue-700">
                  We've conducted a comprehensive analysis of two distinct approaches to implementing the EU AI Act Compliance Platform. 
                  The AI-driven approach offers significant advantages in speed, cost, and adaptability over traditional development methodologies, 
                  with potential for up to <span className="font-medium">47% faster time-to-market</span> and <span className="font-medium">32% cost reduction</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Development Time & Cost */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b">
                <h3 className="font-medium text-blue-800">Development Timeline & Resources</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-4 py-2 text-left">Aspect</th>
                      <th className="border px-4 py-2 text-left">Traditional Development</th>
                      <th className="border px-4 py-2 text-left">AI Agent Implementation</th>
                      <th className="border px-4 py-2 text-left">Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-muted/30">
                      <td className="border px-4 py-2 font-medium">Development Time</td>
                      <td className="border px-4 py-2 text-muted-foreground">12-18 months for full functionality</td>
                      <td className="border px-4 py-2 text-muted-foreground">6-9 months with AI-accelerated development</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Development Cost</td>
                      <td className="border px-4 py-2 text-muted-foreground">€1.8-2.2M for complete platform</td>
                      <td className="border px-4 py-2 text-muted-foreground">€1.2-1.5M with AI efficiencies</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border px-4 py-2 font-medium">Team Size</td>
                      <td className="border px-4 py-2 text-muted-foreground">15-20 full-time specialists</td>
                      <td className="border px-4 py-2 text-muted-foreground">8-12 specialists with AI assistance</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Maintenance Cost</td>
                      <td className="border px-4 py-2 text-muted-foreground">25-30% of initial development cost annually</td>
                      <td className="border px-4 py-2 text-muted-foreground">15-20% of initial cost with self-improving AI</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          
            {/* Technical Implementation */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b">
                <h3 className="font-medium text-blue-800">Technical Implementation Factors</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-4 py-2 text-left">Aspect</th>
                      <th className="border px-4 py-2 text-left">Traditional Development</th>
                      <th className="border px-4 py-2 text-left">AI Agent Implementation</th>
                      <th className="border px-4 py-2 text-left">Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-muted/30">
                      <td className="border px-4 py-2 font-medium">Technical Complexity</td>
                      <td className="border px-4 py-2 text-muted-foreground">Higher initial complexity requiring specialized expertise</td>
                      <td className="border px-4 py-2 text-muted-foreground">Reduced complexity through AI-powered abstractions</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Integration Complexity</td>
                      <td className="border px-4 py-2 text-muted-foreground">Custom code for each integration point</td>
                      <td className="border px-4 py-2 text-muted-foreground">AI-assisted adaptors and intelligent mapping</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border px-4 py-2 font-medium">Architecture Flexibility</td>
                      <td className="border px-4 py-2 text-muted-foreground">Fixed architecture with difficult modifications</td>
                      <td className="border px-4 py-2 text-muted-foreground">Modular architecture with AI-driven components</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Technology Stack</td>
                      <td className="border px-4 py-2 text-muted-foreground">Conventional full-stack development</td>
                      <td className="border px-4 py-2 text-muted-foreground">AI-enhanced stack with foundation models</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          
            {/* Business & Compliance Factors */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b">
                <h3 className="font-medium text-blue-800">Business & Compliance Factors</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-4 py-2 text-left">Aspect</th>
                      <th className="border px-4 py-2 text-left">Traditional Development</th>
                      <th className="border px-4 py-2 text-left">AI Agent Implementation</th>
                      <th className="border px-4 py-2 text-left">Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-muted/30">
                      <td className="border px-4 py-2 font-medium">Adaptability</td>
                      <td className="border px-4 py-2 text-muted-foreground">Limited ability to adapt to changing requirements</td>
                      <td className="border px-4 py-2 text-muted-foreground">High adaptability with AI-driven dynamic components</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Regulatory Updates</td>
                      <td className="border px-4 py-2 text-muted-foreground">Manual monitoring and code updates</td>
                      <td className="border px-4 py-2 text-muted-foreground">Automated monitoring with AI-suggested updates</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border px-4 py-2 font-medium">Knowledge Base</td>
                      <td className="border px-4 py-2 text-muted-foreground">Content from legal experts (€180-220/hour)</td>
                      <td className="border px-4 py-2 text-muted-foreground">AI-assisted content generation with expert review</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Documentation</td>
                      <td className="border px-4 py-2 text-muted-foreground">High quality but standardized templates</td>
                      <td className="border px-4 py-2 text-muted-foreground">High quality with intelligent context adaptation</td>
                      <td className="border px-4 py-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          AI Approach
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          
            {/* Benefits and Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" /> 
                  AI Implementation Benefits
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-blue-700">47% faster time-to-market with AI-accelerated development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-blue-700">32% reduction in total development costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-blue-700">60% reduction in regulatory update implementation time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-blue-700">75% reduction in knowledge base content creation costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-blue-700">Enhanced ability to scale with changing regulatory requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-blue-700">Significant reduction in manual compliance documentation work</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-3 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  AI Implementation Challenges
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-amber-700">Requires specialized AI engineering expertise</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-amber-700">Need for robust AI/human collaboration workflows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-amber-700">Close attention to AI-generated content quality control</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-amber-700">Additional testing required for AI-powered components</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-amber-700">Ensuring data privacy and security in AI processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-amber-700">Managing AI model API costs and dependencies</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Implementation Approach Visualization */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-blue-800">Speed-Focused (AI-First)</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 text-xl">6-7</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Months</p>
                      <p className="text-xs text-muted-foreground">To MVP Launch</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Maximum AI automation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>75% content AI-generated</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Parallel tracks development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">⚠</span>
                      <span className="text-amber-700">Higher initial API costs</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-blue-800">Balanced Approach</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 text-xl">9-10</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Months</p>
                      <p className="text-xs text-muted-foreground">To MVP Launch</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Strategic AI integration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>50% content AI-assisted</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Optimal quality/speed ratio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Moderate API costs</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-blue-800">Cost-Focused Approach</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 text-xl">12-14</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Months</p>
                      <p className="text-xs text-muted-foreground">To MVP Launch</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Minimal API dependencies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>25% content AI-assisted</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Sequential development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Lowest initial investment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}