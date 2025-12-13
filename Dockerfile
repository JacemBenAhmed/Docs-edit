FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# Build arguments for environment variables
ARG VITE_API_BASE
ARG VITE_GOOGLE_CLIENT_ID

# Set environment variables for build
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY


# Build the application

RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:5173"]
