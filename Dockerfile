# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy only package files to leverage cache
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install runtime dependencies
RUN apk add --no-cache libc6-compat curl

# Create app user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership for non-root user
RUN chown -R nextjs:nodejs /app/public /app/prisma /app/.next

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Define environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Add environment variables for sensitive data (Optional fallback)
ENV STRIPE_SECRET_KEY="sk_test_51OsxwGDpUyM8uB9PTvjowmYafP3CplSXGRl7lJ9t6QYIP4rVbM9y67bQ5Fc74XKBqqG5deTAHFLaRqvAYkKRPzKX00GiQxk7qD" \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51OsxwGDpUyM8uB9Pp67ZAZPBOsNHCUPrNq22M5ueYVnC8BrYv5ZiLqowkIc0CmzkgOQqOXUPhD6pZjD4p2VGrZQW00P8M9xLwJ" \
    STRIPE_WEBHOOK_SECRET="whsec_4e93b94c1d7960ef3fc2b77600a1c8926dd874243ceae92da59414f64a71b788"

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
