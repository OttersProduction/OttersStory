# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **MapleStory HP/MP Washing Calculator** - a Next.js 16 application that helps players calculate optimal HP washing strategies for MapleStory private servers. The app:

- **Optimizes INT allocation** using binary search to minimize AP reset costs while reaching target HP goals
- **Simulates character progression** from any starting level to a target level (up to 200)
- **Visualizes HP/MP/INT growth** using interactive charts
- **Supports multiple washing modes**: HP washing, MP washing, or no washing
- **Tracks HP quests** (Olaf quests, Water of Life, Elixer of Life) and applies bonuses at appropriate levels
- **Preserves washed gains** when starting from an existing character
- **Calculates total AP resets** needed for the washing plan

### Washing Reference Docs

- **Player-facing guide**: `washing-guide.md` (adapted from [HP Washing for Dummies – Sylafia](https://royals.ms/forum/threads/hp-washing-for-dummies.224894/))
- **Developer washing mechanics summary**: `washing-mechanics.md` (formulas, loops, and edge cases used by the calculator)

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
  - `getQuestHP()`: Calculates HP bonuses from HP quests (Water of Life, Olaf quests) and when they're applied
  - `getLevelUpHP()`: Calculates HP gained per level for each job
  - `getLevelUpMP()`: Calculates MP gained per level for each job

- **Washing Mechanics** (`app/utils/wash-helper.ts`):
  - `getAPResetsHPWash()`: Determines how many AP resets can be performed based on available MP
  - `getHPGainByAP()`: Calculates HP gained per AP reset (varies by class and fresh/used AP)
  - `getMPLossByAP()`: Calculates MP lost per AP reset (class-specific)
  - `getMPGainByAP()`: Calculates MP gained per AP (for MP washing calculations)
  - `MP_LOSS_PER_WASH`: Constant defining MP cost per wash for each job

- **HP Wash Plan Generation** (`app/utils/hp-wash.ts`):
  - `createHPWashPlan()`: Main function that creates a complete washing plan
  - `simulateWashing()`: Simulates character progression with washing from current level to target level
  - `findOptimalInt()`: Uses binary search to find minimum INT needed to reach target HP

- **Player State Management** (`app/models/player.ts`):
  - `Player` class: Manages character state, stats, HP/MP, and washing operations
  - `levelUp()`: Handles level progression, AP gain, and HP quest completion
  - `washHP()`: Performs HP washing and returns number of AP resets used
  - Preserves washed HP/MP gains when initialized with existing character data

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
  - Each component uses `class-variance-authority` (CVA) for variant management
  - Fully typed with TypeScript and accessible via Radix UI primitives
  - **Currently Installed**: Button, Card, Checkbox, Collapsible, Form, Input, Label, Select

- **Logical Components** (`components/logical/`):
  - `form.tsx`: Comprehensive form for character input with validation (Zod + react-hook-form)
  - `job-select.tsx`: Job selection dropdown component
  - `graph.tsx`: Recharts-based visualization of HP/MP/INT progression over levels
  - `plan-breakdown.tsx`: Displays washing plan results (total AP resets, final HP/MP/INT)

- **Theme Components** (`components/`):
  - `theme-provider.tsx`: Wraps next-themes ThemeProvider for dark/light mode support
  - `theme-toggle.tsx`: Button component for switching between themes

### Data Flow

The main page (`app/page.tsx`) manages:
1. **Form State**: Receives form values from `InitalForm` component including:
   - Character stats (level, HP, MP, STR, DEX, INT, LUK, AP)
   - Job selection
   - Target goals (level, HP, optional INT)
   - Washing mode (hp, none, mp)
   - HP quests to complete

2. **Plan Generation**: When form is submitted:
   - Creates a `Player` instance from form values
   - Calls `createHPWashPlan()` which:
     - Optimizes INT using binary search (if targetInt not specified)
     - Simulates progression from current level to target level
     - Performs washing at each level (if washing mode is "hp")
     - Allocates AP: first to meet minimum main stat requirements, then to INT up to target
     - Tracks HP quest completion at appropriate levels
     - Returns plan with data points, total AP resets, and final stats

3. **Visualization**: 
   - Displays `PlanBreakdown` with key metrics
   - Renders `Graph` component showing HP/MP/INT progression over levels

## Path Aliases

TypeScript paths are configured with `@/*` pointing to the root directory:
- `@/app/models/*` - Data models (Job, HPQuest, Player, HPWashPlan, defaults, cost-optimization)
- `@/app/utils/*` - Calculation utilities (hp-mp-helper, wash-helper, hp-wash, format, math)
- `@/components/*` - React components (ui, logical, theme components)
- `@/lib/*` - Utility functions (cn for className merging)

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
- `checkbox.tsx` - Checkbox input for HP quest selection
- `collapsible.tsx` - Collapsible content container
- `form.tsx` - Form wrapper with react-hook-form integration
- `input.tsx` - Text input field for numeric values
- `label.tsx` - Form label component
- `select.tsx` - Dropdown select built on Radix UI Select primitive

## Important Implementation Details

### Washing Logic
- Washing can only occur when `currentMP > minimumMP`
- Maximum 5 AP resets per level (limited by available AP)
- "Fresh AP" (direct leveling AP) gives different HP gains than "used AP" (from washing) for some classes
- INT increases MP pool: every 10 INT (rounded down) gives +1 MP per level
- The `Player` class tracks `hpGain` and `mpGain` separately from base HP/MP to preserve washed values
- When initializing a Player with existing character data, the difference between input HP/MP and base HP/MP is preserved as gains

### Level Ranges
- Levels 1-10: First job (Beginner) formulas
- Levels 10-14: Post-advancement, pre-second-job formulas (for some classes)
- Levels 14+: Full job-specific formulas apply

### Warrior Special Cases
Warriors have a significant HP formula change at level 15 where they gain an additional +40 HP per level, plus large job advancement bonuses (225/550/1575/3400 cumulative).

### HP Quest System
- HP quests are tracked in the `Player` class and applied during level up
- `getQuestHP()` calculates when each quest should be completed based on level
- Quest HP is added to `additionalHP` and included in natural HP calculations
- Supported quests: Olaf1-10, ElixerOfLife, WaterSpring

### INT Optimization
- When `targetInt` is not specified, `findOptimalInt()` uses binary search to find the minimum INT needed
- Search range: 4 (minimum) to 500 (maximum reasonable)
- Goal: Minimize AP resets while still reaching target HP
- For non-mages, INT above 4 will need to be reset back to main stat (counted in total AP resets)

### Washing Modes
- `"hp"`: Full HP washing enabled - optimizes INT and performs washing at each level
- `"none"`: No washing - simulates natural progression only
- `"mp"`: MP washing mode (currently same as "hp" in implementation)

### Form Validation
- Uses Zod schema for type-safe validation
- Validates all numeric inputs (level, stats, targets) with min/max constraints
- Job selection is required
- HP quests are optional checkboxes
- Target INT is optional (will be optimized if not provided)

## File Organization

```
app/
  models/
    job.ts              - Job enum, job groups, main stat mappings
    player.ts           - Player class for state management
    hp-quest.ts         - HPQuest enum (Olaf quests, Water of Life, etc.)
    hp-wash.ts          - HPWashPlan interface
    cost-optimization.ts - Cost optimization types (future feature)
    defaults.ts         - Default preferences and constants
  utils/
    hp-mp-helper.ts     - Base HP/MP calculations, quest HP
    wash-helper.ts      - Washing mechanics (HP/MP gains/losses)
    hp-wash.ts          - Plan generation and INT optimization
    format.ts           - Number formatting utilities
    math.ts             - Math utilities (clamp, etc.)
  page.tsx              - Main calculator page (form + results)
  layout.tsx            - Root layout with theme provider and fonts
  globals.css           - Global styles, CSS variables, theme colors

components/
  ui/                   - shadcn/ui components (button, card, checkbox, etc.)
  logical/
    form.tsx            - Main form component with validation
    job-select.tsx      - Job selection dropdown
    graph.tsx           - Recharts visualization
    plan-breakdown.tsx  - Results display component
  theme-provider.tsx    - Theme context provider
  theme-toggle.tsx      - Dark/light mode toggle button

lib/
  utils.ts              - Utility functions (cn for className merging)
```

## TypeScript Configuration

- Target: ES2017
- JSX: react-jsx (Next.js 16 automatic runtime)
- Strict mode enabled
- Path alias `@/*` maps to repository root

## Key Dependencies

- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library
- **recharts 3.3.0** - Charting library for visualizations
- **react-hook-form 7.66.0** - Form state management
- **zod 4.1.12** - Schema validation
- **@hookform/resolvers 5.2.2** - Zod resolver for react-hook-form
- **next-themes 0.4.6** - Theme management (dark/light mode)
- **tailwindcss 4** - Utility-first CSS framework
- **@radix-ui/*** - Headless UI primitives for accessibility
- **lucide-react 0.546.0** - Icon library

## Development Notes

### Starting from Existing Characters
The calculator can simulate washing for characters that have already been partially washed. When initializing a `Player` with existing HP/MP values:
- The difference between input values and base HP/MP is preserved as `hpGain`/`mpGain`
- These gains are maintained through level ups and additional washing
- This allows users to plan future washing based on their current character state

### AP Allocation Priority
During simulation, AP is allocated in this order:
1. **Minimum main stat requirement** - Ensures character meets job requirements
2. **INT up to target** - If target INT not reached, allocate remaining AP to INT
3. **Main stat** - Any remaining AP goes to main stat

### Cost Calculation
- Total AP resets include:
  - AP resets used for HP washing during leveling
  - AP resets needed to reset INT back to main stat (for non-mages)
- Cost optimization models exist but are not yet fully implemented in the UI
