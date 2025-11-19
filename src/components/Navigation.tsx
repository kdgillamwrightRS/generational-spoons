import Link from 'next/link';
import { getNavigationLinks } from '@/lib/data/config';

export default async function Navigation() {
    // Fetch navigation links from database (with fallback)
    const navigationLinks = await getNavigationLinks();

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Title */}
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        Generational Spoons
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex gap-6">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
