// FilterDropdown.js (Do NOT include 'use client' here)

import { useState } from 'react';

// TypeScript interfaces removed for JavaScript compatibility

export default function FilterDropdown({
    label,
    options,
    initialValue,
    onSelect,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(initialValue);

    const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || options[0].label;

    const handleSelect = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
        if (onSelect) onSelect(value);
    };

    // Set a fixed width for the dropdown and menu (further reduced width)
    const fixedWidth = 'w-20'; // Tailwind: 5rem (adjust as needed)
    return (
        <div className="relative h-7 flex items-center">
            {/* LABEL */}
            <span className="text-[12px] font-bold text-black uppercase h-7 flex items-center pr-1">
                {label}
            </span>

            {/* CUSTOM SELECT BUTTON */}
            <button
                type="button"
                className={`text-[12px] font-medium text-white px-2 py-0.5 h-5 shadow-sm appearance-none flex items-center justify-between bg-linear-to-b from-[#666] to-[#444] ${fixedWidth}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="dropdown-menu"
                aria-haspopup="listbox"
            >
                <span className="truncate w-full">{selectedLabel}</span>
                {/* Custom Dropdown Arrow */}
                <span className={`transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} style={{ fontSize: '0.35em' }}>
                    <svg width="7" height="4" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {/* CUSTOM DROPDOWN MENU - Positioned with top-full */}
            {isOpen && (
                <ul
                    id="dropdown-menu"
                    role="listbox"
                    className={`absolute top-full right-0 z-10 mt-[-5] shadow-lg bg-linear-to-b from-[#666] to-[#444] ${fixedWidth}`}
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === selectedValue}
                            className={`text-[10px] px-3 py-1 cursor-pointer hover:bg-gray-600/60 ${option.value === selectedValue ? 'bg-gray-700 font-bold' : 'font-medium'} text-white`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}