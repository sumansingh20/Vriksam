<div align="center">

# VRIKSHAM

### The Future of Green Infrastructure

**India's leading plant management SaaS platform**

Transforming urban spaces through intelligent plant lifecycle management, AI-powered diagnostics, and real-time environmental impact tracking.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r167-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

</div>

---

## Screenshots

| Landing Page | Admin Dashboard | Plant Health Monitor |
|:---:|:---:|:---:|
| ![Landing Page](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Plant Health](docs/screenshots/plant-health.png) |

| AI Diagnostics | Service Scheduling | ESG Reports |
|:---:|:---:|:---:|
| ![AI Diagnostics](docs/screenshots/ai-diagnostics.png) | ![Scheduling](docs/screenshots/scheduling.png) | ![ESG Reports](docs/screenshots/esg-reports.png) |

> Add your own screenshots to `docs/screenshots/` after running the application.

---

## Feature Highlights

| Feature | Description |
|---------|-------------|
| :office: **Client Management** | Onboard corporate and residential clients, manage locations, and track contract lifecycles |
| :seedling: **Plant Health Monitoring** | Track every plant with QR codes, health scores, and historical condition data |
| :robot: **AI-Powered Diagnostics** | Upload plant images for automated health analysis and care recommendations using GPT-4o |
| :calendar: **Service Visit Scheduling** | Assign technicians, schedule routine and emergency visits, track completion |
| :busts_in_silhouette: **Technician Management** | Zone-based assignment, performance ratings, availability tracking, and mobile access |
| :credit_card: **Subscription Billing** | Flexible plans (Starter, Professional, Enterprise) with Stripe integration and invoicing |
| :bar_chart: **Real-Time Analytics** | Revenue dashboards, plant health distribution, technician performance metrics |
| :package: **Inventory Management** | Track plant stock, supplier details, low-stock alerts, and purchase orders |
| :lock: **Role-Based Access Control** | Admin, Client, and Technician roles with granular permissions and route protection |
| :key: **Google OAuth + JWT Auth** | One-click sign-in alongside secure email/password with refresh token rotation |
| :earth_africa: **ESG Impact Tracking** | CO2 absorption, oxygen production, and biodiversity metrics for sustainability reporting |
| :crystal_ball: **3D Visualizations** | Interactive plant displays and green city scenes powered by Three.js and React Three Fiber |

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.5
- **Styling:** Tailwind CSS 3.4, Framer Motion
- **State Management:** Zustand, TanStack React Query
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **UI Components:** Radix UI, Lucide Icons
- **Charts:** Recharts
- **Forms:** React Hook Form, Zod
- **Payments:** Stripe.js

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose / Prisma
- **Authentication:** JWT + Passport.js + NextAuth.js
- **Payments:** Stripe SDK
- **AI:** OpenAI GPT-4o SDK
- **Logging:** Winston

### Infrastructure
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (frontend), AWS ECS Fargate (backend)
- **Storage:** AWS S3
- **CDN:** Vercel Edge Network

---

## Quick Start

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- MongoDB 7.0+ (for Option A) or Docker (for Option C)

---

### Option A: Full-Stack with MongoDB

Best for development with the complete backend API.

```bash
# 1. Clone the repository
git clone https://github.com/vriksham/vriksham.git
cd vriksham

# 2. Install dependencies for both frontend and backend
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Configure environment variables
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
# Edit both .env files with your values (MongoDB URI, JWT secrets, etc.)

# 4. Seed MongoDB with demo data
cd backend && npm run prisma:seed && cd ..

# 5. Start both servers
# Terminal 1 - Backend (port 4000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Next.js Only (Vercel-Deployable)

Best for frontend development using built-in Next.js API routes. No separate backend required.

```bash
# 1. Clone the repository
git clone https://github.com/vriksham/vriksham.git
cd vriksham/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and secrets

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. API routes are served from `/api/*`.

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvriksham%2Fvriksham&root-directory=frontend&env=MONGODB_URI,JWT_SECRET,NEXTAUTH_SECRET,NEXTAUTH_URL)

