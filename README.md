# KANTIN AU - Modern Finance & Order Management System

CanteenSys is a highly responsive, full-stack Point of Sale (POS) and Financial Dashboard designed to streamline canteen order management, stock tracking, and revenue reporting. Built with modern web development practices, it prioritizes performance, security, and a premium User Experience (UX).

## 🚀 Tech Stack & Architecture

This project is built using a modern, scalable JavaScript/TypeScript ecosystem:

### Core Framework & Backend
- **Framework:** [Next.js (App Router)](https://nextjs.org/) - Utilizing the latest React paradigm for optimal performance.
- **Data Mutation:** **React Server Actions** - Form submissions and database mutations are handled entirely on the server-side, eliminating the need for boilerplate API routes and enhancing security against client-side tampering.
- **Language:** **TypeScript** - Enforcing static typing to maintain codebase integrity and reduce runtime errors.
- **Database:** **MongoDB** (via Mongoose) - A flexible NoSQL database perfectly suited for handling dynamic product catalog structures and transaction histories.

### Frontend & UI/UX
- **Styling:** **Tailwind CSS** - Utility-first CSS framework enabling rapid UI development with a consistent, atomic design system.
- **UI Components:** Built from scratch with a focus on Glassmorphism aesthetics, fluid micro-interactions, and a strict Mobile-First responsive grid.
- **Icons:** **Lucide React** - Clean, consistent, and highly customizable SVG icons.

### Security & State Management
- **Authentication:** **Next.js Middleware** - Edge-level route protection. Unauthorized access to `/dashboard`, `/transaction`, etc., is intercepted before rendering.
- **Localization:** Custom Context Provider managing ID/EN dictionary states persistently via HTTP-only Cookies.
- **State Management:** React Hooks (`useState`, `useEffect`, `useTransition` for non-blocking UI updates).

## 🏗️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB cluster (Atlas or Local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hannndii/dashboard_finance.git
   cd dashboard_finance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_USER=your_admin_username
   ADMIN_PASS=your_admin_password
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Repository Structure
- `/app` - Next.js App Router containing Pages, Server Actions, and API definitions.
- `/app/component` - Reusable React UI components (Sidebar, Topbar, Modals).
- `/models` - Mongoose database schemas.
- `/lib` - Core utilities (DB Connection, Dictionaries for localization).

---
*Built with ❤️ for better finance and order management.*
