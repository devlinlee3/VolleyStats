-- Insert default admin user for testing
-- Password: Admin123 (BCrypt encoded)
INSERT INTO users (email, password_hash, first_name, last_name, role, enabled, created_at, updated_at) 
VALUES (
    'admin@volleyball.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 
    'Admin', 
    'User', 
    'ADMIN', 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);
