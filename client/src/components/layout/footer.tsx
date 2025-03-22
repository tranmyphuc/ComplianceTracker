import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto py-4 px-6 text-center text-sm text-neutral-500">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <span className="font-bold text-primary">SGH ASIA</span>
          <span className="font-medium">- EU AI Act Compliance</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <div className="text-xs text-neutral-400 mr-4">
            Compliant with EU AI Act, GDPR, PDPD of Vietnam and ISO 27001:2022
          </div>
          <Link href="/privacy" className="hover:text-neutral-800">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-neutral-800">
            Terms of Service
          </Link>
        </div>
      </div>
      <div className="text-xs text-neutral-400 mt-2">
        Developed and maintained by the Information Technology & Security Division
      </div>
    </footer>
  );
}