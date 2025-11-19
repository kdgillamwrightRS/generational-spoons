
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNavigationLinks } from '@/lib/data/config';

type NavigationLink = { label: string; href: string };
const NAV_LINKS: NavigationLink[] = [
    { label: 'Recipes', href: '/recipes' },
    { label: 'About', href: '/about' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>(NAV_LINKS);

    // Optionally fetch dynamic links if needed
    useEffect(() => {
        (async () => {
            try {
                const links = await getNavigationLinks();
                if (Array.isArray(links) && links.length > 0) {
                    setNavigationLinks(links);
                }
            } catch { }
        })();
    }, []);

    // Normalize pathname for comparison (remove trailing slash except for root)
    let normalizedPath = pathname;
    if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
    }

    return (
        <nav className="sticky top-0 z-50 bg-black shadow-sm" style={{ fontFamily: 'var(--font-caveat)' }}>
            <div className="w-full md:mx-auto">
                <div className="flex justify-between items-center h-16 w-full">
                    {/* Logo/Title */}
                    <Link href="/" className="text-lg font-bold text-amber-600 hover:text-amber-500 transition-colors">
                        Generational Spoons
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex gap-6">
                        {navigationLinks.map((link) => {
                            const isRecipes = link.href === '/recipes' && (normalizedPath === '/recipes' || normalizedPath.startsWith('/recipes/'));
                            const isAbout = link.href === '/about' && (normalizedPath === '/about' || normalizedPath.startsWith('/about/'));
                            const isActive = isRecipes || isAbout;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={
                                        isActive
                                            ? 'text-amber-600 font-bold transition-colors text-lg'
                                            : 'text-white hover:text-gray-300 font-medium transition-colors text-lg'
                                    }
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
