# Clarity - AI-Native Personal Achievement Partner

## Project Overview

Clarity is an AI-native personal achievement partner that eliminates the friction between ambition and action. Built with modern technologies and following Apple's human interface guidelines, it provides a minimalist, elegant interface for goal tracking and progress management.

## Core Features

- **Intelligent Goal Extraction**: AI-powered goal creation from natural language input
- **Smart Progress Tracking**: Automatic progress updates through natural language
- **Minimalist Design**: Clean, uncluttered interface inspired by Apple's design principles
- **Seamless Flow**: Fluid user experience with immediate feedback and smooth transitions

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Hook Form with Zod validation

### Backend
- FastAPI with Python
- PostgreSQL database
- JWT authentication
- Google Gemini 1.5 API integration
- Docker containerization

## Project Structure

```
/
├── client/          # Frontend React application
├── server/          # Backend FastAPI application
├── docker-compose.yml
├── LICENSE
└── version-3-manifest.md
```

## Quick Start

1. Clone the repository
2. Run `docker-compose up` for one-command local environment setup
3. Access the application at `http://localhost:3000`

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and coding standards.

## Manifest

This project follows the specifications outlined in [version-3-manifest.md](./version-3-manifest.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
