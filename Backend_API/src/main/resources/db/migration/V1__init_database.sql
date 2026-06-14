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

-- Performance indexes for high-traffic query patterns
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route);
CREATE INDEX IF NOT EXISTS idx_trips_departure_time ON trips(departure_time);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON trips(bus_id);

CREATE INDEX IF NOT EXISTS idx_tickets_trip_id ON tickets(trip_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);

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

-- Insert mock admin user
-- Password is a mock bcrypt hash (e.g. for "password123")
INSERT INTO users (full_name, phone, email, password, role) 
VALUES 
('Admin Hao Thanh', '0901234567', 'admin@haothanh.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUrawRaQiCX2', 'ADMIN'),
('Admin Hao Thanh 2', '0999999999', 'admin2@haothanh.com', '$2a$10$gAc/WoS5fNzJGJX1wnFDSOfVPWaVyW8C3jW88Sx1kHa.3eTI5x40O', 'ADMIN');

-- Insert mock buses
INSERT INTO buses (bus_number, license_plate, bus_type, total_seats, layout_config, image_url, description, manufacture_year, color) 
VALUES 
('01', '37B-123.45', 'Limousine 34 Phòng VIP', 34, '{"id":"custom_1781092669932","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"},null,{"id":"E-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"},null,{"id":"E-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"},null,{"id":"E-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"},null,{"id":"E-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"},null,{"id":"E-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"},null,{"id":"E-6","type":"wc"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"},null,{"id":"H-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"},null,{"id":"H-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"},null,{"id":"H-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"},null,{"id":"H-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"},null,{"id":"H-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"},null,{"id":"H-6","type":"wc"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099715/ctf4brt66lskbriewuod.jpg', 'Dòng xe Limousine 34 phòng đôi cao cấp. Mỗi phòng được trang bị rèm che riêng tư, màn hình LCD giải trí, cổng sạc USB, đèn đọc sách và wifi tốc độ cao. Thường dùng chạy tuyến cố định đường dài, mang lại cảm giác êm ái như khách sạn di động.', 2023, 'Trắng ngọc trai'),
('02', '37B-678.90', 'Thaco Mobihome 40 Phòng', 40, '{"id":"custom_1781092623308","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"},null,{"id":"E-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"},null,{"id":"E-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"},null,{"id":"E-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"},null,{"id":"E-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"},null,{"id":"E-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"},null,{"id":"E-6","type":"seat","status":"available"}],[{"id":"A-7","type":"seat","status":"available"},null,{"id":"C-7","type":"seat","status":"available"},null,{"id":"E-7","type":"wc"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"},null,{"id":"H-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"},null,{"id":"H-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"},null,{"id":"H-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"},null,{"id":"H-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"},null,{"id":"H-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"},null,{"id":"H-6","type":"seat","status":"available"}],[{"id":"D-7","type":"seat","status":"available"},null,{"id":"F-7","type":"seat","status":"available"},null,{"id":"H-7","type":"wc"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099784/po02o6j4otnlhdnpe7vp.jpg', 'Dòng xe khách giường nằm cao cấp Thaco Mobihome thế hệ mới. Sử dụng khung gầm nguyên khối (Monocoque) và động cơ Weichai vận hành mạnh mẽ, êm ái. Thiết kế nội thất 40 phòng nằm độc lập, bọc da sang trọng, tích hợp đầy đủ tiện nghi: hệ thống điều hòa đa vùng, màn hình giải trí, cổng sạc, rèm che riêng tư. Ngoại thất sơn đen nhám điểm xuyết dải sao vàng cực kỳ nổi bật và nhận diện tốt trên mọi cung đường.', 2023, 'Đen nhám - Họa tiết sao vàng'),
('03', '37B-999.99', 'Thaco Town 24 Ghế', 24, '{"id":"custom_1781092565541","name":"Custom Layout","basePrice":250000,"floors":[{"floorIndex":1,"floorName":"Tầng 1","matrix":[[{"id":"A-1","type":"seat","status":"available"},null,{"id":"C-1","type":"seat","status":"available"}],[{"id":"A-2","type":"seat","status":"available"},null,{"id":"C-2","type":"seat","status":"available"}],[{"id":"A-3","type":"seat","status":"available"},null,{"id":"C-3","type":"seat","status":"available"}],[{"id":"A-4","type":"seat","status":"available"},null,{"id":"C-4","type":"seat","status":"available"}],[{"id":"A-5","type":"seat","status":"available"},null,{"id":"C-5","type":"seat","status":"available"}],[{"id":"A-6","type":"seat","status":"available"},null,{"id":"C-6","type":"seat","status":"available"}]]},{"floorIndex":2,"floorName":"Tầng 2","matrix":[[{"id":"D-1","type":"seat","status":"available"},null,{"id":"F-1","type":"seat","status":"available"}],[{"id":"D-2","type":"seat","status":"available"},null,{"id":"F-2","type":"seat","status":"available"}],[{"id":"D-3","type":"seat","status":"available"},null,{"id":"F-3","type":"seat","status":"available"}],[{"id":"D-4","type":"seat","status":"available"},null,{"id":"F-4","type":"seat","status":"available"}],[{"id":"D-5","type":"seat","status":"available"},null,{"id":"F-5","type":"seat","status":"available"}],[{"id":"D-6","type":"seat","status":"available"},null,{"id":"F-6","type":"seat","status":"available"}]]}]}', 'https://res.cloudinary.com/dqw8ycwat/image/upload/v1781099897/d4zvceetveoa7ko9r8iw.jpg', 'Dòng xe khách ghế ngồi thế hệ mới nhất. Xe được nhà xe tùy biến hạ tải từ form 28 chỗ tiêu chuẩn xuống chỉ còn 24 chỗ, giúp tăng tối đa không gian để chân (legroom) và độ ngả lưng cho hành khách. Toàn bộ 24 ghế được thiết kế công thái học và bọc da cao cấp. Khung gầm đúc liền khối trang bị hệ thống phuộc hơi giảm xóc cực kỳ êm ái. Sự lựa chọn hoàn hảo và rộng rãi nhất cho các tuyến đường liên tỉnh cự ly trung bình.', 2024, 'Xanh dương đậm - Sọc cam');

