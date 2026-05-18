<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository customized as a reusable MongoDB backend boilerplate.

# NestJS Boilerplate MongoDB

A clean, reusable NestJS backend boilerplate for building production-ready REST APIs with MongoDB. It includes authentication, role-based authorization, Swagger documentation, global response/error handling, file upload support, email helper, Stripe payment flow, and a ready module structure.

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT, bcrypt |
| Docs | Swagger |
| Upload | Multer, Cloudinary |
| Email | Nodemailer |
| Payment | Stripe |
| Testing | Jest, Supertest |

## Main Features

- JWT register, login, password reset, and change-password flow
- Access token and refresh token support
- Role-based guard for `user` and `admin`
- MongoDB models with Mongoose schemas
- Global response format with interceptor
- Global exception filter for validation, MongoDB, JWT, multer, Cloudinary, Axios, and syntax errors
- Pagination, filtering, searching, and sorting helpers
- Swagger API documentation
- Optional Cloudinary image upload
- Optional email sending helper
- Optional Stripe payment intent and webhook flow
- Unit and e2e smoke tests

## Project Structure

```txt
src
|-- app.controller.ts
|-- app.module.ts
|-- app.service.ts
|-- main.ts
`-- app
    |-- config
    |-- errors
    |-- helpers
    |-- middlewares
    |-- module
    |   |-- auth
    |   |-- contact
    |   |-- dashboard
    |   |-- payment
    |   |-- subscribe
    |   |-- user
    |   `-- webhook
    `-- utils
```

## Requirements

- Node.js 20 or newer recommended
- npm
- MongoDB local server or MongoDB Atlas URI

## Project Setup

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your own values. For local MongoDB, this default URI works if MongoDB is running locally:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nestjs_boilerplate
```

## Compile And Run The Project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run build
npm run start:prod
```

Open:

```txt
API:     http://localhost:5000/api/v1
Swagger: http://localhost:5000/api/docs
Health:  http://localhost:5000
```

## Environment Variables

Core app config:

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | Yes | `development` | Runtime environment |
| `PORT` | Yes | `5000` | Server port |
| `APP_NAME` | Yes | `My API` | App name used in Swagger and health response |
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/app` | MongoDB connection string |
| `CORS_ORIGIN` | Yes | `http://localhost:3000` | Frontend origin allowed by CORS |

Auth config:

| Variable | Required | Purpose |
| --- | --- | --- |
| `BCRYPT_SALT_ROUNDS` | Yes | Password hashing rounds |
| `ACCESS_TOKEN_SECRET` | Yes | JWT access token secret |
| `ACCESS_TOKEN_EXPIRES` | Yes | Access token expiry |
| `REFRESH_TOKEN_SECRET` | Yes | JWT refresh token secret |
| `REFRESH_TOKEN_EXPIRES` | Yes | Refresh token expiry |

Optional services:

| Service | Required Variables |
| --- | --- |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` |
| Email | `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_ADDRESS`, `EMAIL_PASS`, `EMAIL_FROM`, `EMAIL_SENDER_NAME` |
| Stripe | `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |

