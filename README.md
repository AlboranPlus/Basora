# Basora

Community library management system. Members borrow and lend books among themselves, build reputation through a level system, and leave reviews.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16, Flyway migrations |
| Frontend | React 18, TypeScript, Vite, TanStack Query, React Router v6 |
| Infrastructure | Docker, Docker Compose |

## Getting started

### Prerequisites

- Docker & Docker Compose
- Java 21 (for backend development)
- Node.js 20 (for frontend development)

### Run the full stack

```bash
docker compose up --build
```

Frontend: http://localhost:5173  
Backend API: http://localhost:8080  
Swagger UI: http://localhost:8080/swagger-ui.html

### Development

```bash
# Backend only (requires local PostgreSQL)
make backend-dev

# Frontend only (proxies API to localhost:8080)
make frontend-dev

# Run tests
make test
```

### Environment variables

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

## Project structure

```
basora/
├── backend/            Spring Boot application
│   └── src/main/
│       ├── java/eu/basora/
│       │   ├── catalog/        Books, editions, copies, authors
│       │   ├── member/         Members and level system
│       │   ├── circulation/    Borrowings, reservations, ratings
│       │   ├── isbn/           OpenLibrary ISBN lookup
│       │   └── config/         Security, OpenAPI, Jackson
│       └── resources/
│           └── db/migration/   Flyway SQL migrations
└── frontend/           Vite + React application
    └── src/
        ├── api/        Axios API clients per domain
        ├── components/ Shared UI components
        ├── hooks/      TanStack Query hooks
        ├── pages/      Route-level page components
        └── types/      TypeScript domain types
```

## Level system

| Level | Name | Borrows required | Permissions |
|-------|------|-----------------|-------------|
| 1 | Newcomer | 0 | Borrow books |
| 2 | Reader | 5 | Borrow + lend, 14-day loans |
| 3 | Curator | 15 | Priority reservations, 21-day loans |
| 4 | Librarian | 30 | Full access, 30-day loans |
