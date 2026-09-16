
# Famstep

Famstep is a social productivity and professional networking platform for developers, freelancers, learners, and teams. It brings skill development, collaboration, competitions, project work, and professional networking into one application.

## Features

- User profiles, achievements, skills, education, experience, and projects
- Posts, comments, reactions, notifications, follows, and networking
- Learning groups, collaboration workflows, messaging, and real-time chat
- Coding practice, contests, scoreboards, and competition management
- Freelancing and project-oriented workflows
- Authentication with NextAuth and Google/GitHub providers
- MongoDB-backed data storage
- AWS S3 media storage and AWS email integrations
- Docker-based production deployment

## Tech Stack

- Next.js 15 with the Pages Router
- React 18 and JavaScript/JSX
- MongoDB and Mongoose
- NextAuth
- Socket.IO
- AWS S3, SES, and Cognito integrations
- Sass, Material UI, Ant Design, and Recharts

## Requirements

- Node.js 18 or newer
- npm
- MongoDB
- AWS services and OAuth credentials for the integrations you enable

## Local Development

1. Install dependencies:

	```bash
	npm install
	```

2. Create `.env.local` in the project root and add the required application credentials. Use a secret manager or local environment file; never commit credentials to the repository.

3. Start the development server:

	```bash
	npm run dev
	```

4. Open [http://localhost:3000](http://localhost:3000).

## Production

Build and run the application with:

```bash
npm run build
npm start
```

The included Docker configuration can be used for containerized deployment:

```bash
docker compose up --build
```

The application is then available on port `3000`.

## Project Structure

| Directory | Purpose |
| --- | --- |
| `pages/` | Pages and API routes |
| `components/` | Reusable UI components |
| `layouts/` | Page layouts and feature views |
| `model/` | MongoDB models |
| `config/` | Authentication, storage, email, and upload configuration |
| `database/` | Database connection helpers |
| `global/` | Shared React context and socket layout |
| `styles/` | Global and component styles |

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run Next.js linting |

## Security

Environment files contain database, OAuth, email, and cloud provider credentials. Keep them out of version control, rotate any credentials that have been exposed, and provide deployment values through the hosting platform or a secret manager.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://13.201.93.129:3000](http://13.201.93.129:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://13.201.93.129:3000/api/hello](http://13.201.93.129:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