Cloudinary, email, and Stripe are optional at app startup. If their values are empty, the server still runs. Related endpoints/helpers will return a clear configuration error until you set the required values.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run start` | Start NestJS app |
| `npm run start:dev` | Start app in watch mode |
| `npm run start:debug` | Start app in debug watch mode |
| `npm run build` | Build project into `dist` |
| `npm run start:prod` | Run production build |
| `npm run lint` | Run ESLint and auto-fix |
| `npm run format` | Format source and test files |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
| `npm run test:cov` | Run tests with coverage |

## Run Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Overview

All module routes use this prefix:

```txt
/api/v1
```

Important routes:

| Module | Method | Endpoint | Access |
| --- | --- | --- | --- |
| Health | `GET` | `/` | Public |
| Auth | `POST` | `/api/v1/auth/register` | Public |
| Auth | `POST` | `/api/v1/auth/login` | Public |
| Auth | `POST` | `/api/v1/auth/forgot-password` | Public |
| Auth | `POST` | `/api/v1/auth/verify` | Public |
| Auth | `POST` | `/api/v1/auth/reset-password` | Public |
| Auth | `POST` | `/api/v1/auth/change-password` | User/Admin |
| User | `POST` | `/api/v1/user` | Admin |
| User | `GET` | `/api/v1/user` | Admin |
| User | `GET` | `/api/v1/user/profile` | User/Admin |
| User | `PUT` | `/api/v1/user/profile` | User/Admin |
| User | `GET` | `/api/v1/user/:id` | Admin |
| User | `PUT` | `/api/v1/user/:id` | Admin |
| User | `DELETE` | `/api/v1/user/:id` | Admin |
| Contact | `POST` | `/api/v1/contact` | Public |
| Contact | `GET` | `/api/v1/contact` | Admin |
| Contact | `GET` | `/api/v1/contact/:id` | Public |
| Contact | `PUT` | `/api/v1/contact/:id` | Admin |
| Contact | `DELETE` | `/api/v1/contact/:id` | Admin |
| Subscribe | `POST` | `/api/v1/subscribe` | Admin |
| Subscribe | `GET` | `/api/v1/subscribe` | Public |
| Subscribe | `GET` | `/api/v1/subscribe/:id` | Public |
| Subscribe | `PATCH` | `/api/v1/subscribe/:id` | Admin |
| Subscribe | `DELETE` | `/api/v1/subscribe/:id` | Admin |
| Payment | `POST` | `/api/v1/payment/:subscribeId` | User |
| Payment | `GET` | `/api/v1/payment` | Admin |
| Payment | `GET` | `/api/v1/payment/:id` | Public |
| Dashboard | `GET` | `/api/v1/dashboard/overview` | Admin |
| Dashboard | `GET` | `/api/v1/dashboard/chart` | Admin |
| Webhook | `POST` | `/api/v1/webhook` | Stripe |

For exact request bodies, open Swagger:

```txt
http://localhost:5000/api/docs
```

## Authentication Flow

Register a user:

```http
POST /api/v1/auth/register
```

Login:

```http
POST /api/v1/auth/login
```

The login response returns an `accessToken`. Use it in protected routes:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Swagger also supports bearer token authorization. Click `Authorize`, paste your token, and test protected endpoints from the browser.

## Common Development Workflow

1. Create or update a module inside `src/app/module`.
2. Add DTO validation with `class-validator`.
3. Add schema/entity with Mongoose decorators.
4. Register the schema in the module with `MongooseModule.forFeature`.
5. Add service logic.
6. Add controller endpoints.
7. Protect routes with `AuthGuard('admin')`, `AuthGuard('user')`, or both.
8. Check Swagger docs.
9. Run build, lint, and tests.

```bash
npm run build
npm run lint
npm test
npm run test:e2e
```

## Response Format

Successful API responses are normalized:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Request successfully completed",
  "meta": null,
  "data": {}
}
```

Error responses are normalized:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errorSources": [
    {
      "path": "email",
      "message": "Valid email is required"
    }
  ],
  "stack": null
}
```

In development, `stack` is included for easier debugging.

## Pagination, Search, Filter, Sort

List endpoints commonly support:

| Query | Example | Purpose |
| --- | --- | --- |
| `page` | `1` | Page number |
| `limit` | `10` | Items per page |
| `sortBy` | `createdAt` | Field to sort |
| `sortOrder` | `desc` | `asc` or `desc` |
| `searchTerm` | `john` | Text search across configured fields |

Example:

```txt
GET /api/v1/user?page=1&limit=10&sortBy=createdAt&sortOrder=desc&searchTerm=john
```

## Stripe Webhook Setup

Set these values in `.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

Webhook endpoint:

```txt
POST /api/v1/webhook
```

