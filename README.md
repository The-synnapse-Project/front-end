# Synnapse Frontend

<div align="center">
  <img src="public/logo.svg" alt="Synnapse Logo" width="120" />
  <p>A modern Next.js web application for interacting with the Synnapse intelligent classroom system.</p>
</div>

<br/>

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-0070F3?style=flat)](https://next-auth.js.org/)

## 📋 Overview

Synnapse is an intelligent classroom platform that enhances the teaching and learning experience through digital tools. The frontend provides an intuitive interface for students, teachers, and administrators to interact with the classroom system.

## ✨ Features

- **Dual Authentication System**

  - Sign in with Google OAuth
  - Traditional email/password authentication
  - Secure password recovery process

- **Role-Based Experience**

  - Custom dashboards for Admin, Teacher (Profesor), and Student (Alumno) roles
  - Permission-based access control to features and data
  - Personalized content based on user role

- **Modern, Responsive UI**

  - Clean, intuitive interface that works on all devices
  - Dark/light theme support with seamless transitions
  - Animated components for enhanced user experience
  - Mobile-optimized layout with slide-out navigation

- **Real-time Capabilities**

  - Attendance tracking and updates

- **Comprehensive User Management**
  - Profile viewing and editing
  - Role and permission administration
  - User history and analytics

## 🛠️ Tech Stack

- **Core Technologies**

  - [Next.js](https://nextjs.org/) - React framework with server-side rendering
  - [React](https://reactjs.org/) - UI component library
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

- **Styling & UI**

  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - Custom animations and transitions
  - Responsive design system

- **Authentication & Authorization**

  - [NextAuth.js](https://next-auth.js.org/) - Authentication solution for Next.js
  - JWT token handling
  - Role-based authorization

- **State Management**

  - React Context API for global state
  - Custom hooks for shared logic

- **API Integration**
  - Custom Fetch-based client for Rocket API

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Package manager: npm, yarn, or bun
- Access to Google OAuth credentials (for full auth functionality)
- Rocket API backend running (locally or remote)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/Synnapse.git
   cd Synnapse/front-end
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**

   Copy the example environment file and configure your variables:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your specific configuration:

### Environment Variables

```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000  # Rocket API URL

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000    # Your app's URL

# Optional Configuration
NODE_ENV=development                  # development, production
```

### Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
# or
bun run build
bun start
```

## 🔌 API Integration

The frontend connects to a Rocket-based API for all data services. Key integration points:

- **API Client**: Located at `src/lib/api-client.ts`

  - Handles all HTTP requests to the backend
  - Includes authentication headers and error handling

- **Auth Integration**: Located at `src/app/api/auth/[...nextauth]/route.ts`
  - Configures NextAuth.js with dual providers
  - Manages session handling and token refreshing

## 🔐 Authentication Flow

### Email/Password Authentication

1. User enters credentials on the login page
2. Credentials are sent to the Rocket API for verification
3. Upon successful verification, a JWT token is returned
4. NextAuth creates a session with this token
5. User is redirected to their role-specific dashboard

### Google Authentication

1. User clicks "Sign in with Google"
2. Google OAuth flow is initiated via NextAuth
3. Upon successful Google authentication:
   - If the email matches an existing user, they are logged in
   - If no match is found, a new user account is created
4. A session is created with appropriate role permissions
5. User is redirected to their role-specific dashboard

## 🧩 Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/Components` - Reusable UI components
- `src/models` - TypeScript interfaces and data models
- `src/lib` - Utility functions and helpers
- `src/hooks` - Custom React hooks
- `public` - Static assets

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or need assistance, please open an issue on the repository or contact the Synnapse team.
