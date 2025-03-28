# TCID Online Schedule

A public-facing application that provides TCID (Truckee-Carson Irrigation District) water users and stakeholders access to the current water order delivery schedule. It also allows the watermaster to post delivery updates and public messages.

---

## ✨ Features

- 🌍 Public access to the live water delivery schedule
- 📊 Clean, modern UI built with Next.js
- 📅 Admin portal for watermaster to update schedules and messages
- 🛋 Stakeholder view for efficient planning and coordination
- 📂 Database-agnostic with support for SQLite (dev) and MySQL (staging/prod)

---

## 🤖 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router)
- **Database:** [Prisma ORM](https://www.prisma.io/) with support for SQLite & MySQL
- **Styling/UI:** [ShadCN UI](https://ui.shadcn.com/) + Tailwind CSS

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mikelambson/TCID-Sched.git
cd TCID-Sched
```

### 2. Install dependencies
```bash
pnpm install   # or npm install / yarn install
```

### 3. Set up environment variables
You will need two `.env` files:

- **`.env`** – created by `npx prisma init`
- **`.env.local`** – used by Next.js during development

Key environment variables:
```env
DATABASE_URL="file:./dev.db"     # or mysql://... for prod
NEXT_PUBLIC_API_BASE="http://localhost:3000/api"
DB_PORT=3306                      # or 5432, 1433, etc.
```

### 4. Set up the database
```bash
npx prisma migrate dev --name init
```

### 5. Run the dev server
```bash
npm run dev
```
Then visit: [http://localhost:3000](http://localhost:3000)

---

## 📝 Development Notes

- A CLI-driven project initialization script is planned to streamline the setup process (e.g., select DB type, create .env files, apply Prisma schema, etc.)
- Default dev DB is SQLite. Staging/Production will likely use MySQL.
- Prisma makes swapping between DB providers seamless.

---

## 📖 License
MIT

---

## 📙 Acknowledgments
Project maintained by [@mikelambson](https://github.com/mikelambson) with contributions from the TCID IT & Operations teams.

---

## ⚙️ Roadmap (Planned Features)
- [ ] Admin login with role-based access
- [ ] Mobile optimization for ditchriders and stakeholders
- [ ] Historical schedule views
- [ ] Notification system for schedule updates
- [ ] Offline-capable schedule caching

---

