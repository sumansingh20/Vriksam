#!/usr/bin/env bash
# ============================================================
# VRIKSHAM - Database Seed Script
# Seeds the database with initial/demo data
# ============================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_DIR/backend"

print_header() {
  echo ""
  echo -e "${CYAN}============================================================${NC}"
  echo -e "${CYAN}  VRIKSHAM - Database Seed${NC}"
  echo -e "${CYAN}============================================================${NC}"
  echo ""
}

print_step() {
  echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# ----------------------------------------------------------
# Check environment
# ----------------------------------------------------------

check_env() {
  print_step "Checking environment..."

  if [ ! -f "$BACKEND_DIR/.env" ]; then
    print_error "backend/.env file not found. Run scripts/setup.sh first."
    exit 1
  fi

  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed."
    exit 1
  fi

  if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    print_error "Backend dependencies not installed. Run: cd backend && npm ci"
    exit 1
  fi

  print_success "Environment checks passed"
}

# ----------------------------------------------------------
# Check database connection
# ----------------------------------------------------------

check_database() {
  print_step "Checking database connection..."

  cd "$BACKEND_DIR"
  if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection successful"
  else
    print_error "Cannot connect to database. Ensure PostgreSQL is running."
    print_error "Start it with: cd docker && docker compose up -d postgres"
    exit 1
  fi
}

# ----------------------------------------------------------
# Reset database (optional)
# ----------------------------------------------------------

reset_database() {
  if [ "${1:-}" = "--reset" ] || [ "${1:-}" = "-r" ]; then
    print_step "Resetting database..."
    cd "$BACKEND_DIR"
    npx prisma migrate reset --force
    print_success "Database reset and migrations applied"
  fi
}

# ----------------------------------------------------------
# Run seed
# ----------------------------------------------------------

run_seed() {
  print_step "Generating Prisma Client..."
  cd "$BACKEND_DIR"
  npx prisma generate
  print_success "Prisma Client generated"

  print_step "Running database seed..."
  npx prisma db seed
  print_success "Database seeded successfully"
}

# ----------------------------------------------------------
# Main
# ----------------------------------------------------------

main() {
  print_header

  case "${1:-}" in
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --reset, -r    Reset database before seeding (WARNING: destroys all data)"
      echo "  --help, -h     Show this help message"
      echo ""
      exit 0
      ;;
  esac

  check_env
  check_database
  reset_database "${1:-}"
  run_seed

  echo ""
  echo -e "${GREEN}============================================================${NC}"
  echo -e "${GREEN}  Seeding Complete!${NC}"
  echo -e "${GREEN}============================================================${NC}"
  echo ""
  echo -e "  You can verify the data with Prisma Studio:"
  echo -e "    cd backend && npx prisma studio"
  echo ""
}

main "$@"
