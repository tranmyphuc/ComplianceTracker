import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto py-4 px-6 text-center text-sm text-neutral-500">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          &copy; {new Date().getFullYear()} ComplianceAI. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <Link href="/privacy">
            <a className="hover:text-neutral-800">Privacy Policy</a>
          </Link>
          <Link href="/terms">
            <a className="hover:text-neutral-800">Terms of Service</a>
          </Link>
          <Link href="/support">
            <a className="hover:text-neutral-800">Support</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
