import Image from 'next/image';
import SearchBar from './SearchBar';
import { HeroSectionProps } from '@/lib/types';

export default function HeroSection({ heroImage, welcomeMessage }: HeroSectionProps) {
    return (
        <section className="relative h-[40vh]">
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
                    <p
                        className="text-xl lg:text-2xl text-white/90 mb-1"
                        style={{
                            textShadow:
                                '0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,1), 0 0 2px #000, 0 0 1px #000',
                        }}
                    >
                        Welcome to
                    </p>
                    <h1
                        className="text-4xl lg:text-5xl font-bold text-white mb-2"
                        style={{
                            textShadow:
                                '0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,1), 0 0 2px #000, 0 0 1px #000',
                        }}
                    >
                        Generational Spoons
                    </h1>
                    <p
                        className="text-sm lg:text-xl text-white/90 mb-4"
                        style={{
                            textShadow:
                                '0 2px 8px rgba(0,0,0,0.95), 0 4px 24px rgba(0,0,0,1), 0 0 2px #000, 0 0 1px #000',
                        }}
                    >
                        {welcomeMessage.subheading}
                    </p>

                    {/* Search Bar */}
                    <div>
                        <SearchBar placeholder="Search recipes..." />
                    </div>
                </div>
            </div>
        </section>
    );
}
