FROM node:22-bookworm-slim

# LaTeX for the PDF feature (xelatex plus the packages resume-pdf.js uses)
RUN apt-get update \
 && apt-get install -y --no-install-recommends texlive-xetex texlive-latex-extra texlive-fonts-recommended fonts-lmodern \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Server dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Client dependencies and build (creates client/dist)
COPY client/package*.json client/
RUN cd client && npm ci

COPY . .
RUN cd client && npm run build

ENV NODE_ENV=production
CMD ["node", "server.js"]
