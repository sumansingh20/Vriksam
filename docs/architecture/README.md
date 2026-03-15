# VRIKSHAM Architecture Documentation

## System Overview

```
                                   VRIKSHAM Architecture
  +-----------------------------------------------------------------------------------+
  |                                                                                   |
  |   CLIENTS (Browser / Mobile)                                                      |
  |   +-------------------+                                                           |
  |   |   Next.js 14 SPA  |                                                           |
  |   |  (React 18 + TS)  |                                                           |
  |   +--------+----------+                                                           |
  |            |                                                                      |
  |            | HTTPS (Port 3000)                                                    |
  |            |                                                                      |
  |   +--------v----------+         +------------------+                              |
  |   |   Next.js Server  |         |   Stripe Webhooks|                              |
  |   |  (SSR + API Proxy)|         |                  |                              |
  |   +--------+----------+         +--------+---------+                              |
  |            |                              |                                       |
  |            | REST API (Port 4000)         |                                       |
  |            |                              |                                       |
  |   +--------v------------------------------v--------+                              |
  |   |           Express.js Backend API               |                              |
  |   |  +----------+  +----------+  +----------+     |                              |
  |   |  | Auth MW   |  | Rate     |  | Helmet   |     |                              |
  |   |  | (JWT +    |  | Limiter  |  | Security |     |                              |
  |   |  |  Google)  |  +----------+  +----------+     |                              |
  |   |  +----------+                                  |                              |
  |   |  +----------+  +----------+  +----------+     |                              |
  |   |  | Routes   |  | Services |  | Cron Jobs|     |                              |
  |   |  +----------+  +----------+  +----------+     |                              |
  |   +----+---------------+---------------+-----------+                              |
  |        |               |               |                                          |
  |   +----v----+    +----v----+    +-----v-----+    +-------------+                 |
  |   |PostgreSQL|    |  Redis  |    | AWS S3    |    | OpenAI API  |                 |
  |   | (Prisma) |    | (Cache) |    | (Uploads) |    | (AI Health) |                 |
  |   +---------+    +---------+    +-----------+    +-------------+                 |
  |                                                                                   |
  +-----------------------------------------------------------------------------------+
```

## Tech Stack

### Frontend

| Technology          | Purpose                      | Version |
|---------------------|------------------------------|---------|
| Next.js             | React framework (SSR/SSG)    | 14.2.5  |
| React               | UI library                   | 18.3.1  |
| TypeScript          | Type safety                  | 5.5+    |
| Tailwind CSS        | Utility-first styling        | 3.4+    |
| Framer Motion       | Animations                   | 11.3+   |
| Three.js / R3F      | 3D visualizations            | 0.167+  |
| GSAP                | Advanced animations          | 3.12+   |
| Zustand             | State management             | 4.5+    |
| React Query         | Server state management      | 5.51+   |
| React Hook Form     | Form handling                | 7.52+   |
| Zod                 | Schema validation            | 3.23+   |
| NextAuth.js         | Authentication               | 4.24+   |
| Recharts            | Data visualization           | 2.12+   |
| Radix UI            | Accessible UI primitives     | Latest  |
| Lucide React        | Icons                        | 0.424+  |
| Stripe.js           | Payment integration          | 4.3+    |

### Backend

| Technology          | Purpose                      | Version |
|---------------------|------------------------------|---------|
| Express.js          | HTTP server framework        | 4.21+   |
| TypeScript          | Type safety                  | 5.7+    |
| Prisma ORM          | Database toolkit             | 6.4+    |
| PostgreSQL          | Relational database          | 16      |
| Redis               | Caching and sessions         | 7       |
| JWT                 | Token-based auth             | 9.0+    |
| Passport.js         | Authentication strategies    | 0.7+    |
| Stripe              | Payment processing           | 17.7+   |
| OpenAI SDK          | AI plant health analysis     | 4.85+   |
| Winston             | Structured logging           | 3.17+   |
| Zod                 | Input validation             | 3.24+   |
| Sharp               | Image processing             | 0.33+   |
| Node-cron           | Scheduled jobs               | 3.0+    |
| Helmet              | HTTP security headers        | 8.0+    |

### Infrastructure

