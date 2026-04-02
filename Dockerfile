FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files needed for build
COPY tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs ./
COPY src ./src
COPY public ./public

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts
COPY --from=deps /app/.next .next
COPY --from=deps /app/public public
COPY --from=deps /app/node_modules node_modules

# Copy config and scripts
COPY --from=deps /app/package.json .
COPY --from=deps /app/tsconfig.json .
COPY --from=deps /app/src src

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]
