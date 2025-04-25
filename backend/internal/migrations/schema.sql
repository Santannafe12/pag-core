CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active', -- Valores: active, blocked
    role VARCHAR(20) DEFAULT 'user', -- Valores: user, admin
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- Valores: transfer, deposit, refund
    status VARCHAR(20) DEFAULT 'completed', -- Valores: completed, pending, failed
    qr_code_id INT REFERENCES qr_codes(id) ON DELETE SET NULL, -- Referência para transações feitas via QR Code
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_requests (
    id SERIAL PRIMARY KEY,
    requester_id INT REFERENCES users(id) ON DELETE CASCADE,
    payer_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- Valores: pending, accepted, declined
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE qr_codes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'active', -- Valores: active, expired
    qr_code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);