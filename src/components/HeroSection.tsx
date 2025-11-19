import Image from 'next/image';
import SearchBar from './SearchBar';
import { HeroSectionProps } from '@/lib/types';

export default function HeroSection({ heroImage, welcomeMessage }: HeroSectionProps) {
    return (
        <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
            {/* Hero Image */}
            <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />

            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl">
                    {/* Welcome Message */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        {welcomeMessage.heading}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                        {welcomeMessage.subheading}
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <SearchBar placeholder="Search recipes..." />
                    </div>
                </div>
            </div>
        </section>
    );
}