-- Insert mock routes
INSERT INTO routes (route_code, origin, destination, distance, estimated_duration) 
VALUES 
('HN-NA', 'Hà Nội', 'Nghệ An', 300.0, 6.0),
('NA-HN', 'Nghệ An', 'Hà Nội', 300.0, 6.0);

-- Insert mock trips using subqueries to safely get the bus_id without hardcoding IDs
INSERT INTO trips (bus_id, route, departure_time, base_price, status) 
VALUES 
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Hà Nội - Nghệ An', '2026-06-15 08:00:00+07', 250000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '37B-123.45'), 'Nghệ An - Hà Nội', '2026-06-16 14:00:00+07', 250000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Hà Nội - Nghệ An', '2026-06-15 20:00:00+07', 250000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '37B-678.90'), 'Nghệ An - Hà Nội', '2026-06-17 19:30:00+07', 250000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Hà Nội - Nghệ An', '2026-06-15 09:00:00+07', 250000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '37B-999.99'), 'Nghệ An - Hà Nội', '2026-06-15 15:00:00+07', 250000.00, 'SCHEDULED');

-- Insert mock tickets
-- Using subqueries to safely get the trip_id and user_id without hardcoding IDs
INSERT INTO tickets (trip_id, user_id, ticket_code, seat_code, total_price, payment_status) 
VALUES 
((SELECT id FROM trips WHERE route = 'Hà Nội - Nghệ An' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10024', 'A-1', 250000.00, 'PAID'),
((SELECT id FROM trips WHERE route = 'Hà Nội - Nghệ An' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10025', 'A-2', 250000.00, 'PENDING'),
((SELECT id FROM trips WHERE route = 'Hà Nội - Nghệ An' OFFSET 1 LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10026', 'B-2', 250000.00, 'PAID'),
((SELECT id FROM trips WHERE route = 'Nghệ An - Hà Nội' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10027', 'C-3', 250000.00, 'CANCELLED'),
((SELECT id FROM trips WHERE route = 'Nghệ An - Hà Nội' OFFSET 1 LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10028', 'D-4', 250000.00, 'PENDING');
