# 🚌 Hao Thanh Bus Ticketing & Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.15-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.6-blue.svg?logo=react)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB.svg?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-000020.svg?logo=expo)](https://expo.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache%20%7C%20Lock-DC382D.svg?logo=redis)](https://redis.io/)

## 🌟 Introduction

A comprehensive, high-performance bus ticketing and management system built with a modern microservices-inspired architecture. Designed to handle high concurrent traffic and completely resolve Race Conditions during seat booking. The platform includes a Web Frontend for administrators/users, a Mobile App for customers, and a robust Backend API.

## 📑 Table of Contents

- [Introduction](#-introduction)
- [Screenshots / Demo](#-screenshots--demo)
- [Features & Highlights](#-features--highlights)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Installation & Usage](#-installation--usage-local-development)
- [Container Management](#-container-management)
- [Contributing](#-contributing)
- [License](#-license)

## 📸 Screenshots / Demo

<!-- Please insert your application screenshots, GIFs, or demo video links here -->
- **Web Dashboard:** `![Dashboard Screenshot](link-to-image)`
- **Mobile App Booking Flow:** `![Mobile App Screenshot](link-to-image)`
- **System Architecture Diagram:** `![Architecture Screenshot](link-to-image)`

## ✨ Features & Highlights

- **Real-time Seat Booking:** Prevents race conditions using Redis Distributed Locks (Redisson).
- **Cross-Platform Accessibility:** Native-feeling mobile app alongside a responsive web application.
- **High Availability & Load Balancing:** Nginx routes traffic intelligently to multiple backend replicas.
- **Secure Authentication:** JWT-based stateless authentication integrated with Spring Security.
- **Interactive Maps & Charts:** Real-time data visualization using Recharts and interactive maps via Leaflet.
- **Automated Database Migrations:** Hassle-free database schema updates using Flyway.
- **Cloud Media Storage:** Direct integration with Cloudinary for seamless image uploads.
- **Real-time Chat/Support:** Integrated WebSocket support.

## 🚀 Tech Stack

### Frontend (Web)

- **Core Framework:** React 19.2.6, Vite 8.0.16
- **Routing:** React Router v7
- **Styling:** Tailwind CSS 3.4
- **UI & Visualization:** Lucide React, Recharts, React Leaflet

### Mobile (App)

- **Core Framework:** React Native 0.81.5, Expo 54.0.0
- **Navigation:** React Navigation v7
- **Styling:** NativeWind 2.0 (Tailwind CSS for React Native)

### Backend (API)

- **Language:** Java 21
- **Framework:** Spring Boot 3.5.15
- **ORM & Data Access:** Spring Data JPA / Hibernate
- **Database Migration:** Flyway
- **Caching & Locking:** Spring Data Redis, Redisson 3.30.0
- **Security:** Spring Security, JWT
- **Cloud Storage:** Cloudinary

### DevOps & Infrastructure

- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 15 (Alpine)
- **Cache:** Redis (Alpine)
- **Web Server / Reverse Proxy:** Nginx (Alpine)

## 🏗 Architecture

The project is designed with a distributed mindset, incorporating Load Balancing to ensure High Availability and scalability:

- **Frontend Web:** A Single Page Application (SPA) built with React 19 + Vite, delivering a smooth and highly optimized user experience.
- **Mobile App:** A cross-platform mobile application developed using React Native and Expo, bringing the booking experience directly to users' smartphones.
- **Backend API:** A RESTful API built with Java 21 & Spring Boot 3.5. It runs in multiple replicas behind a load balancer to handle high traffic seamlessly.
- **Database:** PostgreSQL 15 serves as the primary relational database, with schema migrations meticulously managed by Flyway.
- **Cache & Distributed Lock:** Redis is utilized to accelerate data retrieval. Crucially, Redisson is integrated to implement Distributed Locks, completely eliminating Race Conditions during high-concurrency seat bookings.
- **API Gateway / Load Balancer:** Nginx acts as the single entry point (Reverse Proxy), automatically distributing incoming API requests across multiple backend instances.

## 📂 Folder Structure

```text
nha_xe_hao_thanh/
├── Backend_API/          # Spring Boot RESTful API source code
├── Frontend_Web/         # React + Vite Web application source code
├── Mobile_App/           # React Native + Expo Mobile application source code
├── nginx/                # Nginx Load Balancer / Reverse Proxy configuration
├── .env                  # Shared environment variables (Git ignored)
├── docker-compose.yml    # Infrastructure deployment configuration
└── README.md             # Project documentation (You are here)
```

## ⚡ Installation & Usage (Local Development)

The entire infrastructure is containerized using Docker Compose. With just a few commands, you can spin up the full environment.

### 1. Prerequisites

- **Docker Engine** and **Docker Compose** must be installed and running.
- Ensure the following ports are available on your host machine: `3000` (Frontend Web), `8081` (Mobile App Expo), `8080` (Nginx API Gateway), `5432` (PostgreSQL), and `6379` (Redis).
- Node.js (v18+) & npm/yarn (if you plan to run the Mobile App directly without Docker).

### 2. Environment Configuration

Create a `.env` file in the root directory (next to `docker-compose.yml`) and populate it with the required configurations:

```env
### FRONTEND ###
VITE_API_BASE_URL=http://localhost:8080/api/v1

### BACKEND ###
# Database Variables
POSTGRES_DB=haothanh_db
POSTGRES_USER=root
POSTGRES_PASSWORD=rootpassword

# Spring Boot Environment Variables
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/haothanh_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=rootpassword
SPRING_REDIS_HOST=redis
SPRING_REDIS_PORT=6379

# Cloudinary Integration (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mail Config
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@gmail.com

### MOBILE APP ###
# Your machine's local IP address (e.g., 192.168.1.x) for Expo to connect to the backend
LOCAL_IP=your_local_ip_address
```

### 3. Spin Up the System

Open a terminal at the project root and run:

```bash
docker-compose up -d --build
```

This automated process will:

1. Pull necessary base images (PostgreSQL, Redis, Nginx).
2. Build Docker images for the Frontend Web, Mobile App, and Backend API.
3. Establish a private Docker network for secure inter-container communication.
4. Spin up **3 replicas** of the Backend API to demonstrate load balancing.
5. Automatically execute Flyway Migrations to set up the latest database schema.

### 4. Access the Applications

Once the containers are running healthy:

- **Web Application (Frontend):** [http://localhost:3000](http://localhost:3000)
- **API Gateway (Nginx):** [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Mobile App (Expo QR Code):** [http://localhost:8081](http://localhost:8081) (Scan the QR code with the Expo Go app on your physical device)

## 🛠 Container Management

- **View backend logs**:

  ```bash
  docker-compose logs -f backend
  ```

- **Stop the entire system:**

  ```bash
  docker-compose down
  ```

- **Stop the system and wipe all data volumes:**

  ```bash
  docker-compose down -v
  ```

## 🤝 Contributing

1. **Fork** the Project
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