| Technology          | Purpose                      |
|---------------------|------------------------------|
| Docker              | Containerization             |
| Docker Compose      | Multi-container orchestration|
| GitHub Actions      | CI/CD pipelines              |
| AWS ECS Fargate     | Container hosting            |
| AWS ECR             | Container registry           |
| AWS RDS             | Managed PostgreSQL           |
| AWS ElastiCache     | Managed Redis                |
| AWS S3              | File storage                 |
| AWS ALB             | Load balancing               |
| AWS Route 53        | DNS management               |
| AWS ACM             | SSL/TLS certificates         |

---

## Database Schema Overview

The database uses PostgreSQL with Prisma ORM. Below is a summary of the main entities and their relationships.

```
  +----------+       +----------+       +-----------+
  |   User   |------>|  Client  |------>| Location  |
  | (id,role)|       | (company)|       | (address) |
  +----+-----+       +----+-----+       +-----+-----+
       |                   |                   |
       |                   |              +----v----+
       v                   |              |  Plant  |--------> PlantSpecies
  +----------+             |              | (status)|
  |Technician|             |              +----+----+
  | (rating) |             |                   |
  +----+-----+             |              +----v---------+
       |                   |              |PlantHealthLog|
       |              +----v------+       | (healthScore)|
       +------------->|ServiceVisit|       +--------------+
                      | (schedule)|
                      +-----------+

  +----------+       +-----------+       +---------+
  |  Client  |------>|Subscription|----->| Invoice |-----> Payment
  +----------+       |  (plan)    |      | (total) |
                     +-----------+       +---------+

  +----------+       +------------------+
  |  Team    |------>| Technician(s)    |
  +----------+       +------------------+

  +----------+       +------------------+
  |   User   |------>| Notification(s)  |
  +----------+       +------------------+

  +----------+       +------------------+
  |PlantSpecies|---->|   Inventory      |
  +----------+       +------------------+
```

### Key Models

- **User**: Central auth entity with roles (ADMIN, CLIENT, TECHNICIAN)
- **Client**: Business or residential customer with locations
- **Location**: Physical spaces where plants are placed
- **PlantSpecies**: Catalog of plant types with care requirements
- **Plant**: Individual plant instance with health tracking
- **PlantHealthLog**: Timestamped health readings (manual + AI)
- **SubscriptionPlan**: Pricing tiers (Starter, Professional, Enterprise)
- **Subscription**: Active plan binding a client to a plan
- **ServiceVisit**: Scheduled or completed maintenance visits
- **Technician**: Field staff with specializations and zones
- **Invoice / Payment**: Billing and payment tracking (Stripe integration)
- **Inventory**: Stock levels for plant species
- **Team**: Grouping of technicians by zone
- **Notification**: In-app alerts for users

---

## API Design Principles

### RESTful Conventions

- Resources are nouns (`/plants`, `/clients`, `/service-visits`)
- HTTP methods map to CRUD operations (GET, POST, PUT, DELETE)
- Nested resources for strong relationships (`/clients/:id/locations`)
- Consistent response envelope: `{ success, data, error, pagination }`

### Versioning

All API routes are prefixed with `/api/v1`. This allows future breaking changes to be deployed at `/api/v2` without disrupting existing integrations.

### Authentication Flow

```
  +--------+                     +----------+                  +----------+
  | Client |                     | Frontend |                  | Backend  |
  +---+----+                     +----+-----+                  +----+-----+
      |                               |                             |
      |  1. Enter credentials         |                             |
      |------------------------------>|                             |
      |                               |  2. POST /auth/login        |
      |                               |---------------------------->|
      |                               |                             |
      |                               |  3. Validate credentials    |
      |                               |     Hash comparison (bcrypt)|
      |                               |                             |
      |                               |  4. Generate JWT tokens     |
      |                               |     (access + refresh)      |
      |                               |<----------------------------|
      |  5. Store in NextAuth session  |                             |
      |<------------------------------|                             |
      |                               |                             |
      |  6. Authenticated request      |                             |
      |------------------------------>|  7. Bearer token in header  |
      |                               |---------------------------->|
      |                               |                             |
      |                               |  8. Verify JWT              |
      |                               |     Extract user + role     |
      |                               |                             |
      |                               |  9. Authorization check     |
      |                               |     (role-based)            |
      |                               |<----------------------------|
      |  10. Response                  |                             |
      |<------------------------------|                             |
      |                               |                             |
      |  --- Token Refresh Flow ---   |                             |
      |                               |                             |
      |  11. Access token expired      |                             |
      |------------------------------>|                             |
      |                               |  12. POST /auth/refresh     |
      |                               |      (with refresh token)   |
      |                               |---------------------------->|
      |                               |  13. New access token       |
      |                               |<----------------------------|
      |  14. Retry original request    |                             |
      |<------------------------------|                             |
```

