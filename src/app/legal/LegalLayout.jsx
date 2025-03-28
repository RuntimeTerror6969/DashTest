import Link from 'next/link';

export default function LegalLayout({ children, currentPage }) {
  const legalLinks = [
    { href: '/legal/terms', label: 'Terms & Conditions' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/refund', label: 'Refund Policy' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Top Navigation */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-primary/40">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-primary text-center mb-4">Legal</h2>
          <ul className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary whitespace-nowrap px-3 py-2 ${
                    currentPage === link.href ? 'text-primary dark:text-primary font-semibold' : ''
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="border-t border-border/40 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 