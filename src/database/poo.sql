-- Active: 1675782659416@@127.0.0.1@3306
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    upload_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO videos (id, title, duration)
VALUES
	("v001", "Video Feliz", 120),
	("v002", "Video Triste", 60);

SELECT * FROM videos;

CREATE TABLE courses (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    lessons INTEGER NOT NULL
);

INSERT INTO courses (id, name, lessons)
VALUES
("c001", "Javascript", 5),
("c002", "React", 10),
("c003", "Typescript", 15);

SELECT * FROM courses