# Compass Elevators website and content manager

## Goal
Build the complete Compass Elevators public website and a simple protected content manager. The visual identity will follow the supplied navy, blue, white, and restrained red brand direction while remaining original and distinct from the reference website.

## Public website
- Create a shared responsive header, mobile menu, footer, WhatsApp shortcut, call actions, and quote prompts.
- Build dedicated pages for Home, About, Elevators, Services, Projects, Contact, Privacy, and Request a Quote.
- Add individual detail pages for each elevator type and service.
- Use the provided company details and approved copy without inventing experience figures, certifications, clients, testimonials, warranties, or performance promises.
- Create cohesive elevator-specific photography and visual details where the flyer cannot supply suitable wide-format imagery.
- Add responsive layouts, accessible controls, restrained motion, loading/empty/error states, and unique social/SEO metadata for every public page.

## Enquiries
- Build the mobile-friendly four-step quote form with validation, optional private attachment, consent, and a readable enquiry reference.
- Build the contact form with validation requiring a phone number or email.
- Store submissions securely and show polished success and failure feedback.

## Content manager
- Add email/password admin sign-in with no public registration.
- Protect all management pages and validate administrator access on the server.
- Provide a practical dashboard plus management screens for quote requests, contact messages, homepage content, services, elevator types, projects and galleries, testimonials, FAQs, media, SEO, and site settings.
- Support publishing, ordering, filtering, status changes, internal notes, image management, and hiding empty public sections.

## Data and security
- Enable Lovable Cloud for login, structured content, enquiries, and file storage.
- Use separate administrator-role records; no separate personal profile table will be added because profile data was not requested.
- Apply strict access rules: visitors may read published content and submit forms, while only administrators may manage content or view enquiries and private attachments.
- Keep data access behind service modules so a future Laravel/MySQL API can replace the current implementation without rewriting pages.
- Create public media storage and private quote-attachment storage with appropriate restrictions.

## Quality checks
- Verify navigation and key interactions at desktop, tablet, and mobile sizes.
- Test forms, validation, authentication boundaries, management workflows, and attachment privacy.
- Resolve build/runtime issues and check for overflow, missing states, accessibility problems, and broken links.

## Technical details
- Keep the existing TanStack Start routing stack while meeting the requested React, TypeScript, Tailwind, React Hook Form, Zod, and TanStack Query requirements.
- Use relational, migration-friendly tables and literal starter content for the supplied elevator types, services, FAQs, and generic project examples.
- Use semantic design tokens in the global design system, with Manrope headings and a highly readable sans-serif body face.
