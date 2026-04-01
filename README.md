# 🖥️ Smart Inventory & Order Management Dashboard

A high-performance, modern web application designed for seamless warehouse management and real-time sales analytics. Built with **Next.js 15**, **Redux Toolkit**, and **Tailwind CSS**, this dashboard provides a premium, data-driven experience for inventory administrators.

---

## ✨ Dashboard Preview

![Dashboard Preview](https://i.ibb.co/chZFv0mS/blob.jpg)

---

## 🚀 Key Features

### 📊 Real-time Revenue Analytics
- **Growth Tracking**: Interactive `AreaCharts` powered by **Recharts**, providing daily revenue insights with custom gradients and tooltips.
- **Dynamic Aggregation**: Automated calculation of rolling 7-day sales and performance metrics.

### ⚠️ Automated Restock Queue
- **Intelligent Thresholds**: System-wide monitoring that flags products where `stockQuantity <= minStockThreshold`.
- **Dedicated Fulfillment View**: A specialized workspace for restocking low or out-of-stock items, complete with status-based color coding (Amber for low, Rose for critical).
- **Sidebar Alerts**: Live count badges in the navigation drawer ensure you never miss an inventory shortage.

### 📦 Complete Inventory Lifecycle
- **Product Management**: Desktop-class interface for adding, editing, and archiving products with image support.
- **Categorization**: Multi-level category tagging for sophisticated catalog organization.
- **Order Fulfillment**: End-to-end status tracking from `Pending` to `Delivered`.

### 🛡️ Administrative Security
- **Protected Routes**: Custom Next.js Middleware ensures that all management surfaces are restricted to authenticated users.
- **Session Persistence**: Secure JWT handling with automated redirection to login on session expiry.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **State Management**: [Redux Toolkit (RTK) & RTK Query](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18.17+)
- A running instance of the [Inventory Server](https://github.com/fl9mdasif/Smart-Inventory-Order-Management-System)

### 1. Installation
```bash
git clone https://github.com/fl9mdasif/Smart-Inventory-client
cd Smart-Inventory-client
npm install
```
npm install
```

### 2. Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

*Designed for high-speed operations and visual excellence.*