For local testing with Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/v1/webhook
```

Copy the generated webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Production Docker And Deployment Guide

This boilerplate is ready for two deployment styles:

1. Manual Docker deployment from your machine to Docker Hub and VPS.
2. Automatic CI/CD deployment with GitHub Actions, Docker Hub, and VPS.

The deployment files are:

| File | Purpose |
| --- | --- |
| `Dockerfile` | Builds the production NestJS image |
| `.dockerignore` | Keeps Docker build context small and secure |
| `docker-compose.yml` | Runs the API container locally or on a server |
| `.github/workflows/deploy.yml` | CI/CD pipeline for build, test, Docker push, and VPS deploy |
| `.env.example` | Example env values for local, Docker, and production |

## Dockerfile Explanation

The `Dockerfile` uses a production-friendly multi-stage build:

| Stage | What It Does |
| --- | --- |
| `base` | Sets Node.js 20 Alpine and app work directory |
| `deps` | Installs all dependencies with `npm ci` |
| `builder` | Builds TypeScript into `dist` |
| `production-deps` | Installs only production dependencies |
| `production` | Runs the final app as a non-root user |

Production benefits:

- Smaller final image
- Only compiled `dist` and production `node_modules` are copied
- Runs as `nestjs` user instead of root
- Built-in Docker healthcheck
- Uses `node dist/main.js` for production runtime

## Local Docker Run

Copy env first:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Run API only, using your existing MongoDB or MongoDB Atlas:

```bash
docker compose up -d --build app
```

Run API with local MongoDB container:

```bash
docker compose --profile local up -d --build
```

If you use the compose MongoDB service, set this in `.env`:

```env
MONGO_URI=mongodb://mongo:27017/nestjs_boilerplate
```

Useful Docker commands:

```bash
# check containers
docker compose ps

# see API logs
docker compose logs -f app

# stop app
docker compose down

# stop app and remove local MongoDB volume
docker compose --profile local down -v
```

## Docker Hub Manual Build And Push

Use this when you want to build and push manually before setting up CI/CD.

1. Login to Docker Hub:

```bash
docker login
```

2. Build image:

```bash
docker build -t your-dockerhub-username/nestjs-boilerplate-mongodb:latest .
```

3. Push image:

```bash
docker push your-dockerhub-username/nestjs-boilerplate-mongodb:latest
```

4. Optional version tag:

```bash
docker tag your-dockerhub-username/nestjs-boilerplate-mongodb:latest your-dockerhub-username/nestjs-boilerplate-mongodb:v1
docker push your-dockerhub-username/nestjs-boilerplate-mongodb:v1
```

## VPS Requirements

Your VPS needs:

- Ubuntu server recommended
- Docker installed
- Docker Compose plugin installed
- A deployment user with Docker permission
- Port `5000` open, or your custom `APP_PORT`
- MongoDB Atlas URI or another production MongoDB URI

Install Docker on Ubuntu VPS:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Allow your deploy user to run Docker:

```bash
sudo usermod -aG docker $USER
newgrp docker
docker version
docker compose version
```

Open firewall port if UFW is enabled:

```bash
sudo ufw allow 5000/tcp
sudo ufw status
```

## Manual VPS Docker Deploy

Use this if you do not want GitHub Actions yet.

1. SSH into VPS:

```bash
ssh your-user@your-server-ip
```

2. Create app folder:

```bash
sudo mkdir -p /opt/nestjs-boilerplate-mongodb
sudo chown -R $USER:$USER /opt/nestjs-boilerplate-mongodb
cd /opt/nestjs-boilerplate-mongodb
```

3. Create production `.env`:

```bash
nano .env
```

Minimum production `.env`:

```env
NODE_ENV=production
PORT=5000
APP_NAME=Your App Name
CORS_ORIGIN=https://your-frontend-domain.com
MONGO_URI=mongodb+srv://username:password@cluster/database
JWT_SECRET=strong-random-secret
JWT_EXPIRE=1h
BCRYPT_SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=strong-random-access-secret
ACCESS_TOKEN_EXPIRES=7d
REFRESH_TOKEN_SECRET=strong-random-refresh-secret
REFRESH_TOKEN_EXPIRES=90d
DOCKER_IMAGE=your-dockerhub-username/nestjs-boilerplate-mongodb:latest
APP_PORT=5000
APP_CONTAINER_NAME=nestjs_boilerplate_api
```

4. Create `docker-compose.yml` on VPS:

```bash
nano docker-compose.yml
```

Paste this:

```yaml
services:
  app:
    image: ${DOCKER_IMAGE}
    container_name: ${APP_CONTAINER_NAME:-nestjs_boilerplate_api}
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "${APP_PORT:-5000}:${PORT:-5000}"
    networks:
      - backend_network
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 5000)).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s

