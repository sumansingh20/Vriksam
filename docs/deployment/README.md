# VRIKSHAM Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [AWS Deployment Guide](#aws-deployment-guide)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Database Migration Commands](#database-migration-commands)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software       | Minimum Version | Installation                                |
|----------------|-----------------|---------------------------------------------|
| Node.js        | 20.0.0          | https://nodejs.org/ or use nvm              |
| npm            | 9.0.0           | Bundled with Node.js                        |
| Docker         | 24.0+           | https://docs.docker.com/get-docker/         |
| Docker Compose | 2.20+           | Bundled with Docker Desktop                 |
| Git            | 2.40+           | https://git-scm.com/                        |
| PostgreSQL     | 16 (optional)   | Only if running without Docker              |

### Required Accounts (for full functionality)

| Service        | Purpose                      | Sign Up                              |
|----------------|------------------------------|--------------------------------------|
| Google Cloud   | OAuth 2.0 authentication     | https://console.cloud.google.com/    |
| Stripe         | Payment processing           | https://dashboard.stripe.com/        |
| OpenAI         | AI plant health analysis     | https://platform.openai.com/         |
| AWS            | Production hosting           | https://aws.amazon.com/              |

---

## Local Development Setup

### Quick Start (automated)

```bash
# Clone the repository
git clone https://github.com/vriksham/vriksham.git
cd vriksham

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

The setup script will:
1. Verify prerequisites (Node.js, npm, Docker)
2. Copy environment files from templates
3. Install frontend and backend dependencies
4. Start PostgreSQL and Redis via Docker
5. Run Prisma migrations
6. Seed the database with initial data

### Manual Setup

#### Step 1: Clone and install

```bash
git clone https://github.com/vriksham/vriksham.git
cd vriksham

# Install frontend dependencies
cd frontend
npm ci

# Install backend dependencies
cd ../backend
npm ci
```

#### Step 2: Configure environment

```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend environment
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
EOF
```

#### Step 3: Start database

```bash
cd docker
docker compose up -d postgres redis
```

#### Step 4: Run migrations and seed

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

#### Step 5: Start development servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1
- Prisma Studio: Run `cd backend && npx prisma studio` to open at http://localhost:5555

---

## Docker Deployment

### Development with Docker

Use Docker Compose with the dev override for hot-reloading:

```bash
cd docker

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services with hot reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or start in detached mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker compose logs -f frontend
docker compose logs -f backend

# Stop all services
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### Production with Docker

```bash
cd docker

# Copy and configure environment
cp .env.example .env
# Edit .env with production values (strong passwords, real API keys)

# Build and start all services
docker compose up -d --build

# Run migrations against the containerized database
docker compose exec backend npx prisma migrate deploy

# Seed the database (first deployment only)
docker compose exec backend npx prisma db seed

# View status
docker compose ps

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: destroys data)
docker compose down -v
```

### Building Individual Images

```bash
# Build frontend image
docker build -f docker/Dockerfile.frontend -t vriksham-frontend:latest .

# Build backend image
docker build -f docker/Dockerfile.backend -t vriksham-backend:latest .

# Run frontend container
docker run -p 3000:3000 --env-file docker/.env vriksham-frontend:latest

# Run backend container
docker run -p 4000:4000 --env-file docker/.env vriksham-backend:latest
```

---

## AWS Deployment Guide

### Architecture Overview

The production deployment uses AWS ECS Fargate for container orchestration:

- **ECS Fargate**: Runs frontend and backend containers
- **RDS PostgreSQL**: Managed database with Multi-AZ
- **ElastiCache Redis**: Managed Redis cluster
- **ALB**: Application Load Balancer with SSL termination
- **ECR**: Docker image registry
- **S3**: File uploads storage
- **Route 53**: DNS management
- **ACM**: SSL/TLS certificates

### Step 1: AWS Infrastructure Setup

#### Create ECR Repositories

```bash
aws ecr create-repository --repository-name vriksham-frontend --region ap-south-1
aws ecr create-repository --repository-name vriksham-backend --region ap-south-1
```

#### Create RDS PostgreSQL Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier vriksham-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 16.1 \
  --master-username postgres \
  --master-user-password <strong-password> \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids <sg-id> \
  --db-subnet-group-name <subnet-group> \
  --multi-az \
  --backup-retention-period 7 \
  --region ap-south-1
```

#### Create ElastiCache Redis Cluster

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id vriksham-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --region ap-south-1
```

