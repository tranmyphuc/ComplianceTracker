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