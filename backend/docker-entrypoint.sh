#!/bin/sh
set -e

echo "==> Running Prisma database migrations..."
npx prisma migrate deploy

echo "==> Seeding database (admin user, products, customers, orders)..."
npx prisma db seed || echo "Seed skipped or already populated."

echo "==> Starting backend server on port 3000..."
exec node dist/index.js

