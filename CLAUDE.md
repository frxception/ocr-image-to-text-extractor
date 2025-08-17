# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is an **Image-to-Text OCR Extractor** web application with a React frontend and Express.js backend. The application processes images client-side using Tesseract.js for optical character recognition.

### Stack Overview
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components + TailwindCSS
- **OCR**: Tesseract.js (client-side processing)
- **State**: React Query for server state

### Key Architecture Patterns
- **Monorepo structure**: Client and server in same repository with shared schema
- **Client-side OCR**: All image processing happens in browser (privacy-focused)
- **Component composition**: Heavy use of shadcn/ui + custom feature components
- **Hook-based logic**: Custom hooks for OCR (`use-ocr.tsx`), theme, saved texts
- **Type-safe API**: Shared schema between client/server via `shared/schema.ts`

## Development Commands

```bash
# Development (runs both client and server with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Linting and formatting (using Biome)
npm run lint          # Check for linting issues
npm run lint:fix      # Fix auto-fixable linting issues
npm run format        # Format code
npm run format:check  # Check formatting without fixing

# Database operations
npm run db:push
```

## Key Files & Components

### Core OCR Logic
- `client/src/hooks/use-ocr.tsx` - Main OCR processing with image enhancement
- `client/src/components/upload-area.tsx` - File upload and processing UI
- `client/src/components/image-viewer.tsx` - Pan/zoom image viewer
- `client/src/components/enhancement-toolbar.tsx` - OCR settings controls

### Data Management
- `shared/schema.ts` - Database schema and validation types
- `client/src/hooks/use-saved-text.tsx` - Local storage for extracted text
- `server/storage.ts` - Database abstraction layer

### UI System
- `client/src/components/ui/` - Complete shadcn/ui component library
- `client/src/components/theme-provider.tsx` - Dark/light theme support
- `client/src/lib/utils.ts` - Utility functions and styling helpers

## Image Processing Features

The application includes sophisticated client-side image enhancement:
- **Enhancement levels**: None, Light, Medium, Strong preprocessing
- **Character focus**: Optimized for text, numbers, or mixed content
- **Crop functionality**: Interactive cropping before OCR processing
- **Real-time preview**: Side-by-side original vs enhanced image comparison

## Database Schema

Simple user management schema in PostgreSQL:
```sql
users table: id (UUID), username (unique), password
```

## Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## Development Notes

- Server runs on development mode with `tsx` for TypeScript execution
- Client uses Vite for fast HMR and optimized builds
- Build process bundles server with esbuild for production deployment
- All OCR processing is client-side - images never leave user's device
- Database connection via Neon serverless PostgreSQL