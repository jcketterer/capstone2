CREATE TABLE "advocate" (
    "id" int   NOT NULL,
    "first_name" string   NOT NULL,
    "last_name" string   NOT NULL,
    "email" string   NOT NULL,
    "password" string   NOT NULL,
    "milestone" string   NOT NULL,
    "start_date_of_current_milestone" date   NOT NULL,
    "team_lead" string   NOT NULL,
    "manager" string   NOT NULL,
    CONSTRAINT "pk_advocate" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "skills" (
    "advocate_id" int   NOT NULL,
    "skill_name" string   NOT NULL
);

ALTER TABLE "skills" ADD CONSTRAINT "fk_skills_advocate_id" FOREIGN KEY("advocate_id")
REFERENCES "advocate" ("id");

