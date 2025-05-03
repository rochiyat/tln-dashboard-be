# ElysiaJS + Drizzle Clean Architecture Starter

A production-ready starter template using ElysiaJS, Drizzle ORM, and Bun.

## Features

- 🧩 **Clean Architecture**: Domain-driven design with clear separation of concerns
- 🔐 **Authentication**: JWT-based authentication system
- 👤 **User Management**: Complete user entity with profile management
- 🔄 **Database**: Drizzle ORM with MYSQL
- 📝 **Validation**: End-to-end type safety with Elysia's built-in validation
- 📚 **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- 🧪 **Testing**: Unit and integration tests setup
- 🧠 **Type Safety**: Full TypeScript support with end-to-end type safety
- 🔍 **Error Handling**: Comprehensive error handling system
- 🔄 **Migrations**: Database migration system
- ⛔ **rate limiting**: rating limiting using redis
- 📫 **otp mail verification**: mail verification using resend and react email

## Project Structure

made using [dirscanner](https://github.com/aymaneallaoui/dirscanner)

```
src/
├── domain/              # Domain entities and business rules
│   └── entities/        # Core business objects
│
├── application/         # Application-specific business rules
│   ├── use-cases/       # Business logic operations
│   └── services/        # Reusable services
│
├── infrastructure/      # External concerns (database, external APIs)
│   ├── database/        # Database setup and implementations
│   │   ├── schema/      # Drizzle schema definitions
│   │   └── migrations/  # Database migrations
│   └── utils/           # Utility functions
│
├── interface/           # Interface adapters
│   ├── controllers/     # Elysia route handlers (controllers)
│   ├── validators/      # Input validation schemas
│   └── middleware/      # Request/response middleware
│
├── main/                # Application entry point
│   ├── config/          # Configuration files
│   ├── routes/          # Route definitions
│   └── server.ts        # Server initialization
│
├── scripts/             # Utility scripts (migrations, seed data)
│
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Getting Started

### Installation

1. Clone the repository
2. Run `bun install`
3. Create a `.env` file based on `.env.example`
4. Run `bun run db:migrate` to apply database migrations
5. Run `bun run dev` to start the development server

## Commands

- `bun run dev`: Start the development server
- `bun run build`: Build the project
- `bun run start`: Start the production server
- `bun run test`: Run tests
- `bun run db:generate`: Generate a new migration
- `bun run db:migrate`: Apply migrations
- `bun run db:studio`: Open Drizzle Studio
