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

CREATE INDEX idx_users_username ON users(username);


CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description_path VARCHAR(150) NOT NULL,
    website VARCHAR(150) NOT NULL UNIQUE,
    size VARCHAR(50) NOT NULL
);

CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    level VARCHAR(10) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    url VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobpost (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    company_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description_path VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    number_of_vacancies INTEGER,
    job_type VARCHAR(100) NOT NULL,
    application_deadline TIMESTAMP,
    min_salary INTEGER,
    max_salary INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

CREATE INDEX idx_jobpost_company_id ON jobpost(company_id);
CREATE INDEX idx_jobpost_application_deadline ON jobpost(application_deadline);
CREATE INDEX idx_jobpost_job_type ON jobpost(job_type);


CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE post_tags (
    post_id UUID NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES jobpost(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE course_tags (
    course_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (course_id, tag_id),
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);
