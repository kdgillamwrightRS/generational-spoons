# Generational Spoons App Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)
Code MUST be readable, maintainable, and self-documenting. All code MUST follow consistent patterns: meaningful variable/function names, single responsibility principle, DRY (Don't Repeat Yourself), and clear separation of concerns. Comments MUST explain "why" not "what". TypeScript MUST be used with strict type checking enabled.

**Rationale**: Clean code reduces technical debt, improves maintainability, and enables faster development cycles.

### II. Simple UX (NON-NEGOTIABLE)
User interfaces MUST prioritize simplicity and intuitive navigation. Every user interaction MUST have a clear purpose and obvious outcome. Cognitive load MUST be minimized through clear visual hierarchy, consistent design patterns, and elimination of unnecessary features.

**Rationale**: Simple UX reduces user frustration and improves adoption rates.

### III. Responsive Design (NON-NEGOTIABLE)
All interfaces MUST work seamlessly across desktop, tablet, and mobile devices. Responsive breakpoints MUST be implemented using a mobile-first approach with Tailwind CSS. Performance MUST remain consistent across all device types.

**Rationale**: Multi-device compatibility is essential for modern web applications.

### IV. Structured Content & Data Integrity (NON-NEGOTIABLE)
Recipe data MUST be highly structured, separating ingredients, steps, and notes into distinct, queryable fields. Data entry MUST enforce consistency (e.g., standardizing units of measure). This ensures the longevity and maintainability of the family recipes.

**Rationale**: Preserving family history requires structured, consistent data.

### V. Minimal Dependencies (NON-NEGOTIABLE)
Dependencies MUST be justified and kept to an absolute minimum. Bundle size impact MUST be considered before adding any dependency.

**Rationale**: Minimal dependencies reduce security vulnerabilities, decrease bundle size, and improve build times.

### VI. No Testing Policy (NON-NEGOTIABLE)
This project MUST NOT include any automated testing: no unit tests, no integration tests, no end-to-end tests, no testing frameworks. Quality MUST be ensured through code reviews, clear documentation, and careful manual validation.

**Rationale**: Focus is on rapid development and simple functionality that can be validated manually.

## Technology Stack (Finalized)

The project MUST use the following technology stack:

- **Next.js**: Use the latest stable version (App Router required).
- **React**: Use the latest stable version.
- **Supabase**: MUST be used for all data persistence and authentication.
- **Tailwind CSS**: Use the latest stable version (for responsive design and styling).
- **TypeScript**: Use the latest stable version (with strict type checking).

## Governance

This constitution supersedes all other development practices and guidelines. Complexity MUST be justified against the minimal dependencies principle. When in doubt, choose the simpler solution.