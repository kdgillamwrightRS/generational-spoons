import HeroSection from '@/components/HeroSection';
import PopularRecipesSection from '@/components/PopularRecipesSection';
import { getHeroConfig } from '@/lib/data/config';

export default async function HomePage() {
    // Fetch hero section configuration from database (with fallback)
    const heroConfig = await getHeroConfig();

    const heroData = {
        heroImage: {
            src: heroConfig.imageUrl,
            alt: heroConfig.imageAlt,
        },
        welcomeMessage: {
            heading: heroConfig.heading,
            subheading: heroConfig.subheading,
        },
    };

    return (
        <main className="">
            <HeroSection {...heroData} />
            <PopularRecipesSection limit={6} />
        </main>
    );
}
