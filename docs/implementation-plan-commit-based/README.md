# 🏙️ CityCare — Commit-by-Commit Implementation Plan (Frontend)

> **Assignment Target:** B7A7 Next.js Frontend (Fullstack) Project Assignment  
> **Domain:** City Complaint & Service Platform (`Student ID Last Digit: 0`)  
> **Backend Integration:** `docs/city-complaint-backend` (Express 5 + Prisma 7 + PostgreSQL + Redis)  
> **Reference Architecture:** `docs/PH-Healthcare-Nextjs` (Next.js 16 App Router, TanStack Form & Query, ofetch, Base UI / shadcn base-lyra, RoleGuard, Sidebar)  
> **Total Commits Planned:** **30 Meaningful Commits** (Target Range: 25 – 35)

---

## 🚨 MANDATORY EXECUTION RULE: Reference-First Pattern Adoption (`docs/PH-Healthcare-Nextjs`)

For **every single commit and feature** implemented in this project, the following 3-step rule **MUST** be strictly enforced:

1. **🔍 Step 1: Pre-Commit Reference Inspection (`docs/PH-Healthcare-Nextjs`)**
   - Before writing or designing any new file (API service, hook, UI component, form, page, guard, type, or schema), **first inspect `docs/PH-Healthcare-Nextjs`**.
   - Check if an equivalent or similar component/method exists (e.g., `src/api/*`, `src/hooks/*`, `src/components/ui/*`, `src/components/auth/*`, `src/components/dashboard/*`, `src/types/*`, `src/routes/*`, `src/validation/*`).

2. **⚡ Step 2: Code & Design Method Replication**
   - If matched, **strictly replicate the exact code style, architectural conventions, patterns, and design methods** from `PH-Healthcare-Nextjs`.
   - Maintain strict consistency in:
     - API services using `ofetch` and returning standard promises.
     - Custom hooks wrapping TanStack Query `useQuery` / `useMutation`.
     - Base UI + Tailwind styling patterns and shadcn `base-lyra` primitives.
     - Form handling using `@tanstack/react-form` + Zod schemas.
     - Auth security guards (`AuthGuard`, `RoleGuard`, `AccessDenied`, `AuthLoading`).
     - Dashboard layouts (`DashboardShell`, `DashboardSidebar`, `DashboardHeader`).

3. **🔗 Step 3: Backend Domain Adaptation (`docs/city-complaint-backend`)**
   - Adapt the replicated patterns to the City Complaint domain, Prisma schemas, role enums (`CITIZEN`, `STAFF`, `ADMIN`, `SUPER_ADMIN`), and Express 5 API payloads.

---

