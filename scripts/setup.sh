#!/usr/bin/env bash
# ============================================================
# VRIKSHAM - Development Setup Script
# Sets up the local development environment from scratch
# ============================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ----------------------------------------------------------
# Helper functions
# ----------------------------------------------------------

print_header() {
  echo ""
  echo -e "${CYAN}============================================================${NC}"
  echo -e "${CYAN}  VRIKSHAM - Development Setup${NC}"
  echo -e "${CYAN}  Green Infrastructure SaaS Platform${NC}"
  echo -e "${CYAN}============================================================${NC}"
  echo ""
}

print_step() {
  echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

check_command() {
  if command -v "$1" &> /dev/null; then
    local version
    version=$($1 --version 2>/dev/null | head -n1)
    print_success "$1 found: $version"
    return 0
  else
    print_error "$1 is not installed"
    return 1
  fi
}

# ----------------------------------------------------------
# Prerequisites check
# ----------------------------------------------------------

check_prerequisites() {
  print_step "Checking prerequisites..."
  local missing=0

  if ! check_command "node"; then
    print_error "Please install Node.js >= 20: https://nodejs.org/"
    missing=1
  else
    local node_major
    node_major=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$node_major" -lt 20 ]; then
      print_error "Node.js >= 20 required. Current: $(node -v)"
      missing=1
    fi
  fi

  if ! check_command "npm"; then
    print_error "Please install npm >= 9: https://www.npmjs.com/"
    missing=1
  fi

  if ! check_command "docker"; then
    print_warning "Docker not found. Required for database setup."
    print_warning "Install Docker: https://docs.docker.com/get-docker/"
    missing=1
  fi

  if ! check_command "docker"; then
    true
  elif ! docker compose version &> /dev/null; then
    print_warning "Docker Compose v2 not found. Required for database setup."
    missing=1
  else
    print_success "Docker Compose found: $(docker compose version --short 2>/dev/null || echo 'unknown')"
  fi

  if [ "$missing" -eq 1 ]; then
    print_error "Some prerequisites are missing. Please install them and try again."
    exit 1
  fi

  print_success "All prerequisites satisfied"
  echo ""
}

# ----------------------------------------------------------
# Environment files
# ----------------------------------------------------------

setup_env_files() {
  print_step "Setting up environment files..."

  # Backend .env
  if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    cp "$PROJECT_DIR/backend/.env.example" "$PROJECT_DIR/backend/.env"
    print_success "Created backend/.env from .env.example"
  else
    print_warning "backend/.env already exists, skipping"
  fi

  # Docker .env
  if [ ! -f "$PROJECT_DIR/docker/.env" ]; then
    cp "$PROJECT_DIR/docker/.env.example" "$PROJECT_DIR/docker/.env"
    print_success "Created docker/.env from .env.example"
  else
    print_warning "docker/.env already exists, skipping"
  fi

  # Frontend .env.local
  if [ ! -f "$PROJECT_DIR/frontend/.env.local" ]; then
    cat > "$PROJECT_DIR/frontend/.env.local" << 'ENVEOF'
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
ENVEOF
    print_success "Created frontend/.env.local"
  else
    print_warning "frontend/.env.local already exists, skipping"
  fi

  echo ""
}

# ----------------------------------------------------------
# Install dependencies
# ----------------------------------------------------------

install_dependencies() {
  print_step "Installing frontend dependencies..."
  cd "$PROJECT_DIR/frontend"
  npm ci
  print_success "Frontend dependencies installed"

  print_step "Installing backend dependencies..."
  cd "$PROJECT_DIR/backend"
  npm ci
  print_success "Backend dependencies installed"

  echo ""
}

# ----------------------------------------------------------
# Database setup
# ----------------------------------------------------------

setup_database() {
  print_step "Starting PostgreSQL with Docker..."
  cd "$PROJECT_DIR/docker"
  docker compose up -d postgres redis
  print_success "PostgreSQL and Redis containers started"

  print_step "Waiting for PostgreSQL to be ready..."
  local retries=30
  while [ $retries -gt 0 ]; do
    if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
      print_success "PostgreSQL is ready"
      break
    fi
    retries=$((retries - 1))
    sleep 2
  done

  if [ $retries -eq 0 ]; then
    print_error "PostgreSQL did not become ready in time"
    exit 1
  fi

  print_step "Running Prisma migrations..."
  cd "$PROJECT_DIR/backend"
  npx prisma generate
  npx prisma migrate dev --name init
  print_success "Database migrations applied"

  print_step "Seeding database..."
  npx prisma db seed
  print_success "Database seeded with initial data"

  echo ""
}

# ----------------------------------------------------------
# Main
# ----------------------------------------------------------

main() {
  print_header
  check_prerequisites
  setup_env_files
  install_dependencies
  setup_database

  echo ""
  echo -e "${GREEN}============================================================${NC}"
  echo -e "${GREEN}  Setup Complete!${NC}"
  echo -e "${GREEN}============================================================${NC}"
  echo ""
  echo -e "  ${CYAN}Frontend:${NC}  http://localhost:3000"
  echo -e "  ${CYAN}Backend:${NC}   http://localhost:4000"
  echo -e "  ${CYAN}API Docs:${NC}  http://localhost:4000/api/v1/health"
  echo -e "  ${CYAN}Prisma:${NC}    http://localhost:5555 (run: cd backend && npx prisma studio)"
  echo ""
  echo -e "  ${YELLOW}To start development:${NC}"
  echo -e "    Terminal 1: cd frontend && npm run dev"
  echo -e "    Terminal 2: cd backend && npm run dev"
  echo ""
  echo -e "  ${YELLOW}Or use Docker:${NC}"
  echo -e "    cd docker && docker compose -f docker-compose.yml -f docker-compose.dev.yml up"
  echo ""
}

main "$@"
