-- ============================================================
-- Hardware Inventory Management System - SQL Server 2019
-- Schema Script
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'HardwareInventoryDB')
BEGIN
    CREATE DATABASE HardwareInventoryDB;
END
GO

USE HardwareInventoryDB;
GO

-- Users
CREATE TABLE users (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    role        VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','MANAGER','VIEWER')),
    active      BIT          NOT NULL DEFAULT 1,
    created_at  DATETIME2    DEFAULT GETDATE(),
    updated_at  DATETIME2    DEFAULT GETDATE()
);
GO

-- Vendors
CREATE TABLE vendors (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    contact_person  VARCHAR(100),
    phone           VARCHAR(20),
    email           VARCHAR(100),
    address         VARCHAR(255),
    website         VARCHAR(100),
    created_at      DATETIME2 DEFAULT GETDATE()
);
GO

-- Locations
CREATE TABLE locations (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    building    VARCHAR(100) NOT NULL,
    floor       VARCHAR(50),
    room        VARCHAR(50),
    description VARCHAR(255)
);
GO

-- Devices
CREATE TABLE devices (
    id                 BIGINT IDENTITY(1,1) PRIMARY KEY,
    asset_tag          VARCHAR(50)    NOT NULL UNIQUE,
    name               VARCHAR(100)   NOT NULL,
    category           VARCHAR(50)    NOT NULL,
    brand              VARCHAR(50),
    model              VARCHAR(50),
    serial_number      VARCHAR(100)   UNIQUE,
    processor          VARCHAR(50),
    ram                VARCHAR(20),
    storage            VARCHAR(50),
    operating_system   VARCHAR(50),
    mac_address        VARCHAR(50),
    ip_address         VARCHAR(50),
    status             VARCHAR(20)    NOT NULL DEFAULT 'AVAILABLE'
                           CHECK (status IN ('AVAILABLE','ASSIGNED','IN_MAINTENANCE','RETIRED','LOST')),
    condition          VARCHAR(20)    NOT NULL DEFAULT 'NEW'
                           CHECK (condition IN ('NEW','GOOD','FAIR','POOR','DAMAGED')),
    purchase_date      DATE,
    purchase_price     DECIMAL(10,2),
    warranty_expiry    DATE,
    notes              VARCHAR(255),
    vendor_id          BIGINT REFERENCES vendors(id) ON DELETE SET NULL,
    location_id        BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    created_at         DATETIME2 DEFAULT GETDATE(),
    updated_at         DATETIME2 DEFAULT GETDATE()
);
GO

-- Assignments
CREATE TABLE assignments (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_id       BIGINT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    assigned_to     VARCHAR(100) NOT NULL,
    employee_id     VARCHAR(100),
    department      VARCHAR(100),
    assigned_date   DATE NOT NULL,
    return_date     DATE,
    purpose         VARCHAR(255),
    active          BIT NOT NULL DEFAULT 1,
    assigned_by     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at      DATETIME2 DEFAULT GETDATE()
);
GO

-- Maintenance Logs
CREATE TABLE maintenance_logs (
    id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_id           BIGINT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    maintenance_type    VARCHAR(50)  NOT NULL,
    maintenance_date    DATE         NOT NULL,
    completion_date     DATE,
    technician          VARCHAR(100),
    description         VARCHAR(1000),
    cost                DECIMAL(10,2),
    status              VARCHAR(50)  DEFAULT 'Pending',
    resolution          VARCHAR(500),
    logged_by           BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at          DATETIME2 DEFAULT GETDATE()
);
GO

-- Warranties
CREATE TABLE warranties (
    id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_id           BIGINT NOT NULL UNIQUE REFERENCES devices(id) ON DELETE CASCADE,
    warranty_provider   VARCHAR(100) NOT NULL,
    warranty_type       VARCHAR(50),
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    contract_number     VARCHAR(100),
    contact_phone       VARCHAR(100),
    contact_email       VARCHAR(100),
    notes               VARCHAR(500),
    created_at          DATETIME2 DEFAULT GETDATE()
);
GO

PRINT 'Schema created successfully.';
GO
