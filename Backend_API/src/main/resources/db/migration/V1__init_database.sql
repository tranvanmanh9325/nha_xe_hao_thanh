CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Thành viên Mới',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buses (
    id BIGSERIAL PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    bus_type VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    layout_config TEXT,
    image_url VARCHAR(255),
    description TEXT,
    manufacture_year INT,
    color VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Đang hoạt động',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
    id BIGSERIAL PRIMARY KEY,
    route_code VARCHAR(50) UNIQUE NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance DOUBLE PRECISION,
    estimated_duration DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'Đang hoạt động',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    route VARCHAR(255) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    driver VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    ticket_code VARCHAR(100) UNIQUE NOT NULL,
    seat_code VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    pickup_point VARCHAR(255),
    dropoff_point VARCHAR(255),
    note TEXT,
    payment_status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE booking_seats (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    seat_number VARCHAR(50) NOT NULL,
    CONSTRAINT fk_booking_seat_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    hotline VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    notify_new_ticket BOOLEAN DEFAULT TRUE,
    auto_cancel_unpaid BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes for high-traffic query patterns
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route);
CREATE INDEX IF NOT EXISTS idx_trips_departure_time ON trips(departure_time);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON trips(bus_id);

CREATE INDEX IF NOT EXISTS idx_tickets_trip_id ON tickets(trip_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at_date ON tickets (created_at);

CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_booking_id ON booking_seats(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_seat_number ON booking_seats(seat_number);


-- Composite index for the most frequent query: finding booked seats per trip
CREATE INDEX IF NOT EXISTS idx_tickets_trip_status ON tickets(trip_id, payment_status);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_buses_license_plate ON buses(license_plate);
CREATE INDEX IF NOT EXISTS idx_routes_route_code ON routes(route_code);
CREATE INDEX IF NOT EXISTS idx_tickets_trip_seat ON tickets(trip_id, seat_code);

-- UNIQUE partial index to prevent double-booking at DB level (defense-in-depth)
-- Only allow one active ticket per seat per trip
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_seat_per_trip 
    ON tickets(trip_id, seat_code) 
    WHERE payment_status IN ('PAID', 'PENDING');

-- ==========================================
-- MOCK DATA (Dữ liệu mẫu để test hệ thống)
-- ==========================================

-- 1. Insert mock users (Bao gồm Admin và Khách hàng)
-- Password mặc định là "password123" đã được mã hóa bcrypt
INSERT INTO users (full_name, phone, email, password, role) 
VALUES 
-- Admins
('Admin Hào Thành', '0901234567', 'admin@haothanh.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'ADMIN'),
('Admin Quản Lý', '0999999999', 'admin2@haothanh.com', '$2a$10$gAc/WoS5fNzJGJX1wnFDSOfVPWaVyW8C3jW88Sx1kHa.3eTI5x40O', 'ADMIN'),
-- Customers
('Nguyễn Văn Khách', '0911111111', 'khach1@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'CUSTOMER'),
('Trần Thị Diệu', '0922222222', 'khach2@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'CUSTOMER'),
('Lê Hoàng Nam', '0933333333', 'khach3@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'CUSTOMER'),
('Phạm Quang Khải', '0944444444', 'khach4@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'CUSTOMER');

-- 2. Insert mock buses (Các xe của nhà xe)
INSERT INTO buses (bus_number, license_plate, bus_type, total_seats, layout_config, image_url, description, manufacture_year, color) 
VALUES 
('01', '37B-123.45', 'Limousine 34 Phòng VIP', 34, '{"id":"custom_1781092669932","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"},null,{"id":"E-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"},null,{"id":"E-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"},null,{"id":"E-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"},null,{"id":"E-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"},null,{"id":"E-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"},null,{"id":"E-6","type":"wc"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"},null,{"id":"H-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"},null,{"id":"H-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"},null,{"id":"H-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"},null,{"id":"H-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"},null,{"id":"H-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"},null,{"id":"H-6","type":"wc"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099715/ctf4brt66lskbriewuod.jpg', 'Dòng xe Limousine 34 phòng đôi cao cấp. Mỗi phòng được trang bị rèm che riêng tư, màn hình LCD giải trí, cổng sạc USB, đèn đọc sách và wifi tốc độ cao. Thường dùng chạy tuyến cố định đường dài, mang lại cảm giác êm ái như khách sạn di động.', 2023, 'Trắng ngọc trai'),
('02', '37B-678.90', 'Thaco Mobihome 40 Phòng', 40, '{"id":"custom_1781092623308","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"},null,{"id":"E-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"},null,{"id":"E-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"},null,{"id":"E-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"},null,{"id":"E-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"},null,{"id":"E-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"},null,{"id":"E-6","type":"seat","status":"available"}],[{"id":"A-7","type":"seat","status":"available"},null,{"id":"C-7","type":"seat","status":"available"},null,{"id":"E-7","type":"wc"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"},null,{"id":"H-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"},null,{"id":"H-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"},null,{"id":"H-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"},null,{"id":"H-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"},null,{"id":"H-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"},null,{"id":"H-6","type":"seat","status":"available"}],[{"id":"D-7","type":"seat","status":"available"},null,{"id":"F-7","type":"seat","status":"available"},null,{"id":"H-7","type":"wc"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099784/po02o6j4otnlhdnpe7vp.jpg', 'Dòng xe khách giường nằm cao cấp Thaco Mobihome thế hệ mới. Sử dụng khung gầm nguyên khối (Monocoque) và động cơ Weichai vận hành mạnh mẽ, êm ái. Thiết kế nội thất 40 phòng nằm độc lập, bọc da sang trọng, tích hợp đầy đủ tiện nghi: hệ thống điều hòa đa vùng, màn hình giải trí, cổng sạc, rèm che riêng tư. Ngoại thất sơn đen nhám điểm xuyết dải sao vàng cực kỳ nổi bật và nhận diện tốt trên mọi cung đường.', 2023, 'Đen nhám - Họa tiết sao vàng'),
('03', '37B-999.99', 'Thaco Town 24 Ghế', 24, '{"id":"custom_1781092565541","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099897/d4zvceetveoa7ko9r8iw.jpg', 'Dòng xe khách ghế ngồi thế hệ mới nhất. Xe được nhà xe tùy biến hạ tải từ form 28 chỗ tiêu chuẩn xuống chỉ còn 24 chỗ, giúp tăng tối đa không gian để chân (legroom) và độ ngả lưng cho hành khách. Toàn bộ 24 ghế được thiết kế công thái học và bọc da cao cấp. Khung gầm đúc liền khối trang bị hệ thống phuộc hơi giảm xóc cực kỳ êm ái. Sự lựa chọn hoàn hảo và rộng rãi nhất cho các tuyến đường liên tỉnh cự ly trung bình.', 2024, 'Xanh dương đậm - Sọc cam');

-- 3. Insert mock routes (Tuyến đường)
INSERT INTO routes (route_code, origin, destination, distance, estimated_duration) 
VALUES 
('HN-NA', 'Hà Nội', 'Nghệ An', 306.0, 4.3),
('NA-HN', 'Nghệ An', 'Hà Nội', 305.5, 4.2);

-- 4. Insert mock trips (Chuyến xe)
-- Giả sử hôm nay là ngày 16/06/2026. Data sẽ được thiết lập xung quanh ngày này.
INSERT INTO trips (bus_id, route, departure_time, base_price, status, driver) 
VALUES 
-- Chuyến đã hoàn thành hôm qua (15/06)
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Hà Nội - Nghệ An', '2026-06-15 08:00:00+07', 250000.00, 'COMPLETED', 'Lê Hữu Đạt'),
-- Chuyến sắp chạy hôm nay (16/06)
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Nghệ An - Hà Nội', '2026-06-16 14:00:00+07', 250000.00, 'SCHEDULED', 'Trần Văn Mạnh'),
-- Chuyến đang chạy (16/06)
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Hà Nội - Nghệ An', '2026-06-16 10:00:00+07', 250000.00, 'IN_PROGRESS', 'Hoàng Thái Hưng'),
-- Chuyến ngày mai (17/06)
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Nghệ An - Hà Nội', '2026-06-17 19:30:00+07', 250000.00, 'SCHEDULED', 'Phạm Minh Đức'),
-- Chuyến bị hủy (15/06)
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Hà Nội - Nghệ An', '2026-06-15 09:00:00+07', 250000.00, 'CANCELLED', 'Ngô Quốc Bảo'),
-- Chuyến hoàn thành hôm qua (15/06)
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Nghệ An - Hà Nội', '2026-06-15 15:00:00+07', 250000.00, 'COMPLETED', 'Đinh Tiến Vũ');

-- 5. Insert mock tickets (Vé cá nhân lẻ)
-- Lưu ý: Các mã ghế phải map chính xác với layout của xe tương ứng chuyến đi.
INSERT INTO tickets (trip_id, user_id, ticket_code, seat_code, total_price, payment_status, created_at) 
VALUES 
-- Vé cho Trip 1 (Xe 01: Limousine 34 Phòng) - Khách: Nguyễn Văn Khách
((SELECT id FROM trips WHERE driver = 'Lê Hữu Đạt' LIMIT 1), (SELECT id FROM users WHERE phone = '0911111111'), 'T-10024', 'A-1', 250000.00, 'PAID', '2026-06-14 10:00:00+07'),
((SELECT id FROM trips WHERE driver = 'Lê Hữu Đạt' LIMIT 1), (SELECT id FROM users WHERE phone = '0911111111'), 'T-10025', 'C-1', 250000.00, 'PAID', '2026-06-14 10:00:00+07'),

-- Vé cho Trip 2 (Xe 01: Limousine 34 Phòng) - Khách: Trần Thị Diệu
((SELECT id FROM trips WHERE driver = 'Trần Văn Mạnh' LIMIT 1), (SELECT id FROM users WHERE phone = '0922222222'), 'T-10026', 'A-2', 250000.00, 'PENDING', '2026-06-15 15:30:00+07'),
((SELECT id FROM trips WHERE driver = 'Trần Văn Mạnh' LIMIT 1), (SELECT id FROM users WHERE phone = '0922222222'), 'T-10027', 'E-2', 250000.00, 'CANCELLED', '2026-06-15 15:30:00+07'),

-- Vé cho Trip 3 (Xe 02: Mobihome 40 Phòng) - Khách: Lê Hoàng Nam
((SELECT id FROM trips WHERE driver = 'Hoàng Thái Hưng' LIMIT 1), (SELECT id FROM users WHERE phone = '0933333333'), 'T-10028', 'D-4', 250000.00, 'PAID', '2026-06-15 09:00:00+07'),
((SELECT id FROM trips WHERE driver = 'Hoàng Thái Hưng' LIMIT 1), (SELECT id FROM users WHERE phone = '0933333333'), 'T-10029', 'F-4', 250000.00, 'PAID', '2026-06-15 09:00:00+07'),
((SELECT id FROM trips WHERE driver = 'Hoàng Thái Hưng' LIMIT 1), (SELECT id FROM users WHERE phone = '0933333333'), 'T-10030', 'H-4', 250000.00, 'PAID', '2026-06-15 09:00:00+07'),

-- Vé cho Trip 4 (Xe 02: Mobihome 40 Phòng) - Khách: Phạm Quang Khải
((SELECT id FROM trips WHERE driver = 'Phạm Minh Đức' LIMIT 1), (SELECT id FROM users WHERE phone = '0944444444'), 'T-10031', 'C-7', 250000.00, 'PENDING', '2026-06-16 08:00:00+07'),

-- Vé cho Trip 6 (Xe 03: Town 24 Ghế)
((SELECT id FROM trips WHERE driver = 'Đinh Tiến Vũ' LIMIT 1), (SELECT id FROM users WHERE phone = '0911111111'), 'T-10032', 'A-4', 250000.00, 'PAID', '2026-06-14 09:15:00+07'),
((SELECT id FROM trips WHERE driver = 'Đinh Tiến Vũ' LIMIT 1), (SELECT id FROM users WHERE phone = '0922222222'), 'T-10033', 'C-5', 250000.00, 'PAID', '2026-06-14 14:20:00+07');

-- 6. Insert mock bookings (Vé đoàn)
-- Booking cho Trip 2 (Xe 01: Limousine 34 Phòng)
INSERT INTO bookings (trip_id, customer_name, customer_phone, payment_status, total_amount, created_at)
VALUES
((SELECT id FROM trips WHERE driver = 'Trần Văn Mạnh' LIMIT 1), 'Đoàn Khách Du Lịch', '0987654321', 'PAID', 250000.00 * 10, '2026-06-15 10:00:00+07');

INSERT INTO booking_seats (booking_id, seat_number)
VALUES
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'D-1'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'D-2'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'D-3'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'F-1'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'F-2'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'F-3'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'H-1'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'H-2'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'H-3'),
((SELECT id FROM bookings WHERE customer_name = 'Đoàn Khách Du Lịch' LIMIT 1), 'A-3');

-- 7. Insert mock system settings
INSERT INTO system_settings (company_name, hotline, address, email, notify_new_ticket, auto_cancel_unpaid)
VALUES ('Nhà Xe Hào Thanh', '1900 1234', 'Xóm Tân Hưng, Xã Hưng Nguyên, Tỉnh Nghệ An', 'haothanhhungnguyen@gmail.com', true, true);

-- ==========================================
-- BỔ SUNG DỮ LIỆU SEED CHO B2C (Từ ngày 18/06/2026 đến 25/06/2026)
-- ==========================================

-- 8. Insert thêm 15 Chuyến xe (Trips) ở tương lai (18/06/2026 - 25/06/2026)
INSERT INTO trips (bus_id, route, departure_time, base_price, status, driver) 
VALUES 
-- Ngày 18/06/2026
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Hà Nội - Nghệ An', '2026-06-18 08:00:00+07', 250000.00, 'SCHEDULED', 'Lê Hữu Đạt'),
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Nghệ An - Hà Nội', '2026-06-18 14:00:00+07', 250000.00, 'SCHEDULED', 'Trần Văn Mạnh'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Hà Nội - Nghệ An', '2026-06-18 20:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn A'),

-- Ngày 19/06/2026
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Nghệ An - Hà Nội', '2026-06-19 08:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn B'),
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Hà Nội - Nghệ An', '2026-06-19 14:00:00+07', 250000.00, 'SCHEDULED', 'Lê Hữu Đạt'),
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Nghệ An - Hà Nội', '2026-06-19 20:00:00+07', 250000.00, 'SCHEDULED', 'Trần Văn Mạnh'),

-- Ngày 20/06/2026
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Hà Nội - Nghệ An', '2026-06-20 08:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn A'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Nghệ An - Hà Nội', '2026-06-20 14:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn B'),
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Hà Nội - Nghệ An', '2026-06-20 20:00:00+07', 250000.00, 'SCHEDULED', 'Lê Hữu Đạt'),

-- Ngày 21/06/2026
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Nghệ An - Hà Nội', '2026-06-21 08:00:00+07', 250000.00, 'SCHEDULED', 'Trần Văn Mạnh'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Hà Nội - Nghệ An', '2026-06-21 14:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn A'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Nghệ An - Hà Nội', '2026-06-21 20:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn B'),

-- Ngày 22/06/2026
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Hà Nội - Nghệ An', '2026-06-22 08:00:00+07', 250000.00, 'SCHEDULED', 'Lê Hữu Đạt'),
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Nghệ An - Hà Nội', '2026-06-22 14:00:00+07', 250000.00, 'SCHEDULED', 'Trần Văn Mạnh'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Hà Nội - Nghệ An', '2026-06-22 20:00:00+07', 250000.00, 'SCHEDULED', 'Nguyễn Văn A');

-- 9. Insert thêm 4 tài khoản khách hàng (CUSTOMER) để test Mobile App
-- Password: 1234567890@123 (BCrypt hash)
INSERT INTO users (full_name, phone, email, password, role)
VALUES
('Võ Minh Tuấn',   '0355001001', 'tuan.vo@gmail.com',    '$2a$10$2i0i.CnTdqIYw4./vVSkf.qsg5wW8/25dTUN19ymDlJXQ89QBXgOK', 'CUSTOMER'),
('Đặng Thị Hồng',  '0355002002', 'hong.dang@gmail.com',  '$2a$10$2i0i.CnTdqIYw4./vVSkf.qsg5wW8/25dTUN19ymDlJXQ89QBXgOK', 'CUSTOMER'),
('Bùi Quốc Anh',   '0355003003', 'anh.bui@gmail.com',    '$2a$10$2i0i.CnTdqIYw4./vVSkf.qsg5wW8/25dTUN19ymDlJXQ89QBXgOK', 'CUSTOMER'),
('Hoàng Thị Mai',   '0355004004', 'mai.hoang@gmail.com',  '$2a$10$2i0i.CnTdqIYw4./vVSkf.qsg5wW8/25dTUN19ymDlJXQ89QBXgOK', 'CUSTOMER');

-- ==========================================
-- BỔ SUNG BẢNG CHAT (Từ V2)
-- ==========================================

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_unique_active_session ON chat_sessions (user_id) WHERE status = 'ACTIVE';

-- Create chat_messages table
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    sender_id BIGINT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_messages_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- BỔ SUNG BẢNG SUPPORT & FAQ (Từ V3)
-- ==========================================

-- Create support_requests table
CREATE TABLE IF NOT EXISTS support_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_support_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON support_requests(user_id);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
    id BIGSERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock FAQs (Câu hỏi thường gặp)
INSERT INTO faqs (question, answer, order_index) VALUES
('Làm thế nào để đặt vé xe?', 'Bạn có thể đặt vé dễ dàng thông qua ứng dụng bằng cách chọn điểm đi, điểm đến, ngày đi và chọn chuyến xe phù hợp. Sau đó tiến hành thanh toán để hoàn tất.', 1),
('Chính sách hoàn/hủy vé như thế nào?', 'Bạn có thể hủy vé miễn phí trước 24 giờ so với giờ khởi hành. Hủy trước 12-24 giờ sẽ chịu phí 20%. Không hỗ trợ hủy vé trong vòng 12 giờ trước khi xe chạy.', 2),
('Tôi có thể thanh toán qua các hình thức nào?', 'Hệ thống hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (MoMo, ZaloPay, VNPay) và chuyển khoản ngân hàng trực tiếp.', 3),
('Tôi có được mang theo thú cưng không?', 'Để đảm bảo vệ sinh và không gian chung, nhà xe quy định hành khách không được mang theo vật nuôi, thú cưng lên khoang hành khách. Bạn có thể gửi thú cưng dưới dạng hành lý ký gửi nếu đáp ứng đủ điều kiện về lồng vận chuyển.', 4),
('Làm sao để lấy hóa đơn điện tử?', 'Bạn có thể yêu cầu xuất hóa đơn điện tử trong quá trình đặt vé hoặc liên hệ với bộ phận CSKH trong vòng 7 ngày sau khi chuyến đi kết thúc.', 5),
('Tôi có thể thay đổi thông tin chuyến đi không?', 'Bạn có thể thay đổi thông tin chuyến đi (giờ đi, chỗ ngồi) trước 24 giờ khởi hành bằng cách liên hệ tổng đài hoặc thao tác trực tiếp trên ứng dụng.', 6),
('Quy định về hành lý xách tay và ký gửi?', 'Mỗi hành khách được mang theo 1 kiện hành lý xách tay (không quá 5kg) và 1 kiện hành lý ký gửi (không quá 20kg). Hành lý quá cước sẽ bị tính thêm phí.', 7),
('Trẻ em có được miễn phí vé không?', 'Trẻ em dưới 3 tuổi hoặc cao dưới 100cm được miễn phí vé nếu ngồi chung ghế với người lớn. Trẻ từ 3 tuổi trở lên tính giá vé như người lớn.', 8);

-- ==========================================
-- BỔ SUNG BẢNG PRIVACY_POLICIES
-- ==========================================

-- Create privacy_policies table
CREATE TABLE IF NOT EXISTS privacy_policies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS privacy_policy_translations (
    id BIGSERIAL PRIMARY KEY,
    policy_id BIGINT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT fk_privacy_policy_translation FOREIGN KEY (policy_id) REFERENCES privacy_policies(id) ON DELETE CASCADE,
    UNIQUE (policy_id, language_code)
);

-- Insert mock Privacy Policies (Chính sách bảo mật)
INSERT INTO privacy_policies (id, title, content, order_index) VALUES
(1, '1. Mục đích và phạm vi thu thập', 'Hào Thành Bus thu thập thông tin cá nhân (Họ tên, Số điện thoại, Email) nhằm mục đích xử lý đặt vé, cung cấp dịch vụ vận tải, thông báo lịch trình, và hỗ trợ khách hàng. Dữ liệu này giúp chúng tôi nâng cao chất lượng dịch vụ và cá nhân hóa trải nghiệm cho từng hành khách.', 1),
(2, '2. Bảo mật thông tin thanh toán', 'Chúng tôi tuân thủ các tiêu chuẩn bảo mật dữ liệu an toàn trên internet (SSL) và tiêu chuẩn bảo mật dữ liệu thẻ thanh toán (PCI DSS). Các thông tin thanh toán và thẻ tín dụng/ghi nợ được xử lý qua các cổng thanh toán uy tín và hoàn toàn không được lưu trữ trực tiếp trên hệ thống của Hào Thành Bus.', 2),
(3, '3. Cam kết chia sẻ thông tin', 'Chúng tôi cam kết tuyệt đối không bán, trao đổi hay chia sẻ thông tin cá nhân của hành khách cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được cung cấp cho cơ quan chức năng khi có yêu cầu hợp pháp theo quy định của pháp luật Việt Nam.', 3),
(4, '4. Quản lý vé điện tử', 'Dữ liệu vé điện tử bao gồm mã QR code được bảo mật nghiêm ngặt. Khách hàng vui lòng không chia sẻ mã QR vé của mình cho người lạ để tránh rủi ro về quyền lợi lên xe. Việc để lộ thông tin mã vé có thể dẫn đến việc mất quyền lợi chuyến đi.', 4),
(5, '5. Quyền lợi của khách hàng', 'Khách hàng có quyền yêu cầu truy cập, chỉnh sửa hoặc vô hiệu hóa thông tin tài khoản cá nhân của mình trên hệ thống. Khách hàng cũng có thể từ chối nhận các email/tin nhắn khuyến mãi bất kỳ lúc nào bằng cách sử dụng tính năng hỗ trợ trong ứng dụng.', 5),
(6, '6. Thay đổi chính sách', 'Hào Thành Bus có quyền cập nhật, sửa đổi chính sách bảo mật này để phù hợp với quy định pháp luật và hoạt động dịch vụ. Mọi thay đổi lớn sẽ được thông báo trực tiếp qua thông báo ứng dụng (Push Notifications) và cập nhật công khai tại đây.', 6);

-- Update auto increment sequence
SELECT setval('privacy_policies_id_seq', (SELECT MAX(id) FROM privacy_policies));

INSERT INTO privacy_policy_translations (policy_id, language_code, title, content) VALUES
(1, 'en', '1. Purpose and Scope of Collection', 'We collect personal information (Name, Phone, Email) to process bookings, provide transport services, notify schedules, and support customers. This helps us improve service quality.'),
(1, 'ja', '1. 収集の目的と範囲', '当社は、予約の処理、輸送サービスの提供、スケジュールの通知、顧客サポートのために個人情報（氏名、電話番号、メールアドレス）を収集します。これによりサービス品質が向上します。'),
(1, 'ko', '1. 수집 목적 및 범위', '당사는 예약 처리, 운송 서비스 제공, 일정 알림, 고객 지원을 위해 개인 정보(이름, 전화번호, 이메일)를 수집합니다. 이는 서비스 품질 향상에 도움이 됩니다.'),
(1, 'zh', '1. 收集的目的和范围', '我们收集个人信息（姓名、电话、电子邮件）以处理预订、提供运输服务、通知时间表并支持客户。这有助于我们提高服务质量。'),
(2, 'en', '2. Payment Security', 'We comply with internet security standards (SSL) and payment card data security standards (PCI DSS). Payment info is processed via reputable gateways and not stored on our systems.'),
(2, 'ja', '2. 支払いのセキュリティ', 'インターネットセキュリティ基準（SSL）およびペイメントカードデータセキュリティ基準（PCI DSS）に準拠しています。支払い情報は信頼できるゲートウェイを通じて処理され、当社のシステムには保存されません。'),
(2, 'ko', '2. 결제 보안', '인터넷 보안 표준(SSL) 및 결제 카드 데이터 보안 표준(PCI DSS)을 준수합니다. 결제 정보는 신뢰할 수 있는 게이트웨이를 통해 처리되며 당사 시스템에 저장되지 않습니다.'),
(2, 'zh', '2. 支付安全', '我们遵守互联网安全标准（SSL）和支付卡数据安全标准（PCI DSS）。付款信息通过信誉良好的网关处理，不存储在我们的系统中。'),
(3, 'en', '3. Commitment to Not Share Info', 'We absolutely do not sell or share passenger info with any third party for commercial purposes. Info is only provided to authorities upon legal request.'),
(3, 'ja', '3. 情報共有の禁止へのコミットメント', '商業目的で乗客情報を第三者に販売または共有することは絶対にありません。情報は、法的な要求がある場合にのみ当局に提供されます。'),
(3, 'ko', '3. 정보 공유 금지 약속', '상업적 목적으로 승객 정보를 제3자에게 판매하거나 공유하지 않습니다. 정보는 법적 요구가 있는 경우에만 당국에 제공됩니다.'),
(3, 'zh', '3. 不共享信息的承诺', '我们绝不为商业目的将乘客信息出售或共享给任何第三方。仅在合法要求下向当局提供信息。'),
(4, 'en', '4. E-Ticket Management', 'E-ticket data including QR codes is strictly confidential. Please do not share your ticket QR code with strangers to avoid losing boarding rights.'),
(4, 'ja', '4. 電子チケットの管理', 'QRコードを含む電子チケットのデータは厳重に機密保持されます。乗車権を失うことを防ぐため、チケットのQRコードを見知らぬ人と共有しないでください。'),
(4, 'ko', '4. 전자 티켓 관리', 'QR 코드를 포함한 전자 티켓 데이터는 엄격하게 기밀로 유지됩니다. 탑승 권리를 잃지 않도록 티켓 QR 코드를 낯선 사람과 공유하지 마십시오.'),
(4, 'zh', '4. 电子客票管理', '包括二维码在内的电子客票数据严格保密。请勿与陌生人分享您的客票二维码，以免失去乘车权。'),
(5, 'en', '5. Customer Rights', 'Customers have the right to request access to, correction, or deactivation of their personal account info. Customers can opt out of promotional messages anytime.'),
(5, 'ja', '5. お客様の権利', 'お客様は、個人のアカウント情報へのアクセス、修正、または無効化を要求する権利があります。いつでもプロモーションメッセージの受信を拒否できます。'),
(5, 'ko', '5. 고객의 권리', '고객은 개인 계정 정보에 대한 접근, 수정 또는 비활성화를 요청할 권리가 있습니다. 언제든지 프로모션 메시지 수신을 거부할 수 있습니다.'),
(5, 'zh', '5. 客户权利', '客户有权要求访问、更正或停用其个人帐户信息。客户可以随时选择拒收促销信息。'),
(6, 'en', '6. Policy Changes', 'We reserve the right to update this privacy policy. Major changes will be notified directly via Push Notifications and updated publicly here.'),
(6, 'ja', '6. ポリシーの変更', '当社は、このプライバシーポリシーを更新する権利を留保します。大きな変更がある場合は、プッシュ通知で直接お知らせし、ここで公開します。'),
(6, 'ko', '6. 정책 변경', '당사는 이 개인 정보 보호 정책을 업데이트할 권리가 있습니다. 중요한 변경 사항은 푸시 알림을 통해 직접 알려드리고 여기에 공개적으로 업데이트합니다.'),
(6, 'zh', '6. 政策变更', '我们保留更新此隐私政策的权利。重大更改将通过推送通知直接通知并在此处公开发布。');

-- ==========================================
-- BỔ SUNG BẢNG TERMS_OF_SERVICE
-- ==========================================

-- Create terms_of_service table
CREATE TABLE IF NOT EXISTS terms_of_service (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS terms_of_service_translations (
    id BIGSERIAL PRIMARY KEY,
    terms_id BIGINT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT fk_terms_of_service_translation FOREIGN KEY (terms_id) REFERENCES terms_of_service(id) ON DELETE CASCADE,
    UNIQUE (terms_id, language_code)
);

-- Insert mock Terms of Service (Điều khoản dịch vụ)
INSERT INTO terms_of_service (id, title, content, order_index) VALUES
(1, '1. Trách nhiệm của hành khách', 'Hành khách có trách nhiệm cung cấp thông tin cá nhân (họ tên, số điện thoại) chính xác khi đặt vé để đảm bảo quyền lợi khởi hành. Hành khách phải tự bảo mật thông tin tài khoản và mã vé điện tử của mình.', 1),
(2, '2. Quy định khởi hành và lên xe', 'Hành khách cần có mặt tại điểm đón trước giờ khởi hành ít nhất 30 phút đối với ngày thường và 60 phút đối với dịp Lễ/Tết. Xuất trình mã vé điện tử hoặc vé giấy hợp lệ cho nhân viên nhà xe trước khi lên xe.', 2),
(3, '3. Hành lý và tư trang', 'Mỗi hành khách được mang tối đa 1 kiện hành lý xách tay (dưới 5kg) và 1 kiện hành lý ký gửi (không quá 20kg). Không mang theo hàng quốc cấm, vũ khí, chất cháy nổ, chất có mùi hôi tanh hoặc động vật/thú cưng lên khoang hành khách. Hành khách tự bảo quản tư trang có giá trị cao.', 3),
(4, '4. Chính sách Đổi / Hủy vé', 'Khách hàng được miễn phí hủy vé trước 24 giờ so với giờ khởi hành. Hủy vé từ 12 - 24 giờ trước khởi hành chịu phí 20%. Không hỗ trợ hoàn/hủy vé nếu yêu cầu trong vòng 12 giờ trước giờ xe chạy hoặc sau khi xe đã xuất bến.', 4),
(5, '5. Thay đổi lịch trình từ nhà xe', 'Trong các trường hợp bất khả kháng (thiên tai, dịch bệnh, kẹt xe, sự cố kỹ thuật đột xuất), Hào Thành Bus có quyền thay đổi giờ chạy hoặc loại xe. Chúng tôi sẽ thông báo trước cho hành khách và hỗ trợ đổi vé hoặc hoàn tiền 100% nếu lịch trình mới không phù hợp.', 5),
(6, '6. Xuất hóa đơn (VAT)', 'Hành khách có nhu cầu xuất hóa đơn giá trị gia tăng (VAT) vui lòng cung cấp thông tin xuất hóa đơn trong quá trình đặt vé hoặc liên hệ với bộ phận CSKH chậm nhất 7 ngày sau khi chuyến đi kết thúc.', 6);

-- Update auto increment sequence
SELECT setval('terms_of_service_id_seq', (SELECT MAX(id) FROM terms_of_service));

INSERT INTO terms_of_service_translations (terms_id, language_code, title, content) VALUES
(1, 'en', '1. Passenger Responsibilities', 'Passengers are responsible for providing accurate personal information (full name, phone number) when booking tickets. Passengers must secure their account information and e-tickets.'),
(1, 'ja', '1. 乗客の責任', '乗客はチケット予約時に正確な個人情報（氏名、電話番号）を提供する責任があります。乗客はアカウント情報と電子チケットを安全に保管する必要があります。'),
(1, 'ko', '1. 승객의 책임', '승객은 티켓 예약 시 정확한 개인 정보(이름, 전화번호)를 제공할 책임이 있습니다. 승객은 계정 정보와 전자 티켓을 안전하게 보관해야 합니다.'),
(1, 'zh', '1. 乘客责任', '乘客在订票时有责任提供准确的个人信息（姓名、电话号码）。乘客必须妥善保管其帐户信息和电子客票。'),
(2, 'en', '2. Departure and Boarding', 'Passengers must be at the pickup point at least 30 minutes before departure on normal days and 60 minutes on holidays. Present valid e-ticket or paper ticket before boarding.'),
(2, 'ja', '2. 出発と乗車', '乗客は通常日であれば出発の30分前、祝日であれば60分前に乗車場所に到着している必要があります。乗車前に有効な電子チケットまたは紙のチケットを提示してください。'),
(2, 'ko', '2. 출발 및 탑승', '승객은 평일에는 출발 30분 전, 휴일에는 60분 전까지 탑승 장소에 도착해야 합니다. 탑승 전 유효한 전자 티켓 또는 종이 티켓을 제시해 주십시오.'),
(2, 'zh', '2. 出发和登车', '乘客必须在平时出发前至少30分钟、节假日出发前60分钟到达乘车点。登车前请出示有效的电子客票或纸质客票。'),
(3, 'en', '3. Luggage and Belongings', 'Each passenger is allowed 1 carry-on (under 5kg) and 1 checked luggage (under 20kg). No prohibited goods, weapons, explosives, foul-smelling items, or pets. Passengers are responsible for high-value items.'),
(3, 'ja', '3. 手荷物と所持品', '乗客1人につき機内持ち込み1個（5kg未満）および預け荷物1個（20kg未満）が許可されます。禁制品、武器、爆発物、悪臭のする物、ペットの持ち込みは禁止です。高価な品物はご自身で管理してください。'),
(3, 'ko', '3. 수하물 및 소지품', '승객 1인당 기내 수하물 1개(5kg 미만) 및 위탁 수하물 1개(20kg 미만)가 허용됩니다. 금지품, 무기, 폭발물, 악취가 나는 물건, 반려동물은 반입할 수 없습니다. 고가의 물품은 직접 관리해야 합니다.'),
(3, 'zh', '3. 行李和物品', '每位乘客允许携带1件手提行李（5公斤以下）和1件托运行李（20公斤以下）。严禁携带违禁品、武器、爆炸物、有恶臭的物品或宠物。贵重物品请自行保管。'),
(4, 'en', '4. Cancellation/Change Policy', 'Free cancellation 24 hours before departure. 20% fee for 12-24 hours before. No refund/cancellation within 12 hours of departure or after the bus has departed.'),
(4, 'ja', '4. キャンセル・変更ポリシー', '出発の24時間前まではキャンセル無料。12〜24時間前の場合は20%の違約金がかかります。出発前12時間以内または出発後のキャンセル・返金はできません。'),
(4, 'ko', '4. 취소/변경 정책', '출발 24시간 전까지는 무료 취소가 가능합니다. 12~24시간 전에는 20%의 수수료가 부과됩니다. 출발 12시간 이내 또는 버스 출발 후에는 환불/취소가 부과됩니다.'),
(4, 'zh', '4. 取消/更改政策', '出发前24小时免费取消。出发前12-24小时收取20%的手续费。出发前12小时内或发车后不支持退票/取消。'),
(5, 'en', '5. Schedule Changes by Us', 'In case of force majeure (natural disasters, pandemics, traffic jams, sudden technical incidents), we reserve the right to change departure times or bus types. We will notify passengers and offer 100% refund if the new schedule is unsuitable.'),
(5, 'ja', '5. 弊社によるスケジュール変更', '不可抗力（自然災害、パンデミック、交通渋滞、突然の技術的事故など）の場合、弊社は出発時間やバスの種類を変更する権利を留保します。乗客に通知し、新しいスケジュールが合わない場合は全額返金します。'),
(5, 'ko', '5. 당사에 의한 일정 변경', '불가항력(자연재해, 전염병, 교통체증, 돌발적인 기술적 사고 등)의 경우 당사는 출발 시간이나 버스 종류를 변경할 권리가 있습니다. 승객에게 통지하며 새로운 일정이 맞지 않을 경우 100% 환불해 드립니다.'),
(5, 'zh', '5. 我们的日程更改', '如遇不可抗力（自然灾害、流行病、交通拥堵、突发技术事故等），我们保留更改出发时间或巴士类型的权利。我们将通知乘客，如果新的时间表不合适，我们将提供100%全额退款。'),
(6, 'en', '6. VAT Invoicing', 'Passengers requiring VAT invoices must provide invoice information during booking or contact customer service within 7 days after the trip ends.'),
(6, 'ja', '6. VAT請求書', 'VAT請求書が必要な乗客は、予約時に請求書情報を提供するか、旅行終了後7日以内にカスタマーサービスにご連絡ください。'),
(6, 'ko', '6. VAT 세금 계산서', 'VAT 세금 계산서가 필요한 승객은 예약 시 청구서 정보를 제공하거나 여행 종료 후 7일 이내에 고객 서비스 센터에 연락해야 합니다.'),
(6, 'zh', '6. 增值税发票', '需要增值税发票的乘客必须在预订期间提供发票信息或在行程结束后7天内联系客户服务。');