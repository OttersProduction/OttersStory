# Otters Story Washing

A Next.js application with Tailwind CSS for the Otters Story washing tools and utilities.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the washing directory:

   ```bash
   cd tools/washing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
tools/washing/
├── app/                 # Next.js 13+ app directory
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/         # Reusable components (create as needed)
├── public/            # Static assets (create as needed)
├── package.json       # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── next.config.js     # Next.js configuration
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## Building for Production

```bash
npm run build
npm run start
```

The application will be optimized for production and ready to deploy.
