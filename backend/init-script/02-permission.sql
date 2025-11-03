CREATE USER spring_boot_backend WITH PASSWORD 'thisisspringbootpassword';

GRANT CONNECT ON DATABASE jobcubator_application_database to spring_boot_backend;
GRANT USAGE ON SCHEMA PUBLIC TO spring_boot_backend;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE refresh_token TO spring_boot_backend;