## 📑 Table of Contents
1. [Mandatory Execution Rule: Reference-First Pattern Adoption](#-mandatory-execution-rule-reference-first-pattern-adoption-docsph-healthcare-nextjs)
2. [Architecture Blueprint & Reference Model](#-architecture-blueprint--reference-model)
3. [Demo Credentials & User Roles](#-demo-credentials--user-roles)
4. [Page Coverage Matrix (18+ Pages)](#-page-coverage-matrix-18-pages)
5. [Master 30-Commit Roadmap](#-master-30-commit-roadmap)
   - [Phase 1: Foundation, Blocker UI & Auth (Commits 1–6)](#phase-1-foundation-blocker-ui--auth-commits-16)
   - [Phase 2: Shell Layouts, Sidebars & Route Guards (Commits 7–10)](#phase-2-shell-layouts-sidebars--route-guards-commits-710)
   - [Phase 3: Public & Civic Marketing Pages (Commits 11–14)](#phase-3-public--civic-marketing-pages-commits-1114)
   - [Phase 4: Citizen Portal & Complaint Workflows (Commits 15–19)](#phase-4-citizen-portal--complaint-workflows-commits-1519)
   - [Phase 5: Staff / Field Technician Portal (Commits 20–23)](#phase-5-staff--field-technician-portal-commits-2023)
   - [Phase 6: Admin Governance & City Operations (Commits 24–27)](#phase-6-admin-governance--city-operations-commits-2427)
   - [Phase 7: Payments, Notifications & Final Polish (Commits 28–30)](#phase-7-payments-notifications--final-polish-commits-2830)
6. [Git Workflow & Verification Best Practices](#-git-workflow--verification-best-practices)

---

## 🏛️ Architecture Blueprint & Reference Model

Following the architecture of `docs/PH-Healthcare-Nextjs` and the Next.js 16 App Router best practices:

```
src/
├── api/                      # ofetch endpoint services (auth.api.ts, request.api.ts, etc.)
├── app/
│   ├── (public)/             # Public pages (Header + Footer layout)
│   │   ├── (marketing)/      # /, /about, /services, /contact, /track
│   │   └── (authentication)/ # /login, /register, /verify-email
│   ├── (dashboard)/          # Authenticated App (SidebarProvider + DashboardShell)
│   │   ├── admin/            # /admin, /admin/requests, /admin/departments, /admin/users, /admin/audit-logs
│   │   ├── staff/            # /staff, /staff/assigned, /staff/updates, /staff/profile
│   │   └── dashboard/        # /dashboard (Citizen overview), /dashboard/requests, /dashboard/payments, /dashboard/profile
│   ├── payment/              # /payment/success, /payment/cancel
│   ├── error.tsx             # Global Error Boundary
│   ├── not-found.tsx         # Global Custom 404
│   ├── layout.tsx            # Root HTML layout with Fonts, Providers & Toaster
│   └── globals.css           # Tailwind v4 theme definitions
├── components/
│   ├── auth/                 # AuthGuard, RoleGuard, AccessDenied, AuthLoading
│   ├── dashboard/            # DashboardShell, DashboardSidebar, DashboardHeader
│   ├── form/                 # LoginForm, RegisterForm, ComplaintWizard, FeedbackModal
│   ├── layout/               # Header, Footer, MobileNav
│   ├── modules/              # Domain components (Timeline, StatusBadge, PriorityBadge)
│   └── ui/                   # shadcn base-lyra styled Base UI components
├── hooks/                    # TanStack Query custom hooks (useLogin, useRequests, useWards, etc.)
├── lib/                      # apiClient.ts (ofetch with credentials: include), utils.ts (cn)
├── providers/                # QueryProvider, GoogleProvider, ToasterProvider
├── routes/                   # admin.routes.ts, staff.routes.ts, citizen.routes.ts
├── types/                    # api.type.ts, user.type.ts, request.type.ts, payment.type.ts
└── validation/               # Zod schemas (auth.validation.ts, request.validation.ts)
```

---

## 👥 Demo Credentials & User Roles

The application strictly implements **3 distinct primary roles** matching `docs/city-complaint-backend`:

| Role | Demo Email | Demo Password | Default Route | Key Responsibilities |
|---|---|---|---|---|
| **ADMIN** | `superadmin@gmail.com` | `Super@Admin123456` | `/admin` | City oversight, triage & routing, staff assignment, department/category CRUD, audit logs |
| **STAFF** | `rakib.staff@citycare.com` | `Staff@1234` | `/staff` | Department casework, status transitions (`IN_PROGRESS` → `RESOLVED`), work updates, onsite photos |
| **CITIZEN** | `testercitizen@gmail.com` | `Tester@Citizen123456` | `/dashboard` | Submit civic complaints, track timeline, rate resolution, pay service/permit bills |

*Mandatory requirement:* The `/login` page includes **One-Click Demo Login** buttons for all three accounts above.

---

## 📋 Page Coverage Matrix (18+ Pages)

| # | Route | Route Group | Access | Purpose |
|---|---|---|---|---|
| 1 | `/` | `(public)/(marketing)` | Public | CityCare landing page, live civic stats & department overview |
| 2 | `/about` | `(public)/(marketing)` | Public | Platform mission, SLA commitment framework, leadership |
| 3 | `/services` | `(public)/(marketing)` | Public | Directory of municipal departments and complaint categories |
| 4 | `/contact` | `(public)/(marketing)` | Public | City council contact info, emergency hotlines, general inquiry form |
| 5 | `/track` | `(public)/(marketing)` | Public | Public complaint tracking lookup by Request Number (`REQ-2026-XXXXX`) |
| 6 | `/login` | `(public)/(authentication)` | Public | Login form with One-Click Demo buttons & Google Sign-In |
| 7 | `/register` | `(public)/(authentication)` | Public | Citizen registration form (Name, Email, Phone, Password) |
| 8 | `/verify-email` | `(public)/(authentication)` | Public | OTP verification screen (`input-otp`) with 5-minute countdown |
| 9 | `/dashboard` | `(dashboard)/dashboard` | CITIZEN | Citizen dashboard overview (recent activity, open cases, notifications) |
| 10 | `/dashboard/submit-request` | `(dashboard)/dashboard` | CITIZEN | Multi-step complaint submission wizard with image preview |
| 11 | `/dashboard/requests` | `(dashboard)/dashboard` | CITIZEN | My complaints list with status tabs, search & pagination |
| 12 | `/dashboard/requests/[id]` | `(dashboard)/dashboard` | CITIZEN / Role | Complaint details with live unified event timeline & work updates |
| 13 | `/dashboard/payments` | `(dashboard)/dashboard` | CITIZEN | Citizen payment bills, bKash checkout trigger & invoice receipts |
| 14 | `/dashboard/profile` | `(dashboard)/dashboard` | Any Auth | Profile view/edit & Cloudinary profile image upload |
| 15 | `/staff` | `(dashboard)/staff` | STAFF | Staff dashboard overview (assigned workload, urgent tickets, SLA timers) |
| 16 | `/staff/assigned` | `(dashboard)/staff` | STAFF | Assigned complaints table, status transitions & work update logger |
| 17 | `/admin` | `(dashboard)/admin` | ADMIN / SUPER | Admin analytics overview (Recharts charts, department stats, SLA rates) |
| 18 | `/admin/requests` | `(dashboard)/admin` | ADMIN / SUPER | Master complaints management, department routing & staff assignment |
| 19 | `/admin/departments` | `(dashboard)/admin` | ADMIN / SUPER | Municipal department CRUD & staff member assignments |
| 20 | `/admin/categories` | `(dashboard)/admin` | ADMIN / SUPER | Complaint categories & SLA policies management |
| 21 | `/admin/wards` | `(dashboard)/admin` | ADMIN / SUPER | Ward management CRUD table |
| 22 | `/admin/users` | `(dashboard)/admin` | ADMIN / SUPER | User administration (filter by role/status, block/activate accounts) |
| 23 | `/admin/audit-logs` | `(dashboard)/admin` | ADMIN / SUPER | Immutable audit trail viewer (actor, action, diff snapshots) |
| 24 | `/payment/success` | `payment` | CITIZEN | Payment success confirmation, transaction ID & invoice print |
| 25 | `/payment/cancel` | `payment` | CITIZEN | Payment cancelled / failed warning & retry trigger |
| 26 | `not-found.tsx` | Utility | Public | Modern 404 page with navigation redirects |
| 27 | `error.tsx` | Utility | Public | Global error boundary with retry handler |

---

## 🚀 Master 30-Commit Roadmap

### Phase 1: Foundation, Blocker UI & Auth (Commits 1–6)
*Focus: Eliminate all blockers, establish API client, core types, shared UI primitives, and complete auth flows.*

#### 📌 Commit 01
- **Message:** `chore: setup project structure, providers and api client`
- **Goal:** Establish standard client architecture following `PH-Healthcare-Nextjs`.
- **Files Modified / Created:**
  - `src/lib/apiClient.ts` (configure `ofetch` instance with `baseURL: process.env.NEXT_PUBLIC_API_BASE_URL` and `credentials: "include"`)
  - `src/providers/query.provider.tsx` (singleton TanStack Query client)
  - `src/providers/google.provider.tsx` (GoogleOAuthProvider wrapper)
  - `src/providers/index.tsx` (composite Providers wrapper)
  - `.env.local` & `.env.example` (`NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1`)
- **Verification:** Run `bun run build` to confirm zero compilation errors.

#### 📌 Commit 02
- **Message:** `feat: add core types, enums and zod validation schemas`
- **Goal:** Mirror backend database enums, API envelopes, and validation rules in frontend.
- **Files Modified / Created:**
  - `src/types/api.type.ts` (`ApiResponse<T>`, `Meta`, `ApiError`)
  - `src/types/user.type.ts` (`UserRole`, `UserStatus`, `User`, `CitizenProfile`, `DepartmentMember`)
  - `src/types/request.type.ts` (`RequestType`, `RequestPriority`, `RequestStatus`, `ServiceRequest`, `TimelineEvent`, `WorkUpdate`)
  - `src/types/payment.type.ts` (`PaymentStatus`, `PaymentPurpose`, `Payment`, `PaymentTransaction`)
  - `src/types/index.ts` (barrel export)
  - `src/validation/auth.validation.ts` (Zod schemas for login, register, verify-email, forgot-password)
  - `src/validation/request.validation.ts` (Zod schema for complaint creation & feedback)
  - `src/validation/index.ts` (barrel export)
- **Verification:** Run `bunx tsc --noEmit`.

#### 📌 Commit 03
- **Message:** `feat: import shared base-lyra shadcn ui components`
- **Goal:** Provide all required UI building blocks matching `PH-Healthcare-Nextjs` style.
- **Files Modified / Created:**
  - `src/components/ui/card.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/sheet.tsx`
  - `src/components/ui/tabs.tsx`
  - `src/components/ui/table.tsx`
  - `src/components/ui/table-pagination.tsx`
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/ui/spinner.tsx`
  - `src/components/ui/toast.tsx` (or sonner wrapper)
- **Verification:** Confirm all UI components compile cleanly with `@base-ui/react`.

#### 📌 Commit 04
- **Message:** `feat: implement auth api services and react query hooks`
- **Goal:** Wire all authentication endpoints to TanStack Query hooks.
- **Files Modified / Created:**
  - `src/api/auth.api.ts` (`userLogin`, `userRegistration`, `verifyAccount`, `userLogout`, `getMe`, `googleOAuth`, `forgotPassword`, `resetPassword`)
  - `src/api/index.ts`
  - `src/hooks/auth.hook.ts` (`useLogin`, `useRegistration`, `useVerifyAccount`, `useLogout`, `useGetMe`, `useGoogleOAuth`)
  - `src/hooks/index.ts`
- **Verification:** Verify that query keys and mutation callbacks are typed with `ApiResponse<T>`.

#### 📌 Commit 05
- **Message:** `feat: build login page with one-click demo role logins`
- **Goal:** Complete the mandatory One-Click Role Login requirement and email/password login form.
- **Files Modified / Created:**
  - `src/components/form/login-form.tsx` (TanStack Form + Zod, password toggle, error states)
  - `src/components/auth/demo-login-cards.tsx` (3 distinct buttons for **Admin**, **Staff**, and **Citizen** that fill credentials and trigger login with 1 click)
  - `src/app/(public)/(authentication)/login/page.tsx` (split layout with login hero graphic and login form)
- **Verification:** Test one-click login buttons for all 3 demo roles.

#### 📌 Commit 06
- **Message:** `feat: add citizen registration and otp verification flows`
- **Goal:** Citizen signup with email OTP verification.
- **Files Modified / Created:**
  - `src/components/form/register-form.tsx` (Name, Email, Phone, Password validation)
  - `src/components/form/verify-otp-modal.tsx` (6-digit OTP input with countdown timer & resend link)
  - `src/app/(public)/(authentication)/register/page.tsx`
  - `src/app/(public)/(authentication)/verify-email/page.tsx`
- **Verification:** Verify registration triggers OTP modal and auto-redirects upon verification.

---

### Phase 2: Shell Layouts, Sidebars & Route Guards (Commits 7–10)
*Focus: Implement route security, permission checks, navigation menus, and the dashboard shell.*

#### 📌 Commit 07
- **Message:** `feat: implement auth guard, role guard and route middleware`
- **Goal:** Enforce route-level and component-level security for all 3 roles.
- **Files Modified / Created:**
  - `src/components/auth/auth-guard.tsx` (redirects unauthenticated users to `/login`)
  - `src/components/auth/role-guard.tsx` (checks current user role against allowed roles)
  - `src/components/auth/access-denied.tsx` (clean 403 screen with home redirect)
  - `src/components/auth/auth-loading.tsx` (fullscreen branded spinner)
  - `src/middleware.ts` (Next.js middleware parsing cookie tokens and redirecting unauthorized roles)
- **Verification:** Test navigating to `/admin` as a Citizen; verify redirect or AccessDenied view.

#### 📌 Commit 08
- **Message:** `feat: create public navbar, footer and marketing layout`
- **Goal:** Responsive public header and footer for marketing pages.
- **Files Modified / Created:**
  - `src/components/layout/Header.tsx` (logo, navigation links, role-aware dashboard button or Login/Register CTA, mobile drawer)
  - `src/components/layout/Footer.tsx` (city links, emergency services hotline, copyright)
  - `src/app/(public)/(marketing)/layout.tsx` (renders Header, children, Footer)
- **Verification:** Verify mobile responsive hamburger menu and sticky navbar behavior.

#### 📌 Commit 09
- **Message:** `feat: build responsive dashboard sidebar and layout shell`
- **Goal:** Replicate `PH-Healthcare-Nextjs` dashboard shell for authenticated users.
- **Files Modified / Created:**
  - `src/components/dashboard/dashboard-sidebar.tsx` (collapsible sidebar with active link highlights)
  - `src/components/dashboard/dashboard-header.tsx` (breadcrumb, user profile avatar, notifications bell, theme switch)
  - `src/components/dashboard/dashboard-shell.tsx` (SidebarProvider, SidebarInset, responsive header)
  - `src/app/(dashboard)/layout.tsx` (wraps dashboard routes in AuthGuard and DashboardShell)
- **Verification:** Test sidebar toggle and collapse on mobile and desktop viewports.

#### 📌 Commit 10
- **Message:** `feat: define role-based route configurations for 3 user roles`
- **Goal:** Modular navigation menus for Admin, Staff, and Citizen.
- **Files Modified / Created:**
  - `src/routes/admin.routes.ts` (Overview, Requests, Departments, Categories/SLA, Wards, Users, Audit Logs)
  - `src/routes/staff.routes.ts` (Overview, Assigned Cases, Field Updates, Profile)
  - `src/routes/citizen.routes.ts` (Overview, Submit Complaint, My Complaints, Payments, Profile)
  - `src/routes/index.ts` (barrel export)
  - `src/types/sidebar.type.ts`
- **Verification:** Log in with each role; verify sidebar displays the correct menu items.

---

### Phase 3: Public & Civic Marketing Pages (Commits 11–14)
*Focus: Build engaging, fast Server Components for public citizens.*

#### 📌 Commit 11
- **Message:** `feat: build civic home page with statistics and complaint showcase`
- **Goal:** Modern landing page with real civic data metrics and CTA.
- **Files Modified / Created:**
  - `src/components/modules/home/hero-section.tsx` (Hero banner with "Report Issue" & "Track Request" CTAs)
  - `src/components/modules/home/stats-counter.tsx` (Total resolved, active cases, average SLA resolution time)
  - `src/components/modules/home/how-it-works.tsx` (4-step visual flow: Report → Route → Inspect → Resolve)
  - `src/components/modules/home/recent-resolved-showcase.tsx` (Cards with before/after resolution pictures)
  - `src/app/(public)/(marketing)/page.tsx`
- **Verification:** Run Lighthouse / inspect page load and layout shift.

#### 📌 Commit 12
- **Message:** `feat: implement city departments and services directory page`
- **Goal:** Public directory of municipal departments and available public services.
- **Files Modified / Created:**
  - `src/api/department.api.ts` (`getPublicDepartments`, `getDepartmentById`)
  - `src/api/category.api.ts` (`getPublicCategories`)
  - `src/components/modules/departments/department-card.tsx`
  - `src/app/(public)/(marketing)/departments/page.tsx`
  - `src/app/(public)/(marketing)/services/page.tsx`
- **Verification:** Verify clicking a department shows contact details and complaint categories.

#### 📌 Commit 13
- **Message:** `feat: create about us, mission and civic transparent governance page`
- **Goal:** Civic mission, municipal transparency charter, and leadership.
- **Files Modified / Created:**
  - `src/components/modules/about/sla-commitment-card.tsx`
  - `src/components/modules/about/team-grid.tsx`
  - `src/app/(public)/(marketing)/about/page.tsx`
- **Verification:** Test layout responsiveness on mobile.

#### 📌 Commit 14
- **Message:** `feat: build public complaint tracking and contact inquiry page`
- **Goal:** Public tracking page where citizens enter request number to check status without login.
- **Files Modified / Created:**
  - `src/components/modules/tracking/public-tracker.tsx` (input for `REQ-2026-XXXXX` with status stepper)
  - `src/components/form/contact-form.tsx` (general inquiries form with validation)
  - `src/app/(public)/(marketing)/track/page.tsx`
  - `src/app/(public)/(marketing)/contact/page.tsx`
- **Verification:** Enter a valid request number; verify public timeline details render properly.

---

### Phase 4: Citizen Portal & Complaint Workflows (Commits 15–19)
*Focus: Core citizen features — complaint submission wizard, request tracking, feedback, profile.*

#### 📌 Commit 15
- **Message:** `feat: build multi-step citizen complaint submission wizard`
- **Goal:** Wizard form for filing municipal service complaints.
- **Files Modified / Created:**
  - `src/api/request.api.ts` (`createServiceRequest`, `getMyRequests`, `getRequestById`)
  - `src/hooks/request.hook.ts` (`useCreateRequest`, `useMyRequests`, `useRequestDetails`)
  - `src/components/form/complaint-wizard/step-category.tsx`
  - `src/components/form/complaint-wizard/step-location.tsx` (Ward picker + address input)
  - `src/components/form/complaint-wizard/step-details.tsx` (Title, description, priority)
  - `src/components/form/complaint-wizard/step-media.tsx` (Multi-file photo upload preview)
  - `src/components/form/complaint-wizard/complaint-wizard.tsx` (Stepper navigation with draft state)
  - `src/app/(dashboard)/dashboard/submit-request/page.tsx`
- **Verification:** Submit a new complaint; verify generated `requestNo` is returned and displayed.

#### 📌 Commit 16
- **Message:** `feat: implement citizen complaints dashboard with filters and search`
- **Goal:** Citizen's list of filed complaints with URL-synchronized filtering.
- **Files Modified / Created:**
  - `src/components/modules/requests/request-filter-bar.tsx` (Status tabs, priority dropdown, search input via `useSearchParams`)
  - `src/components/modules/requests/request-card.tsx`
  - `src/components/modules/requests/request-table.tsx`
  - `src/components/ui/status-badge.tsx` (color-coded for SUBMITTED, IN_PROGRESS, RESOLVED, etc.)
  - `src/app/(dashboard)/dashboard/requests/page.tsx`
  - `src/app/(dashboard)/dashboard/requests/loading.tsx` (skeleton list loader)
- **Verification:** Filter by status; verify URL updates (`?status=IN_PROGRESS`) and state persists on refresh.

#### 📌 Commit 17
- **Message:** `feat: create complaint details page with unified event timeline`
- **Goal:** Full request details view with SLA countdown, attachments, and visual audit timeline.
- **Files Modified / Created:**
  - `src/api/timeline.api.ts` (`getRequestTimeline`, `getRequestUpdates`)
  - `src/components/modules/requests/timeline-stepper.tsx` (visual event trail: submitted, routed, assigned, resolved)
  - `src/components/modules/requests/sla-indicator.tsx` (time remaining before SLA breach)
  - `src/components/modules/requests/media-gallery.tsx` (inspection images with lightbox zoom)
  - `src/app/(dashboard)/dashboard/requests/[id]/page.tsx`
  - `src/app/(dashboard)/dashboard/requests/[id]/loading.tsx`
- **Verification:** Verify single request details page displays all milestones in timeline order.

#### 📌 Commit 18
- **Message:** `feat: add citizen feedback rating modal for resolved complaints`
- **Goal:** Allow citizens to submit rating and review once complaint reaches `RESOLVED` or `CLOSED`.
- **Files Modified / Created:**
  - `src/api/feedback.api.ts` (`submitFeedback`, `getRequestFeedback`)
  - `src/hooks/feedback.hook.ts` (`useSubmitFeedback`, `useRequestFeedback`)
  - `src/components/form/feedback-modal.tsx` (1–5 star rating, comment, validation)
- **Verification:** Confirm feedback button only appears on terminal state complaints.

#### 📌 Commit 19
- **Message:** `feat: build citizen profile management and avatar upload`
- **Goal:** Edit citizen profile info and upload profile image.
- **Files Modified / Created:**
  - `src/api/user.api.ts` (`updateMyProfile`, `uploadProfileImage`, `deleteMe`)
  - `src/hooks/user.hook.ts` (`useUpdateProfile`, `useUploadProfileImage`)
  - `src/components/form/profile-form.tsx` (Name, contact number, address)
  - `src/components/modules/profile/avatar-upload.tsx` (Drag-and-drop image upload to Cloudinary)
  - `src/app/(dashboard)/dashboard/profile/page.tsx`
- **Verification:** Upload a profile image; verify instant UI update with TanStack Query cache invalidation.

---

### Phase 5: Staff / Field Technician Portal (Commits 20–23)
*Focus: Staff caseload triage, status state machine execution, onsite work updates and photo uploads.*

#### 📌 Commit 20
- **Message:** `feat: build staff dashboard overview with assigned workload metrics`
- **Goal:** Summary dashboard for department technicians and case officers.
- **Files Modified / Created:**
  - `src/components/modules/staff/staff-metrics.tsx` (Assigned tickets, urgent cases, SLA overdue)
  - `src/components/modules/staff/recent-assigned-list.tsx`
  - `src/app/(dashboard)/staff/page.tsx`
  - `src/app/(dashboard)/staff/loading.tsx`
- **Verification:** Log in as `rakib.staff@citycare.com`; verify technician caseload metrics load correctly.

#### 📌 Commit 21
- **Message:** `feat: implement staff assigned requests list and priority triage`
- **Goal:** Table of requests assigned to staff's department with quick filters.
- **Files Modified / Created:**
  - `src/components/modules/staff/staff-requests-table.tsx` (columns: Request No, Citizen, Priority, Status, SLA Due, Actions)
  - `src/components/modules/staff/priority-tag.tsx` (urgent pulse animation)
  - `src/app/(dashboard)/staff/assigned/page.tsx`
- **Verification:** Test sorting by urgency and filtering by category.

#### 📌 Commit 22
- **Message:** `feat: add staff status transition controls and state machine validation`
- **Goal:** Validated status transitions adhering to backend state machine rules.
- **Files Modified / Created:**
  - `src/api/status.api.ts` (`updateRequestStatus`)
  - `src/hooks/status.hook.ts` (`useUpdateStatus`)
  - `src/components/modules/staff/status-update-dialog.tsx` (select new status: `IN_PROGRESS`, `RESOLVED`, `PENDING` with reason note)
- **Verification:** Transition a request from `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`; verify invalid transitions are disabled in the UI.

#### 📌 Commit 23
- **Message:** `feat: implement staff work updates log and on-site media attachments`
- **Goal:** Field technicians post progress updates and photo proof.
- **Files Modified / Created:**
  - `src/api/work-update.api.ts` (`addWorkUpdate`, `getWorkUpdates`)
  - `src/api/attachment.api.ts` (`uploadAttachment`, `deleteAttachment`)
  - `src/components/form/work-update-form.tsx` (description + photo file upload)
  - `src/components/modules/staff/work-update-feed.tsx`
- **Verification:** Post a work update with an image; verify it appears in the citizen's timeline.

---

### Phase 6: Admin Governance & City Operations (Commits 24–27)
*Focus: Analytics with Recharts, master request triage & routing, departments, SLA policies, user administration, and audit logs.*

#### 📌 Commit 24
- **Message:** `feat: build admin analytics dashboard with charts and sla performance`
- **Goal:** High-level executive dashboard with Recharts visualizations.
- **Files Modified / Created:**
  - `src/components/modules/admin/stat-card.tsx`
  - `src/components/modules/admin/complaints-trend-chart.tsx` (Area chart of monthly complaint volume)
  - `src/components/modules/admin/department-performance-chart.tsx` (Bar chart of resolution rates per department)
  - `src/components/modules/admin/status-distribution-chart.tsx` (Donut / Pie chart of requests by status)
  - `src/app/(dashboard)/admin/page.tsx`
  - `src/app/(dashboard)/admin/loading.tsx`
- **Verification:** Verify Recharts graphs render responsively on all screen sizes.

#### 📌 Commit 25
- **Message:** `feat: implement admin request triage, department routing and staff assignment`
- **Goal:** Administrative dispatch center to route complaints to departments and assign staff technicians.
- **Files Modified / Created:**
  - `src/api/routing.api.ts` (`routeToDepartment`, `endRoute`)
  - `src/api/assignment.api.ts` (`assignStaffMember`, `releaseAssignment`)
  - `src/components/modules/admin/route-department-modal.tsx` (Department dropdown + routing notes)
  - `src/components/modules/admin/assign-staff-modal.tsx` (Staff technician picker by department)
  - `src/app/(dashboard)/admin/requests/page.tsx`
- **Verification:** Route a new request to "Water Supply & Sewerage" and assign to staff; verify status changes to `ASSIGNED`.

#### 📌 Commit 26
- **Message:** `feat: create departments, categories and sla policies management tables`
- **Goal:** CRUD operations for municipal infrastructure entities.
- **Files Modified / Created:**
  - `src/components/modules/admin/department-form-dialog.tsx` (Create/Update department)
  - `src/components/modules/admin/category-form-dialog.tsx` (Create/Update category + SLA hours)
  - `src/components/modules/admin/sla-policy-dialog.tsx` (Response time & resolution time in hours)
  - `src/app/(dashboard)/admin/departments/page.tsx`
  - `src/app/(dashboard)/admin/categories/page.tsx`
- **Verification:** Add a new category with a 24h SLA; test creating a request under that category.

#### 📌 Commit 27
- **Message:** `feat: implement user role administration, ward manager and audit logs viewer`
- **Goal:** Manage city users, wards, and review immutable audit trail.
- **Files Modified / Created:**
  - `src/api/audit.api.ts` (`getAuditLogs`, `getAuditActions`)
  - `src/api/ward.api.ts` (`getWards`, `createWard`, `updateWard`, `deleteWard`)
  - `src/components/modules/admin/users-table.tsx` (search by name/email, toggle active/blocked status)
  - `src/components/modules/admin/ward-table.tsx`
  - `src/components/modules/admin/audit-log-viewer.tsx` (action badges, actor ID, before/after JSON diff preview)
  - `src/app/(dashboard)/admin/users/page.tsx`
  - `src/app/(dashboard)/admin/wards/page.tsx`
  - `src/app/(dashboard)/admin/audit-logs/page.tsx`
- **Verification:** Perform an action; verify it immediately records in the audit logs viewer.

---

### Phase 7: Payments, Notifications & Final Polish (Commits 28–30)
*Focus: Payment checkout & callback redirects, notifications popover, error boundaries, SEO metadata, and production validation.*

#### 📌 Commit 28
- **Message:** `feat: implement fee issuance, bkash checkout and payment verification`
- **Goal:** End-to-end municipal payment integration (inspection fees, service permits).
- **Files Modified / Created:**
  - `src/api/payment.api.ts` (`issuePayment`, `getMyPayments`, `getAllPayments`, `initiateCheckout`, `getPaymentById`)
  - `src/hooks/payment.hook.ts` (`useIssuePayment`, `useMyPayments`, `useInitiateCheckout`)
  - `src/components/modules/payment/issue-payment-modal.tsx` (Staff/Admin fee issuance)
  - `src/components/modules/payment/payment-list.tsx` (Citizen bills list with "Pay with bKash" button)
  - `src/app/(dashboard)/dashboard/payments/page.tsx`
- **Verification:** Click "Pay Now" on a pending fee; verify redirect to bKash checkout URL.

#### 📌 Commit 29
- **Message:** `feat: create payment success, payment cancel redirects and notification center`
- **Goal:** Payment return handlers and real-time notification drawer.
- **Files Modified / Created:**
  - `src/api/notification.api.ts` (`getMyNotifications`, `markAsRead`, `markAllAsRead`)
  - `src/hooks/notification.hook.ts` (`useNotifications`, `useMarkAsRead`)
  - `src/components/modules/notification/notification-popover.tsx` (Unread badge counter + interactive list)
  - `src/app/payment/success/page.tsx` (Transaction ID receipt card + return to dashboard button)
  - `src/app/payment/cancel/page.tsx` (Payment cancelled warning + retry button)
- **Verification:** Complete/cancel payment; verify redirect to respective confirmation page.

#### 📌 Commit 30
- **Message:** `feat: add custom 404, global error boundary, metadata and production polish`
- **Goal:** Final deployment readiness, accessibility, SEO metadata, and zero-error builds.
- **Files Modified / Created:**
  - `src/app/not-found.tsx` (Civic 404 illustration with breadcrumbs)
  - `src/app/error.tsx` (App-wide error boundary with error report trigger)
  - `src/app/layout.tsx` (Dynamic metadata: title, description, OpenGraph tags, favicon)
  - `README.md` (Update project documentation with live link, video link, and demo credentials)
- **Verification:** Run `bun run build` and `bun run lint`; confirm zero warnings and static page pre-rendering succeeds.

---

## 🛠️ Git Workflow & Verification Best Practices

To guarantee the required **25–35 clean commits** with optimal Git health:

1. **Reference Inspection (Mandatory Step 0):**
   - Before drafting code for a commit, check `docs/PH-Healthcare-Nextjs` for equivalent components, hooks, schemas, types, or API patterns.
   - Replicate the proven methods and design patterns directly.
2. **Commit Convention:**
   - Use standard conventional commit prefixes: `feat:`, `fix:`, `chore:`, `refactor:`.
   - Keep messages short, descriptive, and under 60 characters.
3. **Atomic Commits:**
   - Stage only the files corresponding to the specific feature.
   ```bash
   git add src/components/form/login-form.tsx src/components/auth/demo-login-cards.tsx
   git commit -m "feat: build login page with one-click demo role logins"
   ```
4. **Pre-Commit Verification:**
   Before every commit, always run:
   ```bash
   bunx tsc --noEmit    # Ensure TypeScript passes
   bun run lint         # Ensure Biome linter passes
   ```
5. **Push Cadence:**
   Push your commits regularly to origin:
   ```bash
   git push origin main
   ```
