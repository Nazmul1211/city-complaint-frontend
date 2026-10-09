# 🏛️ CityCare — Municipal Grievance & Civic Service Operations Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Biome](https://img.shields.io/badge/Biome-Linter_%26_Formatter-60a5fa?style=for-the-badge&logo=biome)](https://biomejs.dev/)
[![bKash](https://img.shields.io/badge/bKash-Payment_Gateway-E2136E?style=for-the-badge)](https://www.bkash.com/)

**CityCare** is a modern, enterprise-grade civic governance and municipal service operations platform designed for metropolitan municipalities. It bridges the gap between citizens, frontline field technicians, and city municipal leaders through transparent, SLA-backed complaint resolution, real-time dispatching, and secure digital fee payments.

---

## 🚀 Live Demo & Deployment

- **Live Application URL:** [https://citycare-frontend.vercel.app](https://citycare-frontend.vercel.app) *(or your deployed production link)*
- **Walkthrough Demonstration Video:** [Watch Demonstration Video](https://youtube.com/) *(insert video link)*
- **Backend API Repository:** [city-complaint-backend](https://github.com/Nazmul1211/city-complaint-backend)

---

## 🔑 One-Click Demo Accounts

For immediate evaluation, the login page (`/login`) includes **One-Click Demo Role Cards** that automatically populate credentials and authenticate into the respective operational console:

| Role | Operational Scope | Email | Password | Target Console |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Report issues, track timeline, pay fees via bKash, review feedback | `testercitizen@gmail.com` | `Tester@Citizen123456` | [`/dashboard`](https://citycare-frontend.vercel.app/dashboard) |
| **Staff / Technician** | Department casework, status transitions, on-site photo proofs | `rakib.staff@citycare.com` | `Staff@1234` | [`/staff`](https://citycare-frontend.vercel.app/staff) |
| **City Administrator** | Analytics with Recharts, routing & dispatch, SLAs, user governance | `superadmin@gmail.com` | `Super@Admin123456` | [`/admin`](https://citycare-frontend.vercel.app/admin) |

---

## ✨ Key Features by User Role

### 1. 👥 Citizen Experience (`/dashboard`)
- **Lodge Complaint Wizard:** Multi-step wizard supporting categorized reporting (Road Potholes, Water Supply, Street Lighting, Waste Dumping) with ward picker and file uploads.
- **SLA Countdown & Real-Time Tracking:** Live visual countdown timer tracking municipal turnaround commitments against dynamic category SLAs.
- **Unified Event Timeline:** Transparent, tamper-evident audit trail capturing every triage, assignment, and status transition.
- **bKash Municipal Billing & Checkout:** Seamless fee settlement for site inspections and road cutting permits with tokenized bKash checkout, printable vouchers, and transaction audit trails.
- **Citizen Feedback & Ratings:** 5-star rating system with satisfaction feedback upon resolution.

### 2. 👷 Staff & Field Technician Console (`/staff`)
- **Casework Dispatch Roster:** Priority triage view sorted by urgency (`URGENT`, `HIGH`, `MEDIUM`, `LOW`) and SLA due windows.
- **Strict Status State Machine:** Adheres to municipal casework lifecycle (`ASSIGNED` → `IN_PROGRESS` → `RESOLVED`).
- **On-Site Field Updates & Photo Proof:** Technicians log timestamped field progress notes along with verified photographic evidence.

### 3. 🏛️ City Administration & Governance (`/admin`)
- **Executive Analytics Dashboard:** Responsive visualizations built with **Recharts**:
  - **Monthly Complaints Trend:** Area chart mapping seasonal complaint volumes.
  - **Department Resolution Rates:** Bar chart comparing departmental resolution efficiency.
  - **Status Distribution:** Donut chart visualizing active casework backlog.
- **Triage & Department Dispatch:** Assign incoming civic complaints to municipal departments and dispatch designated technicians.
- **Departments & Categories Manager:** Full management of municipal entities and SLA policies (response and resolution hours).
- **Ward Directory:** Manage municipal administrative wards and counselor contacts.
- **User Role Governance:** Directory with status toggles (`ACTIVE` / `SUSPENDED`) and role promotion.
- **Audit Logs Viewer:** Security audit log featuring actor tracking, IP logging, and before/after JSON state diff inspector.

### 4. 🔔 Real-Time Notification Center
- Persistent notification bell popover across all headers with background polling (every 20s) and unread badge counters.
- Supports instant notifications for fee requests, casework assignments, status shifts, and payment receipts.

---

## 🛠️ Technology Stack & Architecture

- **Framework:** Next.js 16.3.6 (Turbopack, App Router, React Server Components)
- **UI & Styling:** React 19, Tailwind CSS v4, `@base-ui/react`, Lucide Icons
- **State & Data Fetching:** TanStack React Query v5 with optimistic invalidations
- **Form Management:** TanStack Form with Zod validation schemas
- **Data Visualizations:** Recharts (Area, Bar, Pie charts)
- **HTTP Client:** `ofetch` with automated bearer token interception
- **Payment Integration:** bKash Tokenized Checkout API
- **Code Standards:** Biome (zero errors, strict accessibility rules), TypeScript Strict Mode

---

## 📂 Project Structure

```
city-complaint-frontend/
├── src/
│   ├── api/                    # Type-safe API client services
│   │   ├── auth.api.ts
│   │   ├── department.api.ts
│   │   ├── notification.api.ts
│   │   ├── payment.api.ts
│   │   ├── request.api.ts
│   │   └── ward.api.ts
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Protected role-based route groups
│   │   │   ├── admin/          # Admin governance & analytics
│   │   │   ├── dashboard/      # Citizen portal & billing
│   │   │   └── staff/          # Technician casework console
│   │   ├── (public)/           # Marketing & auth routes
│   │   ├── payment/            # Payment return handlers (/success, /cancel)
│   │   ├── error.tsx           # Global runtime error boundary
│   │   ├── layout.tsx          # Root layout with SEO metadata & viewport
│   │   └── not-found.tsx       # Custom Civic 404 page
│   ├── components/             # Reusable UI modules & primitives
│   │   ├── auth/               # Role guards, demo login cards
│   │   ├── dashboard/          # Shell, responsive sidebars
│   │   ├── form/               # Wizards & validated inputs
│   │   ├── modules/            # Feature domains (admin, payment, staff, requests)
│   │   └── ui/                 # Accessible Base-UI / Shadcn components
│   ├── hooks/                  # TanStack Query custom hooks
│   ├── lib/                    # apiClient, cookies, utils
│   ├── routes/                 # Role-based route configurations
│   ├── types/                  # TypeScript interface contracts
│   └── validation/             # Zod validation schemas
├── biome.json                  # Biome linter & formatter configuration
├── next.config.ts              # Next.js 16 configuration
└── package.json
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js v20+

### 2. Installation
```bash
git clone https://github.com/Nazmul1211/city-complaint-frontend.git
cd city-complaint-frontend
bun install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
bun run build
```

### 6. Linting & Type Checking
```bash
bun run lint
bunx tsc --noEmit
```

---

## 📜 License

Distributed under the MIT License. Developed for municipal transparency and citizen empowerment.
