import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto py-4 px-4 sm:px-6 text-center text-sm text-neutral-500">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-3 md:mb-0">
          <span className="font-bold text-primary">SGH ASIA</span>
          <span className="font-medium hidden xs:inline">- EU AI Act Compliance</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="text-xs text-neutral-400 sm:mr-4 max-w-xs text-center sm:text-left">
            Compliant with EU AI Act, GDPR, PDPD of Vietnam and ISO 27001:2022
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-neutral-800 text-xs sm:text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-800 text-xs sm:text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      <div className="text-xs text-neutral-400 mt-3">
        © {new Date().getFullYear()} SGH ASIA. All rights reserved.
      </div>
      <div className="text-xs text-neutral-400 mt-1">
        Developed and maintained by the Information Technology & Security Division
      </div>
    </footer>
  );
}
import React from 'react';
import { Link } from 'wouter';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
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
      </div>
    </footer>
  );
};

export default Footer;
