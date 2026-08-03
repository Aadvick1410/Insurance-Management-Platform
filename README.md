# Insurance Management Platform

A comprehensive enterprise web application for managing insurance operations  policies, claims, premium payments, documents, and reporting  with role-based access for Administrators, Insurance Agents, and Customers.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite) + Tailwind CSS |
| Backend | Java 21 + Spring Boot 3 |
| Database | PostgreSQL |
| ORM | Spring Data JPA (Hibernate) |
| Auth | Spring Security + JWT + BCrypt |
| Charts | Chart.js (react-chartjs-2) |
| API Docs | SpringDoc OpenAPI (Swagger UI) |

## Modules

- **Customer Management** — Register, view, edit, search customers
- **Policy Management** — Create, renew, cancel insurance policies
- **Claim Management** — Submit, verify, approve/reject claims
- **Premium Tracking** — Record payments, track overdue premiums
- **Document Management** — Upload/download identity and policy documents
- **Reports Dashboard** — Analytics with Chart.js (active policies, claims, revenue)

## User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Full system access, manage users, generate reports |
| **Agent** | Register customers, create policies, review claims |
| **Customer** | View policies, pay premiums, file claims, upload documents |

## Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL 15+

### Database Setup
```bash
psql -U postgres -c "CREATE DATABASE insurance_db;"
```

### Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@insurance.com | admin123 |
| Agent | agent@insurance.com | agent123 |
| Customer | customer@insurance.com | customer123 |

## Deployment

- **Backend**: Deployed on [Render](https://render.com)
- **Frontend**: Deployed on [Vercel](https://vercel.com)

## Project Structure
```
insurance-management-platform/
├── backend/
│   └── src/main/java/com/insurance/platform/
│       ├── config/          # Security, CORS, WebConfig
│       ├── controller/      # REST API Controllers
│       ├── dto/             # Data Transfer Objects
│       ├── entity/          # JPA Entities
│       ├── exception/       # Global Exception Handling
│       ├── repository/      # JPA Repositories
│       ├── security/        # JWT Filter & Provider
│       └── service/         # Business Logic
├── frontend/
│   └── src/
│       ├── components/      # Reusable Components
│       ├── context/         # Auth Context
│       ├── layouts/         # Dashboard Layout
│       ├── pages/           # Route Pages
│       └── services/        # API Service Layer
└── README.md
```
