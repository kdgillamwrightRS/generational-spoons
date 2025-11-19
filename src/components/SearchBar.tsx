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
        <form onSubmit={handleSearch} className="w-3/5 mx-auto">
            <div className="relative max-w-lg mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="text-black w-full px-2 text-sm xl:text-md focus:outline-none shadow-lg bg-white/60 backdrop-blur-xl border border-white/40"
                />
                <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 hover:text-blue-600 px-1 rounded-full transition-colors"
                    aria-label="Search"
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
