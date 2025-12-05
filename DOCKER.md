# Docker Setup Guide

This guide explains how to build and run the Docs Edit application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Quick Start

### Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker-compose up -d --build
```

2. Access the application:
   - Open your browser and navigate to `http://localhost:3000`

3. Stop the container:
```bash
docker-compose down
```

### Using Docker directly

1. Build the Docker image:
```bash
docker build -t docs-edit:latest .
```

2. Run the container:
```bash
docker run -d -p 3000:80 --name docs-edit-frontend docs-edit:latest
```

3. Access the application:
   - Open your browser and navigate to `http://localhost:3000`

4. Stop the container:
```bash
docker stop docs-edit-frontend
docker rm docs-edit-frontend
```

## Environment Variables

If you need to set environment variables, you can:

1. Create a `.env` file in the project root
2. Add your environment variables:
```env
VITE_API_BASE=http://your-api-url
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

3. Update the Dockerfile to copy and use the `.env` file, or use docker-compose environment section.

## Production Deployment

For production deployment:

1. Update `nginx.conf` with your domain name
2. Build the image:
```bash
docker build -t docs-edit:production .
```

3. Run with production settings:
```bash
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name docs-edit-prod \
  --restart unless-stopped \
  docs-edit:production
```

## Troubleshooting

### Container won't start
- Check logs: `docker logs docs-edit-frontend`
- Verify port 3000 is not in use: `netstat -an | grep 3000`

### Build fails
- Ensure Node.js version matches (^20.19.0 || >=22.12.0)
- Clear Docker cache: `docker builder prune`

### Application not accessible
- Check if container is running: `docker ps`
- Verify port mapping: `docker port docs-edit-frontend`

## Docker Commands Reference

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs docs-edit-frontend

# Follow logs in real-time
docker logs -f docs-edit-frontend

# Execute command in running container
docker exec -it docs-edit-frontend sh

# Remove container
docker rm docs-edit-frontend

# Remove image
docker rmi docs-edit:latest

# Clean up unused resources
docker system prune
```

