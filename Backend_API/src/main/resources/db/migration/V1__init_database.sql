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
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    bus_type VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
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

-- Insert mock admin user
-- Password is a mock bcrypt hash (e.g. for "password123")
INSERT INTO users (full_name, phone, email, password, role) 
VALUES ('Admin Hao Thanh', '0901234567', 'admin@haothanh.com', '$2a$10$7R4d.R2G0R4qM1m4.q5G.eVt4.r5T3z2X/7Z4.Q5w1.2A3B4C5D', 'ADMIN');

-- Insert mock buses
INSERT INTO buses (license_plate, bus_type, total_seats) 
VALUES 
('51B-12345', 'LIMOUSINE_34', 34),
('49B-67890', 'SLEEPER_40', 40),
('51B-99999', 'SEAT_28', 28);

-- Insert mock trips using subqueries to safely get the bus_id without hardcoding IDs
INSERT INTO trips (bus_id, route, departure_time, base_price, status) 
VALUES 
((SELECT id FROM buses WHERE license_plate = '51B-12345'), 'TP.HCM - Đà Lạt', '2026-06-15 08:00:00+07', 350000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '51B-12345'), 'Đà Lạt - TP.HCM', '2026-06-16 14:00:00+07', 350000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '49B-67890'), 'TP.HCM - Nha Trang', '2026-06-15 20:00:00+07', 400000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '49B-67890'), 'Nha Trang - TP.HCM', '2026-06-17 19:30:00+07', 400000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '51B-99999'), 'TP.HCM - Vũng Tàu', '2026-06-15 09:00:00+07', 150000.00, 'SCHEDULED'),
((SELECT id FROM buses WHERE license_plate = '51B-99999'), 'Vũng Tàu - TP.HCM', '2026-06-15 15:00:00+07', 150000.00, 'SCHEDULED');

-- Insert mock tickets
-- Using subqueries to safely get the trip_id and user_id without hardcoding IDs
INSERT INTO tickets (trip_id, user_id, ticket_code, seat_code, total_price, payment_status) 
VALUES 
((SELECT id FROM trips WHERE route = 'TP.HCM - Đà Lạt' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10024', 'A01', 350000.00, 'PAID'),
((SELECT id FROM trips WHERE route = 'TP.HCM - Đà Lạt' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10025', 'A02', 350000.00, 'PENDING'),
((SELECT id FROM trips WHERE route = 'TP.HCM - Nha Trang' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10026', 'B12', 400000.00, 'PAID'),
((SELECT id FROM trips WHERE route = 'Nha Trang - TP.HCM' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10027', 'C03', 400000.00, 'CANCELLED'),
((SELECT id FROM trips WHERE route = 'TP.HCM - Vũng Tàu' LIMIT 1), (SELECT id FROM users WHERE phone = '0901234567'), 'T-10028', 'D04', 150000.00, 'PENDING');