networks:
  backend_network:
    driver: bridge
```

5. Pull and run:

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs -f app
```

6. Test API:

```bash
curl http://your-server-ip:5000
```

## GitHub Actions CI/CD Deploy

The workflow file is:

```txt
.github/workflows/deploy.yml
```

It runs when you push to `main`, and you can also run it manually from GitHub Actions.

CI/CD flow:

1. Checkout code
2. Install dependencies
3. Run `npm run build`
4. Run `npm run lint`
5. Run `npm test`
6. Run `npm run test:e2e`
7. Build Docker image
8. Push image to Docker Hub with `latest` and commit SHA tags
9. SSH into VPS
10. Write production `.env`
11. Write production `docker-compose.yml`
12. Pull latest image
13. Restart container
14. Show container status

## GitHub Repository Secrets

Go to:

```txt
GitHub repository -> Settings -> Secrets and variables -> Actions -> Secrets
```

Add these required secrets:

| Secret | Example | Purpose |
| --- | --- | --- |
| `DOCKER_USERNAME` | `saurav11sarkar` | Docker Hub username |
| `DOCKER_PASSWORD` | `dckr_pat_xxx` | Docker Hub access token or password |
| `SERVER_HOST` | `123.123.123.123` | VPS IP or domain |
| `SERVER_USER` | `root` or `deploy` | VPS SSH user |
| `SERVER_SSH_KEY` | private key content | SSH private key |
| `SERVER_PORT` | `22` | SSH port |
| `MONGO_URI` | `mongodb+srv://...` | Production MongoDB URI |
| `CORS_ORIGIN` | `https://your-frontend.com` | Allowed frontend origin |
| `JWT_SECRET` | strong random string | JWT secret |
| `JWT_EXPIRE` | `1h` | JWT expiry |
| `BCRYPT_SALT_ROUNDS` | `10` | Password hash rounds |
| `ACCESS_TOKEN_SECRET` | strong random string | Access token secret |
| `ACCESS_TOKEN_EXPIRES` | `7d` | Access token expiry |
| `REFRESH_TOKEN_SECRET` | strong random string | Refresh token secret |
| `REFRESH_TOKEN_EXPIRES` | `90d` | Refresh token expiry |

Optional service secrets:

| Secret | When Needed |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Image upload |
| `CLOUDINARY_API_KEY` | Image upload |
| `CLOUDINARY_API_SECRET` | Image upload |
| `EMAIL_HOST` | Email/OTP |
| `EMAIL_PORT` | Email/OTP |
| `EMAIL_ADDRESS` | Email/OTP |
| `EMAIL_PASS` | Email/OTP |
| `EMAIL_FROM` | Email/OTP |
| `EMAIL_TO` | Admin email routing |
| `ADMIN_EMAIL` | Admin email routing |
| `STRIPE_PUBLISHABLE_KEY` | Stripe payments |
| `STRIPE_SECRET_KEY` | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook |
| `STRIPE_PLATFORM_ACCOUNT_ID` | Stripe Connect/platform use |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `FRONTEND_URL` | Frontend redirect/config |
| `BACKEND_URL` | Backend public URL |

## GitHub Repository Variables

Go to:

```txt
GitHub repository -> Settings -> Secrets and variables -> Actions -> Variables
```

Recommended variables:

| Variable | Example | Purpose |
| --- | --- | --- |
| `DOCKER_IMAGE_NAME` | `my-project-backend` | Docker Hub image repo name |
| `APP_DIR` | `/opt/my-project-backend` | VPS deployment folder |
| `APP_PORT` | `5000` | Public VPS port |
| `CONTAINER_PORT` | `5000` | Internal NestJS port |
| `APP_NAME` | `My Project API` | Swagger/health display name |
| `APP_CONTAINER_NAME` | `my_project_api` | Docker container name |
| `CLOUDINARY_FOLDER` | `my-project` | Cloudinary folder |
| `EMAIL_SENDER_NAME` | `My Project` | Email sender display name |

## SSH Key Setup For CI/CD

