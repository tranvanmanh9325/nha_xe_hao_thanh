# 🚌 Hệ Thống Quản Lý Đặt Vé - Nhà Xe Hào Thanh

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache%20%7C%20Lock-DC382D.svg?logo=redis)](https://redis.io/)

Hệ thống quản lý đặt vé xe khách toàn diện được xây dựng với kiến trúc hiện đại, đảm bảo tính mở rộng, hiệu năng cao và xử lý đồng thời tốt (giải quyết triệt để bài toán Race Condition trong đặt vé).

---

## 🏗 Kiến Trúc Hệ Thống

Dự án được thiết kế theo mô hình phân tán, kết hợp Load Balancing để đảm bảo High Availability (HA) và khả năng chịu tải tốt:

- **Frontend:** Single Page Application (SPA) phát triển bằng React 19 + Vite, mang lại trải nghiệm mượt mà và tối ưu hiệu suất.
- **Backend:** Ứng dụng RESTful API viết bằng Java 21 & Spring Boot 3.5. Chạy đa bản sao (3 replicas) để phân tải qua Docker Compose.
- **Database:** PostgreSQL 15 làm cơ sở dữ liệu chính, quản lý cấu trúc schema chuẩn xác qua Flyway.
- **Cache & Distributed Lock:** Redis được sử dụng để tăng tốc truy xuất dữ liệu. Đặc biệt kết hợp Redisson để thiết lập khóa phân tán (Distributed Lock), ngăn chặn hoàn toàn lỗi trùng lặp/conflict khi nhiều người cùng đặt chung một ghế (Race Conditions).
- **API Gateway / Load Balancer:** Nginx đóng vai trò là cửa ngõ duy nhất, tự động phân phối các request API từ client chia đều cho các instance của backend.

## 🚀 Công Nghệ Sử Dụng

### Frontend

- **Core Framework:** React 19, Vite
- **Routing:** React Router v7
- **UI Components & Charts:** Lucide React, Recharts, React Smooth
- **Date Handling:** date-fns

### Backend

- **Ngôn ngữ:** Java 21
- **Framework Chính:** Spring Boot 3.5.14
- **ORM & Data Access:** Spring Data JPA / Hibernate
- **Database Migration:** Flyway
- **Caching & Locking:** Spring Data Redis, Redisson
- **Công cụ hỗ trợ:** Lombok, Spring Boot Actuator

### DevOps & Infrastructure

- **Containerization:** Docker & Docker Compose
- **Database Container:** PostgreSQL 15 (Alpine)
- **Cache Container:** Redis (Alpine)
- **Web Server / Reverse Proxy:** Nginx (Alpine)

---

## 📂 Cấu Trúc Thư Mục

```text
nha_xe_hao_thanh/
├── Backend_API/          # Source code Spring Boot RESTful API
├── Frontend_Web/         # Source code React + Vite Frontend
├── nginx/                # Cấu hình Nginx Load Balancer (Proxy to Backend)
├── .env                  # Cấu hình biến môi trường dùng chung (Git ignored)
├── docker-compose.yml    # Cấu hình triển khai hệ thống (Infrastructure)
└── README.md             # Tài liệu dự án
```

---

## ⚡ Hướng Dẫn Cài Đặt Và Vận Hành (Local Development)

Dự án được đóng gói hoàn toàn bằng Docker Compose. Chỉ với một vài lệnh đơn giản, bạn có thể triển khai hệ thống hoàn chỉnh ở bất kỳ đâu.

### 1. Yêu cầu hệ thống

- **Docker Engine** và **Docker Compose** đã được cài đặt và đang chạy.
- Cổng (Port) `3000` (Frontend), `8080` (Nginx), `5432` (PostgreSQL), `6379` (Redis) trên máy của bạn phải đang trống (không bị chiếm dụng bởi ứng dụng khác).

### 2. Thiết lập môi trường

Nếu bạn vừa pull code về, hãy tạo một file tên `.env` tại thư mục gốc của dự án (ngang hàng với `docker-compose.yml`) và nhập các cấu hình sau:

```env
### FRONTEND ###
VITE_API_BASE_URL=http://localhost:8080/api

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
```

### 3. Khởi động toàn bộ hệ thống

Mở terminal/command prompt tại thư mục gốc của dự án, thực thi lệnh:

```bash
docker-compose up -d --build
```

Quá trình này sẽ diễn ra tự động bao gồm:

1. Kéo các base image cần thiết (Postgres, Redis, Nginx).
2. Tự động build Docker image cho Frontend Web và Backend API.
3. Tạo ra các container và kết nối chúng bằng Docker Network nội bộ.
4. Spin up 3 instances (replicas) của ứng dụng Backend để test Load Balancing.
5. Thực thi tự động Flyway Migration để khởi tạo cấu trúc Database mới nhất.

### 4. Truy cập ứng dụng

Sau khi terminal báo quá trình chạy thành công, mở trình duyệt và truy cập:

- **Ứng dụng Web (Frontend):** [http://localhost:3000](http://localhost:3000)
- **API Server (Truy cập gián tiếp qua Nginx Load Balancer):** [http://localhost:8080/api](http://localhost:8080/api)

---

## 🛠 Cách Quản Lý Các Container

- Xem log hoạt động của backend (để kiểm tra quá trình query DB hoặc Redis, load balancing):

  ```bash
  docker-compose logs -f backend
  ```

- Dừng toàn bộ hệ thống:

  ```bash
  docker-compose down
  ```

- Dừng hệ thống và xóa sạch toàn bộ dữ liệu hiện tại (bao gồm database postgres_data):

  ```bash
  docker-compose down -v
  ```
