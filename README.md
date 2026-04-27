# FinanceApp - Full-Stack Expense Tracker

A minimal full-stack personal expense tracker built with Django REST Framework (backend) and React + Vite (frontend).

The app is designed for realistic usage conditions such as retries, refreshes, and slow networks.

## What This Project Does

- User registration and login with JWT authentication
- Create expenses with:
  - amount
  - category
  - description
  - date
- View expense list
- Filter expenses by category
- Sort expenses by newest date first
- Show total amount for the currently visible list
- Show category-wise summary totals
- Logout from the home screen

## Assignment Criteria Coverage

### Core Requirements

- Create expense: implemented (`POST /api/expenses/`)
- List expenses: implemented (`GET /api/expenses/`)
- Filter by category: implemented (`?category=...`)
- Sort by date desc: implemented (`?sort=date_desc`)
- Total for current list in UI: implemented

### Real-World Reliability

- Idempotent create support using `idempotency_key` (UUID)
- JWT access token refresh flow on protected routes
- Basic loading and error states in UI

### Validation

- Amount cannot be negative
- Date cannot be later than today (frontend + backend)

## Tech Stack

### Backend

- Django
- Django REST Framework
- Simple JWT (`djangorestframework-simplejwt`)
- SQLite
- CORS Headers
- WhiteNoise

### Frontend

- React
- Vite
- React Router
- Axios
- uuid

## Project Structure

- `backend/` - Django API server
- `frontend/` - React client app

## Backend API

Base URL (local): `http://127.0.0.1:8000`

### Auth

- `POST /api/user/register/` - register user
- `POST /api/token/` - get access + refresh token
- `POST /api/token/refresh/` - refresh access token

### Expenses

- `POST /api/expenses/`
  - Body:
    - `amount` (decimal)
    - `category` (string)
    - `description` (string)
    - `date` (YYYY-MM-DD)
    - `idempotency_key` (UUID)
- `GET /api/expenses/`
  - Optional query params:
    - `category=<category_name>`
    - `sort=date_desc`
- `GET /api/expenses/summary/`
  - Returns category totals
- `DELETE /api/expenses/<id>/`
  - Delete a user-owned expense

All expense routes are authenticated and user-scoped.

## Data Model

Expense fields:

- `id`
- `user`
- `amount` (DecimalField)
- `category`
- `description`
- `date`
- `created_at`
- `idempotency_key` (UUID)

## Why SQLite?

SQLite was chosen for this assignment because it is:

- simple to set up
- fast for local development
- sufficient for a small scoped app

The code structure can be migrated to PostgreSQL later without changing core API behavior.

## Local Setup

## 1) Backend Setup

```bash
cd backend
python -m venv ../venv
../venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## 2) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (default Vite).

## Frontend Environment Variable

Create/update `frontend/.env`:

```env
VITE_API_URL="http://127.0.0.1:8000"
```

## Build/Deploy Notes

- Frontend production build:

```bash
cd frontend
npm run build
```

- Backend has a `build.sh` script for deployment flow:
  - install requirements
  - collect static files
  - run migrations

## Design Decisions

- Used JWT for stateless auth and straightforward SPA integration.
- Added idempotency to expense creation to avoid duplicate entries from retries.
- Used Decimal for money handling to avoid floating point rounding issues in storage.
- Kept UI intentionally simple with focus on correctness and clarity.

## Timebox Trade-offs

- No advanced analytics/charts
- No pagination/search
- Minimal automated test coverage
- Basic styling over design-system level polish

## Known Gaps / Future Improvements

- Add more automated tests (API + frontend)
- Add pagination and full-text search
- Improve UX for server/network error handling
- Add edit/update expense flow
- Add responsive layout refinements and accessibility checks


## Demo Submission
Render's service is failing so no demo is possible