---

### Option C: Docker

Best for running the entire stack with zero local setup.

```bash
# 1. Clone the repository
git clone https://github.com/vriksham/vriksham.git
cd vriksham

# 2. Configure environment
cp docker/.env.example docker/.env
# Edit docker/.env with your values

# 3. Start all services (frontend, backend, MongoDB, Redis)
cd docker && docker compose up -d --build

# 4. Seed the database (first time only)
docker compose exec backend npm run prisma:seed
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# View logs
docker compose logs -f

# Stop all services
docker compose down

# Development mode with hot reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

## Demo Accounts

After seeding the database, use these accounts to explore the platform:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@vriksham.org | `Admin@123` | Full platform access, analytics, user management |
| **Partner** | partner@vriksham.org | `Partner@123` | Client dashboard, plant monitoring, service requests |
| **User** | user@vriksham.org | `User@123` | Personal dashboard, plant catalogue, service history |

---

## Project Structure

```
vriksham/
|-- frontend/                       # Next.js 14 application
|   |-- src/
|   |   |-- app/                    # App Router pages and layouts
|   |   |   |-- (auth)/             # Auth pages (login, register, forgot-password)
|   |   |   |-- (dashboard)/        # Dashboard pages (admin, partner, client)
|   |   |   |-- (marketing)/        # Public marketing pages (landing, pricing)
|   |   |   |-- api/                # Next.js API route handlers
|   |   |-- components/             # Reusable UI components
|   |   |   |-- ui/                 # Base UI primitives (Button, Card, Input...)
|   |   |   |-- layout/             # Layout components (Navbar, Footer, Sidebar)
|   |   |   |-- dashboard/          # Dashboard-specific components
|   |   |   |-- marketing/          # Marketing page sections
|   |   |   |-- charts/             # Chart components (Area, Bar, Pie)
|   |   |   |-- three/              # Three.js 3D scene components
|   |   |-- hooks/                  # Custom React hooks
|   |   |-- lib/                    # Utility libraries (api-client, utils)
|   |   |-- providers/              # React context providers
|   |   |-- services/               # API client service modules
|   |   |-- store/                  # Zustand state stores
|   |   |-- styles/                 # Global CSS and Tailwind
|   |   |-- types/                  # TypeScript type definitions
|   |   |-- animations/             # Framer Motion animation configs
|   |   |-- config/                 # App configuration
|   |   |-- middleware.ts            # Next.js route protection middleware
|   |-- public/                     # Static assets (images, fonts, icons)
|   |-- vercel.json                 # Vercel deployment configuration
|   |-- next.config.js              # Next.js configuration
|   |-- tailwind.config.ts          # Tailwind CSS configuration
|   |-- tsconfig.json               # TypeScript configuration
|   |-- package.json                # Dependencies and scripts
|
|-- backend/                        # Express.js API server
|   |-- src/
|   |   |-- config/                 # App and database configuration
|   |   |-- controllers/            # Route controllers
|   |   |-- middleware/              # Express middleware (auth, validation, error)
|   |   |-- models/                 # Mongoose/Prisma data models
|   |   |-- routes/                 # API route definitions
|   |   |-- services/               # Business logic services
|   |   |-- jobs/                   # Cron jobs and scheduled tasks
|   |   |-- types/                  # TypeScript type definitions
|   |   |-- utils/                  # Helper functions
|   |   |-- validators/             # Zod validation schemas
|   |-- prisma/                     # Prisma ORM configuration
|   |   |-- schema.prisma           # Database schema
|   |   |-- migrations/             # Database migrations
|   |   |-- seeds/                  # Seed data scripts
|
|-- shared/                         # Shared code between frontend and backend
|   |-- constants/                  # Shared constants and enums
|   |-- types/                      # Shared TypeScript type definitions
|   |-- utils/                      # Shared utility functions
|
|-- docker/                         # Docker configuration
|   |-- Dockerfile.frontend         # Frontend production Dockerfile
|   |-- Dockerfile.backend          # Backend production Dockerfile
|   |-- docker-compose.yml          # Production compose
|   |-- docker-compose.dev.yml      # Development compose override
|   |-- .env.example                # Docker environment template
|
|-- .github/workflows/              # CI/CD pipelines
|   |-- ci.yml                      # CI: lint, type-check, test, build
|   |-- deploy.yml                  # CD: build images, push, deploy
|
|-- docs/                           # Documentation
|   |-- api/                        # API endpoint documentation
|   |-- architecture/               # Architecture and design docs
|   |-- deployment/                 # Deployment guides
|
|-- scripts/                        # Development and utility scripts
|   |-- setup.sh                    # Initial project setup
|   |-- seed.sh                     # Database seeding
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Log in with email and password |
| `POST` | `/api/auth/refresh` | Refresh access token using refresh token |
| `POST` | `/api/auth/logout` | Log out and invalidate tokens |
| `POST` | `/api/auth/forgot-password` | Request password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `GET`  | `/api/auth/me` | Get current authenticated user profile |

