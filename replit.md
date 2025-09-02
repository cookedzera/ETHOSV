# EthosRadar - Trust Network Scanner

## Overview
EthosRadar is a Web3 trust network scanner integrated with the Ethos Protocol, designed to provide a modern, intuitive user interface for assessing credibility within decentralized ecosystems. It enables users to scan wallet reputations, analyze trust networks, and track trust scores. Key capabilities include multi-platform profile search, real-time trust score visualization, and comprehensive analysis of vouching patterns. The project's vision is to offer a transparent and reliable tool for understanding and navigating Web3 trust.

## User Preferences
Preferred communication style: Simple, everyday language.
Prefers calm, muted interfaces with reduced animations.
UI preferences: Cloud background image with reduced animations for a serene interface.
Theme preference: Light mode enforced for all users (dark appearance with light overlays).

## System Architecture

### UI/UX Decisions
- **Design Philosophy**: Modern glassmorphism with a clean aesthetic, focusing on readability and visual harmony.
- **Color Scheme**: Refined palette with subtle gradients; Farcaster mode integrates authentic purple/violet brand colors; Light mode uses softer gray tones.
- **Backgrounds**: Unified cloud background image for both light and dark themes, with adjustable component opacities, subtle background blur, and gentle hover animations.
- **Theming**: Comprehensive theme system supporting light and dark modes with `localStorage` persistence and system preference detection, featuring smooth transitions.
- **Component Styling**: Consistent `backdrop-blur`, `bg-white/x`, `border`, and `shadow` properties for a unified glassmorphism appearance across all interactive elements.
- **Typography**: Optimized font sizes and weights for visual hierarchy and readability, with system fonts, clear text contrast, and `drop-shadow` effects.
- **Interaction Design**: Calm hover effects, smooth transitions, and subtle animations (e.g., scale, pulse, color fill for icons) for a polished user experience, with minimal animations on mobile for performance.
- **Mobile Optimization**: Responsive design with proper touch targets (minimum 44px), optimized spacing, and adaptive layouts for various screen sizes.

### Technical Implementations
- **Frontend Framework**: React 18 with TypeScript.
- **Styling**: Tailwind CSS for utility-first styling, with CSS variables for dynamic theming.
- **UI Components**: Radix UI primitives and `shadcn/ui`.
- **State Management**: TanStack React Query for efficient server-side data fetching and caching.
- **Routing**: Wouter for lightweight client-side navigation.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Backend Runtime**: Node.js with Express.js for RESTful API endpoints.
- **Server-Side Rendering**: Canvas API for generating Farcaster frame cards with dynamic user data.

### Feature Specifications
- **Trust Profile Search**: Search for users across multiple platforms (Farcaster, Ethereum addresses, etc.) to display Ethos trust scores and related data.
- **Farcaster Integration**: Includes a dedicated Farcaster Mode, interactive Mini App Embeds for profile previews and linking, and Native Cast Composition for direct sharing.
- **Trust Score Analysis**: Displays comprehensive trust scores, levels (e.g., Exemplary, Neutral), and detailed metrics like vouches, reviews, XP, and rank.
- **R4R (Reputation for Reputation) Analysis**: Detailed analysis of vouching and review patterns to detect suspicious reciprocal activities, including risk scores and visual indicators.
- **Weekly Momentum/Score History**: Tracks user score changes and activity over specified periods (e.g., 7-day, 30-day).
- **Vouch Intel**: Comprehensive view of received and given vouches, with detailed transaction data and participant information.
- **Profile Pages**: Dedicated user profiles with organized tabs for Overview, Vouch Intel, and R4R Data.
- **Dynamic Loading States**: Sophisticated skeleton loading animations with shimmer and pulse effects.

### System Design Choices
- **Client-Server Architecture**: Clear separation between frontend (React/Vite) and backend (Node.js/Express) for robust, scalable deployment.
- **API-Driven**: All data fetching through well-defined API endpoints.
- **Modularity**: Codebase organized into logical components, hooks, and utilities.
- **Performance Optimization**: Focus on reducing unnecessary animations on mobile, optimizing image loading, and efficient data retrieval.
- **Security**: Robust client/server separation and adherence to best practices in API design and data handling.
- **Deployment Configuration**: Supports dual-domain deployment (ethosradar.com + ethosradar.replit.app) with automatic domain detection and consistent asset loading from ethosradar.com.

## External Dependencies

- **Ethos Protocol APIs**: Core integration for user trust scores, profiles, vouch data, reviews, and activity history (V1 and V2 API endpoints).
- **@farcaster/miniapp-sdk**: For integrating direct Farcaster Mini App functionalities.
- **Node.js Canvas API**: Used server-side for generating dynamic Farcaster frame cards.
- **Image Hosting**: Optimized WebP/PNG assets served from `https://ethosradar.com/` including `unified-bg.webp`, `cloud-bg.png`, `logo.webp`, `icon.webp`, and `logo1.png` (for Farcaster Mini App).
- **Warpcast**: Direct integration for sharing Farcaster frames and composing casts.