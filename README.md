# SmartSeason Field Monitoring System

A modern field monitoring dashboard built with React, TypeScript, Tailwind CSS, Vite, Express, and Supabase.

Live demo: https://smart-season-field-monitoring-syste.vercel.app

## Setup Instructions

### 1. Clone repository

```bash
git clone <repo-url> "SmartSeason Field Monitoring System"
cd "SmartSeason Field Monitoring System"
```

### 2. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create `.env` files for both backend and frontend.

#### Backend `.env`

The backend uses Supabase admin credentials to read and write data.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Frontend `.env`

The frontend uses the Supabase public anon key to authenticate users.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the backend server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000` by default.

### 5. Run the frontend app

```bash
cd frontend
npm run dev
```

The frontend runs via Vite, typically on `http://localhost:5173`.

### 6. Access the app

Open the frontend URL in your browser and sign in.

## Development

From the repository root, install dependencies and start both services together:

```bash
npm install
npm run dev
```

This runs both:

- `npm run start:backend` — starts the backend on `http://localhost:5000`
- `npm run start:frontend` — starts the frontend via Vite

If you prefer manual startup, use:

```bash
cd backend
npm install
npm run dev
```

and in another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Design Decisions

- **Frontend:** React + Vite + TypeScript + Tailwind CSS for a fast modern development experience and polished UI.
- **Backend:** Express + Supabase admin client for simple API routing and secure server-side operations.
- **Data flow:** Frontend calls backend API endpoints under `/api/*`, and backend uses Supabase to read/write the `fields` and `field_updates` tables.
- **Authentication:** Supabase handles authentication. Frontend uses `supabase.auth.signInWithPassword` and the backend validates the session via middleware.
- **Role-based access:** The app distinguishes `admin` and `agent` roles in backend routes and frontend UI.
- **Feedback:** Toast notifications provide immediate success/error feedback.
- **Charts:** Dashboard progress visuals are built with lightweight Tailwind-based progress bars rather than a heavy charting library.
- **Structure:** The app separates concerns into frontend and backend packages, with a shared understanding of the `FieldRecord` and `FieldUpdateRecord` types.

## Assumptions

- The Supabase project already includes a table for `fields` and a table for `field_updates`.
- `fields` records have these values:
  - `stage`: `planted | growing | ready | harvested`
  - `status`: `active | at_risk | completed`
- `admin` users can create, update, and delete fields.
- `agent` users can only view fields assigned to them and add updates via the detail screen.
- The backend has access to a Supabase service role key for secure server-side operations.
- Environment variables are stored locally in `.env` files and not committed to version control.
- The current interface is optimized for task-based workflows rather than full CRM-style field editing.

## Current Features

- Login page with demo credentials and a polished authentication UI.
- Role-aware dashboard showing field summaries and progress visuals.
- Field creation flow for administrators.
- Field detail view with stage/status updates and observation notes.
- Admin-only delete function for removing fields.
- Theme toggle and toast notification system for a better user experience.

## Notes

- If you need to seed sample data, add a seed script or use Supabase directly.
- The current chart implementation is intentionally lightweight and easy to extend.
- Additional work can include richer field editing, historical charts, and better agent assignment workflows.
