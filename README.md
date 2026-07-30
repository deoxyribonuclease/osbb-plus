# OSBB Management System

A web app for managing homeowners' associations (ОСББ). Built as a bachelor's project.

The idea is simple — give residents and managers one place to handle everything: payments, meter readings, repair requests, news, and so on. Instead of calling someone or digging through papers, you just open the app.

---

## What it can do

- **Auth** — login, registration, roles (admin, accountant, resident)
- **Residents & apartments** — manage who lives where
- **Meters** — residents can submit their readings, managers can track them
- **Repair requests** — submit a request, see its status
- **Payments** — payment history, balances, expenses
- **News & notifications** — post updates, send notifications to specific people or everyone
- **Maps** — Leaflet integration for displaying locations

---

## Stack

**Frontend** — React 19, Vite, Ant Design, Axios, React Router, Leaflet, Recharts

**Backend** — Node.js, Express, Sequelize (PostgreSQL / SQLite), JWT, Passport.js, Nodemailer

---

## Running locally

You'll need Node.js and PostgreSQL (or just use SQLite for quick testing).

**Backend:**
```bash
cd osbb-backend
npm install
# create a .env file with your DB credentials and JWT secret
npm start
# runs on http://localhost:3000
```

**Frontend:**
```bash
cd osbb-frontend
npm install
npm run dev
# runs on http://localhost:5173
```

---

## Project layout

```
osbb/
├── osbb-backend/
│   ├── controllers/   # business logic
│   ├── models/        # database models (Sequelize)
│   ├── routes/        # API routes
│   ├── middlewares/   # auth and other middlewares
│   └── server.js
│
└── osbb-frontend/
    └── src/
        ├── api/       # all axios calls to the backend
        ├── components/
        ├── pages/
        └── App.jsx
```

---

## Notes

- The `.env` file is not included in the repo (obviously). You'll need to set up your own.
- By default the frontend points to `http://localhost:3000`. There's also a commented-out production URL in `src/api/config.js` if you're deploying somewhere.
