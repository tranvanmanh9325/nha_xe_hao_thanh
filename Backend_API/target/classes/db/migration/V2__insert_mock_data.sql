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
