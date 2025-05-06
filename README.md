# The Menufy

A modern, full-stack restaurant and menu management platform for The Menufy Esprit PI Twin 2025 project.  
This repository contains both **frontend** and **backend** components in a monorepo structure.

---

## 🗂️ Project Structure

```
.
├── .env                  # Example environment config (edit for your local settings)
├── .gitignore
├── eslint.config.js
├── index.html
├── node_modules/
├── package.json          # Root package (mostly for scripts)
├── package-lock.json
├── pnpm-lock.yaml
├── PI/                   # (Optional: describe if used)
├── public/               # Static assets
├── README.md             # This file
├── src/                  # Frontend source code (React, Zustand, etc.)
├── the-menufy-backend/   # Backend (Express.js, MongoDB)
└── vite.config.js
```

- **src/**: Frontend React application  
- **the-menufy-backend/**: Express.js REST API backend  
- **public/**: Static assets for frontend  
- **.env**: Environment variables (copy `.env.example` and modify as needed)

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-org/ThemenufyEspritPITwin2025-Menu-Managment-backend-app.git
cd ThemenufyEspritPITwin2025-Menu-Managment-backend-app
```

### 2. **Install Dependencies**

Install for both frontend and backend (run these in the root and backend folders):

```bash
npm install --force
cd the-menufy-backend
npm install --force
cd ..
```

> If using `pnpm`, run `pnpm install` instead.

### 3. **Environment Variables**

- Copy `.env` and adapt it with your local settings (MongoDB URI, JWT secrets, etc.).
- Backend expects its own `.env` file inside `the-menufy-backend/`.

### 4. **Run the Backend**

```bash
cd the-menufy-backend
npm run dev      # For development with hot reload
# or
npm start        # For production
```

### 5. **Run the Frontend**

```bash
npm run dev
```

---

## ⚙️ Main Features

- User authentication (JWT, Google, Facebook, device verification)
- Restaurant and menu management (admins, menu items, variants)
- Role-based access (admin, user)
- Zustand store for frontend state management
- RESTful API (OpenAPI/Swagger documented)
- Device management, secure login/logout
- Responsive React Bootstrap UI

---

## 📖 Scripts

At project root and in `the-menufy-backend/` you will find:

| Script         | Description                     |
|----------------|--------------------------------|
| `npm run dev`  | Start frontend/backend in dev   |
| `npm start`    | Start backend in production     |
| `npm install`  | Install dependencies            |

---

## 🧑‍💻 Development Notes

- **Frontend**: React, Zustand, React Hook Form, Bootstrap, SweetAlert2, ReCAPTCHA, etc.
- **Backend**: Express.js, MongoDB (Mongoose), JWT, bcrypt, RESTful conventions.
- **API Docs**: Swagger JSDoc comments available in backend source.

---

## 📝 Contributing

1. Fork and clone the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit and push
4. Open a pull request!

---

## 🙋 FAQ

- **Q:** I get an error about missing dependencies?  
  **A:** Use `npm install --force` in both root and backend folders.

- **Q:** How do I connect to MongoDB?  
  **A:** Update your `.env` files with correct connection strings.

- **Q:** Where is the backend API?  
  **A:** All backend code is in `the-menufy-backend/` and usually runs on port 5000.

---

## 🏷️ License

MIT (c) 2025 The Menufy Esprit PI Twin Team

---

> _Happy coding!_
