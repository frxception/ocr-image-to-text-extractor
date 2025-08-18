# Image-to-Text OCR Extractor

A modern, privacy-focused web application that performs optical character recognition (OCR) on images entirely in the browser using advanced client-side processing. Built with React, TypeScript, and Tesseract.js.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [OCR Processing Pipeline](#ocr-processing-pipeline)
- [Image Enhancement](#image-enhancement)
- [Development](#development)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

This Image-to-Text OCR Extractor is a full-stack web application designed to convert images containing text into editable text format. The application prioritizes user privacy by processing all images locally in the browser without uploading them to any server.

### Why This Application Was Created

**Privacy-First Approach**: Traditional OCR services require uploading images to external servers, raising privacy concerns for sensitive documents. This application solves this by processing everything client-side.

**Advanced Image Enhancement**: Many images contain poor contrast, noise, or suboptimal lighting that affects OCR accuracy. Our application includes sophisticated preprocessing algorithms to enhance images before text extraction.

**User Experience Focus**: Designed with a modern, intuitive interface that supports both light and dark themes, drag-and-drop functionality, and real-time processing feedback.

**Developer-Friendly Architecture**: Built with modern TypeScript, comprehensive component architecture, and scalable patterns for easy maintenance and feature expansion.

## Features

### Core OCR Capabilities
- **Client-side Processing**: All OCR operations happen in the browser using Tesseract.js
- **Multiple Image Formats**: Support for PNG, JPG, JPEG, GIF, BMP, and WebP
- **Real-time Progress Tracking**: Live updates during image processing stages
- **High Accuracy**: Advanced preprocessing and character recognition optimization

### Image Enhancement Engine
- **Four Enhancement Levels**:
  - **None**: Process original image without modification
  - **Light**: Minimal enhancement for good quality images
  - **Medium**: Balanced enhancement for average quality images (default)
  - **Strong**: Maximum enhancement for difficult/poor quality images

- **Character Focus Modes**:
  - **All Characters**: Extract all text including symbols and punctuation
  - **Alphanumeric**: Focus on letters and numbers only
  - **Numbers**: Extract numeric content only

### Advanced Image Processing
- **Grayscale Conversion**: Optimized luminance formula for better text recognition
- **Contrast Enhancement**: Dynamic contrast adjustment based on enhancement level
- **Sharpening Filters**: Convolution-based sharpening for medium and strong enhancement
- **Noise Reduction**: Intelligent preprocessing to reduce image artifacts

### User Interface Features
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Image Viewer**: Interactive pan and zoom functionality for uploaded images
- **Side-by-Side Comparison**: View original and enhanced images simultaneously
- **Results Panel**: Comprehensive text output with statistics
- **Text Management**: Save, search, and manage extracted text locally
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Optimized for desktop and mobile devices

## Architecture

### System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server  │    │   PostgreSQL    │
│                 │    │                  │    │    Database     │
│ • OCR Engine    │───▶│ • API Routes     │───▶│                 │
│ • Image Enhance │    │ • Authentication │    │ • User Management│
│ • UI Components │    │ • Session Mgmt   │    │ • Text Storage  │
│ • State Mgmt    │    │ • Static Serving │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow Architecture

```
User Upload → Image Enhancement → OCR Processing → Text Extraction → Local Storage
     ↓              ↓                    ↓               ↓              ↓
File Validation → Preprocessing → Tesseract.js → Result Analysis → UI Update
```

### Component Architecture

The application follows a modular component architecture with clear separation of concerns:

- **Layout Components**: Header, theme providers, routing
- **Feature Components**: Upload area, image viewer, results section
- **UI Components**: Complete shadcn/ui component library
- **Hooks**: Custom hooks for OCR processing, theme management, and data persistence
- **Utilities**: Image processing, text manipulation, and validation functions

## Technology Stack

### Frontend
- **React 18**: Latest React with concurrent features and improved performance
- **TypeScript**: Full type safety across the entire application
- **Vite**: Fast build tool with hot module replacement
- **Tesseract.js 6.0**: Client-side OCR engine with WebAssembly support
- **shadcn/ui**: Modern, accessible component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Backend
- **Express.js**: Minimal, fast web framework for Node.js
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Modern, type-safe database toolkit
- **PostgreSQL**: Robust, ACID-compliant relational database
- **Passport.js**: Authentication middleware
- **Express Session**: Session management with PostgreSQL storage

### Development & Build Tools
- **Biome**: Fast linting and formatting tool
- **ESBuild**: Extremely fast JavaScript bundler for production
- **tsx**: TypeScript execution engine for development
- **Drizzle Kit**: Database migration and schema management
- **PostCSS**: CSS post-processing with Autoprefixer

### Infrastructure
- **Neon**: Serverless PostgreSQL database platform
- **Node.js**: JavaScript runtime environment
- **WebAssembly**: High-performance OCR processing

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- PostgreSQL database (local or cloud-based like Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-to-text-extractor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ocr_db
   SESSION_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
image-to-text-extractor/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # shadcn/ui component library
│   │   │   ├── enhancement-toolbar.tsx
│   │   │   ├── image-viewer.tsx
│   │   │   ├── upload-area.tsx
│   │   │   └── results-section.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── use-ocr.tsx   # Core OCR processing logic
│   │   │   ├── use-saved-text.tsx
│   │   │   └── use-theme.tsx
│   │   ├── pages/            # Application pages
│   │   │   ├── home.tsx      # Main application interface
│   │   │   └── not-found.tsx
│   │   ├── lib/              # Utility functions
│   │   │   ├── utils.ts      # General utilities
│   │   │   └── queryClient.ts
│   │   ├── App.tsx           # Root application component
│   │   └── main.tsx          # Application entry point
│   ├── index.html            # HTML template
│   └── package.json
├── server/                   # Express.js backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database abstraction layer
│   └── vite.ts              # Development server configuration
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema and types
├── package.json             # Project dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── drizzle.config.ts       # Database configuration
└── README.md               # This file
```

## Core Components

### OCR Processing Hook (`use-ocr.tsx`)

The heart of the application's OCR functionality:

**Key Features:**
- **Image Preprocessing**: Advanced enhancement algorithms for better recognition
- **Progress Tracking**: Real-time updates during processing stages
- **Character Filtering**: Focus on specific character types (all, alphanumeric, numbers)
- **Error Handling**: Comprehensive error management and user feedback

**Processing Pipeline:**
1. Image enhancement and preprocessing
2. Tesseract.js worker initialization
3. Character whitelist configuration
4. OCR recognition with progress tracking
5. Text post-processing and statistics calculation

### Upload Area Component (`upload-area.tsx`)

Handles file upload and validation:

**Features:**
- Drag and drop interface
- File type validation (images only)
- File size limits
- Visual feedback for upload states
- Error handling for invalid files

### Image Viewer Component (`image-viewer.tsx`)

Interactive image display component:

**Capabilities:**
- Pan and zoom functionality
- Side-by-side original vs enhanced comparison
- Responsive design for different screen sizes
- Smooth animations and transitions

### Enhancement Toolbar (`enhancement-toolbar.tsx`)

Controls for OCR processing options:

**Settings:**
- Enhancement level selection (none, light, medium, strong)
- Character focus mode (all, alphanumeric, numbers)
- Real-time preview of settings impact
- Processing trigger controls

## OCR Processing Pipeline

### 1. Image Preprocessing

The application implements sophisticated image enhancement algorithms:

```typescript
// Enhancement levels with specific algorithms
switch (enhancementLevel) {
  case "light":
    // Minimal enhancement for good quality images
    enhanced = (enhanced - 128) * 1.2 + 128 + 10;
    break;
  case "medium":
    // Balanced enhancement with binarization
    enhanced = (enhanced - 128) * 1.5 + 128 + 20;
    break;
  case "strong":
    // Maximum enhancement for difficult images
    enhanced = (enhanced - 128) * 2.0 + 128 + 30;
    break;
}
```

### 2. Grayscale Conversion

Uses optimized luminance formula for human vision:
```typescript
const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
```

### 3. Sharpening Filter

Applies convolution-based sharpening for medium and strong enhancement:
```typescript
const kernel = [0, -1, 0, -1, sharpenIntensity, -1, 0, -1, 0];
```

### 4. Character Recognition

Configures Tesseract.js with character whitelists:
- **All**: Full character set including symbols
- **Alphanumeric**: Letters and numbers only
- **Numbers**: Numeric characters, spaces, and basic punctuation

## Image Enhancement

The application provides four levels of image enhancement to optimize OCR accuracy:

### Enhancement Algorithms

1. **Contrast Adjustment**: Dynamic range expansion based on image statistics
2. **Brightness Normalization**: Automatic exposure correction
3. **Noise Reduction**: Statistical filtering to reduce image artifacts
4. **Edge Sharpening**: Convolution filtering to enhance text edges
5. **Binarization**: Intelligent thresholding for text/background separation

### Quality Optimization

- **Adaptive Processing**: Enhancement levels adapt to image characteristics
- **Preservation of Aspect Ratio**: Maintains original image proportions
- **Color Space Optimization**: Conversion to optimal grayscale representation
- **Anti-aliasing**: Smooth edge handling for better character recognition

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run check

# Linting and formatting
npm run lint          # Check for issues
npm run lint:fix      # Fix auto-fixable issues
npm run format        # Format code
npm run format:check  # Check formatting

# Database operations
npm run db:push       # Push schema changes

# Production build
npm run build
npm start
```

### Development Workflow

1. **Code Style**: Enforced by Biome with TypeScript-first configuration
2. **Type Safety**: Full TypeScript coverage with strict mode enabled
3. **Component Development**: shadcn/ui components with custom styling
4. **State Management**: React Query for server state, React hooks for local state
5. **Testing**: Manual testing workflow with development server

### Key Development Files

- `vite.config.ts`: Build configuration with path aliases
- `tailwind.config.ts`: Custom design system configuration
- `biome.json`: Linting and formatting rules
- `tsconfig.json`: TypeScript configuration
- `drizzle.config.ts`: Database configuration

## API Reference

### Authentication Endpoints

```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/user
```

### User Management

```typescript
GET  /api/user/profile
PUT  /api/user/profile
```

Note: The current implementation focuses on client-side OCR processing, with server endpoints primarily handling user authentication and session management.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

### Schema Types

```typescript
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}
```

## Deployment

### Production Environment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=<production-database-url>
   SESSION_SECRET=<secure-random-string>
   PORT=5000
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

### Performance Considerations

- **Bundle Size**: Optimized with tree shaking and code splitting
- **OCR Performance**: Client-side processing reduces server load
- **Caching**: React Query caching for API responses
- **Image Processing**: WebAssembly for high-performance OCR
- **Static Assets**: Efficient serving with Express static middleware

## Contributing

### Code Standards

1. **TypeScript**: All code must be fully typed
2. **Components**: Use functional components with hooks
3. **Styling**: Tailwind CSS with shadcn/ui components
4. **State Management**: React Query for server state, hooks for local state
5. **File Organization**: Follow established project structure

### Pull Request Process

1. Ensure all TypeScript checks pass (`npm run check`)
2. Run linting and formatting (`npm run lint:fix && npm run format`)
3. Test functionality thoroughly
4. Follow conventional commit message format
5. Update documentation as needed

### Development Environment

- Node.js 18+
- PostgreSQL database access
- Modern browser with WebAssembly support
- TypeScript/React development experience recommended

---

**Built with modern web technologies for privacy-focused OCR processing.**