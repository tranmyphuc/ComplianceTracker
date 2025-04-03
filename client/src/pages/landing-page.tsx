import React from 'react';
import { Link } from 'wouter';
import { 
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Shield,
  ExternalLink,
  AlertCircle,
  LockKeyhole,
  FileCheck,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="EU AI Act Compliance Platform" 
              className="h-10 w-auto mr-3"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/200x80/e2e8f0/475569?text=AI+Compliance";
              }}
            />
            <h1 className="text-xl font-bold text-slate-900">EU AI Act Compliance</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="mr-2">
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Hero Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                EU AI Act Compliance
                <span className="text-blue-600 block">Made Simple</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                A comprehensive platform to navigate the complex requirements of the European Union's AI Act, ensuring compliance while minimizing costs and operational disruptions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/compliance-dashboard.png" 
                alt="EU AI Act Compliance Dashboard" 
                className="rounded-lg shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/475569?text=AI+Compliance+Dashboard";
                }}
              />
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Platform</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive tools and features to help your organization navigate the EU AI Act requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="rounded-full bg-blue-100 p-3 w-fit">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">Risk Assessment</CardTitle>
                  <CardDescription>
                    Comprehensive AI system risk evaluation aligned with EU AI Act requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automated risk classification</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Detailed mitigation recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Continuous monitoring capabilities</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="rounded-full bg-blue-100 p-3 w-fit">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">Documentation</CardTitle>
                  <CardDescription>
                    Generate compliant technical documentation for AI systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>EU AI Act compliant templates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automated document generation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Version control & audit trail</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="rounded-full bg-blue-100 p-3 w-fit">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">Compliance Monitoring</CardTitle>
                  <CardDescription>
                    Real-time tracking of compliance status and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Real-time compliance dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Regulatory updates integration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automated compliance alerts</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Business Benefits */}
        <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Benefits</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our platform delivers significant business value beyond compliance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Risk Reduction</h3>
                  <p className="text-slate-600">Minimize non-compliance penalties of up to €35M or 7% of annual turnover</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-3 mb-4">
                    <LockKeyhole className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Market Access</h3>
                  <p className="text-slate-600">Ensure your AI systems can legally operate within the EU market</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-purple-100 p-3 mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Cost Efficiency</h3>
                  <p className="text-slate-600">Reduce compliance costs by up to 65% compared to manual compliance processes</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-orange-100 p-3 mb-4">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Trust Building</h3>
                  <p className="text-slate-600">Demonstrate responsible AI practices to customers and stakeholders</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-blue-600 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to ensure your EU AI Act compliance?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join organizations across Europe that trust our platform for comprehensive AI governance and compliance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary">
                Request Demo <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                View Business Plan
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-slate-900 text-slate-400">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">EU AI Act Compliance</h3>
                <p className="mb-4">Comprehensive compliance solutions for organizations of all sizes.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Features</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Risk Assessment</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Compliance Monitoring</a></li>
                  <li><a href="#" className="hover:text-white">AI Knowledge Center</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">EU AI Act Guide</a></li>
                  <li><a href="#" className="hover:text-white">Implementation Toolkit</a></li>
                  <li><a href="#" className="hover:text-white">Case Studies</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-12 pt-8 text-center">
              <p>&copy; 2025 SGH ASIA. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}