### Clients

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/clients` | List all clients (paginated, filterable) |
| `POST` | `/api/clients` | Create a new client |
| `GET` | `/api/clients/:id` | Get client details by ID |
| `PATCH` | `/api/clients/:id` | Update client information |
| `DELETE` | `/api/clients/:id` | Soft-delete a client |

### Plants

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/plants` | List all plants (paginated, filterable by health, species, location) |
| `POST` | `/api/plants` | Register a new plant |
| `GET` | `/api/plants/:id` | Get plant details with health history |
| `PATCH` | `/api/plants/:id` | Update plant information |
| `DELETE` | `/api/plants/:id` | Remove a plant record |
| `POST` | `/api/plants/:id/health-log` | Add a health check entry |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscriptions` | List all subscriptions |
| `POST` | `/api/subscriptions` | Create a new subscription |
| `GET` | `/api/subscriptions/:id` | Get subscription details |
| `PATCH` | `/api/subscriptions/:id` | Update subscription (upgrade/downgrade) |
| `POST` | `/api/subscriptions/:id/cancel` | Cancel a subscription |

### Service Visits (Maintenance)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/maintenance` | List service visits (filterable by status, date, technician) |
| `POST` | `/api/maintenance` | Schedule a new service visit |
| `GET` | `/api/maintenance/:id` | Get service visit details |
| `PATCH` | `/api/maintenance/:id` | Update visit status or details |
| `POST` | `/api/maintenance/:id/complete` | Mark visit as completed with notes |

### Technicians

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/technicians` | List all technicians |
| `POST` | `/api/technicians` | Add a new technician |
| `GET` | `/api/technicians/:id` | Get technician profile and performance |
| `PATCH` | `/api/technicians/:id` | Update technician details |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/dashboard` | Get dashboard summary stats |
| `GET` | `/api/analytics/revenue` | Revenue metrics (monthly, by plan, by client) |
| `GET` | `/api/analytics/plants` | Plant health distribution and trends |
| `GET` | `/api/analytics/esg` | ESG impact metrics (CO2, O2, biodiversity) |

### Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/inventory` | List inventory items |
| `POST` | `/api/inventory` | Add new inventory item |
| `PATCH` | `/api/inventory/:id` | Update stock levels |

### AI Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/diagnose` | AI plant health diagnosis from image |
| `POST` | `/api/ai/chat` | AI assistant chat for plant care advice |
| `GET` | `/api/ai/predictions/:plantId` | Get AI health predictions for a plant |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/create-checkout` | Create Stripe checkout session |
| `POST` | `/api/payments/webhook` | Stripe webhook handler |
| `GET` | `/api/payments/invoices` | List payment invoices |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get user notifications |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read |
| `POST` | `/api/notifications/mark-all-read` | Mark all notifications as read |

---

## Deployment

### Vercel (Recommended for Frontend)

The fastest way to deploy the VRIKSHAM frontend:

1. **Push your code** to a GitHub repository.
2. **Import the project** on [Vercel](https://vercel.com/new).
3. **Set the root directory** to `frontend`.
4. **Add environment variables** in Vercel project settings:

   ```
   MONGODB_URI         = mongodb+srv://...
   JWT_SECRET          = (min 32 characters)
   JWT_REFRESH_SECRET  = (min 32 characters)
   NEXTAUTH_SECRET     = (generate with: openssl rand -base64 32)
   NEXTAUTH_URL        = https://your-domain.vercel.app
   STRIPE_SECRET_KEY   = sk_live_...
   OPENAI_API_KEY      = sk-...
   ```

5. **Deploy.** Vercel will automatically build and deploy on every push to `main`.

The `vercel.json` configuration sets the region to `bom1` (Mumbai) for optimal latency in India.

### Docker

```bash
cd docker

