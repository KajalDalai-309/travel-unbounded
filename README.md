# Travel Unbounded 🌍 demo link - (https://travel-unbounded-liard.vercel.app/admin/enquiries)

India's Most Trusted Experiential Travel Experts — a full-stack travel company website built with Next.js, MongoDB, and deployed on Vercel.

## Overview

Travel Unbounded showcases curated travel destinations across India and internationally, and captures travel enquiries through a fully-validated booking form that persists to MongoDB Atlas.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas (Mongoose ODM) |
| Deployment | Vercel |
| Language | JavaScript |

## Features

- **Responsive UI** — Mobile (375px), Tablet (768px), Desktop (1440px)
- **Home Page** — Hero banner, India & International destination cards, Why Choose Us, CTA
- **About Page** — Company story, milestone timeline, office locations, values
- **Contact Page** — Full enquiry form with client-side + server-side validation
- **API** — `POST /api/enquiry` (save) + `GET /api/enquiry` (list, admin use)
- **Form UX** — Loading state, success confirmation UI, error handling (no alert())
- **MongoDB** — All enquiries persisted with createdAt timestamp
- **SEO** — Title + meta description on every page
- **Git** — Meaningful commit history

## Project Structure

```
travel-unbounded/
├── app/
│   ├── layout.js           # Root layout with Navbar + Footer
│   ├── page.js             # Home page
│   ├── about/page.js       # About page
│   ├── contact/page.js     # Contact/Enquiry page
│   └── api/
│       └── enquiry/
│           └── route.js    # POST + GET /api/enquiry
├── components/
│   ├── Navbar.jsx          # Responsive sticky navbar
│   ├── Footer.jsx          # Multi-column footer
│   ├── DestinationCard.jsx # Reusable destination card
│   └── BookingForm.jsx     # Full booking form with validation
├── data/
│   └── destinations.js     # Static destination data (10 destinations)
├── lib/
│   └── mongodb.js          # Singleton MongoDB connection
├── models/
│   └── Enquiry.js          # Mongoose schema
├── .env.example            # Environment variable template
└── README.md
```

## Local Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd travel-unbounded

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `NEXT_PUBLIC_BASE_URL` | Deployed URL (for metadata) | No |

### Getting MongoDB URI

1. Create a free account at [mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user
4. Get the connection string (format: `mongodb+srv://...`)
5. Replace `<password>` with your user's password
6. Add to `.env.local`

## API Documentation

### POST /api/enquiry

Submit a travel enquiry.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "countryCode": "+91",
  "contactNumber": "9876543210",
  "email": "john@example.com",
  "dateOfTravel": "2025-12-25",
  "numberOfPeople": 2,
  "hotelCategory": "Deluxe",
  "numberOfChildren": 1,
  "destination": "Kerala",
  "message": "Looking for a 7-day trip"
}
```

**Responses:**
- `201 Created` — Enquiry saved successfully
- `400 Bad Request` — Validation failed (missing field, past date, etc.)
- `500 Internal Server Error` — Database/server error

### GET /api/enquiry

Fetch all submitted enquiries (admin use).

**Query params:** `?page=1&limit=50`

## Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
3. Add environment variable: `MONGODB_URI`
4. Deploy

## Assumptions & Decisions

- **Destination data** is static (local JS file) as specified in the assignment — no CMS or DB for destinations
- **Images** sourced from Unsplash (free-to-use, reliable CDN)
- **Admin dashboard** — `GET /api/enquiry` is available for future admin UI (Phase 2)
- **Country code** uses a dropdown selector rather than a phone library for simplicity
- **Authentication** is out of scope for Phase 1

## Live Demo

[https://travel-unbounded.vercel.app](https://travel-unbounded.vercel.app) *(update after deployment)*

## GitHub

[https://github.com/](https://github.com/) *(update with your repo URL)*
