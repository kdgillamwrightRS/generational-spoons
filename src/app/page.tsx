import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PopularRecipesSection from '@/components/PopularRecipesSection';
import Footer from '@/components/Footer';
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
        <>
            <Navigation />
            <main>
                <HeroSection {...heroData} />
                <PopularRecipesSection limit={6} />
            </main>
            <Footer />
        </>
    );
}
