CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_profile (
    user_id UUID PRIMARY KEY,
    field_of_study VARCHAR(100),
    birth_date VARCHAR(255),
    years_of_experience INTEGER DEFAULT 0,
    organization VARCHAR(100),
    position VARCHAR(100),
    preferred_location VARCHAR(100),
    avatar_path VARCHAR(300),
    cv_path VARCHAR(300),
    min_salary INTEGER,
    max_salary INTEGER,
    CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_users_username ON users(username);
