
CREATE DATABASE softwareArchitecture;

CREATE TABLE users(
    user_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    DOB TEXT NOT NULL,
    password TEXT NOT NULL
);

SELECT * FROM users;

INSERT INTO users(firstname,lastname,email,DOB,password) VALUES ('maheva','Megane','maheva@gmail.com','23-02-2005','maheva123');


--mysql2 -u mysql