# ----------------------------
# Stage 1: Builder
# ----------------------------
# Changed from alpine to slim to support ONNX/glibc
FROM node:24-slim AS builder

WORKDIR /app

# Copy config files
COPY package*.json tsconfig.json ./

# Install ALL dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# ----------------------------
# Stage 2: Production
# ----------------------------
# Changed from alpine to slim here as well
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
# Environment variable for Hugging Face cache

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Start command
CMD ["npm", "start"]