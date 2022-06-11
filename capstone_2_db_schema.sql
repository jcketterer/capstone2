CREATE TABLE advocate (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    first_name VARCHAR(50)   NOT NULL,
    last_name VARCHAR(50)   NOT NULL,
    email VARCHAR(50)   NOT NULL,
    password TEXT NOT NULL,
    hire_date DATE NOT NULL,
    milestone VARCHAR(50)   NOT NULL,
    current_milestone_start_date DATE NOT NULL,
    team_lead VARCHAR(50)   NOT NULL,
    manager VARCHAR(50)   NOT NULL,
    date_created TIMESTAMP without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    advocate_id INTEGER
        REFERENCES advocate ON DELETE CASCADE
    skill_id VARCHAR(50)
        REFERENCES skill_types ON DELETE CASCADE
    PRIMARY KEY (advocate_id, skill_id)
);

CREATE TABLE skill_types (
    skill_id INTEGER PRIMARY KEY,
    skill_name VARCHAR(50) NOT NULL
)

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email TEXT NOT NULL UNIQUE,
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
)


