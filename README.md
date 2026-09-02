# GrowthNest Financial Platform

GrowthNest is a modern financial platform providing SIP, EMI, Lumpsum, and Retirement calculators, a secure Contact Form Backend, and a production-grade User Dashboard & Authentication System (Login, Registration, Protected Dashboard, Financial Goals, Saved Calculations, Password Reset).

---

## 🍃 MongoDB Single Database Architecture

GrowthNest uses **MongoDB** as its single, unified primary database (`growthnest`).

- **Production Cloud Database**: MongoDB Atlas
- **Local Management & Viewing Tool**: MongoDB Compass
- **Object Data Modeling**: Mongoose v8
- **Deployment Platform**: Vercel

```
GrowthNest Website (Vercel) ──> Serverless API Routes ──> MongoDB Atlas Cloud (`growthnest`) <── MongoDB Compass
```

### Collections in `growthnest` DB:
- `users`: User profiles, credentials, role, and authentication status.
- `contact_enquiries`: Submitted enquiries from the Contact Form.
- `financial_goals`: Tracked user financial goals (Retirement, Home Purchase, Emergency Fund, etc.).
- `saved_calculations`: Saved calculator outputs (SIP, EMI, Lumpsum, Retirement).
- `activities`: Audit logs of user actions and platform events.
- `password_reset_tokens`: Single-use tokens for password recovery.

---

## 🛠️ Environment Variables & Setup

### 1. Configuration (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Define the required environment variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/growthnest?retryWrites=true&w=majority
AUTH_SECRET=your_super_secret_jwt_key_here
APP_URL=http://localhost:3000
```

---

## 🧭 Connecting MongoDB Compass Locally

1. Download and install **MongoDB Compass** from [mongodb.com/products/compass](https://www.mongodb.com/products/compass).
2. Launch MongoDB Compass.
3. Paste your MongoDB connection string into the connection bar:
   - For local MongoDB server: `mongodb://127.0.0.1:27017/growthnest`
   - For MongoDB Atlas cloud: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/growthnest`
4. Click **Connect**.
5. Select the **`growthnest`** database to view and manage collections (`users`, `contact_enquiries`, `financial_goals`, `saved_calculations`, `activities`).

---

## 🚀 Vercel Production Deployment

To connect your Vercel deployment to your MongoDB Atlas cloud database:

1. Open your project on the [Vercel Dashboard](https://vercel.com).
2. Go to **Settings** → **Environment Variables**.
3. Add the following variables:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@<cluster-url>/growthnest?retryWrites=true&w=majority`
   - `AUTH_SECRET`: Secret key for JWT signing
   - `APP_URL`: Your Vercel domain (e.g. `https://insurence-umber.vercel.app`)
4. Redeploy your application on Vercel.

---

## 💻 Development & Build

Start local development server:

```bash
npm run dev
```

Run production build check:

```bash
npm run build
```

---

## 🔐 API & Routing Features

- `POST /api/contact`: Form submission endpoint saving into `contact_enquiries`.
- `POST /api/auth/register`: Creates new user profile in `users` collection.
- `POST /api/auth/login`: Authenticates credentials & sets `gn_session` cookie.
- `GET /api/dashboard`: Aggregates user counts & recent activities for authenticated user.
- `GET/POST /api/goals`: Manage user financial goals in `financial_goals`.
- `GET/POST /api/calculations`: Save and manage user calculation scenarios in `saved_calculations`.