#### Create S3 Bucket

```bash
aws s3 mb s3://vriksham-uploads --region ap-south-1
aws s3api put-bucket-cors --bucket vriksham-uploads --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["https://app.vriksham.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }]
}'
```

### Step 2: Build and Push Images

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

# Build and push frontend
docker build -f docker/Dockerfile.frontend -t <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vriksham-frontend:latest .
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vriksham-frontend:latest

# Build and push backend
docker build -f docker/Dockerfile.backend -t <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vriksham-backend:latest .
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/vriksham-backend:latest
```

### Step 3: Deploy with ECS

Create task definitions and services using the AWS Console or CLI. The GitHub Actions CD pipeline (`.github/workflows/deploy.yml`) automates this process on tagged releases.

To trigger a deployment:

```bash
# Create a version tag
git tag v1.0.0
git push origin v1.0.0
```

The CD pipeline will:
1. Build Docker images
2. Push to ECR
3. Run database migrations
4. Update ECS task definitions
5. Deploy to ECS services
6. Run health checks

### Step 4: DNS and SSL

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name app.vriksham.com \
  --subject-alternative-names api.vriksham.com \
  --validation-method DNS \
  --region ap-south-1

# Create Route 53 records pointing to ALB
# (use AWS Console for ALIAS records)
```

---

## Environment Variables Reference

### Backend Environment Variables

| Variable                 | Required | Default                         | Description                          |
|--------------------------|----------|---------------------------------|--------------------------------------|
| `NODE_ENV`               | Yes      | `development`                   | Environment: development, production |
| `PORT`                   | No       | `4000`                          | Server port                          |
| `API_PREFIX`             | No       | `/api/v1`                       | API route prefix                     |
| `DATABASE_URL`           | Yes      | -                               | PostgreSQL connection string         |
| `REDIS_URL`              | No       | -                               | Redis connection string              |
| `JWT_SECRET`             | Yes      | -                               | JWT signing secret (min 32 chars)    |
| `JWT_EXPIRES_IN`         | No       | `7d`                            | Access token expiry                  |
| `JWT_REFRESH_SECRET`     | Yes      | -                               | Refresh token signing secret         |
| `JWT_REFRESH_EXPIRES_IN` | No       | `30d`                           | Refresh token expiry                 |
| `GOOGLE_CLIENT_ID`       | No       | -                               | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET`   | No       | -                               | Google OAuth client secret           |
| `GOOGLE_CALLBACK_URL`    | No       | `.../auth/google/callback`      | Google OAuth callback URL            |
| `STRIPE_SECRET_KEY`      | No       | -                               | Stripe API secret key                |
| `STRIPE_WEBHOOK_SECRET`  | No       | -                               | Stripe webhook signing secret        |
| `OPENAI_API_KEY`         | No       | -                               | OpenAI API key for AI features       |
| `OPENAI_MODEL`           | No       | `gpt-4o`                        | OpenAI model to use                  |
| `OPENAI_MAX_TOKENS`      | No       | `1024`                          | Max tokens for AI responses          |
| `AWS_ACCESS_KEY_ID`      | No       | -                               | AWS access key for S3                |
| `AWS_SECRET_ACCESS_KEY`  | No       | -                               | AWS secret key for S3                |
| `AWS_REGION`             | No       | `ap-south-1`                    | AWS region                           |
| `AWS_S3_BUCKET`          | No       | `vriksham-uploads`              | S3 bucket name                       |
| `SMTP_HOST`              | No       | `smtp.gmail.com`                | SMTP server hostname                 |
| `SMTP_PORT`              | No       | `587`                           | SMTP server port                     |
| `SMTP_USER`              | No       | -                               | SMTP username                        |
| `SMTP_PASS`              | No       | -                               | SMTP password                        |
| `EMAIL_FROM`             | No       | `noreply@vriksham.com`          | From address for emails              |
| `FRONTEND_URL`           | Yes      | `http://localhost:3000`         | Frontend URL (for CORS, redirects)   |
| `CORS_ORIGINS`           | No       | `http://localhost:3000`         | Comma-separated allowed origins      |
| `LOG_LEVEL`              | No       | `debug` / `info`                | Winston log level                    |
| `RATE_LIMIT_WINDOW_MS`   | No       | `900000`                        | Rate limit window (15 min)           |
| `RATE_LIMIT_MAX_REQUESTS`| No       | `100`                           | Max requests per window              |

