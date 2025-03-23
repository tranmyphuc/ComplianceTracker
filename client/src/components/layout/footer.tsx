import React from 'react';
import { Link } from 'wouter';
import { Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            <span className="font-semibold">SGH ASIA</span>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-400 mb-2">
              Compliant with EU AI Act, GDPR, PDPA of Vietnam and ISO 27001:2022
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link href="/privacy-policy" className="text-slate-300 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-slate-300 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="text-slate-400">
                © {currentYear} SGH ASIA. All rights reserved.
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 text-center mt-3">
          Developed and maintained by the Information Technology & Security Division
        </div>
      </div>
    </footer>
  );
}
