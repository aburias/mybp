# Blood Pressure Tracker

A premium, mobile-first web application designed to help you securely track and visualize your blood pressure and cardiovascular health over time. 

Built with modern web technologies and designed for immediate containerized deployment, this application categorizes your readings strictly based on the American Heart Association (AHA) guidelines.

## Features

- **Intuitive Logging:** Quickly log your Systolic and Diastolic pressure.
- **AHA Categorization:** Automatically categorizes both your Systolic and Diastolic numbers independently into AHA stages (Normal, Elevated, Stage 1, Stage 2, Crisis) with intuitive color-coding.
- **Interactive Trends:** Visualize your health with dynamic line charts.
- **Advanced Filtering:** Filter your data by 'This Week', 'This Month', 'All Time', or use a Custom Date Range.
- **Premium Aesthetics:** Features a modern dark-mode, glassmorphism UI with subtle gradients.
- **Fully Dockerized:** Both the Next.js application and the PostgreSQL database are bundled in Docker for instant, painless local setup.

## Tech Stack

- **Frontend / Backend:** Next.js 15 (App Router), React
- **Styling:** CSS Modules, Modern CSS (Flexbox, CSS Variables, Glassmorphism)
- **Charts:** Chart.js, `react-chartjs-2`
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Deployment:** Docker & Docker Compose

## Getting Started (Local Setup)

The application is fully containerized. You only need Docker installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/blood-pressure-tracker.git
cd blood-pressure-tracker
```

### 2. Set up Environment Variables
Create a `.env` file in the root of your project:
```env
# This URL is used for your local Prisma setup to reach the dockerized database
DATABASE_URL="postgresql://postgres:password@127.0.0.1:5440/mybp?schema=public"
```

### 3. Spin up the Database
First, start only the PostgreSQL database container so that we can apply our database schema:
```bash
docker-compose up -d db
```

### 4. Apply the Database Schema
Ensure you have Node.js installed locally to run Prisma commands. Install the dependencies and push the schema to your fresh database:
```bash
npm install
npx prisma db push
```

### 5. Build and Start the Application
Now, build the Next.js app image and spin everything up together!
```bash
docker-compose up -d --build
```

### 6. View the App
Open your browser and navigate to:
[http://localhost:4000](http://localhost:4000)

---

## Security Warning for Production Deployment

The `docker-compose.yml` included in this repository contains default credentials (`POSTGRES_PASSWORD: password`) intended **only** for quick local development and testing. 

If you plan to deploy this application to a public server or production environment:
1. Change the database password in both your `docker-compose.yml` and `.env` files.
2. Consider removing the hardcoded environment variables from `docker-compose.yml` entirely and referencing them securely from your server environment.