On your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f github-actions-deploy
```

This creates:

```txt
github-actions-deploy
github-actions-deploy.pub
```

Add public key to VPS:

```bash
ssh-copy-id -i github-actions-deploy.pub your-user@your-server-ip
```

Or manually append `github-actions-deploy.pub` content into:

```txt
~/.ssh/authorized_keys
```

Add private key content to GitHub secret:

```txt
SERVER_SSH_KEY
```

Test SSH:

```bash
ssh -i github-actions-deploy your-user@your-server-ip
```

## Docker Hub Setup

1. Create Docker Hub account.
2. Create repository, for example `my-project-backend`.
3. Create Docker Hub access token:

```txt
Docker Hub -> Account Settings -> Personal access tokens -> Generate new token
```

4. Add these GitHub secrets:

```txt
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-access-token
```

5. Add GitHub variable:

```txt
DOCKER_IMAGE_NAME=my-project-backend
```

The final image will be:

```txt
your-dockerhub-username/my-project-backend:latest
your-dockerhub-username/my-project-backend:<github-commit-sha>
```

## CI/CD Deploy Steps

After secrets and variables are ready:

1. Commit changes:

```bash
git add .
git commit -m "setup production docker cicd"
```

2. Push to `main`:

```bash
git push origin main
```

3. Open GitHub Actions:

```txt
GitHub repository -> Actions -> CI/CD Docker Deploy
```

4. Wait for all jobs to pass.
5. Open your API:

```txt
http://your-server-ip:5000
http://your-server-ip:5000/api/docs
```

## Manual Rollback

GitHub Actions pushes an image with commit SHA. To rollback:

1. SSH into VPS:

```bash
ssh your-user@your-server-ip
cd /opt/nestjs-boilerplate-mongodb
```

2. Edit `.env`:

```bash
nano .env
```

Change:

```env
DOCKER_IMAGE=your-dockerhub-username/your-image:old-commit-sha
```

3. Restart:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

## Production Checklist

Before real production launch:

- Use MongoDB Atlas or managed MongoDB
- Set `NODE_ENV=production`
- Replace all `change-me-*` secrets
- Use long random JWT secrets
- Set exact `CORS_ORIGIN`, not `*`
- Configure Cloudinary only if uploads are used
- Configure email only if OTP/mail is used
- Configure Stripe only if payments are used
- Keep `.env` out of Git
- Add all required GitHub secrets
- Add Docker Hub access token, not your main password
- Make sure VPS Docker is installed
- Open only required firewall ports
- Put Nginx or another reverse proxy in front for domain and HTTPS
- Run `npm run build`, `npm run lint`, `npm test`, and `npm run test:e2e`

## Common Deployment Commands

On VPS:

```bash
# go to app folder
cd /opt/nestjs-boilerplate-mongodb

# check status
docker compose ps

# check logs
docker compose logs -f app

# restart app
docker compose restart app

# pull latest image and restart
docker compose pull
docker compose up -d

# remove unused images
docker image prune -f
```

## Troubleshooting

Docker permission error:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Port already in use:

```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

Container keeps restarting:

```bash
docker compose logs -f app
```

MongoDB connection fails:

- Check `MONGO_URI`
- Check Atlas IP whitelist
- Check database username/password
- If using Docker MongoDB, use `mongodb://mongo:27017/nestjs_boilerplate`

GitHub Actions SSH fails:

- Check `SERVER_HOST`
- Check `SERVER_USER`
- Check `SERVER_PORT`
- Check `SERVER_SSH_KEY`
- Make sure public key is in VPS `~/.ssh/authorized_keys`

Docker Hub push fails:

- Check `DOCKER_USERNAME`
- Use Docker Hub access token in `DOCKER_PASSWORD`
- Check `DOCKER_IMAGE_NAME`

## Reusing This Boilerplate For A New Project

1. Change `APP_NAME` in `.env`.
2. Update `name`, `description`, and `author` in `package.json`.
3. Update MongoDB database name in `MONGO_URI`.
4. Replace all JWT secrets.
5. Remove modules you do not need.
6. Rename module fields and DTO examples for your business domain.
7. Update this README with your real project details.
8. Run all checks before starting feature work.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit the [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you would like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay In Touch

- Author - [Kamil Mysliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

This project is currently marked as `UNLICENSED` in `package.json`. Update the license before publishing or sharing publicly.
