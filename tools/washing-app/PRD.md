# Washing App - Product Requirements Document

## Overview

An optimization-focused web application for MapleStory washing calculations. The app calculates the optimal base INT allocation and most efficient washing path to reach specific HP and level goals in MapleStory private servers.

## Problem Statement

Washing in MapleStory is a complex optimization problem that involves:

- Determining optimal base INT allocation for MP generation
- Finding the most cost-effective washing path to reach HP goals
- Balancing washing costs against alternative HP sources
- Optimizing for different class-specific mechanics
- Minimizing total AP reset costs while maximizing HP gains

Players struggle with:

- Determining how much base INT to allocate
- Finding the most efficient washing sequence
- Calculating optimal washing strategies for their specific goals
- Understanding the trade-offs between different approaches

## Target Users

- MapleStory private server players
- Players interested in endgame bossing
- Players who need to understand washing costs
- New players learning about washing mechanics

## Core Features

### 1. Optimization Engine

**Priority: High**

- Input: Character class, current level, HP goal, level goal, available resources
- Output: Optimal base INT allocation and washing sequence
- Calculate most cost-effective path to reach goals
- Support for all classes with class-specific optimization
- Minimize total AP reset costs while maximizing HP gains

### 2. Class-Specific Optimization

**Priority: High**

- Class-specific washing ratios and optimization strategies
- Thief-specific washing mechanics and optimal paths
- Mage-specific optimization (including infinite washing strategies)
- Warrior, Pirate, and Bowman optimization algorithms
- Class-specific cost-benefit analysis

### 3. Cost Optimization

**Priority: High**

- AP Reset cost optimization (NX and Meso)
- SP Reset cost optimization for mages
- Total washing cost minimization
- Multi-strategy cost comparison and selection
- Resource allocation optimization

### 4. Path Optimization

**Priority: High**

- Optimal washing sequence calculation
- Step-by-step washing path with cost breakdown
- Alternative HP source integration (quests, gear)
- Multi-goal optimization (HP + level + cost)
- Dynamic path adjustment based on available resources

### 5. Advanced Optimization

**Priority: Medium**

- MP Washing (Double Washing) optimization
- Infinite washing optimization for mages
- Delayed washing strategy optimization
- Minimum MP constraint handling
- Multi-variable optimization algorithms

### 6. Washing Process Visualization

**Priority: High**

- HP/MP to level graph showing washing progression
- Visual representation of washing process vs natural growth
- Interactive graph with level-by-level breakdown
- Cost visualization per level
- Washing efficiency metrics display

### 7. User Interface

**Priority: High**

- Clean, intuitive interface
- Mobile-responsive design
- Real-time calculations
- Save/load washing plans
- Export results

## Technical Requirements

### Frontend

- Next.js 16+ with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- Local storage for user preferences

### Data Models

- Character class definitions
- Washing formulas and ratios
- Cost structures
- User preferences

### Performance

- Fast calculations
- Smooth user experience
- Minimal bundle size

## User Stories

### Epic 1: Optimization Engine

- As a player, I want to input my goals and get the optimal washing plan
- As a player, I want to see the most cost-effective path to my HP goal
- As a player, I want to know exactly how much base INT I need for optimal results

### Epic 2: Class-Specific Optimization

- As a mage, I want the optimal infinite washing strategy
- As a thief, I want the most efficient thief-specific washing path
- As a warrior, I want to optimize my natural HP advantages

### Epic 3: Advanced Optimization

- As a player, I want to compare and select the best washing strategy
- As a player, I want to optimize MP washing benefits
- As a player, I want to see detailed cost optimization breakdowns

### Epic 4: Optimization Guidance

- As a new player, I want to understand optimal washing strategies
- As a player, I want to optimize alternative HP sources
- As a player, I want to see optimized HP goal recommendations

### Epic 5: Washing Process Visualization

- As a player, I want to see a graph of my HP/MP progression through levels
- As a player, I want to visualize the washing process vs natural growth
- As a player, I want to see cost breakdowns per level
- As a player, I want to understand washing efficiency at each level

## Success Metrics

- User engagement with optimization engine
- Accuracy of optimization calculations
- User feedback on optimization results
- Reduction in washing-related questions in community
- User satisfaction with cost savings achieved
- User engagement with visualization features
- Graph interaction and usage metrics

## Future Enhancements

- Integration with server-specific data for better optimization
- Community features (sharing optimized washing plans)
- Advanced optimization algorithms (genetic algorithms, machine learning)
- Mobile app version with offline optimization
- Integration with other MapleStory tools for comprehensive optimization

## Constraints

- Must work offline
- No server-side dependencies
- Compatible with all major browsers
- Fast loading times
- Easy to maintain and update

## Dependencies

- Washing guide content (washing-guide.md)
- Class-specific washing formulas
- Cost data from server
- User interface components

## Risks

- Complex optimization algorithms may have edge cases
- Class-specific mechanics are intricate to optimize
- User interface complexity for optimization results
- Performance with large optimization calculations
- Optimization algorithm accuracy and efficiency

## Timeline

- Phase 1: Optimization engine (3-4 weeks)
- Phase 2: Class-specific optimization (3-4 weeks)
- Phase 3: Advanced optimization features (2-3 weeks)
- Phase 4: Polish and performance optimization (1-2 weeks)

## Acceptance Criteria

- All optimization calculations are accurate
- Interface is intuitive and responsive
- All class-specific optimization is implemented
- Cost optimization is correct and efficient
- User can save and load their optimized plans
- App works offline with full optimization
- Performance is acceptable on mobile devices
- Optimization results are significantly better than manual calculations
