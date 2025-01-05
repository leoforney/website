FROM oven/bun:alpine

# Install Puppeteer dependencies
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ttf-freefont

# Set up working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN bun install

# Copy source code
COPY . .

CMD ["bun", "app.ts"]
