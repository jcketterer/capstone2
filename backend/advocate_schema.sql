CREATE TABLE advocate (
    advocate_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50)   NOT NULL,
    last_name VARCHAR(50)   NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1) UNIQUE,
    hire_date DATE NOT NULL,
    milestone VARCHAR(50)   NOT NULL,
    current_milestone_start_date DATE NOT NULL,
    team_lead VARCHAR(50)   NOT NULL,
    manager VARCHAR(50)   NOT NULL,
    date_created TIMESTAMP without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    password TEXT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1) UNIQUE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE skills (
    name VARCHAR(40) PRIMARY KEY,
    skill_id SERIAL
);

CREATE TABLE advocate_skills (
    advocates_id INTEGER
        REFERENCES advocate ON DELETE CASCADE,
    skill_name VARCHAR(40)
        REFERENCES skills ON DELETE CASCADE,
    PRIMARY KEY (advocates_id, skill_name)
);



