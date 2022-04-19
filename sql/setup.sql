-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS ascii CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT
);

CREATE TABLE messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    message TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    username TEXT NOT NULL
);

CREATE TABLE ascii (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    string TEXT NOT NULL
);

INSERT INTO users (username, email)
VALUES 
('user 1', 'user1@test.com'),
('user 2', 'user2@test.com');

INSERT INTO messages (message, user_id, username)
VALUES 
('HELLO WORLD!', '1', 'user 1'),
('Goodbye, see you next time!', '2', 'user 2');

INSERT INTO ascii (name, string)
VALUES 
('smileycat', '=(^_^)='),
('robot', 'd[ o_0 ]b');