### Frontend Environment Variables

| Variable                              | Required | Default                        | Description                     |
|---------------------------------------|----------|--------------------------------|---------------------------------|
| `NEXT_PUBLIC_API_URL`                 | Yes      | `http://localhost:4000/api/v1` | Backend API URL                 |
| `NEXT_PUBLIC_APP_URL`                 | Yes      | `http://localhost:3000`        | Frontend app URL                |
| `NEXTAUTH_URL`                        | Yes      | `http://localhost:3000`        | NextAuth base URL               |
| `NEXTAUTH_SECRET`                     | Yes      | -                              | NextAuth encryption secret      |
| `GOOGLE_CLIENT_ID`                    | No       | -                              | Google OAuth client ID          |
| `GOOGLE_CLIENT_SECRET`                | No       | -                              | Google OAuth client secret      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  | No       | -                              | Stripe public key               |

---

## Database Migration Commands

### Development

```bash
cd backend

# Create a new migration (after schema changes)
npx prisma migrate dev --name <description>

# Apply pending migrations
npx prisma migrate dev

# Reset database (drops all data, re-applies migrations, re-seeds)
npx prisma migrate reset

# Generate Prisma Client (after schema changes)
npx prisma generate

# Seed the database
npx prisma db seed

# Open Prisma Studio (visual database browser)
npx prisma studio

# Format the schema file
npx prisma format

# Validate the schema file
npx prisma validate
```

### Production

```bash
cd backend

# Apply pending migrations (safe for production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Resolve failed migration (mark as applied or rolled back)
npx prisma migrate resolve --applied <migration-name>
npx prisma migrate resolve --rolled-back <migration-name>
```

### Docker Context

```bash
cd docker

# Run migration inside container
docker compose exec backend npx prisma migrate deploy

# Seed database inside container
docker compose exec backend npx prisma db seed

# Open Prisma Studio from container
docker compose exec backend npx prisma studio
```

---

## Troubleshooting

### Common Issues

#### "Cannot connect to database"

```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Solution:**
1. Verify PostgreSQL is running: `docker compose ps`
2. Check the connection string in `.env`: `DATABASE_URL=postgresql://postgres:password@localhost:5432/vriksham`
3. Restart the database: `docker compose restart postgres`
4. Check if the port is in use: `lsof -i :5432` (macOS/Linux) or `netstat -ano | findstr 5432` (Windows)

#### "Prisma Client not generated"

```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
cd backend
npx prisma generate
```

#### "Migration failed"

```
Error: P3009: migrate found failed migrations
```

**Solution:**
```bash
# In development, reset the database
npx prisma migrate reset

# In production, resolve the failed migration
npx prisma migrate resolve --rolled-back <migration-name>
npx prisma migrate deploy
```

#### "Port already in use"

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find the process using the port
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### "Docker build fails on node_modules"

**Solution:**
Make sure you have a `.dockerignore` in the project root:
```
node_modules
.next
dist
.env
```

#### "CORS error in browser"

```
Access to fetch has been blocked by CORS policy
```

**Solution:**
1. Check `CORS_ORIGINS` in backend `.env` includes the frontend URL
2. Verify `FRONTEND_URL` is set correctly
3. Ensure the backend is accessible at the URL specified in `NEXT_PUBLIC_API_URL`

#### "JWT token expired"

```json
{ "error": { "code": "UNAUTHORIZED", "message": "Token expired" } }
```

**Solution:** The frontend should automatically refresh tokens via NextAuth. If this fails:
1. Check that `JWT_REFRESH_SECRET` is consistent between restarts
2. Verify the refresh endpoint is accessible
3. Clear browser cookies and re-login

#### "Stripe webhook not receiving events"

**Solution:**
1. Verify webhook endpoint is registered in Stripe Dashboard
2. Check `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret
3. For local development, use Stripe CLI: `stripe listen --forward-to localhost:4000/api/v1/payments/webhooks/stripe`

#### "OpenAI API rate limit"

```
Error: 429 Too Many Requests
```

**Solution:**
1. The AI endpoints have built-in rate limiting (10 requests/minute)
2. Check your OpenAI account usage and billing
3. Consider caching AI responses for identical inputs

### Getting Help

- Check the [API documentation](../api/README.md) for endpoint details
- Review the [architecture documentation](../architecture/README.md) for system design
- Open an issue on GitHub with reproduction steps
