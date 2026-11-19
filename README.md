# 🚀 Multi-Tenant Business Intelligence & AI Forecasting SaaS Platform

A modern, full-stack multi-tenant BI and analytics SaaS application with automated data pipelines, Scikit-learn predictive forecasting, order analytics, and customizable reporting.

---

## 📌 Features
- **Multi-Tenant Architecture**: Complete tenant isolation, workspaces, and role-based access control.
- **Automated CSV Ingestion**: Fast dataset processing powered by Pandas, schema validation, and database cascading.
- **AI / ML Price & Sales Forecasting**: Scikit-learn Ridge regression modeling historical daily sales into forward projections.
- **Analytics & BI Metrics**: Clean executive KPIs (PKR currency format), daily revenue charts, top-performing product leaderboards.
- **Consolidated Reporting**: One-click All-in-One CSV report generator.
- **Superadmin Portal**: Dedicated portal for monitoring business admins and workspaces.

---

## 🔑 Default Login Credentials

Importing the provided `saas_db_dump.sql` pre-configures the following operational accounts:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gmail.com` | `malaika3#` | Full platform access, Manage Business Admins |
| **Business Admin** | `mikamalaika14@gmail.com` | `malaika3#` | Business Dashboard, Orders, Products, ML Forecast |

---

## 🛠️ Tech Stack
- **Backend**: Python 3.10+, Django 5, Django REST Framework, Pandas, Scikit-learn, Joblib
- **Database**: MySQL 8.0
- **Frontend**: React 18, Vite, Recharts, Lucide Icons, Axios
- **API Style**: RESTful JSON API with JWT authentication

---

## ⚡ Quick Setup & Local Installation

### Prerequisites
1. **Python 3.10+**
2. **Node.js 18+ & npm**
3. **MySQL Server 8.0+**

---

### Step 1: Database Setup (MySQL)
Open MySQL terminal or Workbench and create the database:
```sql
CREATE DATABASE saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import the pre-configured dump file (contains schema, all migrations, accounts, and demo orders):
```bash
# Using Command Line
mysql -u root -p saas < saas_db_dump.sql
```
*(Or import `saas_db_dump.sql` directly using MySQL Workbench / phpMyAdmin).*

---

### Step 2: Backend Setup
1. Open terminal in the project root directory.
2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Verify database connection in `backend/bi_saas/settings.py` (adjust MySQL `USER` and `PASSWORD` if your local MySQL credentials differ from `root` / `root123`).
5. Run migrations (already satisfied if dump is imported):
   ```bash
   python backend/manage.py migrate
   ```
6. Start Django server:
   ```bash
   python backend/manage.py runserver 127.0.0.1:8000
   ```

---

### Step 3: Frontend Setup
1. Open a new terminal in the project root.
2. Navigate to frontend directory and install packages:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at **`http://localhost:3000`**.

---

## 📦 Project Structure
```text
├── backend/
│   ├── bi_saas/              # Django core settings & routing
│   ├── authentication/       # JWT Auth & Multi-tenant User model
│   ├── business/             # Orders, Products, Customers, Datasets
│   ├── analytics_engine/     # Pandas BI aggregation engine
│   ├── ml/                   # Scikit-learn sales regression models
│   └── reports/              # All-in-One CSV export services
├── frontend/
│   ├── src/
│   │   ├── pages/            # Dashboard, Orders, Customers, Predict, Import
│   │   ├── components/       # Navbar, Sidebar, StatCard, Modals
│   │   └── api/              # Axios API client
├── saas_db_dump.sql          # Pre-loaded MySQL database dump
├── requirements.txt          # Python dependencies
└── README.md                 # Setup documentation
```

---

## 🔒 Security & Best Practices
- Never commit active `.env` files with production secrets.
- In production, set `DEBUG = False` and specify valid `ALLOWED_HOSTS`.
- Ensure MySQL user permissions are scoped strictly to the `saas` database.
