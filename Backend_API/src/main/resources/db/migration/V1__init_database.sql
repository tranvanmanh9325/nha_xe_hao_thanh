CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
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


-- Performance indexes for high-traffic query patterns
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route);
CREATE INDEX IF NOT EXISTS idx_trips_departure_time ON trips(departure_time);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON trips(bus_id);

CREATE INDEX IF NOT EXISTS idx_tickets_trip_id ON tickets(trip_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);

CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_booking_id ON booking_seats(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_seat_number ON booking_seats(seat_number);


-- Composite index for the most frequent query: finding booked seats per trip
CREATE INDEX IF NOT EXISTS idx_tickets_trip_status ON tickets(trip_id, payment_status);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_buses_license_plate ON buses(license_plate);
CREATE INDEX IF NOT EXISTS idx_routes_route_code ON routes(route_code);

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
('Nguyễn Văn Khách', '0911111111', 'khach1@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'USER'),
('Trần Thị Diệu', '0922222222', 'khach2@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'USER'),
('Lê Hoàng Nam', '0933333333', 'khach3@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'USER'),
('Phạm Quang Khải', '0944444444', 'khach4@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'USER');

-- 2. Insert mock buses (Các xe của nhà xe)
INSERT INTO buses (bus_number, license_plate, bus_type, total_seats, layout_config, image_url, description, manufacture_year, color) 
VALUES 
('01', '37B-123.45', 'Limousine 34 Phòng VIP', 34, '{"id":"custom_1781092669932","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"},null,{"id":"E-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"},null,{"id":"E-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"},null,{"id":"E-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"},null,{"id":"E-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"},null,{"id":"E-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"},null,{"id":"E-6","type":"wc"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"},null,{"id":"H-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"},null,{"id":"H-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"},null,{"id":"H-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"},null,{"id":"H-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"},null,{"id":"H-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"},null,{"id":"H-6","type":"wc"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099715/ctf4brt66lskbriewuod.jpg', 'Dòng xe Limousine 34 phòng đôi cao cấp. Mỗi phòng được trang bị rèm che riêng tư, màn hình LCD giải trí, cổng sạc USB, đèn đọc sách và wifi tốc độ cao. Thường dùng chạy tuyến cố định đường dài, mang lại cảm giác êm ái như khách sạn di động.', 2023, 'Trắng ngọc trai'),
('02', '37B-678.90', 'Thaco Mobihome 40 Phòng', 40, '{"id":"custom_1781092623308","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"},null,{"id":"E-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"},null,{"id":"E-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"},null,{"id":"E-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"},null,{"id":"E-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"},null,{"id":"E-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"},null,{"id":"E-6","type":"seat","status":"available"}],[{"id":"A-7","type":"seat","status":"available"},null,{"id":"C-7","type":"seat","status":"available"},null,{"id":"E-7","type":"wc"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"},null,{"id":"H-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"},null,{"id":"H-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"},null,{"id":"H-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"},null,{"id":"H-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"},null,{"id":"H-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"},null,{"id":"H-6","type":"seat","status":"available"}],[{"id":"D-7","type":"seat","status":"available"},null,{"id":"F-7","type":"seat","status":"available"},null,{"id":"H-7","type":"wc"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099784/po02o6j4otnlhdnpe7vp.jpg', 'Dòng xe khách giường nằm cao cấp Thaco Mobihome thế hệ mới. Sử dụng khung gầm nguyên khối (Monocoque) và động cơ Weichai vận hành mạnh mẽ, êm ái. Thiết kế nội thất 40 phòng nằm độc lập, bọc da sang trọng, tích hợp đầy đủ tiện nghi: hệ thống điều hòa đa vùng, màn hình giải trí, cổng sạc, rèm che riêng tư. Ngoại thất sơn đen nhám điểm xuyết dải sao vàng cực kỳ nổi bật và nhận diện tốt trên mọi cung đường.', 2023, 'Đen nhám - Họa tiết sao vàng'),
('03', '37B-999.99', 'Thaco Town 24 Ghế', 24, '{"id":"custom_1781092565541","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099897/d4zvceetveoa7ko9r8iw.jpg', 'Dòng xe khách ghế ngồi thế hệ mới nhất. Xe được nhà xe tùy biến hạ tải từ form 28 chỗ tiêu chuẩn xuống chỉ còn 24 chỗ, giúp tăng tối đa không gian để chân (legroom) và độ ngả lưng cho hành khách. Toàn bộ 24 ghế được thiết kế công thái học và bọc da cao cấp. Khung gầm đúc liền khối trang bị hệ thống phuộc hơi giảm xóc cực kỳ êm ái. Sự lựa chọn hoàn hảo và rộng rãi nhất cho các tuyến đường liên tỉnh cự ly trung bình.', 2024, 'Xanh dương đậm - Sọc cam');

-- 3. Insert mock routes (Tuyến đường)
INSERT INTO routes (route_code, origin, destination, distance, estimated_duration) 
VALUES 
('HN-NA', 'Hà Nội', 'Nghệ An', 300.0, 6.0),
('NA-HN', 'Nghệ An', 'Hà Nội', 300.0, 6.0);

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
INSERT INTO tickets (trip_id, user_id, ticket_code, seat_code, total_price, payment_status) 
VALUES 
-- Vé cho Trip 1 (Xe 01: Limousine 34 Phòng) - Khách: Nguyễn Văn Khách
((SELECT id FROM trips WHERE driver = 'Lê Hữu Đạt' LIMIT 1), (SELECT id FROM users WHERE phone = '0911111111'), 'T-10024', 'A-1', 250000.00, 'PAID'),
((SELECT id FROM trips WHERE driver = 'Lê Hữu Đạt' LIMIT 1), (SELECT id FROM users WHERE phone = '0911111111'), 'T-10025', 'C-1', 250000.00, 'PAID'),

-- Vé cho Trip 2 (Xe 01: Limousine 34 Phòng) - Khách: Trần Thị Diệu
((SELECT id FROM trips WHERE driver = 'Trần Văn Mạnh' LIMIT 1), (SELECT id FROM users WHERE phone = '0922222222'), 'T-10026', 'A-2', 250000.00, 'PENDING'),
((SELECT id FROM trips WHERE driver = 'Trần Văn Mạnh' LIMIT 1), (SELECT id FROM users WHERE phone = '0922222222'), 'T-10027', 'E-2', 250000.00, 'CANCELLED'),

-- Vé cho Trip 3 (Xe 02: Mobihome 40 Phòng) - Khách: Lê Hoàng Nam
((SELECT id FROM trips WHERE driver = 'Hoàng Thái Hưng' LIMIT 1), (SELECT id FROM users WHERE phone = '0933333333'), 'T-10028', 'D-4', 250000.00, 'PAID'),
((SELECT id FROM trips WHERE driver = 'Hoàng Thái Hưng' LIMIT 1), (SELECT id FROM users WHERE phone = '0933333333'), 'T-10029', 'F-4', 250000.00, 'PAID'),
((SELECT id FROM trips WHERE driver = 'Hoàng Thái Hưng' LIMIT 1), (SELECT id FROM users WHERE phone = '0933333333'), 'T-10030', 'H-4', 250000.00, 'PAID'),

-- Vé cho Trip 4 (Xe 02: Mobihome 40 Phòng) - Khách: Phạm Quang Khải
((SELECT id FROM trips WHERE driver = 'Phạm Minh Đức' LIMIT 1), (SELECT id FROM users WHERE phone = '0944444444'), 'T-10031', 'C-7', 250000.00, 'PENDING'),

-- Vé cho Trip 6 (Xe 03: Town 24 Ghế)
((SELECT id FROM trips WHERE driver = 'Đinh Tiến Vũ' LIMIT 1), (SELECT id FROM users WHERE phone = '0911111111'), 'T-10032', 'A-4', 250000.00, 'PAID'),
((SELECT id FROM trips WHERE driver = 'Đinh Tiến Vũ' LIMIT 1), (SELECT id FROM users WHERE phone = '0922222222'), 'T-10033', 'C-5', 250000.00, 'PAID');

-- 6. Insert mock bookings (Vé đoàn)
-- Booking cho Trip 2 (Xe 01: Limousine 34 Phòng)
INSERT INTO bookings (trip_id, customer_name, customer_phone, payment_status, total_amount)
VALUES
((SELECT id FROM trips WHERE driver = 'Trần Văn Mạnh' LIMIT 1), 'Đoàn Khách Du Lịch', '0987654321', 'PAID', 250000.00 * 10);

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