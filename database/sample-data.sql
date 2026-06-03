-- ============================================================
-- Hardware Inventory Management System - Sample Data
-- Run AFTER schema.sql
-- ============================================================

USE HardwareInventoryDB;
GO

-- Vendors
INSERT INTO vendors (name, contact_person, phone, email, address, website) VALUES
('Dell Technologies', 'Raj Mehta', '+91-9800001111', 'sales@dell.com', 'Bengaluru, Karnataka', 'https://www.dell.com'),
('HP India', 'Priya Singh', '+91-9800002222', 'hp.india@hp.com', 'Mumbai, Maharashtra', 'https://www.hp.com'),
('Lenovo India', 'Amit Kumar', '+91-9800003333', 'lenovo@lenovo.com', 'Pune, Maharashtra', 'https://www.lenovo.com'),
('Apple India', 'Sara Joshi', '+91-9800004444', 'apple@apple.com', 'Delhi, India', 'https://www.apple.com');
GO

-- Locations
INSERT INTO locations (building, floor, room, description) VALUES
('Main Office', '1st Floor', 'Room 101', 'Finance Department'),
('Main Office', '1st Floor', 'Room 102', 'HR Department'),
('Main Office', '2nd Floor', 'Room 201', 'IT Department'),
('Main Office', '2nd Floor', 'Room 202', 'Engineering Lab'),
('Server Room', 'Ground Floor', 'SRV-01', 'Primary Server Room');
GO

-- Devices
INSERT INTO devices (asset_tag, name, category, brand, model, serial_number, processor, ram, storage,
    operating_system, status, condition, purchase_date, purchase_price, warranty_expiry, vendor_id, location_id)
VALUES
('HW-001', 'Dell Laptop - Finance', 'Laptop', 'Dell', 'Latitude 5540', 'SN-DELL-001', 'Intel Core i5-13th Gen', '16GB DDR4', '512GB SSD', 'Windows 11 Pro', 'ASSIGNED', 'GOOD', '2023-01-15', 75000.00, '2026-01-15', 1, 1),
('HW-002', 'HP Desktop - HR', 'Desktop', 'HP', 'EliteDesk 800', 'SN-HP-002', 'Intel Core i7-12th Gen', '32GB DDR4', '1TB SSD', 'Windows 11 Pro', 'ASSIGNED', 'NEW', '2023-03-20', 85000.00, '2026-03-20', 2, 2),
('HW-003', 'Lenovo ThinkPad - IT', 'Laptop', 'Lenovo', 'ThinkPad X1 Carbon', 'SN-LEN-003', 'Intel Core i7-13th Gen', '16GB DDR5', '1TB NVMe', 'Windows 11 Pro', 'AVAILABLE', 'NEW', '2023-06-10', 120000.00, '2026-06-10', 3, 3),
('HW-004', 'Dell Monitor - Eng Lab', 'Monitor', 'Dell', 'UltraSharp U2722D', 'SN-DELL-004', NULL, NULL, NULL, NULL, 'AVAILABLE', 'GOOD', '2022-11-05', 35000.00, '2025-11-05', 1, 4),
('HW-005', 'HP LaserJet Printer', 'Printer', 'HP', 'LaserJet Pro M404dn', 'SN-HP-005', NULL, NULL, NULL, NULL, 'AVAILABLE', 'GOOD', '2022-08-15', 22000.00, '2025-08-15', 2, 1),
('HW-006', 'Dell Server', 'Server', 'Dell', 'PowerEdge R750', 'SN-DELL-006', 'Intel Xeon Gold 6330', '128GB ECC', '4TB RAID', 'Windows Server 2022', 'AVAILABLE', 'NEW', '2023-09-01', 450000.00, '2026-09-01', 1, 5),
('HW-007', 'Apple MacBook Pro', 'Laptop', 'Apple', 'MacBook Pro 14"', 'SN-APPLE-007', 'Apple M2 Pro', '16GB Unified', '512GB SSD', 'macOS Ventura', 'IN_MAINTENANCE', 'FAIR', '2022-05-20', 175000.00, '2025-05-20', 4, 3),
('HW-008', 'Lenovo Desktop - Finance', 'Desktop', 'Lenovo', 'ThinkCentre M70q', 'SN-LEN-008', 'Intel Core i5-12th Gen', '8GB DDR4', '256GB SSD', 'Windows 10 Pro', 'AVAILABLE', 'GOOD', '2022-02-28', 45000.00, '2025-02-28', 3, 1);
GO

-- Assignments
INSERT INTO assignments (device_id, assigned_to, employee_id, department, assigned_date, purpose, active)
VALUES
(1, 'Neha Sharma', 'EMP-001', 'Finance', '2023-02-01', 'Day-to-day finance operations', 1),
(2, 'Rahul Gupta', 'EMP-002', 'Human Resources', '2023-04-10', 'HR management tasks', 1);
GO

-- Maintenance Logs
INSERT INTO maintenance_logs (device_id, maintenance_type, maintenance_date, technician, description, cost, status)
VALUES
(7, 'Repair', '2024-01-10', 'Suresh Patil', 'Battery replacement and keyboard cleaning', 8500.00, 'In Progress'),
(5, 'Cleaning', '2023-12-01', 'IT Team', 'Printer head cleaning and toner replacement', 1500.00, 'Completed');
GO

-- Warranties
INSERT INTO warranties (device_id, warranty_provider, warranty_type, start_date, end_date, contract_number, contact_phone, contact_email)
VALUES
(1, 'Dell ProSupport', 'On-site', '2023-01-15', '2026-01-15', 'DELL-PRO-2023-001', '1800-425-4051', 'prosupport@dell.com'),
(2, 'HP Care Pack', 'On-site', '2023-03-20', '2026-03-20', 'HP-CARE-2023-002', '1800-108-4747', 'hpcare@hp.com'),
(6, 'Dell ProSupport Plus', 'On-site', '2023-09-01', '2026-09-01', 'DELL-PRO-2023-006', '1800-425-4051', 'prosupport@dell.com');
GO

PRINT 'Sample data inserted successfully.';
GO
