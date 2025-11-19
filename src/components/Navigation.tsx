import Link from 'next/link';
import { getNavigationLinks } from '@/lib/data/config';

export default async function Navigation() {
    // Fetch navigation links from database (with fallback)
    const navigationLinks = await getNavigationLinks();

    return (
        <nav className="sticky top-0 z-50 bg-black shadow-sm" style={{ fontFamily: 'var(--font-caveat)' }}>
            <div className="w-full md:mx-auto">
                <div className="flex justify-between items-center h-16 w-full.    ">
                    {/* Logo/Title */}
                    <Link href="/" className="text-lg font-bold text-amber-600 hover:text-amber-500 transition-colors">
                        Generational Spoons
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex gap-6">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-white hover:text-gray-300 font-medium transition-colors text-lg"
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
