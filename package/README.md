# CardStacks CRM

A professional, modular, multi-tenant CRM SaaS platform built on Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🏢 **Multi-tenant Architecture** - Organization-based isolation
- 👥 **Client Management** - Comprehensive client profiles with notes, files, and tags
- 📄 **Offer Management** - Create and track client offers
- 📝 **Template System** - Reusable offer templates
- 🔐 **Authentication** - Secure session management with Supabase
- 🎨 **Modern UI** - Beautiful, accessible interface with dark mode support
- 📊 **Analytics Ready** - Dashboard with KPIs and metrics
- 🔒 **Type-Safe** - Full TypeScript with strict mode enabled

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Supabase Auth
- **UI Components**: Radix UI + Custom components
- **Forms**: React Hook Form + Zod
- **Logging**: Pino
- **Monitoring**: Sentry

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (Supabase recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials and other environment variables.

4. Set up the database:
   ```bash
   pnpm db:push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (DashboardLayout)/  # Protected dashboard routes
│   │   ├── clients/         # Client management module
│   │   ├── offers/          # Offer management module
│   │   ├── templates/       # Template management module
│   │   └── settings/        # Settings page
│   └── authentication/      # Auth pages
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   └── providers/           # Context providers
├── lib/                     # Utilities and configurations
│   ├── auth/                # Authentication utilities
│   ├── db/                  # Database schema and queries
│   └── guards.ts            # Type-safe guards
└── hooks/                   # Custom React hooks
```

## Development

### Type Checking

```bash
pnpm typecheck
pnpm typecheck:ci  # CI mode
```

### Database Migrations

```bash
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema changes
```

### Building

```bash
pnpm build
```

## TypeScript Configuration

This project uses strict TypeScript settings:
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- `strict: true`

All code must pass type checking with these settings enabled.

## Contributing

1. Follow the existing code style
2. Ensure all TypeScript checks pass
3. Write type-safe code (no `as any` casts)
4. Use the provided guards for database operations
5. Normalize all optional arrays/objects before use

## License

See LICENSE.md for details.
