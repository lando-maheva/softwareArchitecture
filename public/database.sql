
CREATE DATABASE softwareArchitecture;

CREATE TABLE users(
    user_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    DOB TEXT NOT NULL,
    password TEXT NOT NULL
);
CREATE TABLE cards(
    card_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    user_id CHAR(36),
    card_number VARCHAR(16) NOT NULL UNIQUE,
    cardholder_name TEXT NOT NULL,
    --cvv VARCHAR(4) NOT NULL, // SHOULD BE ENCRIPTED IT IS THE CARD SECURITY CODE(CARD VERIFICATION VALUE)
    expiry_date VARCHAR(5) NOT NULL,
    FOREIGN KEY 
) ;

SELECT * FROM users;

INSERT INTO users(firstname,lastname,email,DOB,password) VALUES ('maheva','Megane','maheva@gmail.com','23-02-2005','maheva123');


--mysql2 -u mysql