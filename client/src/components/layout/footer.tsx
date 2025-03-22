import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto py-4 px-6 text-center text-sm text-neutral-500">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          &copy; {new Date().getFullYear()} SGH ASIA Ltd. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <div className="text-xs text-neutral-400 mr-4">
            Compliant with EU AI Act, GDPR, PDPD of Vietnam and ISO 27001:2022
          </div>
          <Link href="/privacy">
            <a className="hover:text-neutral-800">Privacy Policy</a>
          </Link>
          <Link href="/terms">
            <a className="hover:text-neutral-800">Terms of Service</a>
          </Link>
        </div>
      </div>
      <div className="text-xs text-neutral-400 mt-2">
        This web app built by IT Infra and Security Department
      </div>
    </footer>
  );
}
