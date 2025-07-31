#!/bin/bash

# Railway Database Migration Script
echo "🗄️ Running database migrations..."

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed successfully"
else
    echo "❌ Database migrations failed"
    exit 1
fi

echo "🌱 Seeding database (optional)..."
# Uncomment if you have a seed file
# npm run seed

echo "🎉 Database setup complete!"