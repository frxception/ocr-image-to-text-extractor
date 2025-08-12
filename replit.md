# OCR Text Extractor

## Overview

This is a web application that extracts text from images using Optical Character Recognition (OCR) technology. The application allows users to upload images (JPG, PNG, WEBP formats) and instantly extract all text, characters, and numbers using Tesseract.js. The application features a modern, responsive interface built with React and provides real-time processing feedback with confidence scores and text statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using modern React with TypeScript and follows a component-based architecture:

- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with shadcn/ui component library for consistent, modern design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Theme Support**: Built-in dark/light theme support with persistent storage

### Backend Architecture
The server follows a traditional Express.js REST API pattern:

- **Framework**: Express.js with TypeScript for the web server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Hot reloading with Vite integration for seamless development experience

### Component Structure
The frontend is organized into clear, reusable components:

- **UI Components**: Complete shadcn/ui component library including Select dropdown for enhanced interface consistency
- **Feature Components**: Specialized components for upload handling with integrated image preview, results display, features showcase, enhancement toolbar, and animated loading states
- **Enhancement Toolbar**: Compact, professional toolbar interface with dropdown controls for image processing settings
- **Image Viewer**: Advanced pan/zoom component for detailed image inspection with mouse wheel and button controls
- **Text Search**: Real-time search and highlighting within extracted text with match navigation
- **Crop Tool**: Interactive image cropping functionality that re-runs OCR on selected areas to update extracted text
- **Pre-processing Crop**: Optional image cropping before enhancement and OCR processing for focused text extraction
- **Saved Texts Manager**: Local storage system for saving, organizing, and managing extracted text results with search and export capabilities
- **Layout Components**: Header with theme switching, responsive design patterns
- **Custom Hooks**: Advanced OCR processing with image enhancement, theme management, mobile detection

### OCR Processing
The application uses advanced client-side OCR processing with intelligent image enhancement:

- **Engine**: Tesseract.js for in-browser text recognition with optimized parameters
- **Image Enhancement**: Multi-level preprocessing system (None, Light, Medium, Strong) for better text recognition
- **Preprocessing Features**: Contrast enhancement, brightness adjustment, grayscale conversion, adaptive thresholding, and sharpening filters
- **Processing**: Client-side execution means images never leave the user's device
- **Progress Tracking**: Real-time progress indicators with detailed stage descriptions and animated loading states
- **Result Analytics**: Provides confidence scores, word count, character count, and line count
- **Visual Comparison**: Side-by-side display of original vs enhanced images used for OCR
- **Data Persistence**: Automatic saving of extraction results to localStorage with full management interface

### Data Storage
The application is configured for PostgreSQL with a clean schema design:

- **Database**: PostgreSQL with connection via Neon serverless
- **ORM**: Drizzle ORM with type-safe queries and migrations
- **Schema**: User management with username/password authentication
- **Storage Interface**: Abstracted storage layer with both memory and database implementations

### Development Workflow
The project uses modern development practices:

- **Hot Reloading**: Vite provides instant feedback during development
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: Consistent formatting and linting setup
- **Build Process**: Optimized production builds with proper bundling

## External Dependencies

### Core Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Query for modern React development
- **UI Framework**: Radix UI primitives with shadcn/ui component system for accessible, customizable components
- **Styling**: TailwindCSS for utility-first styling with custom design tokens
- **OCR Engine**: Tesseract.js for client-side optical character recognition
- **File Handling**: react-dropzone for intuitive drag-and-drop file uploads

### Backend Infrastructure
- **Web Server**: Express.js for HTTP server and API routing
- **Database**: Neon Serverless PostgreSQL for scalable database hosting
- **ORM**: Drizzle ORM with Drizzle Kit for database schema management and migrations
- **Session Storage**: connect-pg-simple for PostgreSQL-backed session management

### Development Tools
- **Build System**: Vite for fast development server and optimized production builds
- **Runtime**: Node.js with ESM modules for modern JavaScript execution
- **TypeScript**: Full type safety across the entire application stack
- **Code Quality**: ESBuild for fast TypeScript compilation and bundling

### Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Class Management**: clsx and class-variance-authority for conditional CSS classes
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation
- **Validation**: Zod for schema validation with Drizzle integration
- **Icons**: Lucide React for consistent icon system throughout the application