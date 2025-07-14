# AssuredLife - Life Insurance Management Platform - Client Side

AssuredLife is a modern, full-stack web application designed to streamline the process of purchasing and managing life insurance policies. It provides a secure, responsive, and role-based platform for customers, agents, and administrators.

## Live Site URL

**Live Site:** [https://assured-life.web.app/](https://assured-life.web.app/)

## Admin Credentials

To access the admin dashboard, please use the following credentials:

- **Email:** `m.sharful.i247@gmail.com`
- **Password:** `[I.admin.assured-life.01]`

---

## Key Features

- **Role-Based Access Control:** Secure dashboards and functionality tailored to three distinct user roles:
    - **Admin:** Manages the entire platform, including users, policies, agents, applications, and transactions.
    - **Agent:** Interacts with assigned customers, manages applications, and contributes to the platform's blog.
    - **Customer:** The default role for users, allowing them to browse and apply for policies, manage their dashboard, make payments, and submit claims.
- **Secure Authentication:** Robust user authentication and session management powered by Firebase and JWT (JSON Web Tokens).
- **Dynamic Policy Management:** Admins can create, read, update, and delete insurance policies directly from their dashboard.
- **Comprehensive Admin Dashboard:** A central hub for admins to manage users (promote/demote), review policy applications (approve/reject), and monitor all platform transactions.
- **Agent & Customer Dashboards:** Personalized dashboards for agents to manage their assigned customers and for customers to view their applied policies, check payment status, and submit claims or reviews.
- **Instant Quote Generation:** A public-facing tool that allows potential customers to get a personalized insurance premium estimate based on their age, coverage needs, and other factors.
- **Multi-Step Application Form:** A guided, multi-step form for a smooth user experience when applying for a new policy, including a progress bar.
- **Secure Payment Integration:** Seamless and secure premium payments handled through the Stripe payment gateway.
- **Tanstack Query for Data Fetching:** All data fetching from the backend is efficiently managed using Tanstack Query, ensuring a responsive and up-to-date user interface.
- **Fully Responsive Design:** The entire platform is built with a mobile-first approach and is fully responsive across desktops, tablets, and mobile devices.
- **Dynamic & Interactive UI:** Features like dynamic page titles, toast notifications for user actions, and interactive elements to enhance the user experience.
- **Content Management:** Agents can create, edit, and delete blog posts to share insights and tips with users.
- **Customer Reviews & Testimonials:** Customers can submit reviews for their policies, which are then dynamically displayed on the homepage.
- **PDF Policy Download:** Once a policy application is approved, customers can download a PDF summary of their policy details.

---

## Technologies Used

- **Frontend:** React, Tailwind CSS, Headless UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase Authentication, JWT
- **Payments:** Stripe
- **Data Fetching:** Tanstack Query (React Query)
- **Deployment:** Vercel (Client), Render (Server) - *or your preferred services*
