# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **MapleStory HP/MP Washing Calculator** - a Next.js 16 application that helps players visualize and calculate HP/MP washing mechanics for different character classes. The app simulates character progression from level 5 to 200, showing how HP, MP, and INT evolve based on washing strategies.

## Development Commands

```bash
# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture & Key Concepts

### Core Calculation System

The application implements MapleStory's HP/MP washing formulas, which are class-specific calculations for character stat growth:

- **HP/MP Base Calculations** (`app/utils/hp-mp-helper.ts`):
  - `getHP()`: Calculates base HP for a job at a given level, including job advancement bonuses
  - `getMP()`: Calculates base MP for a job at a given level with INT consideration
  - `getMinimumMP()`: Returns the minimum MP required at a level (used to determine washing capacity)
  - `getQuestHP()`: Calculates HP bonuses from HP quests (Water of Life, Olaf quests)

- **Washing Mechanics** (`app/utils/wash-helper.ts`):
  - `getAPResetsHPWash()`: Determines how many AP resets can be performed based on available MP
  - `getHPGainByAP()`: Calculates HP gained per AP reset (varies by class and fresh/used AP)
  - `getMPLossByAP()`: Calculates MP lost per AP reset (class-specific)
  - `MP_LOSS_PER_WASH`: Constant defining MP cost per wash for each job

### Job System

Jobs are defined in `app/models/job.ts` with the following hierarchy:
- Warriors: Dark Knight, Paladin, Hero
- Thieves: Night Lord, Shadower
- Pirates: Corsair, Buccaneer
- Archers: Bowmaster, Marksman
- Magicians: Magician class
- Beginner: Base class

Each job has unique formulas for HP/MP gain rates, washing efficiency, and advancement bonuses.

### Component Structure

- **UI Components** (`components/ui/`):
  - Built with [shadcn/ui](https://ui.shadcn.com/) - a collection of re-usable components built using Radix UI and Tailwind CSS
  - Components are copied into the project (not installed as dependencies) for full customization
  - Available components: Button, Card, Select (more can be added via `npx shadcn@latest add [component]`)
  - Each component uses `class-variance-authority` (CVA) for variant management
  - Fully typed with TypeScript and accessible via Radix UI primitives
- **Logical Components** (`components/logical/`):
  - `job-select.tsx`: Job selection dropdown
  - `graph.tsx`: Recharts-based visualization of HP/MP/INT progression

### Data Flow

The main page (`app/page.tsx`) manages:
1. **State**: Selected job and target INT
2. **Chart Data Generation**: Simulates leveling from 5→200, calculating:
   - Base HP/MP at each level
   - Available washing (based on MP surplus)
   - HP gains and MP losses from washing
   - INT progression towards target
3. **Visualization**: Passes calculated data to Graph component

## Path Aliases

TypeScript paths are configured with `@/*` pointing to the root directory:
- `@/app/models/*` - Data models (Job, HPQuest)
- `@/app/utils/*` - Calculation utilities
- `@/components/*` - React components

## Styling & UI Components

### Tailwind CSS
- **Framework**: Tailwind CSS v4 with PostCSS plugin
- **Animation**: tw-animate-css library
- **Theme Variables**: CSS variables in `app/globals.css` (--primary, --secondary, --ring, etc.)
- **Approach**: Utility-first classes with CVA for component variants

### shadcn/ui Setup
This project uses **shadcn/ui** for UI components. Key details:

- **Philosophy**: Not a component library - components are copied to your codebase for full ownership
- **Installation**: Individual components added via CLI: `npx shadcn@latest add [component-name]`
- **Location**: All UI components live in `components/ui/`
- **Dependencies**:
  - `@radix-ui/*` - Headless UI primitives for accessibility
  - `class-variance-authority` - Type-safe variant management
  - `clsx` & `tailwind-merge` - Utility for conditional className handling
- **Customization**: Directly edit components in `components/ui/` - they're yours to modify
- **Theme**: Configured via CSS variables in `app/globals.css` for easy theming

**Adding New Components:**
```bash
# Example: Add a new Dialog component
npx shadcn@latest add dialog

# Add multiple components at once
npx shadcn@latest add dialog dropdown-menu tooltip
```

**Currently Installed Components:**
- `button.tsx` - Customizable button with variants (default, destructive, outline, etc.)
- `card.tsx` - Container component with Header, Title, Description, Content, Footer subcomponents
- `select.tsx` - Dropdown select built on Radix UI Select primitive

## Important Implementation Details

### Washing Logic
- Washing can only occur when `currentMP > minimumMP`
- Maximum 5 AP resets per level
- "Fresh AP" (direct leveling AP) gives different HP gains than "used AP" (from washing) for some classes
- INT increases MP pool, enabling more washes

### Level Ranges
- Levels 1-10: First job (Beginner) formulas
- Levels 10-14: Post-advancement, pre-second-job formulas (for some classes)
- Levels 14+: Full job-specific formulas apply

### Warrior Special Cases
Warriors have a significant HP formula change at level 15 where they gain an additional +40 HP per level, plus large job advancement bonuses (225/550/1575/3400 cumulative).

## File Organization

```
app/
  models/        - Type definitions (Job enum, HPQuest enum, defaults, cost optimization)
  utils/         - Calculation functions (washing, HP/MP, math utilities)
  page.tsx       - Main calculator page
  layout.tsx     - Root layout with fonts
  globals.css    - Global styles and CSS variables

components/
  ui/           - Reusable UI primitives (shadcn/ui)
  logical/      - Feature-specific components (job selector, graph)
```

## TypeScript Configuration

- Target: ES2017
- JSX: react-jsx (Next.js 16 automatic runtime)
- Strict mode enabled
- Path alias `@/*` maps to repository root
