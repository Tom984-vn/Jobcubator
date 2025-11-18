CREATE USER spring_boot_backend WITH PASSWORD 'thisisspringbootpassword'; -- Bro don't do this in production .-.

GRANT CONNECT ON DATABASE jobcubator_application_database to spring_boot_backend;
GRANT USAGE ON SCHEMA PUBLIC TO spring_boot_backend;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE refresh_token TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE user_profile TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE company TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE jobpost TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE tag TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE course_tags TO spring_boot_backend;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE post_tags TO spring_boot_backend;