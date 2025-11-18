
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
    user_id CHAR(36) NOT NULL,
    balance DECIMAL(65) NOT NULL,
    cardholder_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    card_number VARCHAR(16) NOT NULL UNIQUE,

    FOREIGN KEY (user_id) REFERENCES users(user_id) 
);
CREATE TABLE transactions(
    transactions_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    card_id CHAR(36) NOT NULL, 
    amount DECIMAL(18, 2) NOT NULL, 
    status VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (card_id) REFERENCES cards(card_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT * FROM users;

INSERT INTO users(firstname,lastname,email,DOB,password) VALUES ('maheva','Megane','maheva@gmail.com','23-02-2005','maheva123');


--mysql2 -u mysql