### Google OAuth Flow

```
  +--------+        +-----------+        +----------+        +---------+
  | Client |        |  Frontend |        |  Backend |        | Google  |
  +---+----+        +-----+-----+        +----+-----+        +----+----+
      |                   |                    |                   |
      | Click "Sign in    |                    |                   |
      | with Google"      |                    |                   |
      |------------------>|                    |                   |
      |                   | Redirect to Google |                   |
      |                   |-------------------------------------------->|
      |                   |                    |                   |
      |                   |              Google consent screen     |
      |<--------------------------------------------------------------|
      |                   |                    |                   |
      | Authorize         |                    |                   |
      |-------------------------------------------------------------->|
      |                   |                    |                   |
      |                   | Callback with code |                   |
      |                   |<-------------------------------------------|
      |                   |                    |                   |
      |                   | POST /auth/google  |                   |
      |                   | (profile + token)  |                   |
      |                   |------------------->|                   |
      |                   |                    |                   |
      |                   |  Find or create    |                   |
      |                   |  user, issue JWT   |                   |
      |                   |<-------------------|                   |
      |  Authenticated    |                    |                   |
      |<------------------|                    |                   |
```

### Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": []
  }
}
```

Standard HTTP status codes are used: 400, 401, 403, 404, 409, 422, 429, 500.

### Input Validation

- All request bodies are validated using Zod schemas on the backend
- Frontend forms use React Hook Form with Zod resolvers for client-side validation
- Path parameters are validated as UUIDs
- Query parameters have defaults and type coercion

---

## Deployment Architecture

```
                          AWS Cloud (ap-south-1)
  +----------------------------------------------------------------------+
  |                                                                      |
  |   Route 53 (DNS)                                                     |
  |   app.vriksham.com --> ALB                                           |
  |   api.vriksham.com --> ALB                                           |
  |                                                                      |
  |   +-------------------+                                              |
  |   | Application Load  |                                              |
  |   | Balancer (ALB)    |                                              |
  |   | + ACM SSL/TLS     |                                              |
  |   +--------+----------+                                              |
  |            |                                                         |
  |     +------+------+                                                  |
  |     |             |                                                  |
  |  +--v---+     +---v---+                                              |
  |  | ECS  |     | ECS   |                                              |
  |  |Fargate|    |Fargate |                                              |
  |  |Front |     |Back   |                                              |
  |  |:3000 |     |:4000  |                                              |
  |  +------+     +---+---+                                              |
  |                    |                                                  |
  |          +---------+---------+                                       |
  |          |                   |                                       |
  |   +------v------+    +------v------+                                 |
  |   |  RDS        |    | ElastiCache |                                 |
  |   |  PostgreSQL |    | Redis       |                                 |
  |   |  (Multi-AZ) |    | (Cluster)   |                                 |
  |   +-------------+    +-------------+                                 |
  |                                                                      |
  |   +-------------+    +-------------+                                 |
  |   | S3 Bucket   |    | CloudWatch  |                                 |
  |   | (Uploads)   |    | (Logs +     |                                 |
  |   +-------------+    |  Metrics)   |                                 |
  |                       +-------------+                                 |
  +----------------------------------------------------------------------+
```

### Scaling Strategy

- **Frontend**: ECS Fargate with auto-scaling (2-6 tasks) based on CPU/memory
- **Backend**: ECS Fargate with auto-scaling (2-8 tasks) based on request count
- **Database**: RDS PostgreSQL with read replicas for heavy read workloads
- **Cache**: ElastiCache Redis cluster with automatic failover
- **CDN**: CloudFront can be placed in front of the ALB for global edge caching

### Security Measures

- All traffic encrypted via TLS (ACM certificates)
- VPC with private subnets for database and cache
- Security groups restrict access between services
- WAF rules on ALB for DDoS protection
- Secrets stored in AWS Secrets Manager
- IAM roles with least-privilege access
- Helmet.js security headers on all responses
- CORS restricted to known origins
- Rate limiting on all API endpoints
- JWT tokens with short expiry and refresh rotation
