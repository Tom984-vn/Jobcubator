CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    full_name varchar(30) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('CANDIDATE', 'COMPANY' )),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_token (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_id UUID NOT NULL UNIQUE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_token_expiry_date ON refresh_token(expiry_date);
CREATE INDEX idx_refresh_token_user_id ON refresh_token(user_id);

CREATE TABLE IF NOT EXISTS user_profile (
    user_id UUID PRIMARY KEY,
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE','OTHER', 'NA')),
    field_of_study VARCHAR(100),
    birth_date VARCHAR(255),
    years_of_experience INTEGER DEFAULT 0,
    organization VARCHAR(100),
    position VARCHAR(100),
    preferred_location VARCHAR(100),
    avatar_path VARCHAR(1000),
    cv_path VARCHAR(300),
    min_salary INTEGER DEFAULT 0,
    max_salary INTEGER DEFAULT 0,
    CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_username ON users(username);

CREATE TABLE IF NOT EXISTS profile_entry (
    id UUID PRIMARY KEY, 
    user_profile_id UUID NOT NULL,
    type VARCHAR(50) CHECK (type IN ('EDUCATION', 'EXPERIENCE')),
    title VARCHAR(255),
    organization VARCHAR(200),
    description VARCHAR(1000),
    start_date VARCHAR(20),
    end_date VARCHAR(20),

    CONSTRAINT fk_profile_entry_user_profile 
        FOREIGN KEY (user_profile_id) 
        REFERENCES user_profile (user_id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_profile_entry_user_id ON profile_entry(user_profile_id);

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    website VARCHAR(150) NOT NULL UNIQUE,
    size VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL 
);

CREATE TABLE IF NOT EXISTS company_members (
    id BIGSERIAL PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    CONSTRAINT uk_company_member UNIQUE (company_id, user_id)
);
 
CREATE TABLE IF NOT EXISTS course (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    level VARCHAR(30) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    url VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_posts (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    company_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT NOT NULL,
    location VARCHAR(150),
    number_of_vacancies INTEGER,
    job_type VARCHAR(100) NOT NULL,
    application_deadline TIMESTAMP,
    min_salary INTEGER,
    max_salary INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);


CREATE INDEX idx_jobpost_company_id ON job_posts(company_id);
CREATE INDEX idx_jobpost_application_deadline ON job_posts(application_deadline);
CREATE INDEX idx_jobpost_job_type ON job_posts(job_type);


CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    job_post_id UUID NOT NULL REFERENCES job_posts(id),
    status VARCHAR(50) NOT NULL,
    cover_letter TEXT,
    applied_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_application_user_job UNIQUE (user_id, job_post_id)
);

CREATE TABLE IF NOT EXISTS tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id UUID NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES job_posts(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE IF NOT EXISTS course_tags (
    course_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (course_id, tag_id),
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_chat_application 
        FOREIGN KEY (application_id) 
        REFERENCES applications (id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_chat_sender 
        FOREIGN KEY (sender_id) 
        REFERENCES users (id) 
        ON DELETE CASCADE
);