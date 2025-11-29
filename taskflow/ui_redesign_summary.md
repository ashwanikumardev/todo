# TaskFlow UI Redesign - Minimalist Edition

## Overview
Responding to feedback, we have completely stripped down the interface and rebuilt it with a strict **Minimalist / Monochrome** design philosophy. The focus is now entirely on content, typography, and whitespace, removing all decorative elements like gradients and glassmorphism.

## Key Changes

### 1. Design System (`globals.css`)
- **Monochrome Palette**: Strictly black, white, and grays.
- **Removed Effects**: No more heavy shadows, blurs, or gradients.
- **Typography**: Focus on 'Inter' with clean weights and tracking.

### 2. Dashboard (`src/app/page.tsx`)
- **Clean Layout**: A simple, centered list view with a minimal header.
- **Distraction-Free**: Removed stats cards and complex toolbars.
- **Focus**: The task list is the sole hero of the page.

### 3. Sidebar (`src/components/Sidebar.tsx`)
- **Flat Design**: Simple list navigation with subtle background changes for active states.
- **Clarity**: High-contrast icons and text.

### 4. Task Cards (`src/components/TaskCard.tsx`)
- **List Style**: Tasks are presented as clean rows rather than cards.
- **Subtle Indicators**: Priority is shown via a small dot, not a colored badge.
- **Readable**: Metadata is kept to a minimum to reduce noise.

### 5. Quick Add (`src/components/QuickAdd.tsx`)
- **Simplified**: A floating button that opens a clean, simple input field.
- **Efficiency**: Icon-only buttons for metadata to keep the interface uncluttered.

## Tech Stack
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4 (Minimal Configuration)
- **State**: Zustand
