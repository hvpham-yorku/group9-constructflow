# ConstructFlow

A construction project management system designed for managing plumbing, electrical, and HVAC work on building projects. Separates workflows for project managers and construction workers.

## Features

- **Role-based dashboards** - Distinct interfaces for managers and workers
- **Project management** - Create and track construction projects with progress metrics
- **Worker management** - Manage crew members and assign them to tasks
- **Blueprint handling** - Upload and view construction blueprints with section assignments
- **Task tracking** - Assign specific work sections to workers with due dates and status tracking
- **Reports & analytics** - Generate performance metrics and project reports
- **Real-time authentication** - User sign-up and login with email/password

## Technology Stack

- **Frontend** - React with routing (react-router-dom)
- **Build tool** - Vite for fast development and optimized builds
- **Database** - Firebase Firestore for cloud data storage
- **Authentication** - Firebase Auth for user management
- **UI Icons** - react-icons for consistent interface elements

## Getting Started

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm build

# Run linter checks
npm run lint
```

The app runs on `http://localhost:5173` by default.

## Project Structure

- `src/pages/` - Main route pages (dashboards, projects, workers, etc.)
- `src/components/` - Reusable UI components
- `src/contexts/` - React context for authentication state
- `src/styles/` - CSS stylesheets for each component
- `src/firebase.js` - Firebase configuration and exported services

## Key Workflows

**Manager Dashboard** - Overview of active projects, key statistics, quick actions  
**Worker Dashboard** - Task list with assigned work sections and due dates  
**Blueprint Viewer** - Upload blueprints, define sections, assign workers  
**Reports** - Analytics on projects and worker utilization

## Local Environment Setup (Firebase Configuration)

To protect Firebase API keys from being exposed, set up local environment variables.

**Step 1: Create your `.env` file**   
In the root directory `constructflow/` (the same folder as `package.json`), create a new file and name it exactly `.env`.

**Step 2: Add the Firebase keys**   
Copy the following template into the `.env` file.

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY="insert_key_here"
VITE_FIREBASE_AUTH_DOMAIN="insert_domain_here"
VITE_FIREBASE_PROJECT_ID="insert_project_id_here"
VITE_FIREBASE_STORAGE_BUCKET="insert_storage_bucket_here"
VITE_FIREBASE_MESSAGING_SENDER_ID="insert_sender_id_here"
VITE_FIREBASE_APP_ID="insert_app_id_here"
```

**Step 3: Get the actual values**   
Log into the shared Firebase Console and go to **Project Settings > General**. Paste the exact values inside the quotation marks in the `.env` file.

**Step 4: Start/Restart the local server**
```bash
npm run dev
```