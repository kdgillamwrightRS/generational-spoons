'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search recipes...' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/recipes?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="ml-auto" style={{ maxWidth: '14rem', width: '100%' }}>
            <div className="relative" style={{ maxWidth: '14rem', width: '100%' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-1 text-white text-xs focus:outline-none shadow-xl placeholder-white/70 placeholder:text-xs h-5"
                    style={{
                        background: 'linear-gradient(to bottom, #666 0%, #444 100%)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                        borderRadius: 0,
                        height: '1.5rem',
                    }}
                />
                <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 hover:text-yellow-400 px-1 rounded-full transition-colors"
                    aria-label="Search"
                    style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem' }}
                >
                    <SearchIcon />
                </button>
            </div>
        </form>
    );
}

function SearchIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}
