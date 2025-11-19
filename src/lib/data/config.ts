import { supabase } from '@/lib/supabase/server';
import { NavigationLink, SocialLink } from '@/lib/types';

/**
 * Configuration types matching database JSONB structure
 */
export interface HeroConfig {
    heading: string;
    subheading: string;
    imageUrl: string;
    imageAlt: string;
}

export interface FooterConfig {
    copyrightYear: number;
    copyrightText: string;
    socialLinks: SocialLink[];
}

export interface SiteMetadata {
    title: string;
    description: string;
    keywords: string[];
}

/**
 * Fallback configurations (used if database is unavailable)
 */
const FALLBACK_HERO_CONFIG: HeroConfig = {
    heading: 'Welcome to Generational Spoons',
    subheading: 'Preserving family recipes, one dish at a time',
    imageUrl: 'https://placehold.co/1920x1080/e2e8f0/1e293b?text=Family+Kitchen&font=roboto',
    imageAlt: 'Family cooking together in a warm kitchen',
};

const FALLBACK_NAVIGATION_LINKS: NavigationLink[] = [
    { label: 'Recipes', href: '/recipes' },
    { label: 'About', href: '/about' },
];

const FALLBACK_FOOTER_CONFIG: FooterConfig = {
    copyrightYear: 2025,
    copyrightText: 'Created by Kayla Gillam-Wright',
    socialLinks: [
        {
            platform: 'linkedin',
            url: 'https://www.linkedin.com/in/kayla-gillam-wright',
            ariaLabel: 'LinkedIn profile',
        },
        {
            platform: 'portfolio',
            url: 'https://kaylagw.com',
            ariaLabel: 'Portfolio website',
        },
    ],
};

const FALLBACK_SITE_METADATA: SiteMetadata = {
    title: 'Generational Spoons',
    description: 'Preserving family recipes, one dish at a time',
    keywords: ['recipes', 'family', 'cooking', 'generational'],
};

/**
 * Generic config fetcher with fallback
 */
async function getConfig<T>(key: string, fallback: T): Promise<T> {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            // Only log on server-side (not in browser console)
            if (typeof window === 'undefined') {
                console.error(`Error fetching config '${key}':`, error);
            }
            return fallback;
        }

        return (data?.value as T) || fallback;
    } catch (error) {
        // Only log on server-side
        if (typeof window === 'undefined') {
            console.error(`Unexpected error fetching config '${key}':`, error);
        }
        return fallback;
    }
}

/**
 * Fetch hero section configuration
 * 
 * @returns Hero section config from database or fallback
 */
export async function getHeroConfig(): Promise<HeroConfig> {
    return getConfig<HeroConfig>('hero_section', FALLBACK_HERO_CONFIG);
}

/**
 * Fetch navigation links configuration
 * 
 * @returns Navigation links from database or fallback
 */
export async function getNavigationLinks(): Promise<NavigationLink[]> {
    return getConfig<NavigationLink[]>('navigation_links', FALLBACK_NAVIGATION_LINKS);
}

/**
 * Fetch footer configuration
 * 
 * @returns Footer config from database or fallback
 */
export async function getFooterConfig(): Promise<FooterConfig> {
    return getConfig<FooterConfig>('footer_config', FALLBACK_FOOTER_CONFIG);
}

/**
 * Fetch site metadata configuration
 * 
 * @returns Site metadata from database or fallback
 */
export async function getSiteMetadata(): Promise<SiteMetadata> {
    return getConfig<SiteMetadata>('site_metadata', FALLBACK_SITE_METADATA);
}

/**
 * Fetch all site configuration at once (for caching/optimization)
 * 
 * @returns Object with all configuration values
 */
export async function getAllSiteConfig() {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('key, value');

        if (error) {
            console.error('Error fetching all site config:', error);
            return {
                hero: FALLBACK_HERO_CONFIG,
                navigation: FALLBACK_NAVIGATION_LINKS,
                footer: FALLBACK_FOOTER_CONFIG,
                metadata: FALLBACK_SITE_METADATA,
            };
        }

        // Transform array to object keyed by config key
        const configMap = data?.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {} as Record<string, unknown>) || {};

        return {
            hero: (configMap.hero_section as HeroConfig) || FALLBACK_HERO_CONFIG,
            navigation: (configMap.navigation_links as NavigationLink[]) || FALLBACK_NAVIGATION_LINKS,
            footer: (configMap.footer_config as FooterConfig) || FALLBACK_FOOTER_CONFIG,
            metadata: (configMap.site_metadata as SiteMetadata) || FALLBACK_SITE_METADATA,
        };
    } catch (error) {
        console.error('Unexpected error fetching all site config:', error);
        return {
            hero: FALLBACK_HERO_CONFIG,
            navigation: FALLBACK_NAVIGATION_LINKS,
            footer: FALLBACK_FOOTER_CONFIG,
            metadata: FALLBACK_SITE_METADATA,
        };
    }
}
