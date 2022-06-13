CREATE TABLE advocate (
    advocate_id SERIAL PRIMARY KEY NOT NULL,
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


CREATE TABLE skill_types (
    skill_id INTEGER PRIMARY KEY,
    skill_name VARCHAR(50) NOT NULL
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
    advocate_id INTEGER
        REFERENCES advocate ON DELETE CASCADE,
    skill_id INTEGER
        REFERENCES skill_types ON DELETE CASCADE,
    PRIMARY KEY (advocate_id, skill_id)
);

