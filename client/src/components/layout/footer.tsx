import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200 py-4 px-6 text-sm text-neutral-600">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-3 sm:mb-0">
          © {currentYear} SGH ASIA Ltd. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary hover:underline">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-primary hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;