# Production deployment
docker compose up -d --build

# With custom .env
cp .env.example .env
# Edit .env with production values
docker compose --env-file .env up -d --build
```

### AWS (ECS Fargate)

For production-grade deployment with auto-scaling:

1. **Build Docker images** and push to Amazon ECR:
   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
   docker build -f docker/Dockerfile.frontend -t vriksham-frontend .
   docker tag vriksham-frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/vriksham-frontend:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/vriksham-frontend:latest
   ```

2. **Create ECS services** using the task definitions in `.github/workflows/deploy.yml`.

3. **Configure RDS** (MongoDB Atlas or DocumentDB) and **ElastiCache** (Redis).

4. **Set up ALB** (Application Load Balancer) with SSL certificate from ACM.

5. **Configure Route 53** for DNS routing to the ALB.

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vriksham` |
| `JWT_SECRET` | Yes | Secret for signing access tokens (min 32 chars) | `a1b2c3d4e5f6...` |
| `JWT_REFRESH_SECRET` | Yes | Secret for signing refresh tokens (min 32 chars) | `f6e5d4c3b2a1...` |
| `NEXTAUTH_SECRET` | Yes | NextAuth.js encryption secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Canonical URL of the application | `https://app.vriksham.com` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret | `GOCSPX-...` |
| `STRIPE_SECRET_KEY` | No | Stripe secret API key | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key (client-side) | `pk_live_...` |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features | `sk-...` |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for API requests | `https://app.vriksham.com/api` |
| `NEXT_PUBLIC_WS_URL` | No | WebSocket URL for real-time features | `wss://ws.vriksham.com` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public-facing application URL | `https://app.vriksham.com` |
| `NEXT_PUBLIC_APP_NAME` | No | Application display name | `VRIKSHAM` |

---

## Development Commands

### Frontend

```bash
cd frontend

npm run dev           # Start development server (port 3000)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run type-check    # Run TypeScript type checking
npm run analyze       # Analyze bundle size
npm run clean         # Clean build artifacts
```

### Backend

```bash
cd backend

npm run dev             # Start dev server with hot reload (port 4000)
npm run build           # Compile TypeScript
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript type checking
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations (development)
npm run prisma:seed     # Seed the database
npm run prisma:studio   # Open Prisma Studio (GUI)
npm run prisma:reset    # Reset database (WARNING: drops all data)
```

---

## Contributing

We welcome contributions from the community! Here is how to get started:

1. **Fork** the repository on GitHub.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and write tests where applicable.
4. **Run quality checks:**
   ```bash
   # Frontend
   cd frontend && npm run lint && npm run type-check && npm run build

   # Backend
   cd backend && npm run lint && npm run typecheck && npm run build
   ```
5. **Commit** with a clear, descriptive message following our convention:
   ```bash
   git commit -m "feat: add plant QR code scanning feature"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch.

### Commit Message Convention

| Prefix | Purpose |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks (dependencies, CI, tooling) |
| `perf:` | Performance improvements |

### Branch Naming

- `feature/` -- New features
- `fix/` -- Bug fixes
- `docs/` -- Documentation updates
- `refactor/` -- Code refactoring
- `release/` -- Release preparation

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Vriksham Technologies Pvt. Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with care by [VRIKSHAM Green Solutions](https://vriksham.com)**

Nurturing Nature, Enriching Spaces

</div>
