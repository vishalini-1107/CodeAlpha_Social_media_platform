CREATE DATABASE user_auth;
USE user_auth;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100),
  password VARCHAR(100),
  phone VARCHAR(15),
  dob DATE
);
ALTER TABLE users ADD profile_img VARCHAR(255);


CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT,
  user_id INT,
  UNIQUE (post_id, user_id)   -- ✅ correct
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT,
  user_id INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT,
  following_id INT,
  UNIQUE (follower_id, following_id)
);
SELECT * FROM posts;

